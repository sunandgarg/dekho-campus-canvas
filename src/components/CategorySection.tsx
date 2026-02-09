import { motion } from "framer-motion";
import { useState } from "react";
import { Star, MapPin, ArrowRight, Clock, Users, Bookmark, TrendingUp, GraduationCap, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

const categoryData: Record<string, { colleges: any[]; courses: any[]; exams: any[] }> = {
  engineering: {
    colleges: [
      { rank: 1, name: "IIT Delhi", location: "New Delhi", rating: 4.9, courses: "50+ Courses", placement: "₹25 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" },
      { rank: 2, name: "IIT Bombay", location: "Mumbai", rating: 4.9, courses: "45+ Courses", placement: "₹28 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop" },
      { rank: 3, name: "IIT Kanpur", location: "Uttar Pradesh", rating: 4.8, courses: "42+ Courses", placement: "₹22 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" },
      { rank: 4, name: "NIT Trichy", location: "Tamil Nadu", rating: 4.7, courses: "35+ Courses", placement: "₹15 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "B.Tech Computer Science", colleges: 1200, avgSalary: "₹12 LPA", growth: "+25%" },
      { name: "B.Tech AI & Machine Learning", colleges: 450, avgSalary: "₹15 LPA", growth: "+45%" },
      { name: "B.Tech Electronics & Comm.", colleges: 980, avgSalary: "₹10 LPA", growth: "+18%" },
      { name: "B.Tech Mechanical Engineering", colleges: 1100, avgSalary: "₹8 LPA", growth: "+12%" },
    ],
    exams: [
      { name: "JEE Main 2026", date: "April 2026", applicants: "15L+", type: "National" },
      { name: "JEE Advanced 2026", date: "May 2026", applicants: "2.5L+", type: "National" },
      { name: "BITSAT 2026", date: "May 2026", applicants: "3L+", type: "University" },
      { name: "VITEEE 2026", date: "April 2026", applicants: "2L+", type: "University" },
    ],
  },
  medical: {
    colleges: [
      { rank: 1, name: "AIIMS Delhi", location: "New Delhi", rating: 4.9, courses: "25+ Courses", placement: "₹15 LPA avg", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop" },
      { rank: 2, name: "JIPMER", location: "Puducherry", rating: 4.8, courses: "20+ Courses", placement: "₹12 LPA avg", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop" },
      { rank: 3, name: "CMC Vellore", location: "Tamil Nadu", rating: 4.8, courses: "30+ Courses", placement: "₹14 LPA avg", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop" },
      { rank: 4, name: "AFMC Pune", location: "Maharashtra", rating: 4.7, courses: "15+ Courses", placement: "₹10 LPA avg", image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "MBBS", colleges: 612, avgSalary: "₹10 LPA", growth: "+15%" },
      { name: "BDS (Dental)", colleges: 315, avgSalary: "₹6 LPA", growth: "+10%" },
      { name: "B.Sc Nursing", colleges: 890, avgSalary: "₹4 LPA", growth: "+20%" },
      { name: "BAMS (Ayurveda)", colleges: 420, avgSalary: "₹5 LPA", growth: "+12%" },
    ],
    exams: [
      { name: "NEET UG 2026", date: "May 2026", applicants: "20L+", type: "National" },
      { name: "AIIMS INI-CET", date: "June 2026", applicants: "50K+", type: "National" },
      { name: "JIPMER Entrance", date: "June 2026", applicants: "1L+", type: "University" },
      { name: "NEET PG 2026", date: "March 2026", applicants: "2L+", type: "National" },
    ],
  },
  management: {
    colleges: [
      { rank: 1, name: "IIM Ahmedabad", location: "Gujarat", rating: 4.9, courses: "10+ Programs", placement: "₹32 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop" },
      { rank: 2, name: "IIM Bangalore", location: "Karnataka", rating: 4.9, courses: "12+ Programs", placement: "₹30 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" },
      { rank: 3, name: "IIM Calcutta", location: "West Bengal", rating: 4.8, courses: "10+ Programs", placement: "₹28 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop" },
      { rank: 4, name: "ISB Hyderabad", location: "Telangana", rating: 4.8, courses: "5+ Programs", placement: "₹34 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "MBA (General)", colleges: 3500, avgSalary: "₹12 LPA", growth: "+18%" },
      { name: "MBA Finance", colleges: 2800, avgSalary: "₹15 LPA", growth: "+22%" },
      { name: "MBA Marketing", colleges: 2600, avgSalary: "₹11 LPA", growth: "+15%" },
      { name: "MBA HR", colleges: 2200, avgSalary: "₹10 LPA", growth: "+12%" },
    ],
    exams: [
      { name: "CAT 2026", date: "November 2026", applicants: "3L+", type: "National" },
      { name: "XAT 2026", date: "January 2026", applicants: "1L+", type: "National" },
      { name: "MAT 2026", date: "Multiple", applicants: "50K+", type: "National" },
      { name: "GMAT", date: "Year-round", applicants: "Varies", type: "International" },
    ],
  },
  design: {
    colleges: [
      { rank: 1, name: "NID Ahmedabad", location: "Gujarat", rating: 4.9, courses: "15+ Programs", placement: "₹12 LPA avg", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop" },
      { rank: 2, name: "IIT Bombay IDC", location: "Mumbai", rating: 4.8, courses: "8+ Programs", placement: "₹15 LPA avg", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop" },
      { rank: 3, name: "NIFT Delhi", location: "New Delhi", rating: 4.7, courses: "20+ Programs", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
      { rank: 4, name: "Srishti Bangalore", location: "Karnataka", rating: 4.6, courses: "18+ Programs", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "B.Des Industrial Design", colleges: 120, avgSalary: "₹8 LPA", growth: "+30%" },
      { name: "B.Des Fashion Design", colleges: 200, avgSalary: "₹6 LPA", growth: "+20%" },
      { name: "B.Des UI/UX Design", colleges: 80, avgSalary: "₹10 LPA", growth: "+50%" },
      { name: "B.Des Graphic Design", colleges: 150, avgSalary: "₹5 LPA", growth: "+15%" },
    ],
    exams: [
      { name: "UCEED 2026", date: "January 2026", applicants: "15K+", type: "National" },
      { name: "NID DAT 2026", date: "January 2026", applicants: "20K+", type: "National" },
      { name: "NIFT Entrance", date: "February 2026", applicants: "50K+", type: "National" },
      { name: "CEED 2026", date: "January 2026", applicants: "10K+", type: "National" },
    ],
  },
  law: {
    colleges: [
      { rank: 1, name: "NLSIU Bangalore", location: "Karnataka", rating: 4.9, courses: "5+ Programs", placement: "₹20 LPA avg", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop" },
      { rank: 2, name: "NLU Delhi", location: "New Delhi", rating: 4.8, courses: "5+ Programs", placement: "₹18 LPA avg", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=300&fit=crop" },
      { rank: 3, name: "NALSAR Hyderabad", location: "Telangana", rating: 4.8, courses: "4+ Programs", placement: "₹16 LPA avg", image: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=400&h=300&fit=crop" },
      { rank: 4, name: "WBNUJS Kolkata", location: "West Bengal", rating: 4.7, courses: "4+ Programs", placement: "₹14 LPA avg", image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "BA LLB (5 Years)", colleges: 450, avgSalary: "₹8 LPA", growth: "+18%" },
      { name: "LLB (3 Years)", colleges: 800, avgSalary: "₹5 LPA", growth: "+12%" },
      { name: "LLM (Master's)", colleges: 200, avgSalary: "₹12 LPA", growth: "+15%" },
      { name: "BBA LLB", colleges: 180, avgSalary: "₹7 LPA", growth: "+20%" },
    ],
    exams: [
      { name: "CLAT 2026", date: "December 2025", applicants: "75K+", type: "National" },
      { name: "AILET 2026", date: "May 2026", applicants: "20K+", type: "University" },
      { name: "LSAT India", date: "Multiple", applicants: "15K+", type: "National" },
      { name: "MH CET Law", date: "April 2026", applicants: "80K+", type: "State" },
    ],
  },
  science: {
    colleges: [
      { rank: 1, name: "IISc Bangalore", location: "Karnataka", rating: 4.9, courses: "40+ Programs", placement: "₹18 LPA avg", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop" },
      { rank: 2, name: "St. Stephen's College", location: "New Delhi", rating: 4.8, courses: "20+ Programs", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" },
      { rank: 3, name: "Hindu College", location: "New Delhi", rating: 4.7, courses: "18+ Programs", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" },
      { rank: 4, name: "Presidency College", location: "Kolkata", rating: 4.6, courses: "15+ Programs", placement: "₹6 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "B.Sc Physics", colleges: 2000, avgSalary: "₹5 LPA", growth: "+15%" },
      { name: "B.Sc Chemistry", colleges: 1800, avgSalary: "₹5 LPA", growth: "+12%" },
      { name: "B.Sc Mathematics", colleges: 1600, avgSalary: "₹6 LPA", growth: "+18%" },
      { name: "B.Sc Biology", colleges: 1400, avgSalary: "₹4 LPA", growth: "+10%" },
    ],
    exams: [
      { name: "CUET 2026", date: "May 2026", applicants: "15L+", type: "National" },
      { name: "IIT JAM 2026", date: "February 2026", applicants: "60K+", type: "National" },
      { name: "JEST 2026", date: "February 2026", applicants: "15K+", type: "National" },
      { name: "TIFR GS 2026", date: "December 2025", applicants: "8K+", type: "Institute" },
    ],
  },
  arts: {
    colleges: [
      { rank: 1, name: "JNU Delhi", location: "New Delhi", rating: 4.8, courses: "50+ Programs", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" },
      { rank: 2, name: "Lady Shri Ram College", location: "New Delhi", rating: 4.8, courses: "25+ Programs", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" },
      { rank: 3, name: "Miranda House", location: "New Delhi", rating: 4.7, courses: "22+ Programs", placement: "₹6 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop" },
      { rank: 4, name: "Loyola College", location: "Chennai", rating: 4.6, courses: "20+ Programs", placement: "₹5 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "BA English Literature", colleges: 3000, avgSalary: "₹4 LPA", growth: "+10%" },
      { name: "BA Psychology", colleges: 1200, avgSalary: "₹5 LPA", growth: "+25%" },
      { name: "BA Political Science", colleges: 2500, avgSalary: "₹5 LPA", growth: "+12%" },
      { name: "BA History", colleges: 2200, avgSalary: "₹4 LPA", growth: "+8%" },
    ],
    exams: [
      { name: "CUET 2026", date: "May 2026", applicants: "15L+", type: "National" },
      { name: "JNU Entrance", date: "June 2026", applicants: "50K+", type: "University" },
      { name: "BHU UET 2026", date: "April 2026", applicants: "3L+", type: "University" },
      { name: "IPU CET 2026", date: "May 2026", applicants: "1L+", type: "State" },
    ],
  },
  commerce: {
    colleges: [
      { rank: 1, name: "SRCC Delhi", location: "New Delhi", rating: 4.9, courses: "5+ Programs", placement: "₹12 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" },
      { rank: 2, name: "Hindu College", location: "New Delhi", rating: 4.8, courses: "6+ Programs", placement: "₹10 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" },
      { rank: 3, name: "Christ University", location: "Bangalore", rating: 4.7, courses: "15+ Programs", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop" },
      { rank: 4, name: "Hansraj College", location: "New Delhi", rating: 4.6, courses: "5+ Programs", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop" },
    ],
    courses: [
      { name: "B.Com (Honours)", colleges: 4000, avgSalary: "₹5 LPA", growth: "+12%" },
      { name: "BBA", colleges: 3500, avgSalary: "₹6 LPA", growth: "+18%" },
      { name: "CA (Chartered Accountancy)", colleges: 500, avgSalary: "₹10 LPA", growth: "+20%" },
      { name: "B.Com + CFA", colleges: 200, avgSalary: "₹8 LPA", growth: "+25%" },
    ],
    exams: [
      { name: "CUET 2026", date: "May 2026", applicants: "15L+", type: "National" },
      { name: "CA Foundation", date: "Multiple", applicants: "3L+", type: "Professional" },
      { name: "IPMAT 2026", date: "May 2026", applicants: "50K+", type: "University" },
      { name: "SET Entrance", date: "May 2026", applicants: "30K+", type: "University" },
    ],
  },
};

export function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("engineering");
  const data = categoryData[activeCategory];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="explore-heading">
      <div className="container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 id="explore-heading" className="text-headline font-bold text-foreground">
            Explore by <span className="text-gradient-accent">Category</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse 5000+ colleges, 10000+ courses, and 500+ entrance exams across all fields
          </p>
        </motion.div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide justify-center flex-wrap" role="tablist">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap flex-shrink-0 rounded-full gap-2 ${
                activeCategory === cat.id ? "gradient-primary text-primary-foreground border-0 shadow-md" : "border-border hover:bg-primary/5"
              }`}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </div>

        {/* 3-Column Layout: Colleges | Courses | Exams */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Column 1: Top Colleges */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" /> Top Colleges
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Based on NIRF rankings</p>
              </div>
              <Link to={`/colleges?category=${activeCategory}`}>
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="space-y-3">
              {data.colleges.map((college) => (
                <Link key={college.rank} to="/colleges" className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="relative flex-shrink-0">
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center z-10">#{college.rank}</span>
                    <img src={college.image} alt={college.name} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{college.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{college.location}</span>
                      <span>•</span>
                      <span>{college.courses}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" /> {college.rating}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{college.placement}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Trending Courses */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Trending Courses
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">High demand programs</p>
              </div>
              <Link to="/courses">
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="space-y-3">
              {data.courses.map((course) => (
                <Link key={course.name} to="/courses" className="group block p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{course.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{course.colleges}+ colleges</span>
                    <div className="flex items-center gap-1.5">
                      <Badge className="bg-accent/10 text-accent hover:bg-accent/10 text-[10px] px-1.5 py-0"><TrendingUp className="w-3 h-3 mr-0.5" />{course.growth}</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[10px] px-1.5 py-0">{course.avgSalary}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Upcoming Exams */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Upcoming Exams
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Don't miss deadlines!</p>
              </div>
              <Link to="/exams">
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="space-y-3">
              {data.exams.map((exam) => (
                <Link key={exam.name} to="/exams" className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{exam.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{exam.date}</span>
                      <span>•</span>
                      <span>{exam.applicants} applicants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                      exam.type === "National" ? "border-destructive/40 text-destructive" : "border-primary/30 text-primary"
                    }`}>{exam.type}</Badge>
                    <Bookmark className="w-4 h-4 text-muted-foreground/40 hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
