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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-counselor`;

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle initial message
  useEffect(() => {
    if (isOpen && initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      streamChat(initialMessage);
    }
  }, [isOpen, initialMessage]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      hasProcessedInitialMessage.current = false;
    }
  }, [isOpen]);

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
    streamChat(input.trim());
  };

  const handleSuggestion = (question: string) => {
    if (isLoading) return;
    streamChat(question);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-amber-200/50 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-xl hover:bg-amber-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-foreground">DC Educational AI</h1>
                    <p className="text-xs text-muted-foreground">Your friendly education guide</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="rounded-xl border-amber-200 hover:bg-amber-50"
              >
                New Chat
              </Button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
              <div className="max-w-3xl mx-auto px-4 py-6">
                {messages.length === 0 ? (
                  <div className="space-y-8">
                    {/* Welcome message */}
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-4">
                        <Sparkles className="w-10 h-10 text-amber-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Hi! I'm your DC Educational AI 👋
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        I'm here to help you navigate your educational journey. Ask me about colleges, 
                        courses, entrance exams, or career paths!
                      </p>
                    </div>

                    {/* Suggested questions */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                        Here are some things you can ask:
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {suggestedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSuggestion(q)}
                            className="flex items-start gap-3 p-4 text-left bg-white hover:bg-amber-50 rounded-xl border border-amber-200/50 transition-all hover:shadow-md hover:border-amber-300"
                          >
                            <MessageCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-amber-400 to-orange-500"
                              : "bg-gradient-to-br from-slate-100 to-slate-200"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md"
                              : "bg-white border border-amber-100 rounded-bl-md shadow-sm"
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
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="bg-white border border-amber-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-amber-200/50 bg-white/80 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your education journey..."
                    className="flex-1 rounded-xl border-amber-200 focus-visible:ring-amber-400 text-base py-6"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
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
