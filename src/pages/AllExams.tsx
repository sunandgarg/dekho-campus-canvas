import { useState, useMemo, Fragment, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { ExamCard } from "@/components/ExamCard";
import { ExamCardSkeleton } from "@/components/SkeletonCards";
import { InlineAdSlot } from "@/components/InlineAdSlot";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { MobileBottomFilter } from "@/components/MobileBottomFilter";
import { useInfiniteData } from "@/hooks/useInfiniteData";
import { getExamHeading, examSeoRoutes } from "@/lib/seoSlugs";
import { useSearchParams, Link } from "react-router-dom";
import {
  examCategories, examStreams, examCourseGroups, examLevels,
} from "@/data/indianLocations";

const topSearches = ["JEE Main", "NEET", "CAT", "GATE", "CLAT", "CUET", "JEE Advanced", "NEET PG"];

export default function AllExams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = searchParams.get("category"); return c ? [c] : [];
  });
  const [selectedStreams, setSelectedStreams] = useState<string[]>(() => {
    const s = searchParams.get("stream"); return s ? [s] : [];
  });
  const [selectedCourseGroups, setSelectedCourseGroups] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  const dbFilters = useMemo(() => {
    const f: Record<string, string | string[] | undefined> = {};
    if (selectedStreams.length === 1) f.category = selectedStreams[0];
    if (selectedLevels.length === 1) f.level = selectedLevels[0];
    return f;
  }, [selectedStreams, selectedLevels]);

  const { items: exams, sentinelRef, isLoading, isFetchingMore, hasMore } = useInfiniteData({
    table: "exams",
    queryKey: ["infinite-exams"],
    orderBy: "name",
    ascending: true,
    filters: dbFilters,
    search: search || undefined,
    searchFields: ["name", "full_name"],
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCourseGroups.length === 1) params.set("group", selectedCourseGroups[0]);
    else if (selectedStreams.length === 1) params.set("stream", selectedStreams[0]);
    if (selectedLevels.length === 1) params.set("level", selectedLevels[0]);
    if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);
    setSearchParams(params, { replace: true });
  }, [selectedStreams, selectedCategories, selectedCourseGroups, selectedLevels, setSearchParams]);

  const activeFilters = [...selectedCategories, ...selectedStreams, ...selectedCourseGroups, ...selectedLevels];

  const filtered = useMemo(() => {
    return exams.filter((e: any) => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(e.exam_type);
      return matchCategory;
    });
  }, [exams, selectedCategories]);

  const heading = useMemo(() => getExamHeading({
    category: selectedCategories[0],
    stream: selectedStreams[0],
    courseGroup: selectedCourseGroups[0],
    level: selectedLevels[0],
  }), [selectedStreams, selectedCategories, selectedCourseGroups, selectedLevels]);

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

  const filterConfigs = [
    { title: "Category of Exams", items: examCategories, selected: selectedCategories, onChange: setSelectedCategories },
    { title: "Streams of Exams", items: examStreams, selected: selectedStreams, onChange: setSelectedStreams },
    { title: "Course Groups", items: examCourseGroups, selected: selectedCourseGroups, onChange: setSelectedCourseGroups },
    { title: "Level of Exams", items: examLevels, selected: selectedLevels, onChange: setSelectedLevels },
  ];

  const ITEMS_PER_AD = 4;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="exams" />
      <main className="px-3 md:container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Exams" }]} />
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">{heading}</h1>
          <p className="text-sm text-muted-foreground">Complete guide to {filtered.length}+ entrance exams — dates, eligibility, syllabus & preparation tips</p>
        </header>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams (e.g. JEE, NEET, CAT...)" className="pl-10 rounded-xl h-10" />
          </div>
        </div>

        {/* SEO Quick Links */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {examSeoRoutes.map(route => (
            <Link key={route.label} to={`/exams?${new URLSearchParams(route.params).toString()}`}
              className="px-2.5 py-1 text-[11px] bg-card border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
              {route.label}
            </Link>
          ))}
        </div>

        {/* Top Searches - mobile only */}
        <div className="lg:hidden mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Top Searches</p>
          <div className="flex flex-wrap gap-1.5">
            {topSearches.map(s => (
              <button key={s} onClick={() => setSearch(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  search === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:bg-muted"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {activeFilters.map(f => (
              <Badge key={f} variant="secondary" className="gap-1 pr-1 text-xs">{f}<button onClick={() => removeFilter(f)} className="ml-1"><X className="w-3 h-3" /></button></Badge>
            ))}
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">Filter By</span>
                {activeFilters.length > 0 && <button onClick={clearAll} className="text-xs text-destructive hover:underline">Reset</button>}
              </div>
              {filterConfigs.map(fc => <FilterSection key={fc.title} {...fc} />)}
              <LeadCaptureForm variant="sidebar" title="Need Exam Guidance?" subtitle="Get free preparation strategy" source="exams_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="exams" />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-3">Showing <span className="font-semibold text-foreground">{filtered.length}</span> exams</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <ExamCardSkeleton key={i} />)
              ) : (
                filtered.map((exam: any, i: number) => (
                  <Fragment key={exam.slug}>
                    <ExamCard exam={exam} index={Math.min(i, 5)} />
                    {(i + 1) % ITEMS_PER_AD === 0 && i < filtered.length - 1 && (
                      <InlineAdSlot page="exams" index={Math.floor(i / ITEMS_PER_AD)} source={`exams_inline_${i}`} />
                    )}
                  </Fragment>
                ))
              )}
            </div>

            <div ref={sentinelRef} className="h-4" />
            {isFetchingMore && (
              <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            )}
            {!hasMore && filtered.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">You've seen all exams</p>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No exams found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
            <div className="mt-6">
              <LeadCaptureForm variant="banner" title="📝 Need help preparing? Get expert guidance for free!" subtitle="Our counselors help you plan the perfect exam strategy" source="exams_bottom_banner" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingBot />
      <WhatsAppButton />
      <MobileBottomFilter activeCount={activeFilters.length} onOpen={() => setFilterOpen(true)} />
      <MobileFilterSheet filters={filterConfigs} activeCount={activeFilters.length} onClearAll={clearAll} open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
}

function FilterSection({ title, items, selected, onChange }: { title: string; items: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 4);

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
          {displayItems.map(item => (
            <label key={item} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded px-1 py-0.5">
              <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggle(item)} className="w-4 h-4" />
              <span className="text-xs">{item}</span>
            </label>
          ))}
          {items.length > 4 && (
            <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary hover:underline mt-1">
              {showAll ? "Show less" : `+ ${items.length - 4} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
