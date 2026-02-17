import { useState, useMemo, Fragment, useEffect } from "react";
import { Search, X } from "lucide-react";
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
import { CollegeCard } from "@/components/CollegeCard";
import { CollegeCardSkeleton } from "@/components/SkeletonCards";
import { InlineAdSlot } from "@/components/InlineAdSlot";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { MobileBottomFilter } from "@/components/MobileBottomFilter";
import { useInfiniteData } from "@/hooks/useInfiniteData";
import { useFeaturedColleges } from "@/hooks/useFeaturedColleges";
import { getCollegeHeading, collegeSeoRoutes, filtersToSlug } from "@/lib/seoSlugs";
import {
  indianStates, citiesByState, collegeStreams, collegeTypes,
  collegeFeeRanges, collegeCourseGroups, collegeExams,
} from "@/data/indianLocations";
import { Link } from "react-router-dom";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

const collegeApprovals = ["AICTE", "UGC", "NAAC", "MCI", "BCI", "AACSB"] as const;
const collegeNaacGrades = ["A++", "A+", "A", "B++", "B+"] as const;

/**
 * AllColleges — College listing page with:
 * - SEO-optimized dynamic headings based on active filters
 * - Infinite scroll with cursor-based pagination (12 items per batch)
 * - Sidebar filters with search, checkboxes, and mobile sheet
 * - Inline ads every 4 cards
 * - Featured college priority ordering
 */
