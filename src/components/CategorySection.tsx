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

const subTabs = [
  { id: "colleges", label: "Colleges", icon: GraduationCap },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "exams", label: "Exams", icon: FileText },
];

// Sample data for each category
const categoryData: Record<string, { colleges: any[]; courses: any[]; exams: any[] }> = {
  engineering: {
    colleges: [
      { rank: 1, name: "IIT Delhi", location: "New Delhi", rating: 4.9, reviews: 2500, courses: "50+ Courses", fees: "₹2.5L/year", placement: "₹25 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", tags: ["NIRF #1", "Govt"] },
      { rank: 2, name: "IIT Bombay", location: "Mumbai", rating: 4.9, reviews: 2200, courses: "45+ Courses", fees: "₹2.5L/year", placement: "₹28 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop", tags: ["NIRF #2", "Govt"] },
      { rank: 3, name: "IIT Kanpur", location: "Uttar Pradesh", rating: 4.8, reviews: 1900, courses: "42+ Courses", fees: "₹2.5L/year", placement: "₹22 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop", tags: ["NIRF #3", "Govt"] },
      { rank: 4, name: "NIT Trichy", location: "Tamil Nadu", rating: 4.7, reviews: 1800, courses: "35+ Courses", fees: "₹1.5L/year", placement: "₹15 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop", tags: ["NIT #1", "Govt"] },
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
      { rank: 1, name: "AIIMS Delhi", location: "New Delhi", rating: 4.9, reviews: 3200, courses: "25+ Courses", fees: "₹1.5K/year", placement: "₹15 LPA avg", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop", tags: ["NIRF #1", "Govt"] },
      { rank: 2, name: "JIPMER", location: "Puducherry", rating: 4.8, reviews: 2100, courses: "20+ Courses", fees: "₹2K/year", placement: "₹12 LPA avg", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop", tags: ["NIRF #2", "Govt"] },
      { rank: 3, name: "CMC Vellore", location: "Tamil Nadu", rating: 4.8, reviews: 2400, courses: "30+ Courses", fees: "₹80K/year", placement: "₹14 LPA avg", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop", tags: ["Private", "Top 5"] },
      { rank: 4, name: "AFMC Pune", location: "Maharashtra", rating: 4.7, reviews: 1500, courses: "15+ Courses", fees: "Free", placement: "₹10 LPA avg", image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop", tags: ["Defence", "Govt"] },
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
      { rank: 1, name: "IIM Ahmedabad", location: "Gujarat", rating: 4.9, reviews: 1800, courses: "10+ Programs", fees: "₹24L/year", placement: "₹32 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop", tags: ["#1 MBA", "Govt"] },
      { rank: 2, name: "IIM Bangalore", location: "Karnataka", rating: 4.9, reviews: 1600, courses: "12+ Programs", fees: "₹25L/year", placement: "₹30 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop", tags: ["#2 MBA", "Govt"] },
      { rank: 3, name: "IIM Calcutta", location: "West Bengal", rating: 4.8, reviews: 1500, courses: "10+ Programs", fees: "₹23L/year", placement: "₹28 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop", tags: ["#3 MBA", "Govt"] },
      { rank: 4, name: "ISB Hyderabad", location: "Telangana", rating: 4.8, reviews: 1200, courses: "5+ Programs", fees: "₹35L/year", placement: "₹34 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", tags: ["Private", "Top 5"] },
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
      { rank: 1, name: "NID Ahmedabad", location: "Gujarat", rating: 4.9, reviews: 800, courses: "15+ Programs", fees: "₹4L/year", placement: "₹12 LPA avg", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop", tags: ["#1 Design", "Govt"] },
      { rank: 2, name: "IIT Bombay IDC", location: "Mumbai", rating: 4.8, reviews: 600, courses: "8+ Programs", fees: "₹2.5L/year", placement: "₹15 LPA avg", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop", tags: ["IIT", "Govt"] },
      { rank: 3, name: "NIFT Delhi", location: "New Delhi", rating: 4.7, reviews: 1200, courses: "20+ Programs", fees: "₹3L/year", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", tags: ["Fashion", "Govt"] },
      { rank: 4, name: "Srishti Bangalore", location: "Karnataka", rating: 4.6, reviews: 500, courses: "18+ Programs", fees: "₹5L/year", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", tags: ["Private", "Art"] },
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
      { rank: 1, name: "NLSIU Bangalore", location: "Karnataka", rating: 4.9, reviews: 900, courses: "5+ Programs", fees: "₹2.5L/year", placement: "₹20 LPA avg", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop", tags: ["#1 Law", "Govt"] },
      { rank: 2, name: "NLU Delhi", location: "New Delhi", rating: 4.8, reviews: 750, courses: "5+ Programs", fees: "₹2L/year", placement: "₹18 LPA avg", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=300&fit=crop", tags: ["#2 Law", "Govt"] },
      { rank: 3, name: "NALSAR Hyderabad", location: "Telangana", rating: 4.8, reviews: 680, courses: "4+ Programs", fees: "₹2L/year", placement: "₹16 LPA avg", image: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=400&h=300&fit=crop", tags: ["#3 Law", "Govt"] },
      { rank: 4, name: "WBNUJS Kolkata", location: "West Bengal", rating: 4.7, reviews: 550, courses: "4+ Programs", fees: "₹1.8L/year", placement: "₹14 LPA avg", image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?w=400&h=300&fit=crop", tags: ["NLU", "Govt"] },
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
      { rank: 1, name: "IISc Bangalore", location: "Karnataka", rating: 4.9, reviews: 1200, courses: "40+ Programs", fees: "₹50K/year", placement: "₹18 LPA avg", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", tags: ["#1 Science", "Govt"] },
      { rank: 2, name: "St. Stephen's College", location: "New Delhi", rating: 4.8, reviews: 1800, courses: "20+ Programs", fees: "₹30K/year", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", tags: ["DU", "Prestigious"] },
      { rank: 3, name: "Hindu College", location: "New Delhi", rating: 4.7, reviews: 1500, courses: "18+ Programs", fees: "₹25K/year", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop", tags: ["DU", "Top 5"] },
      { rank: 4, name: "Presidency College", location: "Kolkata", rating: 4.6, reviews: 900, courses: "15+ Programs", fees: "₹20K/year", placement: "₹6 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop", tags: ["Historic", "Govt"] },
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
      { rank: 1, name: "JNU Delhi", location: "New Delhi", rating: 4.8, reviews: 2200, courses: "50+ Programs", fees: "₹15K/year", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", tags: ["#1 Humanities", "Govt"] },
      { rank: 2, name: "Lady Shri Ram College", location: "New Delhi", rating: 4.8, reviews: 1800, courses: "25+ Programs", fees: "₹35K/year", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop", tags: ["DU", "Women"] },
      { rank: 3, name: "Miranda House", location: "New Delhi", rating: 4.7, reviews: 1600, courses: "22+ Programs", fees: "₹30K/year", placement: "₹6 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop", tags: ["DU", "Women"] },
      { rank: 4, name: "Loyola College", location: "Chennai", rating: 4.6, reviews: 1200, courses: "20+ Programs", fees: "₹40K/year", placement: "₹5 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop", tags: ["Autonomous", "Chennai"] },
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
      { rank: 1, name: "SRCC Delhi", location: "New Delhi", rating: 4.9, reviews: 2000, courses: "5+ Programs", fees: "₹40K/year", placement: "₹12 LPA avg", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", tags: ["#1 Commerce", "DU"] },
      { rank: 2, name: "Hindu College", location: "New Delhi", rating: 4.8, reviews: 1500, courses: "6+ Programs", fees: "₹30K/year", placement: "₹10 LPA avg", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop", tags: ["DU", "Top 5"] },
      { rank: 3, name: "Christ University", location: "Bangalore", rating: 4.7, reviews: 2500, courses: "15+ Programs", fees: "₹1.2L/year", placement: "₹8 LPA avg", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop", tags: ["Private", "Top 10"] },
      { rank: 4, name: "Hansraj College", location: "New Delhi", rating: 4.6, reviews: 1200, courses: "5+ Programs", fees: "₹25K/year", placement: "₹7 LPA avg", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop", tags: ["DU", "Popular"] },
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
  const [activeSubTab, setActiveSubTab] = useState("colleges");
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

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide" role="tablist">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => { setActiveCategory(cat.id); setActiveSubTab("colleges"); }}
              className={`whitespace-nowrap flex-shrink-0 rounded-xl gap-2 ${
                activeCategory === cat.id ? "gradient-primary text-primary-foreground border-0" : "border-border hover:bg-primary/5"
              }`}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Sub-tabs: Colleges / Courses / Exams */}
        <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 w-fit">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSubTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={`${activeCategory}-${activeSubTab}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeSubTab === "colleges" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Top {categories.find(c => c.id === activeCategory)?.label} colleges by NIRF ranking</p>
                <Link to={`/colleges?category=${activeCategory}`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.colleges.map((college) => (
                  <Link key={college.rank} to="/colleges" className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all">
                    <div className="relative h-36 overflow-hidden">
                      <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {college.tags.map((t: string) => (
                          <Badge key={t} className="bg-foreground/70 text-background border-0 text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{college.name}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{college.location}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-primary text-primary" />{college.rating}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{college.fees}</span>
                        <span className="font-medium text-accent">{college.placement}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "courses" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Trending {categories.find(c => c.id === activeCategory)?.label} courses</p>
                <Link to="/courses"><Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.courses.map((course) => (
                  <Link key={course.name} to="/courses" className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all">
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{course.name}</h4>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Users className="w-3 h-3" />{course.colleges}+ colleges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs"><TrendingUp className="w-3 h-3 mr-1" />{course.growth}</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">{course.avgSalary}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "exams" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Upcoming {categories.find(c => c.id === activeCategory)?.label} exams</p>
                <Link to="/exams"><Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.exams.map((exam) => (
                  <Link key={exam.name} to="/exams" className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all">
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{exam.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /><span>{exam.date}</span><span>•</span><span>{exam.applicants} applicants</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">{exam.type}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
