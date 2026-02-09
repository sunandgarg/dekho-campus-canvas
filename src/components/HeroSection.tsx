import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, GraduationCap, BookOpen, FileText, ClipboardList, Star, Newspaper, MapPin, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const rotatingWords = ["College", "Course", "Career", "Exam", "Future"];

const suggestedPrompts = [
  "Best colleges for B.Tech CSE?",
  "How to crack JEE Main 2026?",
  "IIT vs NIT — what's right for me?",
  "Top MBA colleges after graduation?",
];

const quickCategories = [
  { label: "13000+ Colleges", icon: GraduationCap, href: "/colleges" },
  { label: "840+ Courses", icon: BookOpen, href: "/courses" },
  { label: "219+ Exams", icon: FileText, href: "/exams" },
  { label: "Application Form", icon: ClipboardList, href: "/colleges" },
  { label: "Review", icon: Star, href: "/articles" },
  { label: "News", icon: Newspaper, href: "/articles" },
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

  const handleAskAI = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onOpenChat) {
      onOpenChat(searchQuery.trim() || undefined);
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
    if (item.type === "College" && item.logo) {
      return <img src={item.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />;
    }
    if (item.type === "Exam" && (item.image || item.logo)) {
      return <img src={item.logo || item.image!} alt="" className="w-10 h-10 rounded-lg object-cover" />;
    }
    const Icon = getIcon(item);
    return (
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    );
  };

  return (
    <section className="relative bg-background border-b border-border" aria-label="Hero">
      <div className="container relative z-10 py-10 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] tracking-tight">
              Discover Your Ideal{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="text-primary"
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

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto">
            <form onSubmit={handleAskAI}>
              <div className="relative">
                <div className={`relative flex items-center bg-card rounded-xl border-2 transition-all ${isFocused ? "border-primary shadow-lg" : "border-border"}`}>
                  <div className="flex-shrink-0 pl-4">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search Colleges, Courses, Exams or Ask AI..."
                    className="flex-1 bg-transparent border-0 text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 py-3.5 px-3 text-foreground"
                    aria-label="Search or ask AI"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAskAI()}
                    size="default"
                    className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 mr-1.5 gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">Ask AI</span>
                  </Button>
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="py-1">
                      {dbResults.map((item) => (
                        <button
                          key={`${item.type}-${item.slug}`}
                          onMouseDown={() => handleResultClick(item)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                        >
                          {getThumb(item)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
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
                    <div className="border-t border-border px-4 py-2.5">
                      <button
                        onMouseDown={() => handleAskAI()}
                        className="w-full flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">Ask AI Counselor</p>
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
              <span className="text-xs text-muted-foreground font-medium">Try:</span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-3 py-1.5 text-xs bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Categories */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto pt-2">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {quickCategories.map((cat) => (
                <a
                  key={cat.label}
                  href={cat.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground text-center leading-tight">{cat.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
