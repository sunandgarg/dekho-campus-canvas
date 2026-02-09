import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDbColleges } from "@/hooks/useCollegesData";
import { useFeaturedColleges } from "@/hooks/useFeaturedColleges";

export function TopRankedColleges() {
  const { data: featuredSlugs } = useFeaturedColleges();
  const { data: allColleges } = useDbColleges();

  // If we have featured slugs from backend, use those; otherwise fallback to top-rated
  const colleges = (() => {
    if (!allColleges?.length) return [];
    if (featuredSlugs?.length) {
      return featuredSlugs
        .map((slug) => allColleges.find((c) => c.slug === slug))
        .filter(Boolean)
        .slice(0, 8);
    }
    return [...allColleges].sort((a, b) => b.rating - a.rating).slice(0, 8);
  })();

  if (!colleges.length) return null;

  return (
    <section className="py-10 md:py-14 bg-background" aria-labelledby="top-colleges-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <Trophy className="w-4 h-4" />
              Top Ranked
            </div>
            <h2 id="top-colleges-heading" className="text-headline font-bold text-foreground">
              Top Ranked <span className="text-gradient">Colleges</span>
            </h2>
            <p className="text-muted-foreground mt-1">Handpicked top institutions from across India</p>
          </div>
          <Link to="/colleges">
            <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {colleges.map((college: any, index: number) => (
            <motion.div
              key={college.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/colleges/${college.slug}`}
                className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 left-2 bg-foreground/70 text-background border-0 text-[10px]">
                    {college.type}
                  </Badge>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-bold text-foreground text-sm line-clamp-1">{college.short_name || college.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{college.city || college.location?.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(college.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{college.rating}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
