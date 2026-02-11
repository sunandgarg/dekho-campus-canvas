import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, GraduationCap, TrendingUp, Building, CheckCircle, Briefcase, BookOpen, Image as ImageIcon, Users, Award, Scale, Newspaper, HelpCircle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { ScrollSpy, type ScrollSection } from "@/components/ScrollSpy";
import { FAQSection } from "@/components/FAQSection";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { useDbCollege, useCollegesByState, useCollegesByCategory } from "@/hooks/useCollegesData";
import { useDbCourses } from "@/hooks/useCoursesData";

const COLLEGE_SECTIONS: ScrollSection[] = [
  { id: "overview", label: "College Info" },
  { id: "courses", label: "Courses" },
  { id: "fees", label: "Fees" },
  { id: "reviews", label: "Reviews" },
  { id: "admissions", label: "Admissions" },
  { id: "placements", label: "Placements" },
  { id: "cutoff", label: "Cut-Offs" },
  { id: "rankings", label: "Rankings" },
  { id: "gallery", label: "Gallery" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "faculty", label: "Faculty" },
  { id: "compare", label: "Compare" },
  { id: "faq", label: "Q&A" },
  { id: "scholarships", label: "Scholarships" },
  { id: "news", label: "News" },
];

export default function CollegeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: college, isLoading } = useDbCollege(slug);
  const { data: sameStateColleges } = useCollegesByState(college?.state, slug);
  const { data: similarColleges } = useCollegesByCategory(college?.category, slug);
  const { data: allCourses } = useDbCourses();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">College Not Found</h1>
          <p className="text-muted-foreground mb-6">The college you're looking for doesn't exist.</p>
          <Link to="/colleges"><Button className="gradient-primary text-primary-foreground rounded-xl">Browse All Colleges</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const popularCourses = (allCourses ?? [])
    .filter((c) => c.category === college.category || c.category === "Engineering")
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="colleges" itemSlug={slug} />

      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Colleges", href: "/colleges" }, { label: college.name }]} />

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-0">
          <img src={college.image} alt={college.name} className="w-full h-48 md:h-64 object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {college.tags.map((tag) => (
                <Badge key={tag} className="bg-primary/90 text-primary-foreground text-xs">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-background mb-1">{college.name}</h1>
            <p className="flex items-center gap-1 text-background/80 text-sm">
              <MapPin className="w-4 h-4" />
              {college.location}
            </p>
          </div>
        </motion.div>

        <ScrollSpy sections={COLLEGE_SECTIONS} className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-none md:rounded-xl" />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Star, label: "Rating", value: `${college.rating}/5`, color: "text-golden" },
                { icon: GraduationCap, label: "Courses", value: `${college.courses_count}+`, color: "text-primary" },
                { icon: TrendingUp, label: "Placement", value: college.placement, color: "text-success" },
                { icon: Calendar, label: "Estd.", value: String(college.established), color: "text-accent" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-3 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* College Info / Overview */}
            <section id="overview" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">About {college.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{college.description}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Type", value: college.type },
                  { label: "Category", value: college.category },
                  { label: "Fees", value: college.fees },
                  { label: "Ranking", value: college.ranking },
                  { label: "Reviews", value: `${college.reviews} reviews` },
                  { label: "State", value: college.state },
                  { label: "NAAC Grade", value: college.naac_grade },
                  { label: "Approvals", value: college.approvals.join(", ") },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <span className="text-sm font-medium text-foreground">{info.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Courses */}
            <section id="courses" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Popular Courses at {college.short_name || college.name}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {popularCourses.map((c) => (
                  <Link key={c.slug} to={`/courses/${c.slug}`} className="flex items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors">
                    <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.duration} • {c.avg_fees}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Fees */}
            <section id="fees" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Fee Structure</h2>
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-8 h-8 text-golden" />
                <div>
                  <p className="text-xl font-bold text-foreground">{college.fees}</p>
                  <p className="text-xs text-muted-foreground">Average annual fees (varies by course and category)</p>
                </div>
              </div>
              {college.course_fee_content && (
                <p className="text-sm text-muted-foreground leading-relaxed">{college.course_fee_content}</p>
              )}
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" itemSlug={slug} />
            <LeadCaptureForm variant="inline" title="📞 Get admission guidance for this college" source={`college_inline_${college.slug}`} interestedCollegeSlug={college.slug} />

            {/* Reviews */}
            <section id="reviews" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Reviews & Ratings</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{college.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(college.rating) ? "text-golden fill-golden" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{college.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[
                    { label: "Academics", pct: 85 },
                    { label: "Infrastructure", pct: 78 },
                    { label: "Placements", pct: 90 },
                    { label: "Campus Life", pct: 82 },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24">{r.label}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-primary rounded-full h-2" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground w-8">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Admissions */}
            <section id="admissions" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Admission Process</h2>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Check eligibility criteria and required entrance exam scores" },
                  { step: "2", text: "Register on the official website and fill the application form" },
                  { step: "3", text: "Pay application fees and upload required documents" },
                  { step: "4", text: "Attend counseling / interview rounds as applicable" },
                  { step: "5", text: "Receive offer letter and complete admission formalities" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{s.step}</span>
                    <p className="text-sm text-foreground pt-1">{s.text}</p>
                  </div>
                ))}
              </div>
              {college.eligibility_criteria && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Eligibility Criteria</h3>
                  <p className="text-sm text-muted-foreground">{college.eligibility_criteria}</p>
                </div>
              )}
            </section>

            {/* Placements */}
            <section id="placements" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Placements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{college.placement}</p>
                  <p className="text-xs text-muted-foreground">Average Package</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">95%+</p>
                  <p className="text-xs text-muted-foreground">Placement Rate</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{college.top_recruiters.length > 0 ? `${college.top_recruiters.length}+` : "200+"}</p>
                  <p className="text-xs text-muted-foreground">Recruiters</p>
                </div>
              </div>
              {college.placement_content && <p className="text-sm text-muted-foreground">{college.placement_content}</p>}
              {/* Top Recruiters inline */}
              <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">Top Recruiters</h3>
              <div className="flex flex-wrap gap-2">
                {(college.top_recruiters.length > 0 ? college.top_recruiters : ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro"]).map((r) => (
                  <div key={r} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{r}</span>
                  </div>
                ))}
              </div>
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" itemSlug={slug} />

            {/* Cut-Offs */}
            <section id="cutoff" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Cut-Off Scores</h2>
              {college.cutoff ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{college.cutoff}</p>
              ) : (
                <div className="space-y-2">
                  {[
                    { exam: "JEE Main", cutoff: "Top 5,000 ranks (General)" },
                    { exam: "CAT", cutoff: "95+ percentile" },
                    { exam: "NEET", cutoff: "600+ marks" },
                  ].map((c) => (
                    <div key={c.exam} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-medium text-foreground">{c.exam}</span>
                      <span className="text-sm text-muted-foreground">{c.cutoff}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Rankings */}
            <section id="rankings" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Rankings</h2>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-golden" />
                <div>
                  <p className="text-xl font-bold text-foreground">{college.ranking}</p>
                  <p className="text-xs text-muted-foreground">Overall Ranking</p>
                </div>
              </div>
              {college.rankings_content && <p className="text-sm text-muted-foreground">{college.rankings_content}</p>}
            </section>

            {/* Gallery */}
            <section id="gallery" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Gallery</h2>
              {college.gallery_images && college.gallery_images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {college.gallery_images.map((img, i) => (
                    <img key={i} src={img} alt={`${college.name} gallery ${i + 1}`} className="rounded-xl h-32 w-full object-cover" loading="lazy" />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-5 h-5" />
                  <p className="text-sm">Gallery images coming soon.</p>
                </div>
              )}
            </section>

            <LeadCaptureForm variant="inline" title="Need help with admission?" source={`college_mid_${college.slug}`} interestedCollegeSlug={college.slug} />

            {/* Infrastructure / Facilities */}
            <section id="infrastructure" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Infrastructure & Facilities</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {college.facilities.map((f) => (
                  <Badge key={f} variant="secondary" className="text-sm py-1.5 px-3">{f}</Badge>
                ))}
              </div>
              {college.facilities_content && <p className="text-sm text-muted-foreground">{college.facilities_content}</p>}
              {college.hostel_life && (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Hostel Life</h3>
                  <p className="text-sm text-muted-foreground">{college.hostel_life}</p>
                </div>
              )}
            </section>

            {/* Faculty */}
            <section id="faculty" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Faculty</h2>
              <div className="space-y-2">
                {[
                  { label: "Total Faculty", value: "500+" },
                  { label: "PhD Holders", value: "85%" },
                  { label: "Student-Faculty Ratio", value: "15:1" },
                  { label: "Visiting Professors", value: "50+" },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{f.label}</span>
                    <span className="text-sm font-medium text-foreground">{f.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <DynamicAdBanner variant="horizontal" position="bottom" page="colleges" itemSlug={slug} />

            {/* Compare */}
            <section id="compare" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Compare with Similar Colleges</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(similarColleges ?? []).slice(0, 4).map((c) => (
                  <Link key={c.slug} to={`/colleges/${c.slug}`} className="bg-muted rounded-xl p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-14 h-14 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px]">{c.ranking}</Badge>
                          <span className="text-xs text-success font-medium">{c.placement}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Q&A / FAQ */}
            <section id="faq" className="scroll-mt-32">
              <FAQSection page="colleges" itemSlug={slug} title={`FAQs about ${college.name}`} />
            </section>

            {/* Scholarships */}
            <section id="scholarships" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Scholarships</h2>
              {college.scholarship_details ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{college.scholarship_details}</p>
              ) : (
                <div className="space-y-2">
                  {[
                    "Merit-based scholarships for top performers",
                    "Need-based financial aid available",
                    "Government scholarships (SC/ST/OBC)",
                    "Sports & cultural excellence awards",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* News */}
            <section id="news" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Latest News</h2>
              <div className="space-y-3">
                {[
                  { title: `${college.name} opens admissions for 2026 batch`, date: "Feb 2026" },
                  { title: `${college.short_name || college.name} placement report shows 15% salary hike`, date: "Jan 2026" },
                  { title: `New courses launched at ${college.short_name || college.name}`, date: "Dec 2025" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <Newspaper className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <LeadCaptureForm variant="inline" title={`Get admission details for ${college.name}`} source={`college_detail_${college.slug}`} interestedCollegeSlug={college.slug} />
          </div>

          {/* Sidebar - sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <LeadCaptureForm variant="card" title={`Apply to ${college.name}`} subtitle="Get free counseling and application support" source={`college_detail_sidebar_${college.slug}`} interestedCollegeSlug={college.slug} />
              <DynamicAdBanner variant="vertical" position="sidebar" page="colleges" itemSlug={slug} />
              <LeadCaptureForm variant="sidebar" title="Compare Colleges" subtitle="Not sure? Compare this with similar colleges" source="college_compare_sidebar" />
              <DynamicAdBanner variant="square" position="sidebar" page="colleges" itemSlug={slug} />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`🎓 Want to get into ${college.name}? Get expert guidance!`} subtitle="Our counselors have helped thousands of students with admissions" source={`college_detail_bottom_${college.slug}`} interestedCollegeSlug={college.slug} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
      <MobileBottomBar type="college" slug={college.slug} collegeName={college.short_name || college.name} sections={COLLEGE_SECTIONS} />
    </div>
  );
}
