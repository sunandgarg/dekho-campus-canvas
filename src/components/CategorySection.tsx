import { motion } from "framer-motion";
import { useState } from "react";
import { Star, MapPin, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Engineering",
  "Management",
  "Information Technology",
  "Commerce & Banking",
  "Law",
  "Science",
  "Medical",
  "Design",
  "Arts & Humanities",
];

const colleges = [
  { rank: 1, name: "IIT Delhi", location: "Delhi", rating: 4.8, courses: "50+ Courses", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" },
  { rank: 2, name: "IIT Bombay", location: "Mumbai", rating: 4.9, courses: "45+ Courses", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop" },
  { rank: 3, name: "BITS Pilani", location: "Pilani", rating: 4.7, courses: "40+ Courses", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" },
  { rank: 4, name: "NIT Trichy", location: "Trichy", rating: 4.6, courses: "35+ Courses", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop" },
];

const courses = [
  { name: "B.Tech Computer Science", colleges: "1200+", salary: "₹8-15 LPA" },
  { name: "B.Tech Mechanical", colleges: "1100+", salary: "₹6-12 LPA" },
  { name: "B.Tech Electrical", colleges: "950+", salary: "₹7-13 LPA" },
  { name: "B.Tech Civil", colleges: "800+", salary: "₹5-10 LPA" },
];

const exams = [
  { name: "JEE Main", date: "Apr 2026", type: "National" },
  { name: "JEE Advanced", date: "May 2026", type: "National" },
  { name: "BITSAT", date: "May 2026", type: "University" },
  { name: "VITEEE", date: "Apr 2026", type: "University" },
];

export function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("Engineering");

  return (
    <section className="py-20 bg-warm">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-accent text-accent">
            Explore by Category
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Find Your Path
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse top colleges, popular courses, and entrance exams by category
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "accent" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Colleges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Top Colleges</h3>
              <span className="text-sm text-muted-foreground">Best institutions for you</span>
            </div>
            <div className="space-y-4">
              {colleges.map((college) => (
                <div
                  key={college.rank}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-accent">
                    {college.rank}
                  </span>
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{college.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{college.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-foreground">{college.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{college.courses}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary">
              View All Colleges <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* Popular Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Popular Courses</h3>
              <span className="text-sm text-muted-foreground">Trending programs</span>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.name}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <h4 className="font-semibold text-foreground mb-2">{course.name}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{course.colleges}</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {course.salary}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary">
              View All Courses <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* Entrance Exams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Entrance Exams</h3>
              <span className="text-sm text-muted-foreground">Upcoming examinations</span>
            </div>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">{exam.name}</h4>
                    <span className="text-sm text-muted-foreground">{exam.date}</span>
                  </div>
                  <Badge variant="outline" className="border-accent/30 text-accent">
                    {exam.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary">
              View All Exams <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
