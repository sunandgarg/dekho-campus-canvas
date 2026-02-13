import { useParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, Award, Building, BookOpen, CheckCircle, Clock, Newspaper, CreditCard, MapPin, ClipboardList, ExternalLink, Globe, AlertCircle, Download } from "lucide-react";
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
import { useDbExam } from "@/hooks/useExamsData";
import { WhatsNewSection } from "@/components/WhatsNewSection";
import { UsefulLinks } from "@/components/UsefulLinks";

const EXAM_SECTIONS: ScrollSection[] = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "dates", label: "Important Dates" },
  { id: "application", label: "Application" },
  { id: "eligibility", label: "Eligibility" },
  { id: "syllabus", label: "Syllabus" },
  { id: "pattern", label: "Exam Pattern" },
  { id: "preparation", label: "Preparation" },
  { id: "admit-card", label: "Admit Card" },
  { id: "answer-key", label: "Answer Key" },
  { id: "results", label: "Results" },
  { id: "counselling", label: "Counselling" },
  { id: "cutoff", label: "Cut Off" },
  { id: "colleges", label: "Top Colleges" },
  { id: "news", label: "News" },
  { id: "faq", label: "Q&A" },
];

export default function ExamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: exam, isLoading } = useDbExam(slug);

  useSEO({
    title: exam ? (exam.meta_title || `${exam.name} 2026 - Dates, Syllabus, Preparation`) : undefined,
    description: exam ? (exam.meta_description || `${exam.name} 2026 exam dates, syllabus, preparation tips, cutoff`) : undefined,
    keywords: exam?.meta_keywords || undefined,
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

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden mb-0">
          <div className="relative">
            <img src={exam.image} alt={exam.name} className="w-full h-48 md:h-56 object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">{exam.category}</Badge>
              <Badge className="bg-accent/90 text-accent-foreground text-xs">{exam.level}</Badge>
              <Badge className={`text-xs ${exam.status === "Applications Open" ? "bg-success/90 text-success-foreground" : "bg-muted text-muted-foreground"}`}>{exam.status}</Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{exam.name} 2026</h1>
            <p className="text-sm text-muted-foreground mb-3">{exam.full_name}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {exam.registration_url && exam.registration_url !== "#" && (
                <a href={exam.registration_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="rounded-xl text-xs gap-1"><ExternalLink className="w-3.5 h-3.5" />Apply Now</Button>
                </a>
              )}
              {exam.sample_paper_url && exam.sample_paper_url !== "#" && (
                <a href={exam.sample_paper_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1"><Download className="w-3.5 h-3.5" />Sample Papers</Button>
                </a>
              )}
              {exam.website && exam.website !== "#" && (
                <a href={exam.website} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1"><Globe className="w-3.5 h-3.5" />Official Website</Button>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <ScrollSpy sections={EXAM_SECTIONS} baseUrl={`/exams/${slug}`} className="mb-6 -mx-4 px-4 md:mx-0 md:px-0 rounded-none md:rounded-xl" />

        <div className="mb-6">
          <WhatsNewSection entityName={exam.name} entityType="exam" category={exam.category} />
        </div>

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
            <section id="overview" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">About {exam.name} 2026</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exam.description}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Full Name", value: exam.full_name },
                  { label: "Conducting Body", value: "NTA" },
                  { label: "Category", value: exam.category },
                  { label: "Level", value: exam.level },
                  { label: "Exam Type", value: exam.exam_type },
                  { label: "Mode", value: exam.mode },
                  { label: "Language", value: exam.language },
                  { label: "Duration", value: exam.duration },
                  { label: "Frequency", value: exam.frequency },
                  { label: "Application Mode", value: exam.application_mode },
                  { label: "Seats", value: exam.seats || "Varies" },
                  { label: "Negative Marking", value: exam.negative_marking ? "Yes" : "No" },
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
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Key Highlights</h2>
              <div className="space-y-2">
                {[
                  `${exam.name} is conducted by NTA (National Testing Agency)`,
                  `Mode of exam: ${exam.mode}`,
                  `Exam duration: ${exam.duration}`,
                  `Available in ${exam.language}`,
                  `Frequency: ${exam.frequency}`,
                  exam.negative_marking ? "Negative marking applicable" : "No negative marking",
                  `Total applicants: ${exam.applicants}`,
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Dates */}
            <section id="dates" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Important Dates</h2>
              {exam.dates_content && <p className="text-sm text-muted-foreground mb-3">{exam.dates_content}</p>}
              <div className="space-y-0">
                {(exam.important_dates && exam.important_dates.length > 0 ? exam.important_dates : [
                  { event: "Application Start", date: exam.application_start_date || "TBA" },
                  { event: "Application End", date: exam.application_end_date || "TBA" },
                  { event: "Exam Date", date: exam.exam_date },
                  { event: "Result Date", date: exam.result_date || "TBA" },
                ]).map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{d.event}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{d.date}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Application Form */}
            <section id="application" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Application Form</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {exam.application_process || `Apply online through the official ${exam.name} website.`}
              </p>
              {exam.cast_wise_fee && (
                <div className="bg-muted rounded-xl p-4 mt-3">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4" />Application Fee</h3>
                  <p className="text-sm text-muted-foreground">{exam.cast_wise_fee}</p>
                </div>
              )}
              {exam.registration_url && exam.registration_url !== "#" && (
                <div className="mt-3">
                  <a href={exam.registration_url} target="_blank" rel="noopener noreferrer">
                    <Button className="rounded-xl gap-1"><ExternalLink className="w-4 h-4" />Apply Now on Official Website</Button>
                  </a>
                </div>
              )}
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="exams" itemSlug={slug} />
            <LeadCaptureForm variant="inline" title={`📞 Get ${exam.name} preparation guidance`} source={`exam_inline_${exam.slug}`} interestedExamSlug={exam.slug} />

            {/* Eligibility */}
            <section id="eligibility" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} Eligibility Criteria</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{exam.eligibility}</p>
              {exam.age_limit && (
                <div className="mt-3 bg-muted rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Age Limit: {exam.age_limit}</span>
                </div>
              )}
              {exam.gender_wise && (
                <div className="mt-2 bg-muted rounded-xl p-3">
                  <p className="text-sm text-muted-foreground">{exam.gender_wise}</p>
                </div>
              )}
            </section>

            {/* Syllabus */}
            <section id="syllabus" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Syllabus</h2>
              <div className="flex flex-wrap gap-2">
                {exam.syllabus.map((s) => (
                  <Badge key={s} variant="secondary" className="text-sm py-1.5 px-3">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Pattern */}
            <section id="pattern" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} Exam Pattern</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Mode", value: exam.mode },
                  { label: "Duration", value: exam.duration },
                  { label: "Language", value: exam.language },
                  { label: "Negative Marking", value: exam.negative_marking ? "Yes (-1)" : "No" },
                ].map((item) => (
                  <div key={item.label} className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              {exam.exam_pattern && <p className="text-sm text-muted-foreground">{exam.exam_pattern}</p>}
            </section>

            {/* Preparation */}
            <section id="preparation" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} Preparation Tips</h2>
              {exam.preparation_tips ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{exam.preparation_tips}</p>
              ) : (
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
              )}
            </section>

            <DynamicAdBanner variant="horizontal" position="mid-page" page="exams" itemSlug={slug} />

            {/* Admit Card */}
            <section id="admit-card" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Admit Card</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The {exam.name} admit card will be available for download from the official website. Candidates must carry a valid photo ID along with the printed admit card to the exam center.
              </p>
            </section>

            {/* Answer Key */}
            <section id="answer-key" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Answer Key</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exam.question_paper || `The provisional answer key for ${exam.name} will be released on the official website after the exam. Candidates can challenge the answer key within the specified window.`}
              </p>
            </section>

            {/* Results */}
            <section id="results" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Results</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exam.result_content || `${exam.name} results will be declared on ${exam.result_date || "the official website"}. Candidates can check their scores and download scorecards.`}
              </p>
            </section>

            {/* Counselling */}
            <section id="counselling" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Counselling</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exam.counselling_content || `After results, qualified candidates can participate in the ${exam.name} counselling process for seat allocation.`}
              </p>
            </section>

            {/* Cut Off */}
            <section id="cutoff" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} 2026 Cut Off</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exam.cutoff_content || `Cut-off scores for ${exam.name} vary by category and year.`}
              </p>
            </section>

            {/* Accepting Colleges */}
            <section id="colleges" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">Top Colleges Accepting {exam.name}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {exam.top_colleges.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2.5 bg-muted rounded-xl">
                    <Building className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Link to="/colleges">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">View All Colleges →</Button>
                </Link>
              </div>
            </section>

            {/* News */}
            <section id="news" className="bg-card rounded-2xl border border-border p-5 scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{exam.name} Latest News</h2>
              <div className="space-y-3">
                {[
                  { title: `${exam.name} 2026 registration opens`, date: "Feb 2026" },
                  { title: `${exam.name} syllabus revised for 2026`, date: "Jan 2026" },
                  { title: `${exam.name} exam date announced`, date: "Dec 2025" },
                  { title: `NTA releases ${exam.name} 2025 final answer key`, date: "Nov 2025" },
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
              <FAQSection page="exams" itemSlug={slug} title={`FAQs about ${exam.name}`} />
            </section>

            <LeadCaptureForm variant="inline" title={`Get preparation tips for ${exam.name}`} source={`exam_detail_${exam.slug}`} interestedExamSlug={exam.slug} />

            {/* Useful Links */}
            <UsefulLinks
              type="exam"
              name={exam.name}
              shortName={exam.short_name}
              slug={exam.slug}
              category={exam.category}
              sections={EXAM_SECTIONS}
            />
          </div>

          <aside className="hidden lg:block">
            <div className="space-y-4">
              <LeadCaptureForm variant="card" title={`Prepare for ${exam.name}`} subtitle="Get free expert preparation strategy" source={`exam_detail_sidebar_${exam.slug}`} interestedExamSlug={exam.slug} />

              {/* Upcoming Exams */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">📅 Upcoming Exams</h3>
                <div className="space-y-2">
                  {["JEE Main 2026", "NEET UG 2026", "CAT 2026", "GATE 2026", "CLAT 2026"].map((e) => (
                    <Link key={e} to={`/exams/${e.toLowerCase().replace(/\s+/g, "-")}`} className="block text-xs text-primary hover:underline py-1 border-b border-border last:border-0">{e}</Link>
                  ))}
                </div>
              </div>

              {/* Get Started CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-4 text-center">
                <h3 className="text-sm font-bold text-foreground mb-1">What are you waiting for?</h3>
                <p className="text-xs text-muted-foreground mb-3">Discover Your Education Journey With Us</p>
                <div className="space-y-2">
                  <Button size="sm" className="w-full rounded-xl text-xs">Enquiry Now</Button>
                  <Button size="sm" variant="outline" className="w-full rounded-xl text-xs">Apply Now</Button>
                </div>
              </div>

              {/* Previous Year Papers */}
              {exam.sample_paper_url && (
                <div className="bg-card rounded-2xl border border-border p-4">
                  <h3 className="text-sm font-bold text-foreground mb-3">📄 Previous Year Papers</h3>
                  <div className="space-y-2">
                    {[`${exam.name} 2025 Paper`, `${exam.name} 2024 Paper`, `${exam.name} 2023 Paper`].map((p) => (
                      <div key={p} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                        <span className="text-xs text-foreground">{p}</span>
                        <Download className="w-3.5 h-3.5 text-primary cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News & Updates */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">📰 News & Updates</h3>
                <div className="space-y-2">
                  {[`${exam.name} 2026 registration opens`, `${exam.name} syllabus updated`, `${exam.name} mock tests available`].map((n) => (
                    <p key={n} className="text-xs text-muted-foreground py-1 border-b border-border last:border-0">{n}</p>
                  ))}
                </div>
              </div>

              <DynamicAdBanner variant="vertical" position="sidebar" page="exams" itemSlug={slug} />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm variant="banner" title={`📝 Preparing for ${exam.name}? Get expert strategy for free!`} subtitle="Our mentors have helped thousands score top ranks" source={`exam_detail_bottom_${exam.slug}`} interestedExamSlug={exam.slug} />
        </div>
      </main>

      <Footer />
      <FloatingBot />
      <MobileBottomBar type="exam" slug={exam.slug} sections={EXAM_SECTIONS} />
    </div>
  );
}
