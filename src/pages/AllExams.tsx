import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ListingPageLayout } from "@/components/ListingPageLayout";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";
import { ExamCard } from "@/components/ExamCard";
import { exams, examCategories, examLevels, examModes, examStatuses } from "@/data/exams";

export default function AllExams() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [mode, setMode] = useState("All");
  const [status, setStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [category, level, mode, status].filter((f) => f !== "All").length;

  const filtered = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.fullName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || e.category === category;
      const matchLevel = level === "All" || e.level === level;
      const matchMode = mode === "All" || e.mode === mode;
      const matchStatus = status === "All" || e.status === status;
      return matchSearch && matchCategory && matchLevel && matchMode && matchStatus;
    });
  }, [search, category, level, mode, status]);

  const clearAll = () => { setCategory("All"); setLevel("All"); setMode("All"); setStatus("All"); };

  return (
    <ListingPageLayout title="All Entrance Exams 2026" description="Complete guide to 500+ entrance exams — dates, eligibility, syllabus & preparation tips">
      <PageBreadcrumb items={[{ label: "Exams" }]} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams (e.g. JEE, NEET, CAT...)" className="pl-10 rounded-xl h-11" />
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
            <h3 className="text-sm font-semibold text-foreground">Filter Exams</h3>
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterGroup label="Category" options={examCategories} value={category} onChange={setCategory} />
            <FilterGroup label="Level" options={examLevels} value={level} onChange={setLevel} />
            <FilterGroup label="Mode" options={examModes} value={mode} onChange={setMode} />
            <FilterGroup label="Status" options={examStatuses} value={status} onChange={setStatus} />
          </div>
        </motion.div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> exams
      </p>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
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

          <div className="mt-6"><AdBanner variant="horizontal" position="Exams Mid-page" /></div>
        </div>

        <aside className="space-y-6">
          <LeadCaptureForm variant="sidebar" title="Need Exam Guidance?" subtitle="Get free preparation strategy from experts" source="exams_listing" />
          <AdBanner variant="vertical" position="Exams Sidebar" />
          <LeadCaptureForm variant="card" title="Exam Date Alerts" subtitle="Get notified about registration deadlines" source="exams_sidebar_card" />
          <AdBanner variant="square" position="Exams Sidebar 2" />
        </aside>
      </div>

      <div className="mt-10">
        <LeadCaptureForm variant="banner" title="📝 Need help preparing? Get expert guidance for free!" subtitle="Our counselors help you plan the perfect exam strategy" source="exams_bottom_banner" />
      </div>
    </ListingPageLayout>
  );
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
