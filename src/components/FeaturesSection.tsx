import { useRef } from "react";
import { motion } from "framer-motion";
import { Target, Check, ArrowRight, Heart, BookOpen, MessageCircle, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const features = [
  {
    icon: MessageCircle,
    title: "Friendly AI Counselor",
    description: "Chat with our AI just like talking to a friend who knows everything about colleges and careers",
    items: ["24/7 instant help", "No judgment, just guidance", "Remembers your goals"],
  },
  {
    icon: Target,
    title: "Find Your Perfect Fit",
    description: "Tell us what you like, and we'll show you colleges that match YOUR personality and dreams",
    items: ["Smart matching", "Compare side-by-side", "Virtual campus tours"],
  },
  {
    icon: BookOpen,
    title: "Exam Prep Made Easy",
    description: "From study plans to mock tests - everything organized so you can focus on what matters",
    items: ["Personalized schedules", "Practice questions", "Progress tracking"],
  },
  {
    icon: Users,
    title: "Real Student Stories",
    description: "Hear from students who've been in your shoes - their tips, experiences, and honest reviews",
    items: ["Senior advice", "Campus life insights", "Placement stories"],
  },
];

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 bg-muted/30" aria-labelledby="features-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6 md:mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <Heart className="w-4 h-4" />
              <span>Made with love for students</span>
            </div>
            <h2 id="features-heading" className="text-headline font-bold text-foreground">
              Why Students <span className="text-primary">Love</span> Us
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
              We get it — choosing your future is stressful. That's why we built tools that actually help.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scroll("left")} className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors" aria-label="Scroll left">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors" aria-label="Scroll right">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group flex-shrink-0 w-[280px] md:w-[300px] snap-start bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-12"
        >
          <LeadCaptureForm
            variant="banner"
            title="🎓 Get Personalized College Recommendations"
            subtitle="Talk to our expert counselors — completely free!"
            source="features_banner"
          />
        </motion.div>
      </div>
    </section>
  );
}
