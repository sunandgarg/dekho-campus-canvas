import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, GraduationCap, TrendingUp, Building, CheckCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";
import { colleges } from "@/data/colleges";

export default function CollegeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const college = colleges.find((c) => c.slug === slug);

  if (!college) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">College Not Found</h1>
          <p className="text-muted-foreground mb-6">The college you're looking for doesn't exist.</p>
          <Link to="/colleges">
            <Button className="gradient-primary text-primary-foreground rounded-xl">Browse All Colleges</Button>
          </Link>
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
        <PageBreadcrumb items={[{ label: "Colleges", href: "/colleges" }, { label: college.name }]} />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-6"
        >
          <img src={college.image} alt={college.name} className="w-full h-48 md:h-64 object-cover" />
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Star, label: "Rating", value: `${college.rating}/5`, color: "text-golden" },
                { icon: GraduationCap, label: "Courses", value: `${college.courses}+`, color: "text-primary" },
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

            {/* Approvals & NAAC */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Approvals: </span>
                  {college.approvals.map((a) => (
                    <Badge key={a} variant="outline" className="text-xs ml-1 font-semibold">{a}</Badge>
                  ))}
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">NAAC Grade: </span>
                  <Badge className="bg-success/10 text-success border-success/30 ml-1">{college.naacGrade}</Badge>
                </div>
              </div>
            </div>

            {/* About */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">About {college.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{college.description}</p>
            </section>

            {/* Highlights */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Key Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {college.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2 p-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            <AdBanner variant="horizontal" position="College Detail Mid" />

            {/* Facilities */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {college.facilities.map((f) => (
                  <Badge key={f} variant="secondary" className="text-sm py-1.5 px-3">{f}</Badge>
                ))}
              </div>
            </section>

            {/* Quick Info */}
            <section className="bg-card rounded-2xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-3">Quick Information</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Type", value: college.type },
                  { label: "Category", value: college.category },
                  { label: "Fees", value: college.fees },
                  { label: "Ranking", value: college.ranking },
                  { label: "Reviews", value: `${college.reviews} reviews` },
                  { label: "State", value: college.state },
                  { label: "NAAC Grade", value: college.naacGrade },
                  { label: "Approvals", value: college.approvals.join(", ") },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <span className="text-sm font-medium text-foreground">{info.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <AdBanner variant="horizontal" position="College Detail Bottom" />

            {/* Inline Lead Form */}
            <LeadCaptureForm
              variant="inline"
              title={`Get admission details for ${college.name}`}
              source={`college_detail_${college.slug}`}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <LeadCaptureForm
              variant="card"
              title={`Apply to ${college.name}`}
              subtitle="Get free counseling and application support"
              source={`college_detail_sidebar_${college.slug}`}
            />
            <AdBanner variant="vertical" position="College Detail Sidebar" />
            <LeadCaptureForm
              variant="sidebar"
              title="Compare Colleges"
              subtitle="Not sure? Compare this with similar colleges"
              source="college_compare_sidebar"
            />
          </aside>
        </div>

        <div className="mt-10">
          <LeadCaptureForm
            variant="banner"
            title={`🎓 Want to get into ${college.name}? Get expert guidance!`}
            subtitle="Our counselors have helped thousands of students with admissions"
            source={`college_detail_bottom_${college.slug}`}
          />
        </div>
      </main>

      <Footer />
      <FloatingBot />
    </div>
  );
}
