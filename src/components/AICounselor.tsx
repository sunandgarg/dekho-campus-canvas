import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-counselor`;

const suggestedQuestions = [
  "Which entrance exams should I prepare for?",
  "Best engineering colleges in India?",
  "What's the difference between JEE Main and Advanced?",
  "How do I choose between Science and Commerce?",
];

export function AICounselor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

      // Add empty assistant message
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
    streamChat(input.trim());
  };

  const handleSuggestion = (question: string) => {
    if (isLoading) return;
    streamChat(question);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center hover:scale-105 transition-transform focus-ring"
            aria-label="Open AI Counselor"
          >
            <Sparkles className="w-7 h-7 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-accent-foreground">AI</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-6rem)] card-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border gradient-primary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-foreground">AI Career Counselor</h3>
                  <p className="text-xs text-primary-foreground/80">Your 24/7 education guide</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="ai-bubble p-4 rounded-2xl">
                    <p className="text-sm text-foreground">
                      👋 Hi there! I'm your AI Career Counselor. I can help you with:
                    </p>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>• Choosing the right career path</li>
                      <li>• Finding best colleges for you</li>
                      <li>• Entrance exam preparation tips</li>
                      <li>• Course & admission guidance</li>
                    </ul>
                    <p className="mt-3 text-sm text-foreground font-medium">
                      What would you like to know? 🎓
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Quick questions:</p>
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestion(q)}
                        className="block w-full text-left px-4 py-2.5 text-sm bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          msg.role === "user"
                            ? "gradient-accent"
                            : "bg-primary/10"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-4 h-4 text-accent-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.role === "user"
                            ? "user-bubble rounded-br-md"
                            : "ai-bubble rounded-bl-md"
                        }`}
                      >
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
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="ai-bubble p-3 rounded-2xl rounded-bl-md">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your career..."
                  className="flex-1 rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="gradient-primary btn-glow rounded-xl"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-center text-muted-foreground">
                AI responses are for guidance only. Verify info from official sources.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
