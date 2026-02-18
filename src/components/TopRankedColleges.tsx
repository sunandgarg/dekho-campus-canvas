import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDbColleges } from "@/hooks/useCollegesData";
import { useFeaturedColleges } from "@/hooks/useFeaturedColleges";
import { useRef, useState } from "react";

export function TopRankedColleges() {
  const { data: featuredSlugs } = useFeaturedColleges();
  const { data: allColleges } = useDbColleges();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="py-8 md:py-12 bg-background" aria-labelledby="top-colleges-heading">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <GraduationCap className="w-4 h-4" />
              Featured Institutions
            </div>
            <h2 id="top-colleges-heading" className="text-headline font-bold text-foreground">
              <span className="text-gradient">Featured</span> Colleges
            </h2>
            <p className="text-muted-foreground mt-1">Handpicked top institutions from across India</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full w-9 h-9" onClick={() => scroll("left")} disabled={!canScrollLeft} aria-label="Scroll colleges left">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-9 h-9" onClick={() => scroll("right")} disabled={!canScrollRight} aria-label="Scroll colleges right">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Link to="/colleges">
              <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 overscroll-x-contain touch-pan-x"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {colleges.map((college: any, index: number) => (
            <div
              key={college.slug}
              className="snap-start flex-shrink-0 w-[260px] sm:w-[280px]"
            >
              <Link
                to={`/colleges/${college.slug}`}
                className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col"
              >
                <div className="relative h-36 overflow-hidden flex-shrink-0">
                  <img
                    src={college.image}
                    alt={college.name}
                    width={280}
                    height={144}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
