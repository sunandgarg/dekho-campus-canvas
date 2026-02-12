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
import { ExamCard } from "@/components/ExamCard";
import { useDbExams } from "@/hooks/useExamsData";
import {
  examCategories, examStreams, examCourseGroups, examLevels,
} from "@/data/indianLocations";

export default function AllExams() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedCourseGroups, setSelectedCourseGroups] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const { data: dbExams } = useDbExams();
  const exams = dbExams ?? [];

  const activeFilters = [...selectedCategories, ...selectedStreams, ...selectedCourseGroups, ...selectedLevels];

  const filtered = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.full_name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(e.exam_type);
      const matchStream = selectedStreams.length === 0 || selectedStreams.includes(e.category);
      const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(e.level);
      return matchSearch && matchCategory && matchStream && matchLevel;
    });
  }, [search, selectedCategories, selectedStreams, selectedCourseGroups, selectedLevels, exams]);

  const heading = useMemo(() => {
    const stream = selectedStreams.length === 1 ? selectedStreams[0] + " " : "";
    const cat = selectedCategories.length === 1 ? selectedCategories[0] + " " : "";
    return `Top ${stream}${cat}Exams 2026`;
  }, [selectedStreams, selectedCategories]);

  const clearAll = () => {
    setSelectedCategories([]); setSelectedStreams([]);
    setSelectedCourseGroups([]); setSelectedLevels([]);
  };

  const removeFilter = (f: string) => {
    setSelectedCategories(prev => prev.filter(x => x !== f));
    setSelectedStreams(prev => prev.filter(x => x !== f));
    setSelectedCourseGroups(prev => prev.filter(x => x !== f));
    setSelectedLevels(prev => prev.filter(x => x !== f));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="exams" />
      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Exams" }]} />
        <header className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">{heading}</h1>
          <p className="text-sm text-muted-foreground">Complete guide to {filtered.length}+ entrance exams — dates, eligibility, syllabus & preparation tips</p>
        </header>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams (e.g. JEE, NEET, CAT...)" className="pl-10 rounded-xl h-11" />
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">Filter By</span>
                {activeFilters.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-destructive hover:underline">Reset</button>
                )}
              </div>
              <FilterSection title="Category of Exams" items={examCategories} selected={selectedCategories} onChange={setSelectedCategories} />
              <FilterSection title="Streams of Exams" items={examStreams} selected={selectedStreams} onChange={setSelectedStreams} />
              <FilterSection title="Course Groups" items={examCourseGroups} selected={selectedCourseGroups} onChange={setSelectedCourseGroups} />
              <FilterSection title="Level of Exams" items={examLevels} selected={selectedLevels} onChange={setSelectedLevels} />
              <LeadCaptureForm variant="sidebar" title="Need Exam Guidance?" subtitle="Get free preparation strategy" source="exams_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="exams" />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-4">Showing <span className="font-semibold text-foreground">{filtered.length}</span> exams</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((exam, i) => (
                <ExamCard key={exam.slug} exam={exam} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No exams found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
            <div className="mt-8">
              <LeadCaptureForm variant="banner" title="📝 Need help preparing? Get expert guidance for free!" subtitle="Our counselors help you plan the perfect exam strategy" source="exams_bottom_banner" />
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
        {selected.length > 0 && <Badge variant="secondary" className="text-[10px] ml-2 px-1.5">{selected.length}</Badge>}
        <span className="ml-auto">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
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
