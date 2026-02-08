import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Star, Sparkles } from "lucide-react";
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
    if (onOpenChat) onOpenChat(prompt);
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden" aria-label="Hero">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative z-10 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              India's #1 AI Education Counselor
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-display font-extrabold text-foreground leading-tight">
              <span className="text-gradient">DekhoCampus</span>
              <br />
              <span className="text-headline text-muted-foreground font-bold">Educational AI</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Your personal AI guide for colleges, careers & exams.
              <span className="text-foreground"> Ask me anything! 🎓</span>
            </p>
          </motion.div>

          {/* AI Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch}>
              <div className="relative glass rounded-2xl shadow-elevated p-2 hover:shadow-glow transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
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
                    className="rounded-xl gradient-primary btn-glow px-6"
                    disabled={!searchQuery.trim()}
                  >
                    <Send className="w-5 h-5 md:mr-2" />
                    <span className="hidden md:inline">Ask AI</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Suggested prompts */}
            <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
              <span className="text-xs md:text-sm text-muted-foreground">Try asking:</span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm glass rounded-full text-foreground/80 hover:text-foreground hover:border-primary/30 transition-all hover:shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["😊", "🎯", "📚", "🌟", "💪"].map((emoji, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-card border-2 border-border flex items-center justify-center text-lg shadow-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-golden fill-golden" />
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
