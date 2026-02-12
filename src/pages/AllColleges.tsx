import { useState, useMemo } from "react";
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
import { useDbColleges } from "@/hooks/useCollegesData";
import { useDbArticles } from "@/hooks/useArticlesData";
import { useFeaturedColleges } from "@/hooks/useFeaturedColleges";
import { indianStates, citiesByState } from "@/data/indianLocations";
import { Link } from "react-router-dom";

const collegeCategories = ["Engineering", "Medical", "Management", "Law", "Design", "Science", "Commerce"] as const;
const collegeTypes = ["Government", "Private", "Deemed", "Autonomous"] as const;
const collegeApprovals = ["AICTE", "UGC", "NAAC", "MCI", "BCI", "AACSB"] as const;
const collegeNaacGrades = ["A++", "A+", "A", "B++", "B+"] as const;

export default function AllColleges() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedNaac, setSelectedNaac] = useState<string[]>([]);
  const { data: dbColleges } = useDbColleges();
  const { data: articles } = useDbArticles();
  const colleges = dbColleges ?? [];

  const category = selectedCategories[0] || "";
  const { data: featuredSlugs } = useFeaturedColleges(category || undefined, selectedState || undefined);

  const activeFilters = [...selectedCategories, ...selectedTypes, ...selectedApprovals, ...selectedNaac, ...(selectedState ? [selectedState] : []), ...(selectedCity ? [selectedCity] : [])];

  const cities = selectedState ? (citiesByState[selectedState] || []) : [];

  const filtered = useMemo(() => {
    const base = colleges.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(c.category);
      const matchState = !selectedState || c.state === selectedState;
      const matchCity = !selectedCity || c.city === selectedCity;
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(c.type);
      const matchApproval = selectedApprovals.length === 0 || selectedApprovals.some(a => c.approvals.includes(a));
      const matchNaac = selectedNaac.length === 0 || selectedNaac.includes(c.naac_grade);
      return matchSearch && matchCategory && matchState && matchCity && matchType && matchApproval && matchNaac;
    });

    if (featuredSlugs && featuredSlugs.length > 0) {
      const featuredSet = new Set(featuredSlugs);
      return [
        ...base.filter((c) => featuredSet.has(c.slug)),
        ...base.filter((c) => !featuredSet.has(c.slug)),
      ];
    }
    return base;
  }, [search, selectedCategories, selectedState, selectedCity, selectedTypes, selectedApprovals, selectedNaac, featuredSlugs, colleges]);

  // Dynamic heading
  const heading = useMemo(() => {
    const parts: string[] = [];
    if (selectedCategories.length === 1) parts.push(selectedCategories[0]);
    parts.push("Colleges");
    if (selectedCity) parts.push(`in ${selectedCity}`);
    else if (selectedState) parts.push(`in ${selectedState}`);
    else parts.push("in India");
    parts.push("2026");
    return `Top ${parts.join(" ")}`;
  }, [selectedCategories, selectedState, selectedCity]);

  const description = useMemo(() => {
    const count = filtered.length;
    const location = selectedCity || selectedState || "India";
    const stream = selectedCategories.length === 1 ? selectedCategories[0] : "";
    return `There are total ${count} ${stream} colleges in ${location}. Explore fees, placements, rankings & more.`;
  }, [filtered.length, selectedCategories, selectedState, selectedCity]);

  // Related articles
  const relatedArticles = useMemo(() => {
    if (!articles) return [];
    const cat = selectedCategories[0]?.toLowerCase() || "";
    return articles.filter(a => 
      a.vertical === "colleges" || 
      (cat && a.category.toLowerCase().includes(cat))
    ).slice(0, 3);
  }, [articles, selectedCategories]);

  const clearAll = () => { 
    setSelectedCategories([]); setSelectedState(""); setSelectedCity(""); 
    setSelectedTypes([]); setSelectedApprovals([]); setSelectedNaac([]); 
  };

  const removeFilter = (f: string) => {
    setSelectedCategories(prev => prev.filter(x => x !== f));
    setSelectedTypes(prev => prev.filter(x => x !== f));
    setSelectedApprovals(prev => prev.filter(x => x !== f));
    setSelectedNaac(prev => prev.filter(x => x !== f));
    if (f === selectedState) { setSelectedState(""); setSelectedCity(""); }
    if (f === selectedCity) setSelectedCity("");
  };

  // Breadcrumb
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [];
    if (selectedCategories.length === 1) {
      items.push({ label: `${selectedCategories[0]} Colleges India`, href: "/colleges" });
    }
    if (selectedState) {
      items.push({ label: `Colleges in ${selectedState}` });
    } else {
      items.push({ label: "Colleges" });
    }
    return items;
  }, [selectedCategories, selectedState]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="colleges" />
      
      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={breadcrumbItems} />

        {/* Dynamic Title & Description */}
        <header className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">{heading}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>Written By <span className="text-primary font-medium">DekhoCampus Team</span></span>
            <span>•</span>
            <span>Updated on {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </header>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges by name or city..." className="pl-10 rounded-xl h-11" />
        </div>

        {/* Active filter pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <Badge key={f} variant="secondary" className="gap-1 pr-1">
                {f}
                <button onClick={() => removeFilter(f)} className="ml-1 hover:bg-muted rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
            <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Left Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <FilterSection title="Stream" items={collegeCategories as unknown as string[]} selected={selectedCategories} onChange={setSelectedCategories} />
              <FilterSection title="State" items={indianStates} selected={selectedState ? [selectedState] : []} onChange={(v) => { setSelectedState(v[v.length - 1] || ""); setSelectedCity(""); }} singleSelect />
              {cities.length > 0 && (
                <FilterSection title="City" items={cities} selected={selectedCity ? [selectedCity] : []} onChange={(v) => setSelectedCity(v[v.length - 1] || "")} singleSelect />
              )}
              <FilterSection title="College Type" items={collegeTypes as unknown as string[]} selected={selectedTypes} onChange={setSelectedTypes} />
              <FilterSection title="Approved By" items={collegeApprovals as unknown as string[]} selected={selectedApprovals} onChange={setSelectedApprovals} />
              <FilterSection title="NAAC Grade" items={collegeNaacGrades as unknown as string[]} selected={selectedNaac} onChange={setSelectedNaac} />
              
              <LeadCaptureForm variant="sidebar" title="Need Help Choosing?" subtitle="Get free expert counseling" source="colleges_sidebar" />
              <DynamicAdBanner variant="vertical" position="sidebar" page="colleges" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> colleges
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs cursor-pointer">All Colleges</Badge>
                <Badge variant="outline" className="text-xs cursor-pointer text-primary border-primary">Direct Admission</Badge>
              </div>
            </div>

            {/* College List */}
            <div className="space-y-4">
              {filtered.slice(0, 6).map((college, i) => (
                <CollegeListCard key={college.slug} college={college} index={i} />
              ))}

              {filtered.length > 6 && (
                <DynamicAdBanner variant="leaderboard" position="inline" page="colleges" />
              )}

              {filtered.slice(6, 12).map((college, i) => (
                <CollegeListCard key={college.slug} college={college} index={i + 6} />
              ))}

              {filtered.length > 12 && (
                <LeadCaptureForm variant="inline" title="Get Free College Guidance" source="colleges_inline" />
              )}

              {filtered.slice(12).map((college, i) => (
                <CollegeListCard key={college.slug} college={college} index={i + 12} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">No colleges found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground mb-4">Latest News & Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedArticles.map(article => (
                    <Link key={article.slug} to={`/articles/${article.slug}`} className="block bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                      <img src={article.featured_image} alt={article.title} className="w-full h-32 object-cover" loading="lazy" />
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{article.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(article.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" />
            </div>

            <div className="mt-8">
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

// CollegeDekho-style horizontal college card
function CollegeListCard({ college, index }: { college: any; index: number }) {
  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-52 shrink-0">
          <img src={college.image} alt={college.name} className="w-full h-40 sm:h-full object-cover" loading="lazy" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to={`/colleges/${college.slug}`}>
                <h2 className="text-base font-bold text-foreground hover:text-primary transition-colors">{college.name}</h2>
              </Link>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{college.city}, {college.state}</span>
                <span className="flex items-center gap-1"><Building className="w-3 h-3" />{college.type}</span>
                {college.approvals.slice(0, 2).map((a: string) => (
                  <Badge key={a} variant="outline" className="text-[10px] px-1.5 py-0">{a}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">{college.rating}</div>
              <Star className="w-3.5 h-3.5 text-golden fill-golden" />
              <span className="text-xs text-muted-foreground">({college.reviews})</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <p className="text-xs text-muted-foreground">Fees</p>
              <p className="text-sm font-semibold text-foreground">{college.fees}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ranking</p>
              <p className="text-sm font-semibold text-foreground">{college.ranking || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Placement</p>
              <p className="text-sm font-semibold text-success">{college.placement}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Courses</p>
              <p className="text-sm font-semibold text-foreground">{college.courses_count}+</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <Link to={`/colleges/${college.slug}`}>
              <Button variant="outline" size="sm" className="rounded-lg text-xs h-8">View Details</Button>
            </Link>
            <Button size="sm" className="rounded-lg text-xs h-8 bg-accent text-accent-foreground">Apply Now</Button>
            <Button variant="ghost" size="sm" className="rounded-lg text-xs h-8 text-primary">Download Brochure</Button>
          </div>
        </div>
      </div>
    </article>
  );
}

// Filter sidebar section with checkboxes
function FilterSection({ title, items, selected, onChange, singleSelect }: { 
  title: string; items: string[]; selected: string[]; onChange: (v: string[]) => void; singleSelect?: boolean 
}) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 6);

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
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {displayItems.map(item => (
            <label key={item} className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:bg-muted rounded px-1 py-0.5">
              <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggle(item)} className="w-4 h-4" />
              <span className="text-xs">{item}</span>
            </label>
          ))}
          {items.length > 6 && (
            <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary hover:underline mt-1">
              {showAll ? "Show less" : `+ ${items.length - 6} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
