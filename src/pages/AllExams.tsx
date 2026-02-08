import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Calendar, Users, FileText, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingPageLayout } from "@/components/ListingPageLayout";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";
import { exams, examCategories, examLevels } from "@/data/exams";

export default function AllExams() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.fullName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || e.category === category;
      const matchLevel = level === "All" || e.level === level;
      return matchSearch && matchCategory && matchLevel;
    });
  }, [search, category, level]);

  return (
    <ListingPageLayout
      title="All Entrance Exams 2026"
      description="Complete guide to 500+ entrance exams — dates, eligibility, syllabus & preparation tips"
    >
      <PageBreadcrumb items={[{ label: "Exams" }]} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams (e.g. JEE, NEET, CAT...)" className="pl-10 rounded-xl h-11" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="rounded-xl gap-2 h-11">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {(category !== "All" || level !== "All") && (
            <Badge className="ml-1 bg-primary text-primary-foreground text-xs px-1.5">
              {[category, level].filter((f) => f !== "All").length}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-2xl border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Filter Exams</h3>
            <button onClick={() => { setCategory("All"); setLevel("All"); }} className="text-xs text-primary hover:underline">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {examCategories.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Level</label>
              <div className="flex flex-wrap gap-1.5">
                {examLevels.map((l) => (
                  <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${level === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> exams
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((exam, i) => (
            <motion.div key={exam.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/exams/${exam.slug}`} className="block">
                <article className="bg-card rounded-2xl border border-border p-4 md:p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex w-16 h-16 rounded-xl gradient-primary items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h2 className="text-base md:text-lg font-bold text-foreground">{exam.name}</h2>
                        <Badge variant="secondary" className="text-xs">{exam.category}</Badge>
                        <Badge variant="outline" className="text-xs">{exam.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{exam.fullName}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-foreground">{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs text-foreground">{exam.applicants} applicants</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-golden" />
                          <span className="text-xs text-foreground">{exam.mode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>

              {(i + 1) % 3 === 0 && i < filtered.length - 1 && (
                <div className="mt-4">
                  <AdBanner variant="horizontal" position={`Ad - Exams ${i + 1}`} />
                </div>
              )}
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">No exams found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <LeadCaptureForm variant="sidebar" title="Need Exam Guidance?" subtitle="Get free preparation strategy from experts" source="exams_listing" />
          <AdBanner variant="vertical" position="Exams Sidebar" />
          <LeadCaptureForm variant="card" title="Exam Date Alerts" subtitle="Get notified about registration deadlines" source="exams_sidebar_card" />
        </aside>
      </div>

      <div className="mt-10">
        <LeadCaptureForm variant="banner" title="📝 Need help preparing? Get expert guidance for free!" subtitle="Our counselors help you plan the perfect exam strategy" source="exams_bottom_banner" />
      </div>
    </ListingPageLayout>
  );
}
