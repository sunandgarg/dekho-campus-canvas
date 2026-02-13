import { useParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, GraduationCap, TrendingUp, Building, CheckCircle, Briefcase, BookOpen, Image as ImageIcon, Users, Award, Scale, Newspaper, HelpCircle, DollarSign, ExternalLink, Download, Phone, Shield, Globe, Landmark } from "lucide-react";
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
import { WhatsNewSection } from "@/components/WhatsNewSection";
import { UsefulLinks } from "@/components/UsefulLinks";

const COLLEGE_SECTIONS: ScrollSection[] = [
  { id: "overview", label: "College Info" },
  { id: "highlights", label: "Highlights" },
  { id: "courses", label: "Courses & Fees" },
  { id: "admissions", label: "Admissions" },
  { id: "placements", label: "Placements" },
  { id: "cutoff", label: "Cut-Offs" },
  { id: "rankings", label: "Rankings" },
  { id: "reviews", label: "Reviews" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "gallery", label: "Gallery" },
  { id: "scholarships", label: "Scholarships" },
  { id: "hostel", label: "Hostel" },
  { id: "compare", label: "Compare" },
  { id: "news", label: "News" },
  { id: "faq", label: "Q&A" },
];

export default function CollegeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: college, isLoading } = useDbCollege(slug);
  const { data: sameStateColleges } = useCollegesByState(college?.state, slug);
  const { data: similarColleges } = useCollegesByCategory(college?.category, slug);
  const { data: allCourses } = useDbCourses();

  useSEO({
    title: college ? (college.meta_title || `${college.name} - Admissions, Fees, Placements 2026`) : undefined,
    description: college ? (college.meta_description || `${college.name} - admissions, fees, placements, courses, ranking details for 2026`) : undefined,
    keywords: college?.meta_keywords || undefined,
  });

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

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden mb-0">
          <div className="relative">
            <img src={college.image} alt={college.name} className="w-full h-48 md:h-64 object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          </div>
          <div className="p-4 md:p-6 -mt-16 relative z-10">
            <div className="flex items-start gap-4">
              {college.logo && (
                <img src={college.logo} alt={college.short_name} className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-background bg-background object-cover shadow-lg" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {college.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} className="bg-primary/90 text-primary-foreground text-xs">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1 line-clamp-2">{college.name}</h1>
                <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{college.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Estd. {college.established}</span>
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" />NAAC {college.naac_grade}</span>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Button size="sm" className="rounded-xl text-xs gap-1"><Phone className="w-3.5 h-3.5" />Get Free Counselling</Button>
              {college.brochure_url && college.brochure_url !== '#' && (
                <a href={college.brochure_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1"><Download className="w-3.5 h-3.5" />Download Brochure</Button>
                </a>
              )}
              <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1"><Scale className="w-3.5 h-3.5" />Compare</Button>
            </div>
          </div>
        </motion.div>

        <ScrollSpy sections={COLLEGE_SECTIONS} baseUrl={`/colleges/${slug}`} className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-none md:rounded-xl" />

        <div className="mb-6">
          <WhatsNewSection entityName={college.short_name || college.name} entityType="college" category={college.category} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Star, label: "Rating", value: `${college.rating}/5`, color: "text-golden" },
                { icon: GraduationCap, label: "Courses", value: `${college.courses_count}+`, color: "text-primary" },
                { icon: TrendingUp, label: "Avg Package", value: college.placement, color: "text-success" },
                { icon: Building, label: "Type", value: college.type, color: "text-accent" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-3 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Overview */}
            <section id="overview" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">About {college.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{college.description}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Full Name", value: college.name },
                  { label: "Short Name", value: college.short_name },
                  { label: "Type", value: college.type },
                  { label: "Category", value: college.category },
                  { label: "Established", value: String(college.established) },
                  { label: "Location", value: college.location },
                  { label: "NAAC Grade", value: college.naac_grade },
                  { label: "Approvals", value: college.approvals.join(", ") },
                  { label: "Total Courses", value: `${college.courses_count}+` },
                  { label: "Total Reviews", value: `${college.reviews}` },
                  { label: "Fees Range", value: college.fees },
                  { label: "Avg. Placement", value: college.placement },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{info.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section id="highlights" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Key Highlights</h2>
              <div className="space-y-2">
                {college.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Courses & Fees */}
            <section id="courses" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Courses & Fees at {college.short_name || college.name}</h2>
              {college.course_fee_content && (
                <p className="text-sm text-muted-foreground mb-4">{college.course_fee_content}</p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Duration</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Fees</th>
                      <th className="text-right py-2 text-muted-foreground font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularCourses.map((c) => (
                      <tr key={c.slug} className="border-b border-border last:border-0">
                        <td className="py-3">
                          <Link to={`/courses/${c.slug}`} className="text-primary font-medium hover:underline">{c.name}</Link>
                        </td>
                        <td className="py-3 text-muted-foreground">{c.duration}</td>
                        <td className="py-3 text-foreground font-medium">{c.avg_fees}</td>
                        <td className="py-3 text-right">
                          <Link to={`/courses/${c.slug}`}>
                            <Button size="sm" variant="ghost" className="text-xs"><ExternalLink className="w-3 h-3" /></Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <Link to="/courses">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">View All Courses →</Button>
                </Link>
              </div>
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" itemSlug={slug} />
            <LeadCaptureForm variant="inline" title="📞 Get admission guidance for this college" source={`college_inline_${college.slug}`} interestedCollegeSlug={college.slug} />

            {/* Admissions */}
            <section id="admissions" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{college.short_name || college.name} Admission Process 2026</h2>
              {college.admission_process && (
                <p className="text-sm text-muted-foreground mb-4">{college.admission_process}</p>
              )}
              <div className="space-y-3">
                {[
                  { step: "1", title: "Check Eligibility", text: college.eligibility_criteria || "Check eligibility criteria and required entrance exam scores" },
                  { step: "2", title: "Apply Online", text: "Register on the official website and fill the application form" },
                  { step: "3", title: "Entrance Exam", text: "Appear for relevant entrance exam (JEE/NEET/CAT etc.)" },
                  { step: "4", title: "Counselling", text: "Attend counseling / interview rounds as applicable" },
                  { step: "5", title: "Admission", text: "Receive offer letter and complete admission formalities" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{s.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Placements */}
            <section id="placements" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{college.short_name || college.name} Placements 2026</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{college.placement}</p>
                  <p className="text-xs text-muted-foreground">Avg Package</p>
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
              {college.placement_content && <p className="text-sm text-muted-foreground mb-4">{college.placement_content}</p>}
              <h3 className="text-sm font-semibold text-foreground mb-2">Top Recruiters</h3>
              <div className="flex flex-wrap gap-2">
                {(college.top_recruiters.length > 0 ? college.top_recruiters : ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro"]).map((r) => (
                  <Badge key={r} variant="secondary" className="text-xs py-1.5 px-3">{r}</Badge>
                ))}
              </div>
            </section>

            {/* Cut-Offs */}
            <section id="cutoff" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{college.short_name || college.name} Cut-Off 2026</h2>
              {college.cutoff ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{college.cutoff}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Exam</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Cut-off</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { exam: "JEE Main", cat: "General", cutoff: "Top 5,000 ranks" },
                        { exam: "JEE Main", cat: "OBC-NCL", cutoff: "Top 8,000 ranks" },
                        { exam: "JEE Main", cat: "SC", cutoff: "Top 15,000 ranks" },
                        { exam: "CAT", cat: "General", cutoff: "95+ percentile" },
                      ].map((c, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-2 text-foreground font-medium">{c.exam}</td>
                          <td className="py-2 text-muted-foreground">{c.cat}</td>
                          <td className="py-2 text-right text-foreground">{c.cutoff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="colleges" itemSlug={slug} />

            {/* Rankings */}
            <section id="rankings" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{college.short_name || college.name} Rankings</h2>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-10 h-10 text-golden" />
                <div>
                  <p className="text-xl font-bold text-foreground">{college.ranking}</p>
                  <p className="text-xs text-muted-foreground">Overall Ranking</p>
                </div>
              </div>
              {college.rankings_content && <p className="text-sm text-muted-foreground">{college.rankings_content}</p>}
            </section>

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
                    { label: "Faculty", pct: 82 },
                    { label: "Campus Life", pct: 80 },
                    { label: "Value for Money", pct: 75 },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-28">{r.label}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-primary rounded-full h-2" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground w-8">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section id="infrastructure" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Infrastructure & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {college.facilities.map((f) => (
                  <div key={f} className="flex items-center gap-2 p-2.5 bg-muted rounded-xl">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
              {college.facilities_content && <p className="text-sm text-muted-foreground">{college.facilities_content}</p>}
            </section>

            {/* Gallery */}
            <section id="gallery" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Campus Gallery</h2>
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

            {/* Scholarships */}
            <section id="scholarships" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Scholarships at {college.short_name || college.name}</h2>
              {college.scholarship_details ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{college.scholarship_details}</p>
              ) : (
                <div className="space-y-2">
                  {["Merit-based scholarships for top performers", "Need-based financial aid available", "Government scholarships (SC/ST/OBC)", "Sports & cultural excellence awards"].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Hostel */}
            <section id="hostel" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Hostel Life</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {college.hostel_life || `${college.name} provides comfortable hostel accommodation for both boys and girls with modern amenities including WiFi, mess, laundry, and recreational facilities.`}
              </p>
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
              {(sameStateColleges ?? []).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">More colleges in {college.state}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(sameStateColleges ?? []).slice(0, 6).map((c) => (
                      <Link key={c.slug} to={`/colleges/${c.slug}`}>
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-primary/10">{c.short_name || c.name}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* News */}
            <section id="news" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Latest News & Updates</h2>
              <div className="space-y-3">
                {[
                  { title: `${college.name} opens admissions for 2026 batch`, date: "Feb 2026" },
                  { title: `${college.short_name || college.name} placement report shows 15% salary hike`, date: "Jan 2026" },
                  { title: `New courses launched at ${college.short_name || college.name}`, date: "Dec 2025" },
                  { title: `${college.short_name || college.name} ranked among top 10 by NIRF`, date: "Nov 2025" },
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

            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <FAQSection page="colleges" itemSlug={slug} title={`FAQs about ${college.name}`} />
            </section>

            <LeadCaptureForm variant="inline" title={`Get admission details for ${college.name}`} source={`college_detail_${college.slug}`} interestedCollegeSlug={college.slug} />

            {/* Useful Links */}
            <UsefulLinks
              type="college"
              name={college.name}
              shortName={college.short_name}
              slug={college.slug}
              state={college.state}
              city={college.city}
              category={college.category}
              sections={COLLEGE_SECTIONS}
              topCourses={popularCourses.map((c) => ({ name: c.name, slug: c.slug }))}
            />
          </div>

          {/* Sidebar - flows naturally, lead form first */}
          <aside className="hidden lg:block">
            <div className="space-y-4">
              <LeadCaptureForm variant="card" title={`Apply to ${college.name}`} subtitle="Get free counseling and application support" source={`college_detail_sidebar_${college.slug}`} interestedCollegeSlug={college.slug} />

              {/* Get Started CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-4 text-center">
                <h3 className="text-sm font-bold text-foreground mb-1">Get Started!</h3>
                <p className="text-xs text-muted-foreground mb-3">Apply to {college.short_name || college.name}</p>
                <Button size="sm" className="w-full rounded-xl text-xs mb-2">Enquiry Now</Button>
                <Button size="sm" variant="outline" className="w-full rounded-xl text-xs">Download Brochure</Button>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">📍 Contact Information</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><span className="font-medium text-foreground">Location:</span> {college.location}</p>
                  <p><span className="font-medium text-foreground">State:</span> {college.state}</p>
                  <p><span className="font-medium text-foreground">City:</span> {college.city}</p>
                  <p><span className="font-medium text-foreground">Established:</span> {college.established}</p>
                </div>
              </div>

              {/* Top Courses */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">📚 Top Courses</h3>
                <div className="space-y-2">
                  {popularCourses.slice(0, 5).map((c) => (
                    <Link key={c.slug} to={`/courses/${c.slug}`} className="block text-xs text-primary hover:underline py-1 border-b border-border last:border-0">{c.name}</Link>
                  ))}
                </div>
              </div>

              {/* Similar Colleges */}
              {(similarColleges ?? []).length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-4">
                  <h3 className="text-sm font-bold text-foreground mb-3">🏛️ Similar Colleges</h3>
                  <div className="space-y-2">
                    {(similarColleges ?? []).slice(0, 5).map((c) => (
                      <Link key={c.slug} to={`/colleges/${c.slug}`} className="block text-xs text-primary hover:underline py-1 border-b border-border last:border-0">{c.short_name || c.name}</Link>
                    ))}
                  </div>
                </div>
              )}

              <DynamicAdBanner variant="vertical" position="sidebar" page="colleges" itemSlug={slug} />
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
