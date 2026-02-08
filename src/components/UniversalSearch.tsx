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
  { label: "5000+ Colleges", icon: GraduationCap, color: "bg-pink-50 border-pink-200 text-pink-700" },
  { label: "840+ Courses", icon: BookOpen, color: "bg-orange-50 border-orange-200 text-orange-700" },
  { label: "219+ Exams", icon: FileText, color: "bg-purple-50 border-purple-200 text-purple-700" },
  { label: "Application Form", icon: ClipboardList, color: "bg-green-50 border-green-200 text-green-700" },
  { label: "Reviews", icon: Star, color: "bg-amber-50 border-amber-200 text-amber-700" },
  { label: "News", icon: Newspaper, color: "bg-sky-50 border-sky-200 text-sky-700" },
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
    <section className="py-10 bg-card border-y border-border" aria-label="Search Colleges, Courses & Exams">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Rotating headline */}
          <div className="text-center mb-6">
            <h2 className="text-headline font-extrabold text-foreground">
              Find the right{" "}
              <span className="inline-block relative w-[140px] sm:w-[160px] text-left align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-gradient-accent absolute left-0"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              {" "}for you
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Search across thousands of colleges, courses & exams on DekhoCampus
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className={`relative flex items-center rounded-xl border bg-card transition-all ${isFocused ? "border-primary shadow-glow" : "border-border shadow-soft"}`}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search Colleges, Courses, Exams, etc."
                className="flex-1 bg-transparent pl-5 pr-4 py-4 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 rounded-xl"
                aria-label="Search website"
              />
              <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Results dropdown */}
            {isFocused && query.trim() && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-40"
              >
                <div className="py-2">
                  {results.map((item) => (
                    <button
                      key={item.name}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
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

          {/* Quick category cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-3xl mx-auto">
            {quickCategories.map((cat) => (
              <button
                key={cat.label}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${cat.color}`}
              >
                <cat.icon className="w-7 h-7" />
                <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
