import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Check,
  ArrowRight,
  Heart,
  BookOpen,
  MessageCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const features = [
  {
    icon: MessageCircle,
    title: "Friendly AI Counselor",
    description: "Chat with our AI just like talking to a friend who knows everything about colleges and careers",
    color: "from-primary to-electric-purple",
    items: ["24/7 instant help", "No judgment, just guidance", "Remembers your goals"],
  },
  {
    icon: Target,
    title: "Find Your Perfect Fit",
    description: "Tell us what you like, and we'll show you colleges that match YOUR personality and dreams",
    color: "from-success to-mint",
    items: ["Smart matching", "Compare side-by-side", "Virtual campus tours"],
  },
  {
    icon: BookOpen,
    title: "Exam Prep Made Easy",
    description: "From study plans to mock tests - everything organized so you can focus on what matters",
    color: "from-electric-purple to-pink",
    items: ["Personalized schedules", "Practice questions", "Progress tracking"],
  },
  {
    icon: Users,
    title: "Real Student Stories",
    description: "Hear from students who've been in your shoes - their tips, experiences, and honest reviews",
    color: "from-accent to-golden",
    items: ["Senior advice", "Campus life insights", "Placement stories"],
  },
];

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-card to-secondary/30" aria-labelledby="features-heading">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6 md:mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-3">
              <Heart className="w-4 h-4 fill-current" />
              <span>Made with love for students</span>
            </div>
            <h2 id="features-heading" className="text-headline font-bold text-foreground">
              Why Students <span className="text-gradient-accent">Love</span> Us
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
              We get it — choosing your future is stressful. That's why we built tools that actually help.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full w-9 h-9" onClick={() => scroll("left")} disabled={!canScrollLeft} aria-label="Scroll left">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-9 h-9" onClick={() => scroll("right")} disabled={!canScrollRight} aria-label="Scroll right">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Features Carousel - stable scroll like TopRankedColleges */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 overscroll-x-contain touch-pan-x"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="snap-start flex-shrink-0 w-[280px] md:w-[320px] bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        {/* Lead Capture Banner */}
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Ready to start your journey?</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base">
            Try Educational AI Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
