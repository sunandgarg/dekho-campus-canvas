import { motion } from "framer-motion";
import { useState } from "react";
import { Star, MapPin, ArrowRight, Clock, Users, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "engineering", label: "Engineering", emoji: "⚡" },
  { id: "medical", label: "Medical", emoji: "🏥" },
  { id: "management", label: "Management", emoji: "📊" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "law", label: "Law", emoji: "⚖️" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "arts", label: "Arts", emoji: "🎭" },
  { id: "commerce", label: "Commerce", emoji: "💼" },
];

const colleges = [
  { 
    rank: 1, 
    name: "IIT Delhi", 
    location: "New Delhi",
    rating: 4.9,
    reviews: 2500,
    courses: "50+ Courses",
    fees: "₹2.5L/year",
    placement: "₹25 LPA avg",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
    tags: ["NIRF #1", "Govt"],
  },
  { 
    rank: 2, 
    name: "IIT Bombay", 
    location: "Mumbai",
    rating: 4.9,
    reviews: 2200,
    courses: "45+ Courses",
    fees: "₹2.5L/year",
    placement: "₹28 LPA avg",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    tags: ["NIRF #2", "Govt"],
  },
  { 
    rank: 3, 
    name: "BITS Pilani", 
    location: "Rajasthan",
    rating: 4.8,
    reviews: 3200,
    courses: "40+ Courses",
    fees: "₹5L/year",
    placement: "₹18 LPA avg",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop",
    tags: ["Private", "Top 10"],
  },
  { 
    rank: 4, 
    name: "NIT Trichy", 
    location: "Tamil Nadu",
    rating: 4.7,
    reviews: 1800,
    courses: "35+ Courses",
    fees: "₹1.5L/year",
    placement: "₹15 LPA avg",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop",
    tags: ["NIT #1", "Govt"],
  },
];

const courses = [
  { name: "B.Tech Computer Science", colleges: 1200, avgSalary: "₹12 LPA", growth: "+25%" },
  { name: "B.Tech AI & ML", colleges: 450, avgSalary: "₹15 LPA", growth: "+45%" },
  { name: "B.Tech Electronics", colleges: 980, avgSalary: "₹10 LPA", growth: "+18%" },
  { name: "B.Tech Mechanical", colleges: 1100, avgSalary: "₹8 LPA", growth: "+12%" },
];

const exams = [
  { name: "JEE Main 2026", date: "April 2026", applicants: "15L+", type: "National" },
  { name: "JEE Advanced 2026", date: "May 2026", applicants: "2.5L+", type: "National" },
  { name: "BITSAT 2026", date: "May 2026", applicants: "3L+", type: "University" },
  { name: "VITEEE 2026", date: "April 2026", applicants: "2L+", type: "University" },
];

export function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("engineering");

  return (
    <section className="py-20 bg-muted/30" aria-labelledby="explore-heading">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 badge-gradient">Explore by Category</Badge>
          <h2 id="explore-heading" className="text-headline font-bold text-foreground">
            Find Your <span className="text-gradient">Perfect Path</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse 5000+ colleges, 10000+ courses, and 500+ entrance exams across all fields
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide"
          role="tablist"
          aria-label="Education categories"
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap flex-shrink-0 rounded-xl gap-2 ${
                activeCategory === cat.id ? "gradient-primary" : ""
              }`}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Colleges */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Top Colleges</h3>
                <p className="text-sm text-muted-foreground">Based on NIRF rankings</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {colleges.map((college) => (
                <div
                  key={college.rank}
                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    #{college.rank}
                  </div>
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-14 h-14 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {college.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{college.location}</span>
                      <span>•</span>
                      <span>{college.courses}</span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-golden fill-golden" />
                      <span className="font-semibold text-foreground">{college.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{college.placement}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Popular Courses */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Trending Courses</h3>
                <p className="text-sm text-muted-foreground">High demand programs</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.name}
                  className="group p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {course.name}
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.colleges}+ colleges
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/30">
                        {course.growth}
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {course.avgSalary}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Upcoming Exams */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Upcoming Exams</h3>
                <p className="text-sm text-muted-foreground">Don't miss deadlines!</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer"
                >
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {exam.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{exam.date}</span>
                      <span>•</span>
                      <span>{exam.applicants} applicants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-accent/30 text-accent">
                      {exam.type}
                    </Badge>
                    <Button size="icon" variant="ghost" className="w-8 h-8">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
