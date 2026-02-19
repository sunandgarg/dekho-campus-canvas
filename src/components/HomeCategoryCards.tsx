import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import iconCollege from "@/assets/icon-college-badge.png";
import iconCourse from "@/assets/icon-course-badge.png";
import iconExam from "@/assets/icon-exam-badge.png";
import iconApply from "@/assets/icon-apply-badge.png";
import iconReview from "@/assets/icon-review-badge.png";
import iconNews from "@/assets/icon-news-badge.png";

const cards = [
  { icon: iconCollege, title: "Top Colleges", desc: "Explore 5000+ colleges across India", link: "/colleges", color: "from-primary/10 to-primary/5" },
  { icon: iconCourse, title: "Courses", desc: "Find the right course for your career", link: "/courses", color: "from-accent/10 to-accent/5" },
  { icon: iconExam, title: "Entrance Exams", desc: "Dates, syllabus & preparation tips", link: "/exams", color: "from-destructive/10 to-destructive/5" },
  { icon: iconApply, title: "Apply Now", desc: "Get free counselling & apply easily", link: "/colleges", color: "from-success/10 to-success/5" },
  { icon: iconReview, title: "Student Reviews", desc: "Real reviews from real students", link: "/colleges", color: "from-golden/10 to-golden/5" },
  { icon: iconNews, title: "Latest News", desc: "Education news & updates", link: "/articles", color: "from-electric-purple/10 to-electric-purple/5" },
];

export function HomeCategoryCards() {
  return (
    <section className="py-8 md:py-12" aria-labelledby="quick-categories">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <h2 id="quick-categories" className="text-headline font-bold text-foreground">
          What are you <span className="text-gradient-accent">looking for?</span>
        </h2>
        <p className="mt-2 text-muted-foreground">Everything you need for your education journey</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={card.link}
              className={`group block bg-gradient-to-br ${card.color} rounded-2xl border border-border p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <img
                src={card.icon}
                alt={card.title}
                className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform"
                loading="lazy"
              />
              <h3 className="text-sm font-bold text-foreground mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
