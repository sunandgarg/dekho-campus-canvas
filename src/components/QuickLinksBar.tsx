import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, FileText, ClipboardList, Trophy, TrendingUp, Globe, Laptop, Calculator, Newspaper } from "lucide-react";

const quickLinks = [
  { icon: GraduationCap, label: "Top Colleges", href: "/colleges", color: "bg-primary/5 text-primary", iconBg: "bg-primary/10" },
  { icon: BookOpen, label: "Courses", href: "/courses", color: "bg-accent/5 text-accent", iconBg: "bg-accent/10" },
  { icon: FileText, label: "Exams", href: "/exams", color: "bg-muted text-foreground", iconBg: "bg-secondary" },
  { icon: ClipboardList, label: "Apply Now", href: "/colleges", color: "bg-primary/5 text-primary", iconBg: "bg-primary/10" },
  { icon: Trophy, label: "Rankings", href: "/colleges", color: "bg-accent/5 text-accent", iconBg: "bg-accent/10" },
  { icon: TrendingUp, label: "Trending", href: "/articles", color: "bg-muted text-foreground", iconBg: "bg-secondary" },
  { icon: Globe, label: "Study Abroad", href: "https://abroad.dekhocampus.com", color: "bg-primary/5 text-primary", iconBg: "bg-primary/10" },
  { icon: Laptop, label: "Online Degrees", href: "https://online.dekhocampus.com", color: "bg-accent/5 text-accent", iconBg: "bg-accent/10" },
  { icon: Calculator, label: "Tools", href: "/tools", color: "bg-muted text-foreground", iconBg: "bg-secondary" },
  { icon: Newspaper, label: "News", href: "/articles", color: "bg-primary/5 text-primary", iconBg: "bg-primary/10" },
];

export function QuickLinksBar() {
  return (
    <section className="py-4 border-b border-border bg-card/50" aria-label="Quick Links">
      <div className="container">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
            {link.href.startsWith("http") ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-transparent hover:border-border hover:shadow-sm transition-all ${link.color}`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-transparent hover:border-border hover:shadow-sm transition-all ${link.color}`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
