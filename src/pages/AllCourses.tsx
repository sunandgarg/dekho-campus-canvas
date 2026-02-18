import { useState, useMemo, Fragment, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { CourseCard } from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/SkeletonCards";
import { InlineAdSlot } from "@/components/InlineAdSlot";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { MobileBottomFilter } from "@/components/MobileBottomFilter";
import { useInfiniteData } from "@/hooks/useInfiniteData";
import { getCourseHeading, courseSeoRoutes, filtersToSlug } from "@/lib/seoSlugs";
import {
  courseStreams, courseCourseGroups, courseSpecializations,
  courseModes, courseDurations,
} from "@/data/indianLocations";

const topSearches = ["B.Tech", "MBA", "MBBS", "B.Sc", "BBA", "MCA", "B.Com", "LLB"];

export default function AllCourses() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedCourseGroups, setSelectedCourseGroups] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const dbFilters = useMemo(() => {
    const f: Record<string, string | string[] | undefined> = {};
    if (selectedStreams.length === 1) f.category = selectedStreams[0];
    if (selectedModes.length === 1) f.mode = selectedModes[0];
    return f;
  }, [selectedStreams, selectedModes]);

  const { items: courses, sentinelRef, isLoading, isFetchingMore, hasMore } = useInfiniteData({
    table: "courses",
    queryKey: ["infinite-courses"],
    orderBy: "name",
    ascending: true,
    filters: dbFilters,
    search: search || undefined,
    searchFields: ["name", "full_name"],
  });

  useEffect(() => {
    const slug = filtersToSlug("courses", {
      courseGroup: selectedCourseGroups[0],
      stream: selectedStreams[0],
      mode: selectedModes[0],
    });
    const hasFilters = selectedCourseGroups.length > 0 || selectedStreams.length > 0 || selectedModes.length > 0;
    if (hasFilters) {
      window.history.replaceState(null, "", `/courses/${slug}`);
    } else {
      window.history.replaceState(null, "", "/courses");
    }
  }, [selectedStreams, selectedCourseGroups, selectedModes]);

  const activeFilters = [...selectedStreams, ...selectedCourseGroups, ...selectedSpecializations, ...selectedModes, ...selectedDurations];

  const filtered = useMemo(() => {
    return courses.filter((c: any) => {
      const matchCourseGroup = selectedCourseGroups.length === 0 || selectedCourseGroups.includes(c.name);
      const matchDuration = selectedDurations.length === 0 || selectedDurations.includes(c.duration);
      return matchCourseGroup && matchDuration;
    });
  }, [courses, selectedCourseGroups, selectedDurations]);

  const heading = useMemo(() => getCourseHeading({
    courseGroup: selectedCourseGroups[0],
    stream: selectedStreams[0],
    mode: selectedModes[0],
    duration: selectedDurations[0],
  }), [selectedStreams, selectedCourseGroups, selectedModes, selectedDurations]);

  const clearAll = () => {
    setSelectedStreams([]); setSelectedCourseGroups([]);
    setSelectedSpecializations([]); setSelectedModes([]); setSelectedDurations([]);
  };

  const removeFilter = (f: string) => {
    setSelectedStreams(prev => prev.filter(x => x !== f));
    setSelectedCourseGroups(prev => prev.filter(x => x !== f));
    setSelectedSpecializations(prev => prev.filter(x => x !== f));
    setSelectedModes(prev => prev.filter(x => x !== f));
    setSelectedDurations(prev => prev.filter(x => x !== f));
  };

  const filterConfigs = [
    { title: "Streams", items: courseStreams, selected: selectedStreams, onChange: setSelectedStreams },
    { title: "Course Groups", items: courseCourseGroups, selected: selectedCourseGroups, onChange: setSelectedCourseGroups },
    { title: "Specializations", items: courseSpecializations, selected: selectedSpecializations, onChange: setSelectedSpecializations },
    { title: "Course Modes", items: courseModes, selected: selectedModes, onChange: setSelectedModes },
    { title: "Duration", items: courseDurations, selected: selectedDurations, onChange: setSelectedDurations },
  ];

  const ITEMS_PER_AD = 4;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="courses" />
      <main className="px-3 md:container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Courses" }]} />
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">{heading}</h1>
          <p className="text-sm text-muted-foreground">Explore {filtered.length}+ courses — compare eligibility, fees, career prospects & top colleges</p>
        </header>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses (e.g. B.Tech, MBA, MBBS...)" className="pl-10 rounded-xl h-10" />
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {courseSeoRoutes.slice(0, 6).map(route => {
            const streamParam = (route.params as any).stream;
            const groupParam = (route.params as any).group;
            const modeParam = (route.params as any).mode;
            const filterKey = streamParam || groupParam || modeParam;
            const isActive = (streamParam && selectedStreams.includes(streamParam)) ||
              (groupParam && selectedCourseGroups.includes(groupParam)) ||
              (modeParam && selectedModes.includes(modeParam));
            return (
              <button key={route.label}
                onClick={() => {
                  if (streamParam) {
                    setSelectedStreams(prev => prev.includes(streamParam) ? prev.filter(s => s !== streamParam) : [...prev, streamParam]);
                  } else if (groupParam) {
                    setSelectedCourseGroups(prev => prev.includes(groupParam) ? prev.filter(s => s !== groupParam) : [...prev, groupParam]);
                  } else if (modeParam) {
                    setSelectedModes(prev => prev.includes(modeParam) ? prev.filter(s => s !== modeParam) : [...prev, modeParam]);
                  }
                }}
                className={`px-2.5 py-1 text-[11px] rounded-full font-medium border transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}>
                {route.label}
              </button>
            );
          })}
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
                <span className="text-sm font-bold text-foreground">Filter by</span>
                {activeFilters.length > 0 && <button onClick={clearAll} className="text-xs text-destructive hover:underline">Reset all</button>}
              </div>
              {filterConfigs.map(fc => <FilterSection key={fc.title} {...fc} />)}
              <LeadCaptureForm variant="sidebar" title="Confused About Courses?" subtitle="Get free career counseling" source="courses_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="courses" />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-3">Showing <span className="font-semibold text-foreground">{filtered.length}</span> courses</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
              ) : (
                filtered.map((course: any, i: number) => (
                  <Fragment key={course.slug}>
                    <CourseCard course={course} index={Math.min(i, 5)} />
                    {(i + 1) % ITEMS_PER_AD === 0 && i < filtered.length - 1 && (
                      <InlineAdSlot page="courses" index={Math.floor(i / ITEMS_PER_AD)} source={`courses_inline_${i}`} />
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
              <p className="text-center text-sm text-muted-foreground py-4">You've seen all courses</p>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No courses found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
            <div className="mt-6">
              <LeadCaptureForm variant="banner" title="📚 Not sure which course is right? Talk to an expert!" subtitle="Our counselors analyze your interests, scores & goals" source="courses_bottom_banner" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <MobileBottomFilter activeCount={activeFilters.length} onOpen={() => setFilterOpen(true)} />
      <MobileFilterSheet filters={filterConfigs} activeCount={activeFilters.length} onClearAll={clearAll} open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
}

function FilterSection({ title, items, selected, onChange }: { title: string; items: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const filteredItems = filterSearch ? items.filter(i => i.toLowerCase().includes(filterSearch.toLowerCase())) : items;
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 4);

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
        <div className="mt-2">
          {items.length > 10 && <Input value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="h-8 text-xs mb-2 rounded-lg" />}
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {displayItems.map(item => (
              <label key={item} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded px-1 py-0.5">
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
