import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Building, TrendingUp, BookOpen, CheckCircle, ArrowRight, Briefcase, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";
import { courses } from "@/data/courses";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const course = courses.find((c) => c.slug === slug);

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
      <AdBanner variant="leaderboard" />

      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Courses", href: "/courses" }, { label: course.name }]} />

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-6">
          <img src={course.image} alt={course.name} className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">{course.category}</Badge>
              <Badge className="bg-accent/90 text-accent-foreground text-xs">{course.level}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-background mb-1">{course.name}</h1>
            <p className="text-background/80 text-sm">{course.fullName}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: "Duration", value: course.duration, color: "text-primary" },
                { icon: Building, label: "Colleges", value: `${course.colleges}+`, color: "text-accent" },
                { icon: TrendingUp, label: "Growth", value: course.growth, color: "text-success" },
                { icon: Briefcase, label: "Avg Salary", value: course.avgSalary, color: "text-golden" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-3 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">About {course.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
            </section>

            {/* Eligibility */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Eligibility</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.eligibility}</p>
            </section>

            <AdBanner variant="horizontal" position="Course Detail Mid" />

            {/* Subjects */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Key Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {course.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Top Exams */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Entrance Exams</h2>
              <div className="flex flex-wrap gap-2">
                {course.topExams.map((exam) => (
                  <div key={exam} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{exam}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Options */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Career Options</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {course.careers.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fees */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Fee Range</h2>
              <p className="text-xl font-bold text-foreground">{course.avgFees}</p>
              <p className="text-xs text-muted-foreground mt-1">Varies by college and category</p>
            </section>

            <LeadCaptureForm variant="inline" title={`Get admission details for ${course.name}`} source={`course_detail_${course.slug}`} />
          </div>

          <aside className="space-y-6">
            <LeadCaptureForm variant="card" title={`Study ${course.name}`} subtitle="Get free counseling and college recommendations" source={`course_detail_sidebar_${course.slug}`} />
            <AdBanner variant="vertical" position="Course Detail Sidebar" />
            <LeadCaptureForm variant="sidebar" title="Compare Courses" subtitle="Compare with similar courses" source="course_compare_sidebar" />
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`🎯 Want to study ${course.name}? Get free expert guidance!`} subtitle="Our counselors help you pick the best college for this course" source={`course_detail_bottom_${course.slug}`} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
    </div>
  );
}
