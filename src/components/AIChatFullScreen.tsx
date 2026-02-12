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

export function AIChatFullScreen({ isOpen, onClose, initialMessage, leadData, onRequestLeadForm }: AIChatFullScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCollectedLead, setHasCollectedLead] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInit = useRef(false);

  const suggestedQueries = (() => {
    const queries: string[] = [];
    const state = leadData?.state || "India";
    const course = leadData?.course || "";
    queries.push(`Top 5 colleges in ${state}`);
    if (course) queries.push(`Best colleges for ${course}`);
    queries.push("Career options after Science");
    queries.push("Which entrance exams should I prepare for?");
    queries.push("How to get scholarships?");
    return queries.slice(0, 5);
  })();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !hasInit.current) {
      hasInit.current = true;
      setHasCollectedLead(!!leadData?.name);
      const greeting = leadData?.name
        ? `Hi **${leadData.name}**! 👋 I have your details — ${leadData.course || "your course"} interest from ${leadData.city || leadData.state || "India"}. How can I help you today?`
        : "Hi! 👋 I'm your **DekhoCampus Counselor**. Ask me about colleges, courses, exams, or career paths!";
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) hasInit.current = false;
  }, [isOpen]);

  const streamChat = useCallback(async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    // If lead not collected yet, trigger lead form on first user message
    if (!hasCollectedLead && onRequestLeadForm) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Great question! 🎯 To give you the **most accurate and personalized** recommendations, I need a few quick details. This helps me understand your background better.\n\nPlease fill in the short form that just appeared — it takes less than 30 seconds! 📝"
      }]);
      setIsLoading(false);
      onRequestLeadForm();
      setHasCollectedLead(true);
      return;
    }

    let assistantContent = "";
    const contextPrefix = leadData
      ? `[Student: ${leadData.name}, Course: ${leadData.course || "Not specified"}, State: ${leadData.state || "Not specified"}, City: ${leadData.city || "Not specified"}] `
      : "";

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
          } catch { /* skip */ }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, leadData, hasCollectedLead, onRequestLeadForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
  };

  const handleNewChat = () => {
    setMessages([]);
    hasInit.current = false;
    const greeting = leadData?.name
      ? `Hi **${leadData.name}**! 👋 How can I help you today?`
      : "Hi! 👋 Ask me anything about education!";
    setMessages([{ role: "assistant", content: greeting }]);
  };

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
                {messages.length <= 2 && !isLoading && (
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
