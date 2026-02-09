import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Brain, Zap, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dekhocampus-logo.png";

const rotatingWords = ["College", "Course", "Career", "Exam", "Future"];

const suggestedPrompts = [
  "Best colleges for B.Tech CSE?",
  "How to crack JEE Main 2026?",
  "IIT vs NIT — what's right for me?",
  "Top MBA colleges after graduation?",
];

interface HeroSectionProps {
  onOpenChat?: (initialMessage?: string) => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

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
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background" aria-label="Hero">
      {/* Futuristic grid pattern */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 py-10 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <img src={logo} alt="DekhoCampus" className="h-12 md:h-16" />
          </motion.div>

          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20"
          >
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold tracking-wide uppercase text-accent">AI-Powered Education Intelligence</span>
          </motion.div>

          {/* Rotating headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] tracking-tight">
              Discover Your Ideal
              <br />
              <span className="relative inline-flex items-baseline gap-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Ask our AI counselor anything — colleges, courses, exams, scholarships & career paths
            </p>
          </motion.div>

          {/* AI Search Bar — futuristic glass style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch}>
              <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/60 p-1.5 ring-1 ring-primary/10">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center ml-1">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask AI about colleges, courses, exams..."
                    className="flex-1 bg-transparent border-0 text-base md:text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 py-3 text-foreground"
                    aria-label="Ask a question"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-5 md:px-6 shadow-lg"
                    disabled={!searchQuery.trim()}
                  >
                    <Send className="w-5 h-5 md:mr-2" />
                    <span className="hidden md:inline font-semibold">Ask AI</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Prompt chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Try:</span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-3 py-1.5 text-xs bg-card border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-6 md:gap-10 pt-2"
          >
            {[
              { label: "Colleges", count: "13,000+" },
              { label: "Courses", count: "840+" },
              { label: "Exams", count: "219+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg md:text-xl font-bold text-foreground">{stat.count}</p>
                <p className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
