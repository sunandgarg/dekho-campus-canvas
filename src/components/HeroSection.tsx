import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Zap,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  Star,
  Newspaper,
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/dekhocampus-logo.png";
import dcLogo from "@/assets/dc-logo.png";
import iconCollege from "@/assets/icon-college-badge.png";
import iconCourse from "@/assets/icon-course.png";
import iconExam from "@/assets/icon-exam.png";
import iconApplication from "@/assets/icon-application.png";
import iconDocument from "@/assets/icon-document.png";
import iconNews from "@/assets/icon-news.png";

const rotatingWords = ["College", "Course", "Career", "Exam", "Future"];
const wordColors = ["text-gradient", "text-gradient-accent", "text-gradient", "text-gradient-accent", "text-gradient"];

const suggestedPrompts = [
  "Best colleges for B.Tech CSE?",
  "How to crack JEE Main 2026?",
  "IIT vs NIT — what's right for me?",
  "Top MBA colleges after graduation?",
];

const quickCategories = [
  {
    label: "13000+ Colleges",
    image: iconCollege,
    bgColor: "bg-primary/5",
    href: "/colleges",
    alt: "College directory icon",
  },
  { label: "840+ Courses", image: iconCourse, bgColor: "bg-accent/5", href: "/courses", alt: "Course catalog icon" },
  { label: "219+ Exams", image: iconExam, bgColor: "bg-secondary", href: "/exams", alt: "Exam information icon" },
  { label: "Apply Now", image: iconApplication, bgColor: "bg-primary/5", href: "/colleges", alt: "Application icon" },
  { label: "Student Reviews", image: iconDocument, bgColor: "bg-accent/5", href: "/articles", alt: "Reviews icon" },
  { label: "Latest News", image: iconNews, bgColor: "bg-secondary", href: "/articles", alt: "News icon" },
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
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setDbResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const { data, error } = await supabase.rpc("fuzzy_search", {
          search_query: q,
          result_limit: 9,
        });

        if (error) throw error;

        const results: SearchResult[] = (data || []).map((r: any) => ({
          type: r.type as "College" | "Course" | "Exam",
          name: r.name,
          slug: r.slug,
          location: r.location || "",
          logo: r.logo || "",
        }));
        setDbResults(results);
      } catch {
        /* skip */
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
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
      return <img src={item.logo} alt="" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />;
    }
    if (item.type === "Exam" && (item.image || item.logo)) {
      return (
        <img
          src={item.logo || item.image!}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-xl object-cover"
        />
      );
    }
    const Icon = getIcon(item);
    return (
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden bg-background" aria-label="Hero">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-muted/30 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4 py-8 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-8">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20"
          >
            <img src={dcLogo} alt="" width={16} height={16} className="w-4 h-4 object-contain" />
            <span className="text-xs font-semibold tracking-wide uppercase text-accent">
              AI-Powered Education Intelligence
            </span>
          </motion.div>

          {/* Rotating headline */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] tracking-tight">
              Discover Your Ideal
              <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`inline-block ${wordColors[wordIndex]}`}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </h1>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Search colleges, courses & exams — or ask our AI counselor anything
            </p>
          </motion.div>

          {/* Unified Search Bar with AI icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleAskAI}>
              <div className="relative">
                <div
                  className={`relative flex items-center bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border p-1.5 transition-all ${isFocused ? "border-primary/40 ring-2 ring-primary/10" : "border-border/60 ring-1 ring-primary/5"}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center ml-0.5">
                    {searchQuery.trim() ? (
                      <Search className="w-5 h-5 text-white" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search Colleges, Courses, Exams or Ask AI..."
                    className="flex-1 bg-transparent border-0 text-sm md:text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 py-2.5 md:py-3 px-2.5 md:px-3 text-foreground min-w-0"
                    aria-label="Search or ask AI"
                  />
                  <Button
                    type="submit"
                    size="default"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white px-3 md:px-5 shadow-lg h-9 md:h-10 relative"
                    disabled={!searchQuery.trim()}
                    aria-label="Ask AI counselor"
                  >
                    <Send className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline font-semibold text-sm">Ask AI</span>
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
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                        >
                          {getThumb(item)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate text-sm">{item.name}</p>
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
                    <div className="border-t border-border px-4 py-2.5">
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
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Try:</span>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-2.5 py-1 text-[11px] md:text-xs bg-card border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Category Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto pt-2"
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
              {quickCategories.map((cat, index) => (
                <motion.a
                  key={cat.label}
                  href={cat.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.04 }}
                  className={`flex flex-col items-center gap-1.5 p-2.5 md:p-4 rounded-2xl ${cat.bgColor} border border-transparent transition-all hover:shadow-md hover:-translate-y-0.5 group`}
                >
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    width={56}
                    height={56}
                    className="w-10 h-10 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="text-[10px] md:text-xs font-semibold text-foreground/80 text-center leading-tight">
                    {cat.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
