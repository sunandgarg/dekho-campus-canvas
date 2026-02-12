import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { FixedCounsellingCTA } from "@/components/FixedCounsellingCTA";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { CourseCard } from "@/components/CourseCard";
import { useDbCourses } from "@/hooks/useCoursesData";

const courseCategories = ["Engineering", "Medical", "Management", "Law", "Design", "Science", "Commerce", "Arts"] as const;
const courseLevels = ["Undergraduate", "Postgraduate", "Diploma", "Doctoral"] as const;
const courseModes = ["Full-Time", "Part-Time", "Online", "Distance"] as const;

export default function AllCourses() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const { data: dbCourses } = useDbCourses();
  const courses = dbCourses ?? [];

  const activeFilters = [...selectedCategories, ...selectedLevels, ...selectedModes];

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.full_name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(c.category);
      const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(c.level);
      const matchMode = selectedModes.length === 0 || selectedModes.includes(c.mode);
      return matchSearch && matchCategory && matchLevel && matchMode;
    });
  }, [search, selectedCategories, selectedLevels, selectedModes, courses]);

  const heading = useMemo(() => {
    const cat = selectedCategories.length === 1 ? selectedCategories[0] + " " : "";
    const lvl = selectedLevels.length === 1 ? selectedLevels[0] + " " : "";
    return `Top ${cat}${lvl}Courses in India 2026`;
  }, [selectedCategories, selectedLevels]);

  const clearAll = () => { setSelectedCategories([]); setSelectedLevels([]); setSelectedModes([]); };

  const removeFilter = (f: string) => {
    setSelectedCategories(prev => prev.filter(x => x !== f));
    setSelectedLevels(prev => prev.filter(x => x !== f));
    setSelectedModes(prev => prev.filter(x => x !== f));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="courses" />
      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Courses" }]} />
        <header className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">{heading}</h1>
          <p className="text-sm text-muted-foreground">Explore {filtered.length}+ courses — compare eligibility, fees, career prospects & top colleges</p>
        </header>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses (e.g. B.Tech, MBA, MBBS...)" className="pl-10 rounded-xl h-11" />
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <Badge key={f} variant="secondary" className="gap-1 pr-1">{f}<button onClick={() => removeFilter(f)} className="ml-1"><X className="w-3 h-3" /></button></Badge>
            ))}
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <FilterSection title="Stream" items={courseCategories as unknown as string[]} selected={selectedCategories} onChange={setSelectedCategories} />
              <FilterSection title="Level" items={courseLevels as unknown as string[]} selected={selectedLevels} onChange={setSelectedLevels} />
              <FilterSection title="Mode" items={courseModes as unknown as string[]} selected={selectedModes} onChange={setSelectedModes} />
              <LeadCaptureForm variant="sidebar" title="Confused About Courses?" subtitle="Get free career counseling" source="courses_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="courses" />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-4">Showing <span className="font-semibold text-foreground">{filtered.length}</span> courses</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((course, i) => (
                <CourseCard key={course.slug} course={course} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No courses found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
            <div className="mt-8">
              <LeadCaptureForm variant="banner" title="📚 Not sure which course is right? Talk to an expert!" subtitle="Our counselors analyze your interests, scores & goals" source="courses_bottom_banner" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingBot />
      <FixedCounsellingCTA />
    </div>
  );
}

function FilterSection({ title, items, selected, onChange }: { title: string; items: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [expanded, setExpanded] = useState(true);

  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground">
        {title}
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {items.map(item => (
            <label key={item} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded px-1 py-0.5">
              <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggle(item)} className="w-4 h-4" />
              <span className="text-xs">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
