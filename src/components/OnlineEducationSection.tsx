import { motion } from "framer-motion";
import { Laptop, Globe, ArrowRight, Monitor, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const options = [
  {
    icon: Laptop,
    title: "Online Degrees",
    desc: "UGC-approved online B.Tech, MBA, BCA & more from top universities",
    tag: "Trending",
    color: "from-accent to-accent/70",
  },
  {
    icon: Globe,
    title: "Study Abroad Programs",
    desc: "MS, MBA & Bachelors from US, UK, Canada, Australia, Germany",
    tag: "Popular",
    color: "from-primary to-primary/70",
  },
];

const onlineFeatures = [
  { icon: Monitor, label: "Live Classes" },
  { icon: BookOpen, label: "Flexible Schedule" },
  { icon: Award, label: "UGC Approved" },
];

export function OnlineEducationSection() {
  return (
    <section className="py-10 md:py-14" aria-labelledby="online-edu-heading">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-primary/10 text-primary">{opt.tag}</span>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <opt.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{opt.title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{opt.desc}</p>
              
              {opt.title === "Online Degrees" && (
                <div className="flex gap-4 mb-5">
                  {onlineFeatures.map((f) => (
                    <div key={f.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <f.icon className="w-3.5 h-3.5 text-primary" />
                      {f.label}
                    </div>
                  ))}
                </div>
              )}

              <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 group-hover:border-primary">
                Explore Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
