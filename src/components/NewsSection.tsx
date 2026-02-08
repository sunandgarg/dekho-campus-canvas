import { motion } from "framer-motion";
import { Clock, ArrowRight, TrendingUp, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";

const newsItems = [
  {
    category: "Admissions",
    title: "JEE Main 2026 Session 2 Registration Opens — Last Date April 15",
    excerpt: "NTA has started the registration process for JEE Main 2026 Session 2. Students can apply online through the official website.",
    date: "Feb 6, 2026",
    trending: true,
    image: "📋",
  },
  {
    category: "Results",
    title: "CBSE Board 12th Results Expected by May 2026",
    excerpt: "CBSE is expected to announce Class 12 results by the third week of May. Students can check results online.",
    date: "Feb 5, 2026",
    trending: true,
    image: "📊",
  },
  {
    category: "Scholarships",
    title: "PM Vidyalaxmi Scheme: 10 Lakh Scholarships for Meritorious Students",
    excerpt: "Government launches new scholarship scheme covering tuition fees for students from families with income below ₹8 LPA.",
    date: "Feb 4, 2026",
    trending: false,
    image: "🎓",
  },
  {
    category: "Exam Updates",
    title: "NEET UG 2026: NTA Confirms Single-Day Exam in Pen & Paper Mode",
    excerpt: "NTA has confirmed that NEET UG 2026 will be conducted in a single day across all centers in offline mode.",
    date: "Feb 3, 2026",
    trending: true,
    image: "🏥",
  },
  {
    category: "Rankings",
    title: "NIRF 2026 Rankings Released — IIT Madras Tops Engineering Again",
    excerpt: "Ministry of Education releases NIRF 2026 rankings. IIT Madras retains top position in engineering for the 8th consecutive year.",
    date: "Feb 2, 2026",
    trending: false,
    image: "🏆",
  },
  {
    category: "New Courses",
    title: "IITs to Launch B.Tech in AI & Robotics from Academic Year 2026-27",
    excerpt: "Five IITs announce new B.Tech programs in Artificial Intelligence & Robotics with 60 seats each.",
    date: "Feb 1, 2026",
    trending: false,
    image: "🤖",
  },
];

const categoryColors: Record<string, string> = {
  Admissions: "bg-primary/10 text-primary",
  Results: "bg-success/10 text-success",
  Scholarships: "bg-warning/10 text-warning-foreground",
  "Exam Updates": "bg-accent/10 text-accent",
  Rankings: "bg-secondary text-secondary-foreground",
  "New Courses": "bg-muted text-muted-foreground",
};

export function NewsSection() {
  return (
    <section className="py-16 bg-muted/30" aria-label="Latest Education News">
      <div className="container">
        {/* Leaderboard Ad at top */}
        <div className="mb-8">
          <AdBanner variant="leaderboard" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Latest News</span>
            </div>
            <h2 className="text-headline font-extrabold text-foreground">
              Education News & Updates
            </h2>
            <p className="text-muted-foreground mt-1">Stay updated with the latest in Indian education</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary font-semibold hover:underline">
            View All News <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Featured News */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 card-elevated p-6 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{newsItems[0].image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className={categoryColors[newsItems[0].category]}>
                        {newsItems[0].category}
                      </Badge>
                      {newsItems[0].trending && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          <TrendingUp className="w-3 h-3 mr-1" /> Trending
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {newsItems[0].title}
                    </h3>
                    <p className="text-muted-foreground mb-3">{newsItems[0].excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{newsItems[0].date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Side news list */}
              <div className="space-y-4">
                {newsItems.slice(1, 4).map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card-elevated p-4 group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className={`text-xs mb-1 ${categoryColors[item.category]}`}>
                          {item.category}
                        </Badge>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.date}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsItems.slice(3).map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-elevated p-4 group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.image}</span>
                    <Badge variant="secondary" className={`text-xs ${categoryColors[item.category]}`}>
                      {item.category}
                    </Badge>
                    {item.trending && (
                      <TrendingUp className="w-3 h-3 text-accent" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LeadCaptureForm
              variant="sidebar"
              title="Get Exam Alerts"
              subtitle="Never miss important dates"
              source="news_sidebar"
            />
            <AdBanner variant="square" position="Sponsored" className="hidden lg:flex" />
          </div>
        </div>
      </div>
    </section>
  );
}