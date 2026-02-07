import { motion } from "framer-motion";
import { GraduationCap, Users, Building2, Award } from "lucide-react";

const stats = [
  { icon: Building2, value: "5,000+", label: "Partner Colleges", color: "text-primary" },
  { icon: GraduationCap, value: "10,000+", label: "Courses Available", color: "text-accent" },
  { icon: Users, value: "1M+", label: "Students Guided", color: "text-primary" },
  { icon: Award, value: "500+", label: "Entrance Exams", color: "text-accent" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl stats-gradient border border-border"
            >
              <div className={`inline-flex p-3 rounded-xl bg-muted mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
