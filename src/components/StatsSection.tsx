import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Award, TrendingUp, Sparkles } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "5,000+", label: "Partner Colleges", color: "from-primary to-electric-purple" },
  { icon: BookOpen, value: "10,000+", label: "Courses Available", color: "from-accent to-golden" },
  { icon: Users, value: "1M+", label: "Students Guided", color: "from-mint to-primary" },
  { icon: Award, value: "500+", label: "Entrance Exams", color: "from-pink to-accent" },
  { icon: TrendingUp, value: "95%", label: "Success Rate", color: "from-golden to-accent" },
  { icon: Sparkles, value: "24/7", label: "AI Support", color: "from-electric-purple to-pink" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-background relative overflow-hidden" aria-label="Platform statistics">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-headline font-bold text-foreground">
            Trusted by <span className="text-gradient">Millions</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            India's most comprehensive education platform
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-5 text-center group"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
