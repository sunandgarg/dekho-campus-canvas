import { motion } from "framer-motion";
import { GraduationCap, Calendar, Download, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Program {
  college: string;
  title: string;
  badge: string;
  badgeColor: string;
  type: string;
  duration: string;
  originalPrice: number;
  discount: number;
  slug: string;
  courseSlug: string;
  logo?: string;
}

const programs: Program[] = [
  {
    college: "IIT Madras",
    title: "BS in Data Science & Applications",
    badge: "Bestseller",
    badgeColor: "bg-destructive text-destructive-foreground",
    type: "Bachelor's Degree",
    duration: "36 Months",
    originalPrice: 300000,
    discount: 15,
    slug: "iit-madras",
    courseSlug: "bsc-data-science",
  },
  {
    college: "IIM Bangalore",
    title: "Executive PG Programme in Management",
    badge: "New",
    badgeColor: "bg-primary text-primary-foreground",
    type: "Executive PG Program",
    duration: "12 Months",
    originalPrice: 1200000,
    discount: 10,
    slug: "iim-bangalore",
    courseSlug: "mba",
  },
  {
    college: "IIT Bombay",
    title: "M.Tech in AI & Machine Learning",
    badge: "Trending",
    badgeColor: "bg-accent text-accent-foreground",
    type: "Master's Degree",
    duration: "24 Months",
    originalPrice: 500000,
    discount: 12,
    slug: "iit-bombay",
    courseSlug: "mtech-ai",
  },
  {
    college: "IIM Ahmedabad",
    title: "Certificate in Business Analytics",
    badge: "Popular",
    badgeColor: "bg-primary text-primary-foreground",
    type: "Certification",
    duration: "6 Months",
    originalPrice: 250000,
    discount: 20,
    slug: "iim-ahmedabad",
    courseSlug: "business-analytics",
  },
];

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price}`;
}

export function TrendingPrograms() {
  return (
    <section className="py-10 md:py-14" aria-labelledby="trending-programs-heading">
      <div className="mb-6 md:mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-1">Trending Courses</p>
        <h2 id="trending-programs-heading" className="text-headline font-bold text-foreground">
          Explore our <span className="text-destructive">most popular programs</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {programs.map((prog, i) => {
          const discountedPrice = prog.originalPrice * (1 - prog.discount / 100);
          return (
            <motion.article
              key={prog.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-5 flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* College + Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-foreground/60" />
                </div>
                <Badge className={`${prog.badgeColor} text-[10px] font-bold px-2`}>{prog.badge}</Badge>
              </div>

              <p className="text-xs text-muted-foreground font-medium mb-1">{prog.college}</p>
              <h3 className="text-sm font-bold text-foreground mb-3 line-clamp-2 min-h-[2.5rem]">{prog.title}</h3>

              {/* Tags */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{prog.type}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{prog.duration}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-muted-foreground">{formatPrice(prog.originalPrice)}</span>
                  <Badge variant="outline" className="text-destructive border-destructive/30 text-[10px]">{prog.discount}% OFF</Badge>
                </div>
                <p className="text-lg font-bold text-foreground">{formatPrice(discountedPrice)} <span className="text-xs font-normal text-muted-foreground">only on DekhoCampus</span></p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Link to={`/colleges/${prog.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl h-9 text-xs">View Program</Button>
                </Link>
                <Button className="rounded-xl h-9 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3">
                  <Download className="w-3.5 h-3.5 mr-1" /> Syllabus
                </Button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