export default function AllColleges() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedNaac, setSelectedNaac] = useState<string[]>([]);
  const [selectedCourseGroups, setSelectedCourseGroups] = useState<string[]>([]);
  const [selectedFeeRanges, setSelectedFeeRanges] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  // Build filters for DB query
  const dbFilters = useMemo(() => {
    const f: Record<string, string | string[] | undefined> = {};
    if (selectedStreams.length > 0) f.category = selectedStreams.length === 1 ? selectedStreams[0] : undefined;
    if (selectedState) f.state = selectedState;
    if (selectedCity) f.city = selectedCity;
    if (selectedTypes.length > 0) f.type = selectedTypes.length === 1 ? selectedTypes[0] : undefined;
    return f;
  }, [selectedStreams, selectedState, selectedCity, selectedTypes]);

  const { items: colleges, sentinelRef, isLoading, isFetchingMore, hasMore } = useInfiniteData({
    table: "colleges",
    queryKey: ["infinite-colleges"],
    orderBy: "rating",
    ascending: false,
    filters: dbFilters,
    search: search || undefined,
    searchFields: ["name", "city"],
  });

  const category = selectedStreams[0] || "";
  const { data: featuredSlugs } = useFeaturedColleges(category || undefined, selectedState || undefined);

  // Update URL with SEO-friendly slug
  useEffect(() => {
    const slug = filtersToSlug("colleges", {
      courseGroup: selectedCourseGroups[0],
      stream: selectedStreams[0],
      state: selectedState,
      city: selectedCity,
      exam: selectedExams[0],
      type: selectedTypes[0],
      approval: selectedApprovals[0],
    });
    const hasFilters = selectedCourseGroups.length > 0 || selectedStreams.length > 0 ||
      selectedState || selectedCity || selectedExams.length > 0 ||
      selectedTypes.length > 0 || selectedApprovals.length > 0;
    if (hasFilters) {
      window.history.replaceState(null, "", `/colleges/${slug}`);
    } else {
      window.history.replaceState(null, "", "/colleges");
    }
  }, [selectedStreams, selectedCourseGroups, selectedState, selectedCity, selectedExams, selectedTypes, selectedApprovals]);

  const activeFilters = [
    ...selectedStreams, ...selectedTypes, ...selectedApprovals,
    ...selectedNaac, ...selectedCourseGroups, ...selectedFeeRanges,
    ...selectedExams,
    ...(selectedState ? [selectedState] : []),
    ...(selectedCity ? [selectedCity] : []),
  ];

  const cities = selectedState ? (citiesByState[selectedState] || []) : [];

  // Client-side secondary filtering (for filters not in DB query)
  const filtered = useMemo(() => {
    let base = colleges.filter((c: any) => {
      const matchApproval = selectedApprovals.length === 0 || selectedApprovals.some(a => c.approvals?.includes(a));
      const matchNaac = selectedNaac.length === 0 || selectedNaac.includes(c.naac_grade);
      return matchApproval && matchNaac;
    });

    if (featuredSlugs && featuredSlugs.length > 0) {
      const featuredSet = new Set(featuredSlugs);
      return [...base.filter((c: any) => featuredSet.has(c.slug)), ...base.filter((c: any) => !featuredSet.has(c.slug))];
    }
    return base;
  }, [colleges, selectedApprovals, selectedNaac, featuredSlugs]);

  // SEO-optimized heading
  const heading = useMemo(() => getCollegeHeading({
    courseGroup: selectedCourseGroups[0],
    stream: selectedStreams[0],
    state: selectedState,
    city: selectedCity,
    type: selectedTypes[0],
    exam: selectedExams[0],
    approval: selectedApprovals[0],
  }), [selectedStreams, selectedCourseGroups, selectedState, selectedCity, selectedTypes, selectedExams, selectedApprovals]);

  const clearAll = () => {
    setSelectedStreams([]); setSelectedState(""); setSelectedCity("");
    setSelectedTypes([]); setSelectedApprovals([]); setSelectedNaac([]);
    setSelectedCourseGroups([]); setSelectedFeeRanges([]); setSelectedExams([]);
  };

  const removeFilter = (f: string) => {
    setSelectedStreams(prev => prev.filter(x => x !== f));
    setSelectedTypes(prev => prev.filter(x => x !== f));
    setSelectedApprovals(prev => prev.filter(x => x !== f));
    setSelectedNaac(prev => prev.filter(x => x !== f));
    setSelectedCourseGroups(prev => prev.filter(x => x !== f));
    setSelectedFeeRanges(prev => prev.filter(x => x !== f));
    setSelectedExams(prev => prev.filter(x => x !== f));
    if (f === selectedState) { setSelectedState(""); setSelectedCity(""); }
    if (f === selectedCity) setSelectedCity("");
  };

  const filterConfigs = [
    { title: "Streams", items: collegeStreams, selected: selectedStreams, onChange: setSelectedStreams },
    { title: "Course Groups", items: collegeCourseGroups, selected: selectedCourseGroups, onChange: setSelectedCourseGroups },
    { title: "States", items: indianStates, selected: selectedState ? [selectedState] : [], onChange: (v: string[]) => { setSelectedState(v[v.length - 1] || ""); setSelectedCity(""); }, singleSelect: true },
    ...(cities.length > 0 ? [{ title: "Cities", items: cities, selected: selectedCity ? [selectedCity] : [], onChange: (v: string[]) => setSelectedCity(v[v.length - 1] || ""), singleSelect: true }] : []),
    { title: "Exams", items: collegeExams, selected: selectedExams, onChange: setSelectedExams },
    { title: "Institute Type", items: collegeTypes, selected: selectedTypes, onChange: setSelectedTypes },
    { title: "Total Fees", items: collegeFeeRanges, selected: selectedFeeRanges, onChange: setSelectedFeeRanges },
    { title: "Approved By", items: collegeApprovals as unknown as string[], selected: selectedApprovals, onChange: setSelectedApprovals },
    { title: "NAAC Grade", items: collegeNaacGrades as unknown as string[], selected: selectedNaac, onChange: setSelectedNaac },
  ];

  const ITEMS_PER_AD = 4;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="colleges" />

      <main className="px-3 md:container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Colleges" }]} />
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">{heading}</h1>
          <p className="text-sm text-muted-foreground">Showing {filtered.length}+ top colleges — compare fees, placements, rankings & more</p>
        </header>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges by name or city..." className="pl-10 rounded-xl h-10" />
          </div>
        </div>

        {/* SEO Quick Links */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {collegeSeoRoutes.slice(0, 8).map(route => {
            const slug = filtersToSlug("colleges", route.params as Record<string, string>);
            return (
              <Link
                key={route.label}
                to={`/colleges/${slug}`}
                className="px-2.5 py-1 text-[11px] bg-card border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {route.label}
              </Link>
            );
          })}
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
                {activeFilters.length > 0 && <button onClick={clearAll} className="text-xs text-destructive hover:underline">Reset All</button>}
              </div>
              {filterConfigs.map(fc => <FilterSection key={fc.title} {...fc} />)}
              <LeadCaptureForm variant="sidebar" title="Need Help Choosing?" subtitle="Get free expert counseling" source="colleges_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="colleges" />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-3">Showing <span className="font-semibold text-foreground">{filtered.length}</span> colleges</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)
              ) : (
                filtered.map((college: any, i: number) => (
                  <Fragment key={college.slug}>
                    <CollegeCard college={college} index={Math.min(i, 5)} />
                    {(i + 1) % ITEMS_PER_AD === 0 && i < filtered.length - 1 && (
                      <InlineAdSlot page="colleges" index={Math.floor(i / ITEMS_PER_AD)} source={`colleges_inline_${i}`} />
                    )}
                  </Fragment>
                ))
              )}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />
            {isFetchingMore && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            {!hasMore && filtered.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">You've seen all colleges</p>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No colleges found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}
            <div className="mt-6">
              <LeadCaptureForm variant="banner" title="📞 Can't find the right college? Get free expert guidance!" subtitle="Our counselors have helped 50,000+ students" source="colleges_bottom_banner" />
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

function FilterSection({ title, items, selected, onChange, singleSelect }: {
  title: string; items: string[]; selected: string[]; onChange: (v: string[]) => void; singleSelect?: boolean
}) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const filteredItems = filterSearch ? items.filter(i => i.toLowerCase().includes(filterSearch.toLowerCase())) : items;
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 4);

  const toggle = (item: string) => {
    if (singleSelect) onChange(selected.includes(item) ? [] : [item]);
    else onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground">
        {title}
        {selected.length > 0 && <Badge variant="secondary" className="text-[10px] ml-2 px-1.5">{selected.length}</Badge>}
        <span className="ml-auto">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
      </button>
      {expanded && (
        <div className="mt-2">
          {items.length > 10 && (
            <Input value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="h-8 text-xs mb-2 rounded-lg" />
          )}
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {displayItems.map(item => (
              <label key={item} className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:bg-muted rounded px-1 py-0.5">
                <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggle(item)} className="w-4 h-4" />
                <span className="text-xs">{item}</span>
              </label>
            ))}
          </div>
          {filteredItems.length > 4 && !filterSearch && (
            <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary hover:underline mt-1">
              {showAll ? "Show less" : `+ ${filteredItems.length - 4} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
