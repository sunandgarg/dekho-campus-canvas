import { useParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Clock, Building, TrendingUp, BookOpen, CheckCircle, Briefcase, FileText, IndianRupee, GraduationCap, Newspaper, Award, Star, ExternalLink, Download, Users } from "lucide-react";
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
import { useDbCourse } from "@/hooks/useCoursesData";
import { WhatsNewSection } from "@/components/WhatsNewSection";
import { UsefulLinks } from "@/components/UsefulLinks";

const COURSE_SECTIONS: ScrollSection[] = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "eligibility", label: "Eligibility" },
  { id: "syllabus", label: "Syllabus" },
  { id: "fees", label: "Fees" },
  { id: "admission", label: "Admission" },
  { id: "career", label: "Career Scope" },
  { id: "placements", label: "Placements" },
  { id: "specializations", label: "Specializations" },
  { id: "top-exams", label: "Entrance Exams" },
  { id: "top-colleges", label: "Top Colleges" },
  { id: "cutoff", label: "Cut Off" },
  { id: "faq", label: "Q&A" },
];

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useDbCourse(slug);

  useSEO({
    title: course ? (course.meta_title || `${course.name} Course - Fees, Colleges, Career 2026`) : undefined,
    description: course ? (course.meta_description || `${course.name} course details - fees, top colleges, career scope for 2026`) : undefined,
    keywords: course?.meta_keywords || undefined,
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

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses"><Button className="gradient-primary text-primary-foreground rounded-xl">Browse All Courses</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="courses" itemSlug={slug} />

      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Courses", href: "/courses" }, { label: course.name }]} />

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden mb-0">
          <div className="relative">
            <img src={course.image} alt={course.name} className="w-full h-48 md:h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          </div>
          <div className="p-4 md:p-6 -mt-14 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">{course.category}</Badge>
              <Badge className="bg-accent/90 text-accent-foreground text-xs">{course.level}</Badge>
              <Badge variant="secondary" className="text-xs">{course.duration}</Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white md:text-foreground mb-1">{course.name} ({course.full_name})</h1>
            <p className="text-sm text-muted-foreground">{course.short_description || course.description?.slice(0, 120)}</p>
          </div>
        </motion.div>

        <ScrollSpy sections={COURSE_SECTIONS} baseUrl={`/courses/${slug}`} className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-none md:rounded-xl" />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WhatsNewSection entityName={course.name} entityType="course" category={course.category} />
          </div>
          <div className="hidden lg:block" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: "Duration", value: course.duration, color: "text-primary" },
                { icon: Building, label: "Colleges", value: `${course.colleges_count}+`, color: "text-accent" },
                { icon: TrendingUp, label: "Growth", value: course.growth, color: "text-success" },
                { icon: Briefcase, label: "Avg Salary", value: course.avg_salary, color: "text-golden" },
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
              <h2 className="text-lg font-bold text-foreground mb-3">About {course.name} ({course.full_name})</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{course.description}</p>
              {course.about_content && <p className="text-sm text-muted-foreground leading-relaxed">{course.about_content}</p>}
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Full Name", value: course.full_name },
                  { label: "Duration", value: course.duration },
                  { label: "Level", value: course.level },
                  { label: "Mode", value: course.mode },
                  { label: "Category", value: course.category },
                  { label: "Domain", value: course.domain || course.category },
                  { label: "Avg Fees", value: course.avg_fees },
                  { label: "Avg Salary", value: course.avg_salary },
                  { label: "Total Colleges", value: `${course.colleges_count}+` },
                  { label: "Industry Growth", value: course.growth },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <span className="text-sm font-medium text-foreground">{info.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section id="highlights" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Key Highlights</h2>
              <div className="space-y-2">
                {[
                  `${course.full_name} is a ${course.duration} ${course.level} program`,
                  `Offered at ${course.colleges_count}+ colleges across India`,
                  `Average fees: ${course.avg_fees}`,
                  `Average salary after ${course.name}: ${course.avg_salary}`,
                  `Industry growth rate: ${course.growth}`,
                  `Mode of study: ${course.mode}`,
                  `${course.specializations.length}+ specializations available`,
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Eligibility Criteria</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.eligibility}</p>
            </section>

            {/* Syllabus */}
            <section id="syllabus" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Syllabus & Subjects</h2>
              {course.syllabus_content && <p className="text-sm text-muted-foreground mb-3">{course.syllabus_content}</p>}
              <p className="text-sm text-muted-foreground mb-3">The {course.duration} program covers these core subjects:</p>
              <div className="flex flex-wrap gap-2">
                {course.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
              {course.syllabus_pdf_url && course.syllabus_pdf_url !== '#' && (
                <div className="mt-3">
                  <a href={course.syllabus_pdf_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1"><Download className="w-3.5 h-3.5" />Download Syllabus PDF</Button>
                  </a>
                </div>
              )}
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="courses" itemSlug={slug} />

            {/* Fees */}
            <section id="fees" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Fee Structure</h2>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <IndianRupee className="w-5 h-5 mx-auto mb-1 text-golden" />
                  <p className="text-lg font-bold text-foreground">{course.avg_fees}</p>
                  <p className="text-xs text-muted-foreground">Average Fees</p>
                </div>
                {course.low_fee > 0 && (
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">₹{(course.low_fee / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Lowest Fees</p>
                  </div>
                )}
                {course.high_fee > 0 && (
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">₹{(course.high_fee / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">Highest Fees</p>
                  </div>
                )}
              </div>
              {course.fees_content && <p className="text-sm text-muted-foreground">{course.fees_content}</p>}
            </section>

            {/* Admission Process */}
            <section id="admission" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Admission Process 2026</h2>
              {course.admission_process && <p className="text-sm text-muted-foreground mb-4">{course.admission_process}</p>}
              <div className="space-y-3">
                {[
                  { step: "1", title: "Eligibility Check", text: course.eligibility },
                  { step: "2", title: "Entrance Exam", text: `Clear entrance exam: ${course.top_exams.join(", ")}` },
                  { step: "3", title: "Counselling", text: "Participate in counseling/admission rounds" },
                  { step: "4", title: "Admission", text: "Complete document verification and fee payment" },
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

            <LeadCaptureForm variant="inline" title={`📞 Get guidance for ${course.name}`} source={`course_inline_${course.slug}`} interestedCourseSlug={course.slug} />

            {/* Career Scope */}
            <section id="career" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Career Scope & Job Profiles</h2>
              {course.scope_content && <p className="text-sm text-muted-foreground mb-4">{course.scope_content}</p>}
              <div className="grid sm:grid-cols-2 gap-2">
                {course.careers.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2.5 bg-muted rounded-xl">
                    <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Placements */}
            <section id="placements" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Placements</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{course.avg_salary}</p>
                  <p className="text-xs text-muted-foreground">Avg Package</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{course.growth}</p>
                  <p className="text-xs text-muted-foreground">Growth</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{course.colleges_count}+</p>
                  <p className="text-xs text-muted-foreground">Colleges</p>
                </div>
              </div>
              {course.placements_content && <p className="text-sm text-muted-foreground">{course.placements_content}</p>}
              {course.recruiters_content && (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Top Recruiters</h3>
                  <p className="text-sm text-muted-foreground">{course.recruiters_content}</p>
                </div>
              )}
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="courses" itemSlug={slug} />

            {/* Specializations */}
            <section id="specializations" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Specializations</h2>
              {course.specialization_content && <p className="text-sm text-muted-foreground mb-3">{course.specialization_content}</p>}
              <div className="grid sm:grid-cols-2 gap-2">
                {course.specializations.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                    <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Exams */}
            <section id="top-exams" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Entrance Exams for {course.name}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {course.top_exams.map((exam) => (
                  <div key={exam} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{exam}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Colleges */}
            <section id="top-colleges" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Top Colleges for {course.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {course.colleges_count}+ colleges across India offer {course.name}. Top colleges include IITs, NITs, IIMs, and other prestigious institutions.
              </p>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "IIT Bombay", rating: "4.8" },
                  { rank: 2, name: "IIT Delhi", rating: "4.7" },
                  { rank: 3, name: "IIT Madras", rating: "4.7" },
                  { rank: 4, name: "IIT Kanpur", rating: "4.6" },
                  { rank: 5, name: "NIT Trichy", rating: "4.5" },
                ].map((c) => (
                  <div key={c.rank} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{c.rank}</span>
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-golden fill-golden" />
                      <span className="text-sm text-foreground">{c.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Link to="/colleges">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">View All Colleges →</Button>
                </Link>
              </div>
            </section>

            {/* Cut Off */}
            <section id="cutoff" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Cut Off</h2>
              {course.cutoff_content && <p className="text-sm text-muted-foreground mb-3">{course.cutoff_content}</p>}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">College Tier</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Cut-off Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { tier: "Top IITs/NITs", range: "Top 1-5% ranks" },
                      { tier: "Tier-2 Colleges", range: "Top 10-20% ranks" },
                      { tier: "Private Colleges", range: "50-60% marks in entrance" },
                    ].map((c) => (
                      <tr key={c.tier} className="border-b border-border last:border-0">
                        <td className="py-2 text-foreground font-medium">{c.tier}</td>
                        <td className="py-2 text-right text-muted-foreground">{c.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <FAQSection page="courses" itemSlug={slug} title={`FAQs about ${course.name}`} />
            </section>

            <LeadCaptureForm variant="inline" title={`Get admission details for ${course.name}`} source={`course_detail_${course.slug}`} interestedCourseSlug={course.slug} />

            {/* Useful Links */}
            <UsefulLinks
              type="course"
              name={course.name}
              shortName={course.name}
              slug={course.slug}
              category={course.category}
              sections={COURSE_SECTIONS}
            />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              {/* Other Courses */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">📚 Other Courses</h3>
                <div className="space-y-2">
                  {["B.Tech", "MBA", "MBBS", "B.Sc", "B.Com", "LLB", "BBA", "MCA"].filter(c => c !== course.name).slice(0, 6).map((c) => (
                    <Link key={c} to={`/courses/${c.toLowerCase().replace(/[\s\.]+/g, "-")}`} className="block text-xs text-primary hover:underline py-1 border-b border-border last:border-0">{c}</Link>
                  ))}
                </div>
              </div>

              {/* Get Started CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-4 text-center">
                <h3 className="text-sm font-bold text-foreground mb-1">Get Started!</h3>
                <p className="text-xs text-muted-foreground mb-3">Find the best college for {course.name}</p>
                <Button size="sm" className="w-full rounded-xl text-xs">Enquiry Now</Button>
              </div>

              <LeadCaptureForm variant="card" title={`Study ${course.name}`} subtitle="Get free counseling and college recommendations" source={`course_detail_sidebar_${course.slug}`} interestedCourseSlug={course.slug} />
              <DynamicAdBanner variant="vertical" position="sidebar" page="courses" itemSlug={slug} />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`🎯 Want to study ${course.name}? Get free expert guidance!`} subtitle="Our counselors help you pick the best college for this course" source={`course_detail_bottom_${course.slug}`} interestedCourseSlug={course.slug} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
      <MobileBottomBar type="course" slug={course.slug} sections={COURSE_SECTIONS} />
    </div>
  );
}
