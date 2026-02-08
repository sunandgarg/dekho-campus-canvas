import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Sparkles, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStep = "chat" | "ask_name" | "ask_situation" | "ask_city" | "ask_contact" | "free";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-counselor`;
const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const suggestedQuestions = [
  "Which entrance exams should I prepare for?",
  "Best engineering colleges in India?",
  "What's the difference between JEE Main and Advanced?",
  "How do I choose between Science and Commerce?",
  "Top medical colleges for NEET?",
  "Career options after 12th Commerce?",
];

interface AIChatFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export function AIChatFullScreen({ isOpen, onClose, initialMessage }: AIChatFullScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>("chat");
  const [leadData, setLeadData] = useState({ name: "", situation: "", city: "", state: "", email: "", phone: "", query: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      setLeadData(prev => ({ ...prev, query: initialMessage }));
      // First listen to query, then ask for details
      addBotMsg(`Great question! Let me help you with that. But first, may I know your **name**? 😊`);
      setMessages(prev => [...prev, { role: "user", content: initialMessage }]);
      setStep("ask_name");
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (!isOpen) {
      hasProcessedInitialMessage.current = false;
    }
  }, [isOpen]);

  const addBotMsg = (content: string) => {
    setMessages(prev => [...prev, { role: "assistant", content }]);
  };

  const saveLead = async (data: typeof leadData) => {
    try {
      await fetch(LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          name: data.name || null, email: data.email || null, phone: data.phone || null,
          current_situation: data.situation || null, city: data.city || null, state: data.state || null,
          initial_query: data.query || null, source: "hero_search",
        }),
      });
    } catch (e) { console.error("Lead save:", e); }
  };

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const error = await resp.json();
        if (resp.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (resp.status === 402) {
          toast.error("AI service is temporarily unavailable.");
        } else {
          toast.error(error.error || "Failed to get response");
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userInput }]);
    setInput("");

    switch (step) {
      case "chat":
        setLeadData(prev => ({ ...prev, query: userInput }));
        setTimeout(() => {
          addBotMsg("Great question! To give you the best guidance, can I know your **name**? 😊");
          setStep("ask_name");
        }, 300);
        break;

      case "ask_name":
        setLeadData(prev => ({ ...prev, name: userInput }));
        setTimeout(() => {
          addBotMsg(`Nice to meet you, **${userInput}**! 🙌\n\nWhat's your current status?\n- Appearing in 12th\n- Passed 12th\n- Graduated\n- Other`);
          setStep("ask_situation");
        }, 300);
        break;

      case "ask_situation":
        setLeadData(prev => ({ ...prev, situation: userInput }));
        setTimeout(() => {
          addBotMsg("Which **city and state** are you from? 📍\n\n(e.g., Mumbai, Maharashtra)");
          setStep("ask_city");
        }, 300);
        break;

      case "ask_city": {
        const parts = userInput.split(",").map(s => s.trim());
        const updatedLead = { ...leadData, city: parts[0], state: parts[1] || "" };
        setLeadData(updatedLead);
        setTimeout(() => {
          addBotMsg("Let me find the best options for you! 🔍✨");
          setStep("free");
          saveLead(updatedLead);
          streamChat(leadData.query).then(() => {
            setTimeout(() => {
              addBotMsg("📱 For **personalized follow-up**, share your **phone or email**!\n\n(Or type 'skip' to continue chatting)");
              setStep("ask_contact");
            }, 500);
          });
        }, 300);
        break;
      }

      case "ask_contact":
        if (userInput.toLowerCase() !== "skip") {
          const isEmail = userInput.includes("@");
          const update = isEmail ? { email: userInput } : { phone: userInput };
          const updatedLead = { ...leadData, ...update };
          setLeadData(updatedLead);
          saveLead(updatedLead);
          setTimeout(() => {
            addBotMsg("Thank you! 🎉 Our counselors will connect with you soon.\n\nFeel free to ask anything else!");
            setStep("free");
          }, 300);
        } else {
          setTimeout(() => {
            addBotMsg("No problem! Keep asking me anything 😊");
            setStep("free");
          }, 300);
        }
        break;

      case "free":
        streamChat(userInput);
        break;
    }
  };

  const handleSuggestion = (question: string) => {
    if (isLoading) return;
    setLeadData(prev => ({ ...prev, query: question }));
    setMessages(prev => [...prev, { role: "user", content: question }]);
    addBotMsg("Great question! To give you the best guidance, can I know your **name**? 😊");
    setStep("ask_name");
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setStep("chat");
    setLeadData({ name: "", situation: "", city: "", state: "", email: "", phone: "", query: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 gradient-mesh"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border glass">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-secondary">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-bold text-foreground">DekhoCampus AI</h1>
                    <p className="text-xs text-muted-foreground">Your friendly education guide</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleNewChat} className="rounded-xl">
                New Chat
              </Button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
              <div className="max-w-3xl mx-auto px-4 py-6">
                {messages.length === 0 ? (
                  <div className="space-y-8">
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Hi! I'm your DekhoCampus AI 👋
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        I'm here to help you navigate your educational journey. Ask me about colleges, courses, entrance exams, or career paths!
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3 text-center">Here are some things you can ask:</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {suggestedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSuggestion(q)}
                            className="flex items-start gap-3 p-4 text-left bg-card hover:bg-secondary rounded-xl border border-border transition-all hover:shadow-md hover:border-primary/30"
                          >
                            <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "gradient-accent" : "bg-secondary"}`}>
                          {msg.role === "user" ? <User className="w-5 h-5 text-accent-foreground" /> : <Bot className="w-5 h-5 text-secondary-foreground" />}
                        </div>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === "user" ? "user-bubble rounded-br-md" : "ai-bubble rounded-bl-md"}`}>
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm max-w-none text-foreground">
                              <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                          <Bot className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        <div className="ai-bubble px-4 py-3 rounded-2xl rounded-bl-md">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border glass">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      step === "ask_name" ? "Enter your name..." :
                      step === "ask_situation" ? "e.g., Appearing in 12th" :
                      step === "ask_city" ? "e.g., Delhi, Delhi" :
                      step === "ask_contact" ? "Email or phone (or 'skip')" :
                      "Ask me anything about your education journey..."
                    }
                    className="flex-1 rounded-xl text-base py-6"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl gradient-primary btn-glow px-6"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  AI responses are for guidance only. Always verify from official sources.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
