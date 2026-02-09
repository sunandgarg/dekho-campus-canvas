import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { FixedCounsellingCTA } from "@/components/FixedCounsellingCTA";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { Calculator, Percent, IndianRupee, BarChart3, FileCheck, Heart, CalendarDays, Wallet, AlignLeft, Building2, ArrowRight } from "lucide-react";

const allTools = [
  { slug: "compare-colleges", title: "Compare Colleges", desc: "Side-by-side college comparison on fees, placements, and rankings.", icon: Building2 },
  { slug: "cgpa-converter", title: "CGPA/SGPA Converter", desc: "Convert CGPA or SGPA to percentage easily.", icon: Percent },
  { slug: "emi-calculator", title: "Education Loan EMI Calculator", desc: "Calculate your monthly EMI for education loans.", icon: IndianRupee },
  { slug: "rank-predictor", title: "Exam Rank Predictor", desc: "Get an estimated rank based on your expected score.", icon: BarChart3 },
  { slug: "eligibility-checker", title: "College Eligibility Checker", desc: "Check which colleges you're eligible for based on your academics.", icon: FileCheck },
  { slug: "bmi-calculator", title: "BMI Calculator", desc: "Calculate your Body Mass Index quickly.", icon: Heart },
  { slug: "percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentages, increases, and decreases.", icon: Calculator },
  { slug: "age-calculator", title: "Age Calculator", desc: "Calculate your exact age in years, months, and days.", icon: CalendarDays },
  { slug: "sip-calculator", title: "SIP Calculator", desc: "Plan your investments with Systematic Investment Plan calculator.", icon: Wallet },
  { slug: "word-counter", title: "Word & Character Counter", desc: "Count words, characters, sentences, and estimate reading time.", icon: AlignLeft },
];

export default function AllTools() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="tools" />
      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Tools" }]} />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Helpful Tools for Students</h1>
        <p className="text-muted-foreground mb-8">Quick utilities to make your education journey easier</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool) => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.slug}`}
              className="group bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{tool.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{tool.desc}</p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                Use Tool <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <FloatingBot />
      <FixedCounsellingCTA />
    </div>
  );
}
