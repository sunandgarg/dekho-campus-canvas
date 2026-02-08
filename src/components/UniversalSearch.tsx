import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, BookOpen, FileText, ClipboardList, Star, Newspaper, MapPin, ArrowRight } from "lucide-react";

const rotatingWords = ["College", "Course", "Exam"];

const searchableItems = [
  { type: "College", name: "IIT Delhi", location: "New Delhi", icon: GraduationCap },
  { type: "College", name: "IIT Bombay", location: "Mumbai", icon: GraduationCap },
  { type: "College", name: "IIT Madras", location: "Chennai", icon: GraduationCap },
  { type: "College", name: "AIIMS Delhi", location: "New Delhi", icon: GraduationCap },
  { type: "College", name: "IIM Ahmedabad", location: "Ahmedabad", icon: GraduationCap },
  { type: "College", name: "NIT Trichy", location: "Tiruchirappalli", icon: GraduationCap },
  { type: "College", name: "BITS Pilani", location: "Pilani", icon: GraduationCap },
  { type: "College", name: "Delhi University", location: "New Delhi", icon: GraduationCap },
  { type: "Course", name: "B.Tech Computer Science", location: "", icon: BookOpen },
  { type: "Course", name: "MBBS", location: "", icon: BookOpen },
  { type: "Course", name: "MBA", location: "", icon: BookOpen },
  { type: "Course", name: "B.Com Honours", location: "", icon: BookOpen },
  { type: "Course", name: "BA LLB", location: "", icon: BookOpen },
  { type: "Course", name: "B.Des (Design)", location: "", icon: BookOpen },
  { type: "Exam", name: "JEE Main 2026", location: "", icon: FileText },
  { type: "Exam", name: "JEE Advanced 2026", location: "", icon: FileText },
  { type: "Exam", name: "NEET UG 2026", location: "", icon: FileText },
  { type: "Exam", name: "CUET 2026", location: "", icon: FileText },
  { type: "Exam", name: "CAT 2026", location: "", icon: FileText },
  { type: "Exam", name: "CLAT 2026", location: "", icon: FileText },
];

const quickCategories = [
  { label: "13004+ Colleges", icon: GraduationCap, bgColor: "bg-rose-50", borderColor: "border-rose-100", iconBg: "bg-rose-100" },
  { label: "840+ Courses", icon: BookOpen, bgColor: "bg-sky-50", borderColor: "border-sky-100", iconBg: "bg-sky-100" },
  { label: "219+ Exams", icon: FileText, bgColor: "bg-cyan-50", borderColor: "border-cyan-100", iconBg: "bg-cyan-100" },
  { label: "Application Form", icon: ClipboardList, bgColor: "bg-emerald-50", borderColor: "border-emerald-100", iconBg: "bg-emerald-100" },
  { label: "Review", icon: Star, bgColor: "bg-amber-50", borderColor: "border-amber-100", iconBg: "bg-amber-100" },
  { label: "News", icon: Newspaper, bgColor: "bg-sky-50", borderColor: "border-sky-100", iconBg: "bg-sky-100" },
];

export function UniversalSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchableItems
      .filter(item => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  return (
    <section className="py-12 bg-card" aria-label="Search Colleges, Courses & Exams">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Card container - matching Shiksha style */}
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

            {/* Search bar - clean minimal style */}
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
                <button className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Search className="w-6 h-6" />
                </button>
              </div>

              {/* Results dropdown */}
              {isFocused && query.trim() && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-40"
                >
                  <div className="py-2">
                    {results.map((item) => (
                      <button
                        key={item.name}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
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
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick category cards - Shiksha style grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {quickCategories.map((cat, index) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border ${cat.bgColor} ${cat.borderColor} transition-all hover:shadow-md hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${cat.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <cat.icon className="w-7 h-7 md:w-8 md:h-8 text-foreground/80" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-foreground text-center leading-tight">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}