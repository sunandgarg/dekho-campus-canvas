import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, FileText, ClipboardList, Trophy, TrendingUp, Globe, Laptop, Calculator, Newspaper } from "lucide-react";

const quickLinks = [
  { icon: GraduationCap, label: "Top Colleges", href: "/colleges", color: "bg-blue-50 text-blue-600", iconBg: "bg-blue-100" },
  { icon: BookOpen, label: "Courses", href: "/courses", color: "bg-emerald-50 text-emerald-600", iconBg: "bg-emerald-100" },
  { icon: FileText, label: "Exams", href: "/exams", color: "bg-orange-50 text-orange-600", iconBg: "bg-orange-100" },
  { icon: ClipboardList, label: "Apply Now", href: "/colleges", color: "bg-purple-50 text-purple-600", iconBg: "bg-purple-100" },
  { icon: Trophy, label: "Rankings", href: "/colleges", color: "bg-amber-50 text-amber-600", iconBg: "bg-amber-100" },
  { icon: TrendingUp, label: "Trending", href: "/articles", color: "bg-rose-50 text-rose-600", iconBg: "bg-rose-100" },
  { icon: Globe, label: "Study Abroad", href: "#", color: "bg-cyan-50 text-cyan-600", iconBg: "bg-cyan-100" },
  { icon: Laptop, label: "Online Degrees", href: "#", color: "bg-indigo-50 text-indigo-600", iconBg: "bg-indigo-100" },
  { icon: Calculator, label: "Tools", href: "/tools", color: "bg-teal-50 text-teal-600", iconBg: "bg-teal-100" },
  { icon: Newspaper, label: "News", href: "/articles", color: "bg-pink-50 text-pink-600", iconBg: "bg-pink-100" },
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
              <Link
                to={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-transparent hover:border-border hover:shadow-sm transition-all ${link.color}`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
