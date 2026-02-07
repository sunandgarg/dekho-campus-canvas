import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  {
    name: "IIM Ahmedabad",
    shortName: "IIMA",
    location: "Gujarat",
    rating: 4.9,
    reviews: 1800,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop",
    tags: ["#1 MBA", "Government"],
    avgPackage: "₹32 LPA",
    topRecruiter: "McKinsey, BCG",
    ranking: 4,
  },
];

export function FeaturedColleges() {
  return (
    <section className="py-20 bg-background" aria-labelledby="featured-heading">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <Badge className="mb-4 badge-gradient">Featured</Badge>
            <h2 id="featured-heading" className="text-headline font-bold text-foreground">
              Top Ranked <span className="text-gradient">Institutions</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Explore India's most prestigious colleges with world-class placements
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto rounded-xl">
            Explore All Colleges
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredColleges.map((college, index) => (
            <motion.article
              key={college.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group card-interactive overflow-hidden"
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
                  <Badge className="badge-gradient">
                    #{college.ranking} Rank
                  </Badge>
                </div>
                
                {/* Wishlist button */}
                <button
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
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
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-muted">
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      <TrendingUp className="w-4 h-4 text-success" />
                      {college.avgPackage}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Package</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted">
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      <Star className="w-4 h-4 text-golden fill-golden" />
                      {college.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">{college.reviews} reviews</div>
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
      </div>
    </section>
  );
}
