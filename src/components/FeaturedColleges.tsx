import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, GraduationCap, Calendar, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { colleges } from "@/data/colleges";

const topColleges = colleges.slice(0, 6);

export function FeaturedColleges() {
  return (
    <section className="py-10 md:py-16 bg-background" aria-labelledby="featured-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-3">
              <GraduationCap className="w-4 h-4" />
              Featured Institutions
            </div>
            <h2 id="featured-heading" className="text-headline font-bold text-foreground">
              Top Ranked <span className="text-gradient-accent">Colleges</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Explore India's most prestigious institutions with world-class placements
            </p>
          </div>
          <Link to="/colleges">
            <Button variant="outline" className="self-start md:self-auto rounded-xl border-amber-200 hover:bg-amber-50">
              Explore All Colleges
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {topColleges.map((college, index) => (
              <motion.article
                key={college.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group bg-card rounded-2xl border border-amber-100 overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <Badge className="absolute top-3 left-3 bg-foreground/80 text-background border-0 text-xs">
                    {college.type}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{college.shortName}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{college.name}, {college.location.split(",")[0]}</p>
                  </div>

                  {/* Rating & Location */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(college.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{college.rating}/5</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {college.location.split(",")[0]}
                    </span>
                  </div>

                  {/* Approvals */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground text-xs">Approvals:</span>
                    <div className="flex gap-1">
                      {college.approvals.slice(0, 3).map((a) => (
                        <Badge key={a} variant="outline" className="text-[10px] px-1.5 py-0 font-semibold">{a}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Established & NAAC */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Est. {college.established}</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> NAAC {college.naacGrade}</span>
                  </div>

                  {/* CTA */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link to={`/colleges/${college.slug}`}>
                      <Button variant="outline" size="sm" className="w-full rounded-xl text-xs h-9">Know More</Button>
                    </Link>
                    <Button size="sm" className="w-full rounded-xl text-xs h-9 gradient-accent text-white border-0">Apply Now</Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="space-y-6">
            <LeadCaptureForm variant="sidebar" title="Need Help?" subtitle="Get expert guidance" source="colleges_sidebar" />
            <DynamicAdBanner variant="vertical" position="sidebar" />
          </div>
        </div>

        <div className="mt-10">
          <DynamicAdBanner variant="horizontal" position="mid-page" />
        </div>
      </div>
    </section>
  );
}
