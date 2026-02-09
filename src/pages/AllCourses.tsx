import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ListingPageLayout } from "@/components/ListingPageLayout";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { CourseCard } from "@/components/CourseCard";
import { useDbCourses } from "@/hooks/useCoursesData";

const courseCategories = ["All", "Engineering", "Medical", "Management", "Law", "Design", "Science", "Commerce", "Arts"] as const;
const courseLevels = ["All", "Undergraduate", "Postgraduate", "Diploma", "Doctoral"] as const;
const courseModes = ["All", "Full-Time", "Part-Time", "Online", "Distance"] as const;
const courseDurations = ["All", "1-2 Years", "3 Years", "4 Years", "5+ Years"] as const;

export default function AllCourses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [mode, setMode] = useState("All");
  const [duration, setDuration] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const { data: dbCourses } = useDbCourses();
  const courses = dbCourses ?? [];

  const activeFilters = [category, level, mode, duration].filter((f) => f !== "All").length;

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.full_name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || c.category === category;
      const matchLevel = level === "All" || c.level === level;
      const matchMode = mode === "All" || c.mode === mode;
      const matchDuration = duration === "All" || matchesDuration(c.duration, duration);
      return matchSearch && matchCategory && matchLevel && matchMode && matchDuration;
    });
  }, [search, category, level, mode, duration, courses]);

  const clearAll = () => { setCategory("All"); setLevel("All"); setMode("All"); setDuration("All"); };

  return (
    <ListingPageLayout title="All Courses in India 2026" description="Explore 10,000+ courses — compare eligibility, fees, career prospects & top colleges" page="courses">
      <PageBreadcrumb items={[{ label: "Courses" }]} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses (e.g. B.Tech CS, MBA, MBBS...)" className="pl-10 rounded-xl h-11" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="rounded-xl gap-2 h-11">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilters > 0 && <Badge className="ml-1 bg-primary text-primary-foreground text-xs px-1.5">{activeFilters}</Badge>}
        </Button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-2xl border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Filter Courses</h3>
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterGroup label="Category" options={courseCategories} value={category} onChange={setCategory} />
            <FilterGroup label="Level" options={courseLevels} value={level} onChange={setLevel} />
            <FilterGroup label="Mode" options={courseModes} value={mode} onChange={setMode} />
            <FilterGroup label="Duration" options={courseDurations} value={duration} onChange={setDuration} />
          </div>
        </motion.div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> courses
      </p>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((course, i) => (
              <CourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">No courses found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}

          <div className="mt-6"><DynamicAdBanner variant="horizontal" position="mid-page" page="courses" /></div>
        </div>

        <aside className="space-y-6">
          <LeadCaptureForm variant="sidebar" title="Confused About Courses?" subtitle="Get free career counseling from our experts" source="courses_listing" />
          <DynamicAdBanner variant="vertical" position="sidebar" page="courses" />
          <LeadCaptureForm variant="card" title="Get Course Alerts" subtitle="Stay updated on admission deadlines" source="courses_sidebar_card" />
          <DynamicAdBanner variant="square" position="sidebar" page="courses" />
        </aside>
      </div>

      <div className="mt-10">
        <LeadCaptureForm variant="banner" title="📚 Not sure which course is right? Talk to an expert!" subtitle="Our counselors analyze your interests, scores & goals" source="courses_bottom_banner" />
      </div>
    </ListingPageLayout>
  );
}

function matchesDuration(dur: string, filter: string): boolean {
  if (filter === "1-2 Years") return dur.includes("1") || dur.includes("2");
  if (filter === "3 Years") return dur === "3 Years";
  if (filter === "4 Years") return dur === "4 Years";
  if (filter === "5+ Years") return parseFloat(dur) >= 5;
  return true;
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${value === o ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
