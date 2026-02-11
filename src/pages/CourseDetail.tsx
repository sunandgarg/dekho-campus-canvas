import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Building, TrendingUp, BookOpen, CheckCircle, Briefcase, FileText, IndianRupee, GraduationCap } from "lucide-react";
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
import { useDbCourse } from "@/hooks/useCoursesData";

const COURSE_SECTIONS: ScrollSection[] = [
  { id: "overview", label: "Overview" },
  { id: "scope", label: "Scope" },
  { id: "subjects", label: "Subjects" },
  { id: "placements", label: "Placements" },
  { id: "admission", label: "Admission Process" },
  { id: "fees", label: "Fees" },
  { id: "syllabus", label: "Syllabus" },
  { id: "cutoff", label: "Cut Off" },
  { id: "specializations", label: "Specializations" },
  { id: "faq", label: "FAQ" },
];

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useDbCourse(slug);

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

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-0">
          <img src={course.image} alt={course.name} className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">{course.category}</Badge>
              <Badge className="bg-accent/90 text-accent-foreground text-xs">{course.level}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-background mb-1">{course.name}</h1>
            <p className="text-background/80 text-sm">{course.full_name}</p>
          </div>
        </motion.div>

        <ScrollSpy sections={COURSE_SECTIONS} className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-none md:rounded-xl" />

        <div className="grid lg:grid-cols-3 gap-6">
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
              <h2 className="text-lg font-bold text-foreground mb-3">About {course.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Eligibility</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{course.eligibility}</p>
              </div>
            </section>

            {/* Scope */}
            <section id="scope" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Scope of {course.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                With a {course.growth} growth rate, {course.name} graduates are in high demand across industries. The average starting salary is {course.avg_salary} with top performers earning significantly more.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {course.careers.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Subjects */}
            <section id="subjects" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Key Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {course.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="courses" itemSlug={slug} />

            {/* Placements */}
            <section id="placements" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Placements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{course.avg_salary}</p>
                  <p className="text-xs text-muted-foreground">Average Package</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{course.growth}</p>
                  <p className="text-xs text-muted-foreground">Industry Growth</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{course.colleges_count}+</p>
                  <p className="text-xs text-muted-foreground">Colleges Offering</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {course.name} graduates are recruited by leading companies. Top colleges offering this course report 90%+ placement rates.
              </p>
            </section>

            {/* Admission Process */}
            <section id="admission" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Admission Process</h2>
              <div className="space-y-3 mb-4">
                {[
                  { step: "1", text: `Meet eligibility: ${course.eligibility}` },
                  { step: "2", text: `Clear entrance exam: ${course.top_exams.join(", ")}` },
                  { step: "3", text: "Participate in counseling/admission rounds" },
                  { step: "4", text: "Complete document verification and fee payment" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{s.step}</span>
                    <p className="text-sm text-foreground pt-1">{s.text}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Entrance Exams</h3>
              <div className="flex flex-wrap gap-2">
                {course.top_exams.map((exam) => (
                  <div key={exam} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{exam}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fees */}
            <section id="fees" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Fee Structure</h2>
              <div className="flex items-center gap-3 mb-3">
                <IndianRupee className="w-8 h-8 text-golden" />
                <div>
                  <p className="text-xl font-bold text-foreground">{course.avg_fees}</p>
                  <p className="text-xs text-muted-foreground">Average annual fees (varies by college and category)</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Government colleges generally have lower fees compared to private institutions. Scholarships and fee waivers are available for meritorious and economically weaker students.
              </p>
            </section>

            {/* Syllabus */}
            <section id="syllabus" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{course.name} Syllabus</h2>
              <p className="text-sm text-muted-foreground mb-3">
                The {course.duration} program covers the following core and elective subjects:
              </p>
              <div className="flex flex-wrap gap-2">
                {course.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Cut Off */}
            <section id="cutoff" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Cut Off</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Cut-off scores vary by college and category. Here are typical ranges:
              </p>
              <div className="space-y-2">
                {[
                  { tier: "Top IITs/NITs", range: "Top 1-5% ranks" },
                  { tier: "Tier-2 Colleges", range: "Top 10-20% ranks" },
                  { tier: "Private Colleges", range: "50-60% marks in entrance" },
                ].map((c) => (
                  <div key={c.tier} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground font-medium">{c.tier}</span>
                    <span className="text-sm text-muted-foreground">{c.range}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Specializations */}
            <section id="specializations" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Specializations</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {course.specializations.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                    <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <FAQSection page="courses" itemSlug={slug} title={`FAQs about ${course.name}`} />
            </section>

            <LeadCaptureForm variant="inline" title={`Get admission details for ${course.name}`} source={`course_detail_${course.slug}`} interestedCourseSlug={course.slug} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <LeadCaptureForm variant="card" title={`Study ${course.name}`} subtitle="Get free counseling and college recommendations" source={`course_detail_sidebar_${course.slug}`} interestedCourseSlug={course.slug} />
              <DynamicAdBanner variant="vertical" position="sidebar" page="courses" itemSlug={slug} />
              <LeadCaptureForm variant="sidebar" title="Compare Courses" subtitle="Compare with similar courses" source="course_compare_sidebar" />
              <DynamicAdBanner variant="square" position="sidebar" page="courses" itemSlug={slug} />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`🎯 Want to study ${course.name}? Get free expert guidance!`} subtitle="Our counselors help you pick the best college for this course" source={`course_detail_bottom_${course.slug}`} interestedCourseSlug={course.slug} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
    </div>
  );
}
