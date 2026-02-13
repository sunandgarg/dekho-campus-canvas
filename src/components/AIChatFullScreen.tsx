import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-counselor`;

interface AIChatFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  leadData?: { name: string; course: string; state: string; city: string };
  onRequestLeadForm?: () => void;
}

const DEFAULT_SUGGESTIONS = [
  "Top 5 engineering colleges in India",
  "Best colleges for MBA",
  "Career options after 12th Science",
  "Which entrance exams should I prepare for?",
  "How to get scholarships?",
];

export function AIChatFullScreen({ isOpen, onClose, initialMessage, leadData, onRequestLeadForm }: AIChatFullScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCollectedLead, setHasCollectedLead] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInit = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Initialize: always show lead form first if no lead data
  useEffect(() => {
    if (isOpen && !hasInit.current) {
      hasInit.current = true;
      
      if (leadData?.name) {
        setHasCollectedLead(true);
        const greeting = `Hi **${leadData.name}**! 👋\n\nHere's what I know about you:\n- **Course Interest:** ${leadData.course || "Not specified"}\n- **Location:** ${leadData.city ? `${leadData.city}, ${leadData.state}` : leadData.state || "India"}\n\nI'm ready to help you find the perfect college. Pick a question below or ask me anything!`;
        setMessages([{ role: "assistant", content: greeting }]);
      } else {
        // No lead data - show lead form immediately
        if (onRequestLeadForm) {
          onRequestLeadForm();
        }
        setMessages([{ role: "assistant", content: "Hi! 👋 Please fill in your details so I can give you **personalized recommendations**! 📝" }]);
      }
    }
  }, [isOpen, leadData, onRequestLeadForm]);

  // When lead data arrives after form
  useEffect(() => {
    if (leadData?.name && isOpen && hasInit.current && !hasCollectedLead) {
      setHasCollectedLead(true);
      const infoMsg = `Great! Here's what I know about you:\n\n👤 **Name:** ${leadData.name}\n📚 **Course Interest:** ${leadData.course || "Not specified"}\n📍 **Location:** ${leadData.city ? `${leadData.city}, ${leadData.state}` : leadData.state || "India"}\n\nI'll use this to give you personalized recommendations! Pick a question below or ask me anything:`;
      setMessages(prev => [...prev, { role: "assistant", content: infoMsg }]);
      
      if (pendingQuery) {
        setTimeout(() => streamChat(pendingQuery), 500);
        setPendingQuery(null);
      }
    }
  }, [leadData, isOpen, hasCollectedLead]);

  useEffect(() => {
    if (!isOpen) hasInit.current = false;
  }, [isOpen]);

  const streamChat = useCallback(async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    const contextPrefix = leadData
      ? `[Student: ${leadData.name}, Course: ${leadData.course || "Not specified"}, State: ${leadData.state || "Not specified"}, City: ${leadData.city || "Not specified"}] `
      : "";

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: contextPrefix + userMessage },
          ],
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error("Too many requests. Please wait.");
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
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, leadData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();

    // If lead not collected, show lead form first
    if (!hasCollectedLead && onRequestLeadForm) {
      setMessages(prev => [...prev, { role: "user", content: userInput }]);
      setInput("");
      setPendingQuery(userInput);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Great question! 🎯 To give you **personalized recommendations**, I need a few quick details.\n\nPlease fill the form that just appeared — it takes less than 30 seconds! 📝"
      }]);
      onRequestLeadForm();
      return;
    }

    streamChat(userInput);
  };

  const handleNewChat = () => {
    setMessages([]);
    hasInit.current = false;
    setHasCollectedLead(false);
    // Re-open lead form for new chat
    if (onRequestLeadForm) {
      onRequestLeadForm();
    }
    setMessages([{ role: "assistant", content: "Hi! 👋 Please fill in your details to get started! 📝" }]);
  };

  const suggestedQueries = leadData?.name
    ? [
        `Top 5 colleges for ${leadData.course || "B.Tech"} in ${leadData.state || "India"}`,
        `Best colleges in ${leadData.city || leadData.state || "India"}`,
        "Career options and salary packages",
        "Which entrance exams should I prepare for?",
        "How to get scholarships?",
      ]
    : DEFAULT_SUGGESTIONS;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-foreground text-sm">DekhoCampus Counselor</h1>
                  <p className="text-xs text-muted-foreground">Your education guide</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleNewChat} className="rounded-xl text-xs">
                New Chat
              </Button>
            </header>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-accent" : "bg-secondary"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-accent-foreground" /> : <Bot className="w-4 h-4 text-secondary-foreground" />}
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "user-bubble rounded-br-md" : "ai-bubble rounded-bl-md"}`}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none text-foreground">
                          <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="ai-bubble px-4 py-3 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}

                {/* Suggested queries */}
                {!isLoading && hasCollectedLead && messages.length <= 3 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQueries.map((q) => (
                        <button
                          key={q}
                          onClick={() => streamChat(q)}
                          className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-full text-foreground border border-border transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about education..."
                  className="flex-1 rounded-xl text-sm py-5"
                  disabled={isLoading}
                />
                <Button type="submit" className="rounded-xl bg-primary px-5" disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
