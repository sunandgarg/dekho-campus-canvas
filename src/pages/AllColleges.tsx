import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ListingPageLayout } from "@/components/ListingPageLayout";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { CollegeCard } from "@/components/CollegeCard";
import { colleges, collegeCategories, collegeStates, collegeTypes, collegeApprovals, collegeNaacGrades } from "@/data/colleges";
import { useFeaturedColleges } from "@/hooks/useFeaturedColleges";

export default function AllColleges() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("All");
  const [type, setType] = useState("All");
  const [approval, setApproval] = useState("All");
  const [naacGrade, setNaacGrade] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: featuredSlugs } = useFeaturedColleges(category, state);

  const activeFilters = [category, state, type, approval, naacGrade].filter((f) => f !== "All").length;

  const filtered = useMemo(() => {
    const base = colleges.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || c.category === category;
      const matchState = state === "All" || c.state === state;
      const matchType = type === "All" || c.type === type;
      const matchApproval = approval === "All" || c.approvals.includes(approval);
      const matchNaac = naacGrade === "All" || c.naacGrade === naacGrade;
      return matchSearch && matchCategory && matchState && matchType && matchApproval && matchNaac;
    });

    // Sort: featured colleges first
    if (featuredSlugs && featuredSlugs.length > 0) {
      const featuredSet = new Set(featuredSlugs);
      return [
        ...base.filter((c) => featuredSet.has(c.slug)),
        ...base.filter((c) => !featuredSet.has(c.slug)),
      ];
    }
    return base;
  }, [search, category, state, type, approval, naacGrade, featuredSlugs]);

  const clearAll = () => { setCategory("All"); setState("All"); setType("All"); setApproval("All"); setNaacGrade("All"); };

  return (
    <ListingPageLayout title="All Colleges in India 2026" description="Explore 5,000+ colleges across India — compare fees, placements, rankings & more" page="colleges">
      <PageBreadcrumb items={[{ label: "Colleges" }]} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges by name or city..." className="pl-10 rounded-xl h-11" />
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
            <h3 className="text-sm font-semibold text-foreground">Filter Colleges</h3>
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FilterGroup label="Category" options={collegeCategories} value={category} onChange={setCategory} />
            <FilterGroup label="State" options={collegeStates} value={state} onChange={setState} />
            <FilterGroup label="Type" options={collegeTypes} value={type} onChange={setType} />
            <FilterGroup label="Approval" options={collegeApprovals} value={approval} onChange={setApproval} />
            <FilterGroup label="NAAC Grade" options={collegeNaacGrades} value={naacGrade} onChange={setNaacGrade} />
          </div>
        </motion.div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> colleges
      </p>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((college, i) => (
              <CollegeCard key={college.slug} college={college} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <h3 className="font-semibold text-foreground mb-1">No colleges found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}

          <div className="mt-6"><DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" /></div>
        </div>

        <aside className="space-y-6">
          <LeadCaptureForm variant="sidebar" title="Need Help Choosing?" subtitle="Get free expert counseling for admissions" source="colleges_listing" />
          <DynamicAdBanner variant="vertical" position="sidebar" page="colleges" />
          <LeadCaptureForm variant="card" title="Get Admission Alerts" subtitle="Never miss an important deadline" source="colleges_sidebar_card" />
          <DynamicAdBanner variant="square" position="sidebar" page="colleges" />
        </aside>
      </div>

      <div className="mt-10">
        <LeadCaptureForm variant="banner" title="📞 Can't find the right college? Get free expert guidance!" subtitle="Our counselors have helped 50,000+ students" source="colleges_bottom_banner" />
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
