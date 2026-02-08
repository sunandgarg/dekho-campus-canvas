import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, BookOpen, FileText, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const searchableItems = [
  // Colleges
  { type: "College", name: "IIT Delhi", location: "New Delhi", icon: GraduationCap },
  { type: "College", name: "IIT Bombay", location: "Mumbai", icon: GraduationCap },
  { type: "College", name: "IIT Madras", location: "Chennai", icon: GraduationCap },
  { type: "College", name: "AIIMS Delhi", location: "New Delhi", icon: GraduationCap },
  { type: "College", name: "IIM Ahmedabad", location: "Ahmedabad", icon: GraduationCap },
  { type: "College", name: "NIT Trichy", location: "Tiruchirappalli", icon: GraduationCap },
  { type: "College", name: "BITS Pilani", location: "Pilani", icon: GraduationCap },
  { type: "College", name: "Delhi University", location: "New Delhi", icon: GraduationCap },
  // Courses
  { type: "Course", name: "B.Tech Computer Science", location: "", icon: BookOpen },
  { type: "Course", name: "MBBS", location: "", icon: BookOpen },
  { type: "Course", name: "MBA", location: "", icon: BookOpen },
  { type: "Course", name: "B.Com Honours", location: "", icon: BookOpen },
  { type: "Course", name: "BA LLB", location: "", icon: BookOpen },
  { type: "Course", name: "B.Des (Design)", location: "", icon: BookOpen },
  // Exams
  { type: "Exam", name: "JEE Main 2026", location: "", icon: FileText },
  { type: "Exam", name: "JEE Advanced 2026", location: "", icon: FileText },
  { type: "Exam", name: "NEET UG 2026", location: "", icon: FileText },
  { type: "Exam", name: "CUET 2026", location: "", icon: FileText },
  { type: "Exam", name: "CAT 2026", location: "", icon: FileText },
  { type: "Exam", name: "CLAT 2026", location: "", icon: FileText },
];

const quickLinks = [
  { label: "Top Engineering Colleges", href: "#" },
  { label: "Medical Colleges", href: "#" },
  { label: "MBA Colleges", href: "#" },
  { label: "JEE Main Cutoff", href: "#" },
  { label: "NEET Colleges", href: "#" },
  { label: "B.Tech Courses", href: "#" },
];

export function UniversalSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchableItems
      .filter(item => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  return (
    <section className="py-6 bg-card border-y border-border sticky top-16 z-30" aria-label="Universal Search">
      <div className="container">
        <div className="max-w-3xl mx-auto relative">
          <div className={`relative rounded-xl border transition-all ${isFocused ? "border-primary shadow-glow" : "border-border"}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search colleges, courses, exams across India..."
              className="pl-12 pr-4 py-3 h-12 rounded-xl border-0 text-base focus-visible:ring-0"
              aria-label="Search website"
            />
          </div>

          {/* Results dropdown */}
          {isFocused && (query.trim() ? results.length > 0 : true) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-40"
            >
              {query.trim() && results.length > 0 ? (
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
              ) : !query.trim() ? (
                <div className="p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {quickLinks.map(link => (
                      <button
                        key={link.label}
                        onClick={() => setQuery(link.label)}
                        className="px-3 py-1.5 text-xs bg-muted rounded-full text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
