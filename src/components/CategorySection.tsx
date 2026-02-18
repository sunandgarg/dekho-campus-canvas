import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, MapPin, ArrowRight, Clock, Users, Bookmark, TrendingUp, GraduationCap, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { id: "Engineering", label: "Engineering", emoji: "⚡" },
  { id: "Medical", label: "Medical", emoji: "🏥" },
  { id: "Management", label: "Management", emoji: "📊" },
  { id: "Design", label: "Design", emoji: "🎨" },
  { id: "Law", label: "Law", emoji: "⚖️" },
  { id: "Science", label: "Science", emoji: "🔬" },
  { id: "Arts", label: "Arts", emoji: "🎭" },
  { id: "Commerce", label: "Commerce", emoji: "💼" },
];

export function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("Engineering");
  const [colleges, setColleges] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [colRes, courseRes, examRes] = await Promise.all([
        supabase.from("colleges").select("name, slug, city, rating, courses_count, placement, image, logo").eq("is_active", true).eq("category", activeCategory).order("rating", { ascending: false }).limit(4),
        supabase.from("courses").select("name, slug, colleges_count, avg_salary, growth").eq("is_active", true).eq("category", activeCategory).order("colleges_count", { ascending: false }).limit(4),
        supabase.from("exams").select("name, slug, exam_date, applicants, level").eq("is_active", true).eq("category", activeCategory).order("name").limit(4),
      ]);
      setColleges(colRes.data || []);
      setCourses(courseRes.data || []);
      setExams(examRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [activeCategory]);

  return (
    <section className="py-10 md:py-14 bg-background" aria-labelledby="explore-heading">
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 id="explore-heading" className="text-headline font-bold text-foreground">
            Explore by <span className="text-gradient-accent">category</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse colleges, courses, and entrance exams across all fields
          </p>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide justify-center flex-wrap" role="tablist">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap flex-shrink-0 rounded-full gap-2 ${
                activeCategory === cat.id ? "gradient-primary text-primary-foreground border-0 shadow-md" : "border-border hover:bg-primary/5"
              }`}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Column 1: Top Colleges */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" /> Top colleges
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Based on rankings</p>
              </div>
              <Link to={`/colleges?category=${activeCategory}`}>
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="space-y-3">
              {colleges.length === 0 && !loading && <p className="text-xs text-muted-foreground py-4 text-center">No colleges found in this category</p>}
              {colleges.map((college, idx) => (
                <Link key={college.slug} to={`/colleges/${college.slug}`} className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="relative flex-shrink-0">
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center z-10">#{idx + 1}</span>
                    <img src={college.logo || college.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=80&fit=crop&fm=webp&q=75"} alt="" width={48} height={48} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{college.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{college.city}</span>
                      <span>•</span>
                      <span>{college.courses_count}+ courses</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" /> {college.rating}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{college.placement}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Trending Courses */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Trending courses
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">High demand programs</p>
              </div>
              <Link to="/courses">
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="space-y-3">
              {courses.length === 0 && !loading && <p className="text-xs text-muted-foreground py-4 text-center">No courses found in this category</p>}
              {courses.map((course) => (
                <Link key={course.slug} to={`/courses/${course.slug}`} className="group block p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{course.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{course.colleges_count}+ colleges</span>
                    <div className="flex items-center gap-1.5">
                      {course.growth && <Badge className="bg-accent/15 text-foreground hover:bg-accent/15 text-[10px] px-1.5 py-0 font-bold"><TrendingUp className="w-3 h-3 mr-0.5" />{course.growth}</Badge>}
                      {course.avg_salary && <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[10px] px-1.5 py-0">{course.avg_salary}</Badge>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Top Exams */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Top exams
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Key entrance exams</p>
              </div>
              <Link to="/exams">
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="space-y-3">
              {exams.length === 0 && !loading && <p className="text-xs text-muted-foreground py-4 text-center">No exams found in this category</p>}
              {exams.map((exam) => (
                <Link key={exam.slug} to={`/exams/${exam.slug}`} className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{exam.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{exam.exam_date || "TBA"}</span>
                      {exam.applicants && <>
                        <span>•</span>
                        <span>{exam.applicants} applicants</span>
                      </>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                      exam.level === "National" ? "border-destructive/40 text-destructive" : "border-primary/30 text-primary"
                    }`}>{exam.level}</Badge>
                    <Bookmark className="w-4 h-4 text-muted-foreground/40 hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
