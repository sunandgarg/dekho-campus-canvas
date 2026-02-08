import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, GraduationCap, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingPageLayout } from "@/components/ListingPageLayout";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";
import { colleges, collegeCategories, collegeStates, collegeTypes } from "@/data/colleges";

export default function AllColleges() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("All");
  const [type, setType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return colleges.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || c.category === category;
      const matchState = state === "All" || c.state === state;
      const matchType = type === "All" || c.type === type;
      return matchSearch && matchCategory && matchState && matchType;
    });
  }, [search, category, state, type]);

  return (
    <ListingPageLayout
      title="All Colleges in India 2026"
      description="Explore 5,000+ colleges across India — compare fees, placements, rankings & more"
    >
      <PageBreadcrumb items={[{ label: "Colleges" }]} />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colleges by name or city..."
            className="pl-10 rounded-xl h-11"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-xl gap-2 h-11"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {(category !== "All" || state !== "All" || type !== "All") && (
            <Badge className="ml-1 bg-primary text-primary-foreground text-xs px-1.5">
              {[category, state, type].filter((f) => f !== "All").length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card rounded-2xl border border-border p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Filter Colleges</h3>
            <button onClick={() => { setCategory("All"); setState("All"); setType("All"); }} className="text-xs text-primary hover:underline">
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {collegeCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">State</label>
              <div className="flex flex-wrap gap-1.5">
                {collegeStates.map((s) => (
                  <button
                    key={s}
                    onClick={() => setState(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${state === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {collegeTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> colleges
      </p>

      {/* College Cards + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((college, i) => (
            <motion.div
              key={college.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/colleges/${college.slug}`} className="block">
                <article className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row">
                  <div className="sm:w-48 md:w-56 flex-shrink-0">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-40 sm:h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 p-4 md:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-foreground">{college.name}</h2>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {college.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-lg flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-bold">{college.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {college.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Fees</p>
                        <p className="text-sm font-semibold text-foreground">{college.fees}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Placement</p>
                        <p className="text-sm font-semibold text-foreground">{college.placement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Courses</p>
                        <p className="text-sm font-semibold text-foreground">{college.courses}+</p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Insert ad after every 4th card */}
              {(i + 1) % 4 === 0 && i < filtered.length - 1 && (
                <div className="mt-4">
                  <AdBanner variant="horizontal" position={`Ad - Colleges ${i + 1}`} />
                </div>
              )}
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">No colleges found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <LeadCaptureForm
            variant="sidebar"
            title="Need Help Choosing?"
            subtitle="Get free expert counseling for college admissions"
            source="colleges_listing"
          />
          <AdBanner variant="vertical" position="Colleges Sidebar" />
          <LeadCaptureForm
            variant="card"
            title="Get Admission Alerts"
            subtitle="Never miss an important admission deadline"
            source="colleges_sidebar_card"
          />
        </aside>
      </div>

      {/* Bottom CTA */}
      <div className="mt-10">
        <LeadCaptureForm
          variant="banner"
          title="📞 Can't find the right college? Get free expert guidance!"
          subtitle="Our counselors have helped 50,000+ students get into their dream college"
          source="colleges_bottom_banner"
        />
      </div>
    </ListingPageLayout>
  );
}
