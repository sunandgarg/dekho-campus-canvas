import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calculator, Percent, IndianRupee, BarChart3, FileCheck, Heart, CalendarDays, Wallet, AlignLeft, Building2, ArrowRight } from "lucide-react";

const tools = [
  { title: "Compare Colleges", desc: "Side-by-side comparison", icon: Building2, slug: "compare-colleges" },
  { title: "CGPA Converter", desc: "SGPA/CGPA to Percentage", icon: Percent, slug: "cgpa-converter" },
  { title: "EMI Calculator", desc: "Education loan EMI planner", icon: IndianRupee, slug: "emi-calculator" },
  { title: "Rank Predictor", desc: "Predict your rank from score", icon: BarChart3, slug: "rank-predictor" },
  { title: "Eligibility Checker", desc: "Check college eligibility", icon: FileCheck, slug: "eligibility-checker" },
  { title: "BMI Calculator", desc: "Check your body mass index", icon: Heart, slug: "bmi-calculator" },
  { title: "Percentage Calc", desc: "Calculate any percentage", icon: Calculator, slug: "percentage-calculator" },
  { title: "Age Calculator", desc: "Calculate exact age from DOB", icon: CalendarDays, slug: "age-calculator" },
  { title: "SIP Calculator", desc: "Plan your investments", icon: Wallet, slug: "sip-calculator" },
  { title: "Word Counter", desc: "Count words & characters", icon: AlignLeft, slug: "word-counter" },
];

export function ToolsSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/20" aria-labelledby="tools-heading">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
            <Calculator className="w-4 h-4" />
            Smart Toolkit
          </div>
          <h2 id="tools-heading" className="text-headline font-bold text-foreground">
            Helpful <span className="text-gradient-accent">Tools</span> for You
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">Quick utilities to make your education journey easier</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/tools/${tool.slug}`}
                className="group flex flex-col items-center text-center p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:border-primary/30 transition-all h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5 group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            View All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
