import { motion } from "framer-motion";
import { Laptop, Globe, ArrowRight, Monitor, BookOpen, Award, Briefcase, TrendingUp, Users, Clock, Wifi, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const onlineFeatures = [
  { icon: Monitor, label: "Live Classes", desc: "Interactive sessions" },
  { icon: Clock, label: "Flexible Hours", desc: "Learn at your pace" },
  { icon: Award, label: "UGC Approved", desc: "Valid degrees" },
  { icon: Wifi, label: "100% Online", desc: "Learn anywhere" },
];

const onlineDegrees = [
  { name: "Online MBA", university: "Top B-Schools", fee: "₹1.5L - ₹6L", duration: "2 Years" },
  { name: "Online B.Tech", university: "AICTE Approved", fee: "₹1L - ₹3L", duration: "4 Years" },
  { name: "Online BCA", university: "UGC Approved", fee: "₹60K - ₹2L", duration: "3 Years" },
  { name: "Online MCA", university: "Top Universities", fee: "₹80K - ₹2.5L", duration: "2 Years" },
];

export function OnlineEducationSection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden" aria-labelledby="online-edu-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Online Degrees Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Header with animated corporate scene */}
            <div className="relative h-48 md:h-56 bg-gradient-to-br from-accent/20 via-accent/10 to-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="w-40 h-2 bg-accent/30 rounded-full mx-auto" />
                  <motion.div 
                    className="relative -mt-12 mx-auto"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-28 h-20 bg-gradient-to-b from-foreground/90 to-foreground/70 rounded-t-lg mx-auto flex items-center justify-center border-2 border-foreground/20">
                      <div className="w-24 h-16 bg-accent/20 rounded overflow-hidden p-1">
                        <motion.div className="space-y-1" animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                          <div className="h-1.5 w-full bg-accent/40 rounded" />
                          <div className="h-1.5 w-3/4 bg-primary/40 rounded" />
                          <div className="h-1.5 w-full bg-accent/30 rounded" />
                          <div className="h-3 w-8 bg-accent rounded-sm mx-auto mt-1" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="w-32 h-1.5 bg-foreground/60 rounded-b-lg mx-auto" />
                    <div className="w-16 h-1 bg-foreground/40 rounded-b mx-auto" />
                  </motion.div>
                  <motion.div className="absolute -top-24 left-1/2 -translate-x-1/2" animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                    <div className="w-10 h-10 rounded-full bg-accent/60 mx-auto" />
                    <div className="w-16 h-12 bg-accent/40 rounded-t-xl mx-auto -mt-2" />
                  </motion.div>
                </motion.div>
              </div>
              {[
                { icon: Briefcase, x: "15%", y: "20%", delay: 0 },
                { icon: TrendingUp, x: "80%", y: "15%", delay: 0.5 },
                { icon: GraduationCap, x: "10%", y: "70%", delay: 1 },
                { icon: Users, x: "85%", y: "65%", delay: 1.5 },
              ].map(({ icon: Icon, x, y, delay }) => (
                <motion.div key={`${x}-${y}`} className="absolute" style={{ left: x, top: y }} animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay }}>
                  <div className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-accent/20 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                </motion.div>
              ))}
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-accent text-accent-foreground">🔥 Trending</span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <h3 className="text-xl font-extrabold text-foreground mb-2">Online Degrees</h3>
              <p className="text-sm text-muted-foreground mb-4">
                UGC-approved online B.Tech, MBA, BCA & more from top universities. Study while you work!
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {onlineFeatures.map((f) => (
                  <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-xs font-medium text-accent">
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-5">
                {onlineDegrees.map((d) => (
                  <div key={d.name} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">{d.university} • {d.duration}</p>
                    </div>
                    <span className="text-xs font-bold text-accent">{d.fee}</span>
                  </div>
                ))}
              </div>
              <a href="https://online.dekhocampus.com" target="_blank" rel="noopener noreferrer">
                <Button className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                  Explore Online Degrees <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Study Abroad Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="relative h-48 md:h-56 bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="w-32 h-32 rounded-full border-2 border-primary/20 relative">
                  <div className="absolute inset-2 rounded-full border border-dashed border-primary/15" />
                  <div className="absolute inset-4 rounded-full border border-dashed border-primary/10" />
                  <div className="absolute inset-0 rounded-full border-l-2 border-r-2 border-primary/10" style={{ transform: "rotateY(45deg)" }} />
                </motion.div>
                {["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺"].map((flag, i) => (
                  <motion.div
                    key={flag}
                    className="absolute text-2xl"
                    animate={{
                      x: [Math.cos(i * Math.PI / 2) * 80, Math.cos(i * Math.PI / 2 + Math.PI * 2) * 80],
                      y: [Math.sin(i * Math.PI / 2) * 80, Math.sin(i * Math.PI / 2 + Math.PI * 2) * 80],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: i * 3 }}
                    style={{ left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }}
                  >
                    {flag}
                  </motion.div>
                ))}
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">🌍 Popular</span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <h3 className="text-xl font-extrabold text-foreground mb-2">Study Abroad</h3>
              <p className="text-sm text-muted-foreground mb-5">
                MS, MBA & Bachelors from top universities in US, UK, Canada, Australia & Germany
              </p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { flag: "🇺🇸", name: "USA", count: "2000+" },
                  { flag: "🇬🇧", name: "UK", count: "150+" },
                  { flag: "🇨🇦", name: "Canada", count: "300+" },
                  { flag: "🇦🇺", name: "Australia", count: "200+" },
                  { flag: "🇩🇪", name: "Germany", count: "400+" },
                  { flag: "🇳🇿", name: "NZ", count: "80+" },
                ].map((c) => (
                  <motion.div key={c.name} whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-muted/50 hover:bg-primary/5 cursor-pointer transition-colors">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-xs font-bold text-foreground">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.count}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {["SOP Review", "Visa Guidance", "IELTS Prep", "Scholarship Help"].map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary">{s}</span>
                ))}
              </div>
              <a href="https://abroad.dekhocampus.com" target="_blank" rel="noopener noreferrer">
                <Button className="w-full rounded-xl gradient-primary text-primary-foreground">
                  <Globe className="w-4 h-4 mr-2" />
                  Explore Study Abroad <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
