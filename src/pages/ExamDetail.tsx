import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, Award, Building, BookOpen, CheckCircle, Clock } from "lucide-react";
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
import { useDbExam } from "@/hooks/useExamsData";

const EXAM_SECTIONS: ScrollSection[] = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "dates", label: "Important Dates" },
  { id: "pattern", label: "Exam Pattern" },
  { id: "syllabus", label: "Syllabus" },
  { id: "colleges", label: "Top Colleges" },
  { id: "preparation", label: "Preparation Tips" },
  { id: "faq", label: "FAQ" },
];

export default function ExamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: exam, isLoading } = useDbExam(slug);

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
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="exams" itemSlug={slug} />

      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Exams", href: "/exams" }, { label: exam.name }]} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-0">
          <img src={exam.image} alt={exam.name} className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">{exam.category}</Badge>
              <Badge className="bg-accent/90 text-accent-foreground text-xs">{exam.level}</Badge>
              <Badge className={`text-xs ${exam.status === "Applications Open" ? "bg-success/90 text-success-foreground" : "bg-muted text-muted-foreground"}`}>{exam.status}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-background mb-1">{exam.name}</h1>
            <p className="text-background/80 text-sm">{exam.full_name}</p>
          </div>
        </motion.div>

        <ScrollSpy sections={EXAM_SECTIONS} className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-none md:rounded-xl" />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: "Exam Date", value: exam.exam_date, color: "text-primary" },
                { icon: Users, label: "Applicants", value: exam.applicants, color: "text-accent" },
                { icon: Award, label: "Mode", value: exam.mode, color: "text-golden" },
                { icon: Clock, label: "Duration", value: exam.duration, color: "text-success" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-3 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Overview */}
            <section id="overview" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">About {exam.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exam.description}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Category", value: exam.category },
                  { label: "Level", value: exam.level },
                  { label: "Exam Type", value: exam.exam_type },
                  { label: "Language", value: exam.language },
                  { label: "Frequency", value: exam.frequency },
                  { label: "Application Mode", value: exam.application_mode },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <span className="text-sm font-medium text-foreground">{info.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Eligibility Criteria</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{exam.eligibility}</p>
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="exams" itemSlug={slug} />

            {/* Important Dates */}
            <section id="dates" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Important Dates</h2>
              <div className="space-y-3">
                {exam.important_dates.map((d, i) => (
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

            {/* Exam Pattern */}
            <section id="pattern" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Exam Pattern</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Mode", value: exam.mode },
                  { label: "Duration", value: exam.duration },
                  { label: "Language", value: exam.language },
                  { label: "Frequency", value: exam.frequency },
                ].map((item) => (
                  <div key={item.label} className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {exam.name} is conducted in {exam.mode} mode with {exam.syllabus.length} sections covering {exam.syllabus.join(", ")}. Candidates have {exam.duration} to complete the exam.
              </p>
            </section>

            {/* Syllabus */}
            <section id="syllabus" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} Syllabus</h2>
              <div className="flex flex-wrap gap-2">
                {exam.syllabus.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Top Colleges */}
            <section id="colleges" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Top Colleges Accepting {exam.name}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {exam.top_colleges.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2">
                    <Building className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Preparation Tips */}
            <section id="preparation" className="bg-card rounded-2xl border border-border p-5 scroll-mt-28 md:scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Preparation Tips for {exam.name}</h2>
              <div className="space-y-3">
                {[
                  "Start with NCERT/standard textbooks to build strong fundamentals",
                  "Create a realistic study schedule and stick to it daily",
                  "Practice previous year question papers and mock tests regularly",
                  "Focus on weak areas and revise frequently",
                  "Join a reputed coaching or online course for structured preparation",
                  "Stay updated with exam notifications and syllabus changes",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-28 md:scroll-mt-32">
              <FAQSection page="exams" itemSlug={slug} title={`FAQs about ${exam.name}`} />
            </section>

            <LeadCaptureForm variant="inline" title={`Get preparation tips for ${exam.name}`} source={`exam_detail_${exam.slug}`} interestedExamSlug={exam.slug} />
          </div>

          <aside className="space-y-6">
            <LeadCaptureForm variant="card" title={`Prepare for ${exam.name}`} subtitle="Get free expert preparation strategy" source={`exam_detail_sidebar_${exam.slug}`} interestedExamSlug={exam.slug} />
            <DynamicAdBanner variant="vertical" position="sidebar" page="exams" itemSlug={slug} />
            <LeadCaptureForm variant="sidebar" title="Exam Alerts" subtitle="Get notified about deadlines" source="exam_alert_sidebar" />
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`📝 Preparing for ${exam.name}? Get expert strategy for free!`} subtitle="Our mentors have helped thousands score top ranks" source={`exam_detail_bottom_${exam.slug}`} interestedExamSlug={exam.slug} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
    </div>
  );
}
