import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, Award, CheckCircle, BookOpen, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";
import { exams } from "@/data/exams";

export default function ExamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const exam = exams.find((e) => e.slug === slug);

  if (!exam) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Exam Not Found</h1>
          <p className="text-muted-foreground mb-6">The exam you're looking for doesn't exist.</p>
          <Link to="/exams"><Button className="gradient-primary text-primary-foreground rounded-xl">Browse All Exams</Button></Link>
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
        <PageBreadcrumb items={[{ label: "Exams", href: "/exams" }, { label: exam.name }]} />

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-6">
          <img src={exam.image} alt={exam.name} className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">{exam.category}</Badge>
              <Badge className="bg-accent/90 text-accent-foreground text-xs">{exam.level}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-background mb-1">{exam.name}</h1>
            <p className="text-background/80 text-sm">{exam.fullName}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: "Exam Date", value: exam.date, color: "text-primary" },
                { icon: Users, label: "Applicants", value: exam.applicants, color: "text-accent" },
                { icon: Award, label: "Mode", value: exam.mode, color: "text-golden" },
                { icon: FileText, label: "Level", value: exam.level, color: "text-success" },
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
              <h2 className="text-lg font-bold text-foreground mb-3">About {exam.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{exam.description}</p>
            </section>

            {/* Eligibility */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Eligibility Criteria</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{exam.eligibility}</p>
            </section>

            <AdBanner variant="horizontal" position="Exam Detail Mid" />

            {/* Important Dates */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Important Dates</h2>
              <div className="space-y-3">
                {exam.importantDates.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{d.event}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{d.date}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Syllabus */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Exam Syllabus</h2>
              <div className="flex flex-wrap gap-2">
                {exam.syllabus.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Top Colleges */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Top Colleges Accepting {exam.name}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {exam.topColleges.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2">
                    <Building className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            <LeadCaptureForm variant="inline" title={`Get preparation tips for ${exam.name}`} source={`exam_detail_${exam.slug}`} />
          </div>

          <aside className="space-y-6">
            <LeadCaptureForm variant="card" title={`Prepare for ${exam.name}`} subtitle="Get free expert preparation strategy" source={`exam_detail_sidebar_${exam.slug}`} />
            <AdBanner variant="vertical" position="Exam Detail Sidebar" />
            <LeadCaptureForm variant="sidebar" title="Exam Alerts" subtitle="Get notified about deadlines" source="exam_alert_sidebar" />
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`📝 Preparing for ${exam.name}? Get expert strategy for free!`} subtitle="Our mentors have helped thousands score top ranks" source={`exam_detail_bottom_${exam.slug}`} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
    </div>
  );
}
