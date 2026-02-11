import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Brain, Zap, GraduationCap, BookOpen, FileText, ClipboardList, Star, Newspaper, MapPin, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/dekhocampus-logo.png";

const rotatingWords = ["College", "Course", "Career", "Exam", "Future"];
const wordColors = [
  "text-gradient",         // College - blue (primary)
  "text-gradient-accent",  // Course - orange (accent)
  "text-gradient",         // Career - blue
  "text-gradient-accent",  // Exam - orange
  "text-gradient",         // Future - blue
];

const suggestedPrompts = [
  "Best colleges for B.Tech CSE?",
  "How to crack JEE Main 2026?",
  "IIT vs NIT — what's right for me?",
  "Top MBA colleges after graduation?",
];

const quickCategories = [
  { label: "13000+ Colleges", icon: GraduationCap, bgColor: "bg-rose-50", iconBg: "bg-rose-100", href: "/colleges" },
  { label: "840+ Courses", icon: BookOpen, bgColor: "bg-sky-50", iconBg: "bg-sky-100", href: "/courses" },
  { label: "219+ Exams", icon: FileText, bgColor: "bg-cyan-50", iconBg: "bg-cyan-100", href: "/exams" },
  { label: "Application Form", icon: ClipboardList, bgColor: "bg-emerald-50", iconBg: "bg-emerald-100", href: "/colleges" },
  { label: "Review", icon: Star, bgColor: "bg-amber-50", iconBg: "bg-amber-100", href: "/articles" },
  { label: "News", icon: Newspaper, bgColor: "bg-blue-50", iconBg: "bg-blue-100", href: "/articles" },
];

interface SearchResult {
  type: "College" | "Course" | "Exam";
  name: string;
  location: string;
  slug: string;
  logo?: string;
  image?: string;
}

interface HeroSectionProps {
  onOpenChat?: (initialMessage?: string) => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [dbResults, setDbResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Live search from database
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) { setDbResults([]); return; }

    const timeout = setTimeout(async () => {
      try {
        const [colleges, courses, exams] = await Promise.all([
          supabase.from("colleges").select("name, slug, city, logo").eq("is_active", true).ilike("name", `%${q}%`).limit(4),
          supabase.from("courses").select("name, slug").eq("is_active", true).ilike("name", `%${q}%`).limit(3),
          supabase.from("exams").select("name, slug, image, logo").eq("is_active", true).ilike("name", `%${q}%`).limit(3),
        ]);

        const results: SearchResult[] = [
          ...(colleges.data || []).map(c => ({ type: "College" as const, name: c.name, slug: c.slug, location: c.city || "", logo: c.logo || "" })),
          ...(courses.data || []).map(c => ({ type: "Course" as const, name: c.name, slug: c.slug, location: "" })),
          ...(exams.data || []).map(e => ({ type: "Exam" as const, name: e.name, slug: e.slug, location: "", image: e.image || "", logo: e.logo || "" })),
        ];
        setDbResults(results);
      } catch { /* skip */ }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onOpenChat) {
      onOpenChat(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleResultClick = (item: SearchResult) => {
    setSearchQuery("");
    setIsFocused(false);
    const typeRoute = item.type === "College" ? "colleges" : item.type === "Course" ? "courses" : "exams";
    navigate(`/${typeRoute}/${item.slug}`);
  };

  const handleSuggestionClick = (prompt: string) => {
    if (onOpenChat) onOpenChat(prompt);
  };

  const showDropdown = isFocused && searchQuery.trim().length >= 2 && dbResults.length > 0;

  const getIcon = (item: SearchResult) => {
    if (item.type === "College") return GraduationCap;
    if (item.type === "Course") return BookOpen;
    return FileText;
  };

  const getThumb = (item: SearchResult) => {
    // College: show logo if available
    if (item.type === "College" && item.logo) {
      return <img src={item.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />;
    }
    // Exam: show image if available
    if (item.type === "Exam" && (item.image || item.logo)) {
      return <img src={item.logo || item.image!} alt="" className="w-10 h-10 rounded-xl object-cover" />;
    }
    // Fallback icon
    const Icon = getIcon(item);
    return (
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    );
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
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          {/* AI Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold tracking-wide uppercase text-accent">AI-Powered Education Intelligence</span>
          </motion.div>

          {/* Rotating headline */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                    className={wordColors[wordIndex]}
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Search colleges, courses & exams — or ask our AI counselor anything
            </p>
          </motion.div>

          {/* Unified Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto">
            <form onSubmit={handleAskAI}>
              <div className="relative">
                <div className={`relative flex items-center bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border p-1.5 transition-all ${isFocused ? "border-primary/40 ring-2 ring-primary/10" : "border-border/60 ring-1 ring-primary/5"}`}>
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center ml-1">
                    {searchQuery.trim() ? <Search className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search Colleges, Courses, Exams or Ask AI..."
                    className="flex-1 bg-transparent border-0 text-base md:text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 py-3 px-3 text-foreground"
                    aria-label="Search or ask AI"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white px-5 md:px-6 shadow-lg"
                    disabled={!searchQuery.trim()}
                  >
                    <Send className="w-5 h-5 md:mr-2" />
                    <span className="hidden md:inline font-semibold">Ask AI</span>
                  </Button>
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {dbResults.map((item) => (
                        <button
                          key={`${item.type}-${item.slug}`}
                          onMouseDown={() => handleResultClick(item)}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          {getThumb(item)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{item.type}</span>
                              {item.location && (
                                <>
                                  <span>•</span>
                                  <MapPin className="w-3 h-3" />
                                  <span>{item.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                    {/* Ask AI option at bottom */}
                    <div className="border-t border-border px-5 py-3">
                      <button
                        onMouseDown={handleAskAI as any}
                        className="w-full flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-accent text-sm">Ask AI Counselor</p>
                          <p className="text-xs text-muted-foreground">Get personalized guidance for "{searchQuery}"</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
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

          {/* Quick Category Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-3xl mx-auto pt-2">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
              {quickCategories.map((cat, index) => (
                <motion.a
                  key={cat.label}
                  href={cat.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.04 }}
                  className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl ${cat.bgColor} border border-transparent transition-all hover:shadow-md hover:-translate-y-0.5 group`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <cat.icon className="w-6 h-6 md:w-7 md:h-7 text-foreground/70" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-foreground/80 text-center leading-tight">{cat.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
