import { motion } from "framer-motion";
import { Star, ArrowRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featuredColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi",
    rating: 4.8,
    reviews: 2500,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
    tags: ["NIRF Top 10", "Government"],
    deadline: "Applications Open",
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    location: "Ahmedabad, Gujarat",
    rating: 4.9,
    reviews: 1800,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
    tags: ["Top MBA", "Government"],
    deadline: "Closing Soon",
  },
  {
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    rating: 4.7,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop",
    tags: ["Private", "Deemed University"],
    deadline: "Applications Open",
  },
  {
    name: "Delhi University",
    location: "Delhi",
    rating: 4.5,
    reviews: 5600,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop",
    tags: ["Central University", "Government"],
    deadline: "Coming Soon",
  },
];

export function FeaturedColleges() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              Featured
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Top Ranked Colleges
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore India's best educational institutions
            </p>
          </div>
          <Button variant="outline" className="self-start sm:self-auto">
            View All Colleges
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* College Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredColleges.map((college, index) => (
            <motion.div
              key={college.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border card-hover"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={college.image}
                  alt={college.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {college.tags.slice(0, 1).map((tag) => (
                    <Badge key={tag} className="bg-primary/90 text-primary-foreground text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {college.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{college.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold text-foreground">{college.rating}</span>
                    <span className="text-xs text-muted-foreground">({college.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{college.deadline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
