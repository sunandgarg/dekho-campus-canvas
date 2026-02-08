import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Sparkles, GraduationCap, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestedPrompts = [
  "Best colleges for B.Tech CSE in India?",
  "How to prepare for JEE Main 2026?",
  "IIT vs NIT - which is better for me?",
  "Top MBA colleges after graduation?",
];

interface HeroSectionProps {
  onOpenChat?: (initialMessage?: string) => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onOpenChat) {
      onOpenChat(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    if (onOpenChat) {
      onOpenChat(prompt);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" aria-label="Hero">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40" />
      
      {/* Soft decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-orange-200/25 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-rose-200/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative z-10 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Friendly greeting badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-amber-200/50 shadow-sm"
          >
            <span className="text-2xl">👋</span>
            <span className="text-sm font-medium text-foreground">
              Hey there, future achiever!
            </span>
          </motion.div>

          {/* Main headline - humanized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-display font-extrabold text-foreground leading-tight">
              <span className="text-gradient">DC</span> Educational AI
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Your friendly guide to colleges, careers & exams. 
              <span className="text-foreground"> Ask me anything! 🎓</span>
            </p>
          </motion.div>

          {/* ChatGPT-style Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch}>
              <div className="relative bg-white rounded-2xl shadow-xl border border-border/50 p-2 hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask about colleges, courses, exams, career paths..."
                    className="flex-1 bg-transparent border-0 text-base md:text-lg placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 py-3"
                    aria-label="Ask a question"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg px-6"
                    disabled={!searchQuery.trim()}
                  >
                    <Send className="w-5 h-5 md:mr-2" />
                    <span className="hidden md:inline">Ask AI</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Suggested prompts */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Try asking:</span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-3 py-1.5 text-sm bg-white/80 hover:bg-white rounded-full border border-amber-200/50 text-foreground/80 hover:text-foreground hover:border-amber-300 transition-all hover:shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust indicators - more friendly */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["😊", "🎯", "📚", "🌟", "💪"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center text-lg shadow-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Loved by <span className="font-semibold text-foreground">1M+ students</span>
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-border" />

            <div className="flex items-center gap-4">
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-foreground">5000+</div>
                <div className="text-xs text-muted-foreground">Colleges</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-foreground">24/7</div>
                <div className="text-xs text-muted-foreground">AI Help</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
