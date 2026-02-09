import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Shield, Download, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DbCollege } from "@/hooks/useCollegesData";

interface CollegeCardProps {
  college: DbCollege;
  index: number;
}

export function CollegeCard({ college, index }: CollegeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <article className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-48">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <Badge className="absolute top-3 left-3 bg-foreground/80 text-background border-0 text-xs">
            {college.type}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{college.short_name}</h2>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {college.name}, {college.location.split(",")[0]}
            </p>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(college.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">{college.rating}/5</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {college.city || college.location}
            </span>
          </div>

          {/* Approvals */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Approvals:</span>
            <div className="flex gap-1.5">
              {college.approvals.slice(0, 3).map((a) => (
                <Badge key={a} variant="outline" className="text-xs px-1.5 py-0.5 font-semibold">
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          {/* Established & NAAC */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Established {college.established}
            </span>
            {college.naac_grade && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                NAAC {college.naac_grade}
              </span>
            )}
          </div>

          {/* Brochure Button */}
          <Button variant="outline" className="w-full rounded-xl gap-2 h-10 text-sm border-primary/30 text-primary hover:bg-primary/5">
            <Download className="w-4 h-4" />
            Download Brochure
          </Button>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link to={`/colleges/${college.slug}`}>
              <Button variant="outline" className="w-full rounded-xl h-10 text-sm">
                Know More
              </Button>
            </Link>
            <Button className="w-full rounded-xl h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 border-0">
              Apply Now
            </Button>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
