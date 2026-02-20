import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, BookOpen, FileText, ClipboardList, Star, Newspaper, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AILeadForm } from "@/components/AILeadForm";

const rotatingWords = ["College", "Course", "Exam"];

interface SearchResult {
  type: "College" | "Course" | "Exam";
  name: string;
  location: string;
  slug: string;
  logo?: string;
}

const quickCategories = [
  { label: "13004+ Colleges", icon: GraduationCap, bgColor: "bg-rose-50", borderColor: "border-rose-100", iconBg: "bg-rose-100", href: "/colleges" },
  { label: "840+ Courses", icon: BookOpen, bgColor: "bg-sky-50", borderColor: "border-sky-100", iconBg: "bg-sky-100", href: "/courses" },
  { label: "219+ Exams", icon: FileText, bgColor: "bg-cyan-50", borderColor: "border-cyan-100", iconBg: "bg-cyan-100", href: "/exams" },
  { label: "Application Form", icon: ClipboardList, bgColor: "bg-emerald-50", borderColor: "border-emerald-100", iconBg: "bg-emerald-100", href: "/colleges" },
  { label: "Review", icon: Star, bgColor: "bg-amber-50", borderColor: "border-amber-100", iconBg: "bg-amber-100", href: "/articles" },
  { label: "News", icon: Newspaper, bgColor: "bg-sky-50", borderColor: "border-sky-100", iconBg: "bg-sky-100", href: "/articles" },
];

interface UniversalSearchProps {
  onOpenChat?: (message?: string) => void;
}

export function UniversalSearch({ onOpenChat }: UniversalSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [dbResults, setDbResults] = useState<SearchResult[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [pendingChatQuery, setPendingChatQuery] = useState<string | undefined>();
  const [leadCompleted, setLeadCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q || q.length < 2) { setDbResults([]); return; }

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
      } catch { /* skip */ }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = (item: SearchResult) => {
    setQuery("");
    setIsFocused(false);
    const typeRoute = item.type === "College" ? "colleges" : item.type === "Course" ? "courses" : "exams";
    navigate(`/${typeRoute}/${item.slug}`);
  };

  const handleAskAI = () => {
    if (!leadCompleted) {
      // Gate behind lead form
      setPendingChatQuery(query.trim() || undefined);
      setShowLeadForm(true);
      setIsFocused(false);
      return;
    }
    if (onOpenChat) {
      onOpenChat(query.trim() || undefined);
      setQuery("");
      setIsFocused(false);
    }
  };

  const handleLeadSubmit = (data: { name: string; course: string; state: string; city: string }) => {
    setShowLeadForm(false);
    setLeadCompleted(true);
    // Now open chat with the pending query
    if (onOpenChat) {
      onOpenChat(pendingChatQuery);
      setQuery("");
      setPendingChatQuery(undefined);
    }
  };

  const handleLeadClose = () => {
    setShowLeadForm(false);
    // Don't navigate away - just close the form
  };

  const showDropdown = isFocused && query.trim().length >= 2;

  const getIcon = (type: string) => {
    if (type === "College") return GraduationCap;
    if (type === "Course") return BookOpen;
    return FileText;
  };

  return (
    <section className="py-12 bg-card" aria-label="Search Colleges, Courses & Exams">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-border/50 p-8 md:p-10">
            {/* Headline with inline rotating text */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Find the right{" "}
                <span className="relative inline-block min-w-[120px] md:min-w-[140px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rotatingWords[wordIndex]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-gradient-accent"
                    >
                      {rotatingWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {" "}for you
              </h2>
            </div>

            {/* Search bar */}
            <div className="relative max-w-3xl mx-auto mb-10">
              <div className={`relative flex items-center rounded-xl border-2 bg-white transition-all ${isFocused ? "border-primary shadow-lg" : "border-border"}`}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="Search Colleges, Courses, Exams, etc."
                  className="flex-1 bg-transparent pl-5 pr-4 py-4 text-base md:text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 rounded-xl"
                  aria-label="Search website"
                />
                <button 
                  onClick={handleAskAI}
                  className="flex-shrink-0 flex items-center gap-1.5 mr-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>

              {/* Results dropdown */}
              {showDropdown && (dbResults.length > 0 || query.trim().length >= 2) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-40"
                >
                  <div className="py-2">
                    {dbResults.map((item) => {
                      const Icon = getIcon(item.type);
                      return (
                        <button
                          key={`${item.type}-${item.slug}`}
                          onMouseDown={() => handleResultClick(item)}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            {item.logo ? (
                              <img src={item.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                              <Icon className="w-5 h-5 text-primary" />
                            )}
                          </div>
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
                      );
                    })}
                  </div>
                  {/* Ask AI option */}
                  <div className="border-t border-border px-5 py-3">
                    <button
                      onMouseDown={handleAskAI}
                      className="w-full flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm">Ask AI Counselor</p>
                        <p className="text-xs text-muted-foreground">Get personalized guidance for "{query}"</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick category cards */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {quickCategories.map((cat, index) => (
                <motion.a
                  key={cat.label}
                  href={cat.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border ${cat.bgColor} ${cat.borderColor} transition-all hover:shadow-md hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${cat.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <cat.icon className="w-7 h-7 md:w-8 md:h-8 text-foreground/80" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-foreground text-center leading-tight">{cat.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AILeadForm isOpen={showLeadForm} onClose={handleLeadClose} onSubmit={handleLeadSubmit} />
    </section>
  );
}
