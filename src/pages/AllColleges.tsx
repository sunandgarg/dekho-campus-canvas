import { useState, useMemo, Fragment, useEffect } from "react";
import { Search, MapPin, Star, Building, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { FixedCounsellingCTA } from "@/components/FixedCounsellingCTA";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { CollegeCard } from "@/components/CollegeCard";
import { InlineAdSlot } from "@/components/InlineAdSlot";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { useDbColleges } from "@/hooks/useCollegesData";
import { useDbArticles } from "@/hooks/useArticlesData";
import { useFeaturedColleges } from "@/hooks/useFeaturedColleges";
import {
  indianStates, citiesByState, collegeStreams, collegeTypes,
  collegeFeeRanges, collegeCourseGroups, collegeExams,
} from "@/data/indianLocations";
import { Link, useSearchParams } from "react-router-dom";

const collegeApprovals = ["AICTE", "UGC", "NAAC", "MCI", "BCI", "AACSB"] as const;
const collegeNaacGrades = ["A++", "A+", "A", "B++", "B+"] as const;

export default function AllColleges() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedStreams, setSelectedStreams] = useState<string[]>(() => {
    const s = searchParams.get("stream"); return s ? [s] : [];
  });
  const [selectedState, setSelectedState] = useState(() => searchParams.get("state") || "");
  const [selectedCity, setSelectedCity] = useState(() => searchParams.get("city") || "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedNaac, setSelectedNaac] = useState<string[]>([]);
  const [selectedCourseGroups, setSelectedCourseGroups] = useState<string[]>([]);
  const [selectedFeeRanges, setSelectedFeeRanges] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const { data: dbColleges } = useDbColleges();
  const { data: articles } = useDbArticles();
  const colleges = dbColleges ?? [];

  const category = selectedStreams[0] || "";
  const { data: featuredSlugs } = useFeaturedColleges(category || undefined, selectedState || undefined);

  // Sync filters to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedStreams.length === 1) params.set("stream", selectedStreams[0]);
    if (selectedState) params.set("state", selectedState);
    if (selectedCity) params.set("city", selectedCity);
    setSearchParams(params, { replace: true });
  }, [selectedStreams, selectedState, selectedCity, setSearchParams]);

  const activeFilters = [
    ...selectedStreams, ...selectedTypes, ...selectedApprovals,
    ...selectedNaac, ...selectedCourseGroups, ...selectedFeeRanges,
    ...selectedExams,
    ...(selectedState ? [selectedState] : []),
    ...(selectedCity ? [selectedCity] : []),
  ];

  const cities = selectedState ? (citiesByState[selectedState] || []) : [];

  const filtered = useMemo(() => {
    const base = colleges.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
      const matchStream = selectedStreams.length === 0 || selectedStreams.includes(c.category);
      const matchState = !selectedState || c.state === selectedState;
      const matchCity = !selectedCity || c.city === selectedCity;
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(c.type);
      const matchApproval = selectedApprovals.length === 0 || selectedApprovals.some(a => c.approvals.includes(a));
      const matchNaac = selectedNaac.length === 0 || selectedNaac.includes(c.naac_grade);
      return matchSearch && matchStream && matchState && matchCity && matchType && matchApproval && matchNaac;
    });

    if (featuredSlugs && featuredSlugs.length > 0) {
      const featuredSet = new Set(featuredSlugs);
      return [
        ...base.filter((c) => featuredSet.has(c.slug)),
        ...base.filter((c) => !featuredSet.has(c.slug)),
      ];
    }
    return base;
  }, [search, selectedStreams, selectedState, selectedCity, selectedTypes, selectedApprovals, selectedNaac, featuredSlugs, colleges]);

  const heading = useMemo(() => {
    const parts: string[] = [];
    if (selectedStreams.length === 1) parts.push(selectedStreams[0]);
    parts.push("Colleges");
    if (selectedCity) parts.push(`in ${selectedCity}`);
    else if (selectedState) parts.push(`in ${selectedState}`);
    else parts.push("in India");
    parts.push("2026");
    return `Top ${parts.join(" ")}`;
  }, [selectedStreams, selectedState, selectedCity]);

  const description = useMemo(() => {
    const count = filtered.length;
    const location = selectedCity || selectedState || "India";
    const stream = selectedStreams.length === 1 ? selectedStreams[0] : "";
    return `There are total ${count} ${stream} colleges in ${location}. Explore fees, placements, rankings & more.`;
  }, [filtered.length, selectedStreams, selectedState, selectedCity]);

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

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [];
    if (selectedStreams.length === 1) {
      items.push({ label: `${selectedStreams[0]} Colleges India`, href: "/colleges" });
    }
    if (selectedState) {
      items.push({ label: `Colleges in ${selectedState}` });
    } else {
      items.push({ label: "Colleges" });
    }
    return items;
  }, [selectedStreams, selectedState]);

  const ITEMS_PER_AD = 4;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="colleges" />

      <main className="px-3 md:container py-4 md:py-6">
        <PageBreadcrumb items={breadcrumbItems} />

        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">{heading}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>Written By <span className="text-primary font-medium">DekhoCampus Team</span></span>
            <span>•</span>
            <span>Updated on {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </header>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges by name or city..." className="pl-10 rounded-xl h-10" />
          </div>
          <MobileFilterSheet filters={filterConfigs} activeCount={activeFilters.length} onClearAll={clearAll} />
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {activeFilters.map(f => (
              <Badge key={f} variant="secondary" className="gap-1 pr-1 text-xs">
                {f}
                <button onClick={() => removeFilter(f)} className="ml-1 hover:bg-muted rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">Filter By</span>
                {activeFilters.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-destructive hover:underline">Reset All</button>
                )}
              </div>
              {filterConfigs.map((fc) => (
                <FilterSection key={fc.title} {...fc} />
              ))}
              <LeadCaptureForm variant="sidebar" title="Need Help Choosing?" subtitle="Get free expert counseling" source="colleges_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="colleges" />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> colleges
              </p>
            </div>

            {/* Card grid view */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((college, i) => (
                <Fragment key={college.slug}>
                  <CollegeCard college={college} index={i} />
                  {(i + 1) % ITEMS_PER_AD === 0 && i < filtered.length - 1 && (
                    <InlineAdSlot page="colleges" index={Math.floor(i / ITEMS_PER_AD)} source={`colleges_inline_${i}`} />
                  )}
                </Fragment>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No colleges found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}

            <div className="mt-6">
              <DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" />
            </div>

            <div className="mt-6">
              <LeadCaptureForm variant="banner" title="📞 Can't find the right college? Get free expert guidance!" subtitle="Our counselors have helped 50,000+ students" source="colleges_bottom_banner" />
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

function FilterSection({ title, items, selected, onChange, singleSelect }: {
  title: string; items: string[]; selected: string[]; onChange: (v: string[]) => void; singleSelect?: boolean
}) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  
  const filteredItems = filterSearch
    ? items.filter(i => i.toLowerCase().includes(filterSearch.toLowerCase()))
    : items;
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 4);

  const toggle = (item: string) => {
    if (singleSelect) {
      onChange(selected.includes(item) ? [] : [item]);
    } else {
      onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]);
    }
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
            <Input
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="h-8 text-xs mb-2 rounded-lg"
            />
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
