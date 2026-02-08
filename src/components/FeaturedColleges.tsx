import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, TrendingUp, Heart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AdBanner } from "@/components/AdBanner";

const featuredColleges = [
  {
    name: "IIT Delhi",
    shortName: "IITD",
    location: "New Delhi",
    rating: 4.9,
    reviews: 2500,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
    tags: ["NIRF #1", "Government"],
    avgPackage: "₹25 LPA",
    topRecruiter: "Google, Microsoft",
    ranking: 1,
  },
  {
    name: "IIT Bombay",
    shortName: "IITB",
    location: "Mumbai",
    rating: 4.9,
    reviews: 2200,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
    tags: ["NIRF #2", "Government"],
    avgPackage: "₹28 LPA",
    topRecruiter: "Apple, Amazon",
    ranking: 2,
  },
  {
    name: "BITS Pilani",
    shortName: "BITS",
    location: "Rajasthan",
    rating: 4.8,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop",
    tags: ["Private", "Top 10"],
    avgPackage: "₹18 LPA",
    topRecruiter: "Meta, Uber",
    ranking: 3,
  },
];

export function FeaturedColleges() {
  return (
    <section className="py-16 bg-background" aria-labelledby="featured-heading">
      <div className="container">
        {/* Header */}
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
          <Button variant="outline" className="self-start md:self-auto rounded-xl border-amber-200 hover:bg-amber-50">
            Explore All Colleges
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Main content grid with sidebar */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* College cards - 3 columns */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredColleges.map((college, index) => (
              <motion.article
                key={college.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl border border-amber-100 overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  
                  {/* Ranking badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-primary-foreground border-0">
                      #{college.ranking} Rank
                    </Badge>
                  </div>
                  
                  {/* Wishlist button */}
                  <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* College name overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-primary-foreground drop-shadow-lg">
                      {college.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-primary-foreground/90">
                      <MapPin className="w-3 h-3" />
                      <span>{college.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {college.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-success/10">
                      <div className="flex items-center gap-1 text-sm font-semibold text-success">
                        <TrendingUp className="w-4 h-4" />
                        {college.avgPackage}
                      </div>
                      <div className="text-xs text-success/80">Avg Package</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50">
                      <div className="flex items-center gap-1 text-sm font-semibold text-amber-700">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {college.rating}
                      </div>
                      <div className="text-xs text-amber-600/80">{college.reviews} reviews</div>
                    </div>
                  </div>

                  {/* Top Recruiters */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Top Recruiters: </span>
                    <span className="font-medium text-foreground">{college.topRecruiter}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Sidebar - Lead form + Ad */}
          <div className="space-y-6">
            <LeadCaptureForm
              variant="sidebar"
              title="Need Help?"
              subtitle="Get expert guidance"
              source="colleges_sidebar"
            />
            <AdBanner variant="vertical" position="Sponsored" />
          </div>
        </div>

        {/* Horizontal Ad banner below */}
        <div className="mt-10">
          <AdBanner variant="horizontal" position="Ad" />
        </div>
      </div>
    </section>
  );
}