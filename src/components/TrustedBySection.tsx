import { motion } from "framer-motion";
import { Star, Shield, Award, Users, CheckCircle, TrendingUp } from "lucide-react";

const partners = [
  { name: "IIT Delhi", logo: "🏛️", type: "Partner" },
  { name: "BITS Pilani", logo: "🎓", type: "Partner" },
  { name: "NIT Trichy", logo: "📚", type: "Partner" },
  { name: "AIIMS Delhi", logo: "🏥", type: "Partner" },
  { name: "IIM Ahmedabad", logo: "💼", type: "Partner" },
  { name: "JNU Delhi", logo: "🏫", type: "Partner" },
  { name: "VIT Vellore", logo: "⚡", type: "Partner" },
  { name: "SRM Chennai", logo: "🌟", type: "Partner" },
  { name: "Manipal Univ", logo: "🔬", type: "Partner" },
  { name: "Amity Univ", logo: "📖", type: "Partner" },
  { name: "Christ Univ", logo: "🎯", type: "Partner" },
  { name: "Symbiosis Pune", logo: "🌍", type: "Partner" },
];

const trustStats = [
  { icon: Users, value: "1M+", label: "Students Guided", color: "from-primary to-electric-purple" },
  { icon: Shield, value: "5,000+", label: "Verified Colleges", color: "from-success to-mint" },
  { icon: Award, value: "95%", label: "Success Rate", color: "from-accent to-golden" },
  { icon: TrendingUp, value: "50K+", label: "Placements Assisted", color: "from-pink to-accent" },
];

const reviews = [
  { name: "Priya Sharma", city: "Delhi", rating: 5, text: "DekhoCampus helped me get into my dream college. The AI counselor understood exactly what I needed!", avatar: "PS" },
  { name: "Arjun Patel", city: "Mumbai", rating: 5, text: "Best platform for comparing colleges. Saved me weeks of research!", avatar: "AP" },
  { name: "Sneha Reddy", city: "Hyderabad", rating: 5, text: "The free counseling session was incredibly helpful. Got into NIT!", avatar: "SR" },
  { name: "Rohit Kumar", city: "Patna", rating: 5, text: "Amazing AI assistant. Got instant answers about JEE preparation strategy.", avatar: "RK" },
  { name: "Ananya Singh", city: "Lucknow", rating: 5, text: "The exam alerts feature is a lifesaver. Never missed an important date!", avatar: "AS" },
  { name: "Vikram Joshi", city: "Pune", rating: 5, text: "Compared 10+ colleges in minutes. Such a time-saver for students like me.", avatar: "VJ" },
];

export function TrustedBySection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30 overflow-hidden" aria-label="Trusted by millions">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Shield className="w-4 h-4" />
            Trusted by Millions
          </div>
          <h2 className="text-headline font-bold text-foreground">
            India's Most <span className="text-gradient">Trusted</span> Education Platform
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Join over 1 million students who found their perfect college through DekhoCampus
          </p>
        </motion.div>

        {/* Trust Stats - mobile optimized horizontal scroll */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          {trustStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-4 md:p-5 text-center"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 md:mb-3`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos Carousel - auto scrolling */}
        <div className="mb-8 md:mb-12">
          <p className="text-center text-sm font-medium text-muted-foreground mb-4 md:mb-6">
            Partnered with India's top institutions
          </p>
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner.name}-${i}`}
                  className="flex-shrink-0 mx-2 md:mx-3 px-4 md:px-5 py-2.5 md:py-3 bg-card rounded-xl border border-border flex items-center gap-2 md:gap-3 min-w-[140px] md:min-w-[160px]"
                >
                  <span className="text-xl md:text-2xl">{partner.logo}</span>
                  <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Reviews Grid Carousel */}
        <div>
          <p className="text-center text-sm font-medium text-muted-foreground mb-4 md:mb-6">
            What students say about us
          </p>
          
          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex-shrink-0 w-[280px] md:w-auto snap-start bg-card rounded-2xl border border-border p-4 md:p-5"
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-golden fill-golden" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-3 line-clamp-3">"{review.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.city}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-success ml-auto flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
