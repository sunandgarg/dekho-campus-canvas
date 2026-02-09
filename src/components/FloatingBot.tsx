import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type BotStep = "greeting" | "query" | "name" | "situation" | "city" | "contact" | "responding" | "done";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-counselor`;
const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const situationOptions = [
  { label: "Appearing in 12th", value: "12th_appearing" },
  { label: "Passed 12th", value: "12th_passed" },
  { label: "Graduated", value: "graduated" },
  { label: "Other", value: "other" },
];

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<BotStep>("greeting");
  const [leadData, setLeadData] = useState({ name: "", situation: "", city: "", state: "", email: "", phone: "", query: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen, step]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, { role: "assistant", content }]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage("Hi there! 👋 I'm your **DekhoCampus AI Counselor** — available 24/7 to help you with colleges, courses, exams & career guidance.\n\nWhat would you like to know today? 🎓");
        setStep("query");
      }, 500);
    }
  };

  const saveLead = async (data: typeof leadData) => {
    try {
      await fetch(LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          name: data.name || null,
          email: data.email || null,
          phone: data.phone || null,
          current_situation: data.situation || null,
          city: data.city || null,
          state: data.state || null,
          initial_query: data.query || null,
          source: "chatbot",
        }),
      });
    } catch (e) {
      console.error("Lead save failed:", e);
    }
  };

  const streamAIResponse = async (query: string) => {
    setIsLoading(true);
    let assistantContent = "";

    const contextMsg = leadData.name
      ? `Student Info - Name: ${leadData.name}, Status: ${leadData.situation}, Location: ${leadData.city}, ${leadData.state}. Query: ${query}`
      : query;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: contextMsg }],
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error("Too many requests. Please wait a moment.");
        else if (resp.status === 402) toast.error("AI service temporarily unavailable.");
        else toast.error("Failed to get response.");
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            // Skip malformed SSE chunks gracefully
          }
        }
      }
    } catch (error) {
      console.error("Bot error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userInput }]);
    setInput("");

    switch (step) {
      case "query":
        setLeadData(prev => ({ ...prev, query: userInput }));
        setTimeout(() => {
          addBotMessage("Great question! To give you the best guidance, can I know your **name**? 😊");
          setStep("name");
        }, 300);
        break;

      case "name":
        setLeadData(prev => ({ ...prev, name: userInput }));
        setTimeout(() => {
          addBotMessage(`Nice to meet you, **${userInput}**! 🙌\n\nWhat's your current education status?\n- Appearing in 12th\n- Passed 12th\n- Graduated\n- Other`);
          setStep("situation");
        }, 300);
        break;

      case "situation": {
        const matched = situationOptions.find(o =>
          userInput.toLowerCase().includes(o.label.toLowerCase()) ||
          userInput.toLowerCase().includes(o.value.replace("_", " "))
        );
        const situation = matched?.value || userInput;
        setLeadData(prev => ({ ...prev, situation }));
        setTimeout(() => {
          addBotMessage("Which **city and state** are you from? 📍\n\n(e.g., Mumbai, Maharashtra)");
          setStep("city");
        }, 300);
        break;
      }

      case "city": {
        const parts = userInput.split(",").map(s => s.trim());
        setLeadData(prev => ({ ...prev, city: parts[0] || userInput, state: parts[1] || "" }));
        setTimeout(() => {
          addBotMessage("Let me find the best options for you! 🔍✨");
          setStep("responding");
          const updatedLead = {
            ...leadData,
            city: parts[0] || userInput,
            state: parts[1] || "",
          };
          // Save lead first, then respond
          saveLead(updatedLead);
          streamAIResponse(leadData.query).then(() => {
            setTimeout(() => {
              addBotMessage("📱 For **personalized recommendations**, share your **phone number or email** and our expert counselors will reach out!\n\n(Or type 'skip' to continue chatting)");
              setStep("contact");
            }, 500);
          });
        }, 300);
        break;
      }

      case "contact":
        if (userInput.toLowerCase() !== "skip") {
          const isEmail = userInput.includes("@");
          const isPhone = /\d{10}/.test(userInput.replace(/\s/g, ""));
          const update = isEmail ? { email: userInput } : isPhone ? { phone: userInput } : { email: userInput };
          const updatedLead = { ...leadData, ...update };
          setLeadData(updatedLead);
          saveLead(updatedLead);
          setTimeout(() => {
            addBotMessage("Thank you! 🎉 Our counselors will connect with you soon.\n\nFeel free to ask me anything else! I'm here 24/7 💪");
            setStep("done");
          }, 300);
        } else {
          setTimeout(() => {
            addBotMessage("No problem! Feel free to ask me anything else 😊");
            setStep("done");
          }, 300);
        }
        break;

      case "done":
      case "responding":
        // Free chat mode
        streamAIResponse(userInput);
        break;
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={handleOpen}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full gradient-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            aria-label="Talk to AI Counselor"
          >
            <MessageCircle className="w-7 h-7 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] text-accent-foreground font-bold flex items-center justify-center animate-bounce-gentle">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-[380px] md:max-w-[calc(100vw-2rem)] h-[85vh] md:h-[520px] md:max-h-[calc(100vh-4rem)] md:rounded-2xl rounded-t-2xl border border-border bg-card shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 gradient-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">DekhoCampus AI</h3>
                  <p className="text-xs opacity-80">24/7 Career Counselor</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "gradient-accent" : "bg-secondary"}`}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5 text-accent-foreground" /> : <Bot className="w-3.5 h-3.5 text-secondary-foreground" />}
                  </div>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${msg.role === "user" ? "user-bubble rounded-br-md" : "ai-bubble rounded-bl-md"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none text-foreground [&>p]:m-0">
                        <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-secondary-foreground" />
                  </div>
                  <div className="ai-bubble px-3 py-2 rounded-2xl rounded-bl-md">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={
                    step === "query" ? "Type your question..." :
                    step === "name" ? "Enter your name..." :
                    step === "situation" ? "e.g., Appearing in 12th" :
                    step === "city" ? "e.g., Delhi, Delhi" :
                    step === "contact" ? "Email or phone (or 'skip')" :
                    "Ask anything..."
                  }
                  className="flex-1 rounded-xl text-sm h-10"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" className="gradient-primary rounded-xl h-10 w-10" disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
