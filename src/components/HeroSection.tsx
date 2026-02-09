import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import campusBg from "@/assets/campus-hero-bg.jpg";
import logo from "@/assets/dekhocampus-logo.png";

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
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden" aria-label="Hero">
      {/* Campus background image */}
      <img
        src={campusBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="container relative z-10 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <img src={logo} alt="DekhoCampus" className="h-14 md:h-20" />
          </motion.div>

          {/* Tagline badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md border border-card/30"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-card">
              India's #1 AI Education Counselor
            </span>
          </motion.div>

          {/* AI Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch}>
              <div className="relative bg-card rounded-2xl shadow-elevated p-2">
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
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
              <span className="text-xs text-card/80">Try asking:</span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-2.5 py-1 text-xs bg-card/15 backdrop-blur-sm rounded-full text-card/90 hover:text-card hover:bg-card/25 transition-all border border-card/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
