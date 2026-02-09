import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Award, Users, CheckCircle, TrendingUp, ChevronLeft, ChevronRight, ExternalLink, GraduationCap } from "lucide-react";
import { useTrustedPartners } from "@/hooks/useTrustedPartners";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AILeadForm } from "@/components/AILeadForm";
import { AIChatFullScreen } from "@/components/AIChatFullScreen";

const trustStats = [
  { icon: Users, value: "1M+", label: "Students Guided" },
  { icon: Shield, value: "5,000+", label: "Verified Colleges" },
  { icon: Award, value: "95%", label: "Success Rate" },
  { icon: TrendingUp, value: "50K+", label: "Placements Assisted" },
];

const googleReviews = [
  { name: "Ravi Shankar", rating: 5, date: "2 weeks ago", text: "DekhoCampus made my college search so much easier! The AI counselor gave me perfect recommendations based on my JEE score. Got into NIT Warangal.", avatar: "RS", verified: true },
  { name: "Meera Jain", rating: 5, date: "1 month ago", text: "Best education platform in India. The counselors are extremely knowledgeable and helped me compare BITS Pilani vs VIT. Their free counseling was a game-changer!", avatar: "MJ", verified: true },
  { name: "Aditya Verma", rating: 5, date: "3 weeks ago", text: "The compare colleges feature is amazing! I compared 5 different engineering colleges and finally chose the right one. Thank you DekhoCampus team! 🙏", avatar: "AV", verified: true },
  { name: "Pooja Reddy", rating: 4, date: "1 month ago", text: "Very helpful for NEET preparation guidance. The AI bot answered all my questions about medical colleges and their fee structures. Will definitely recommend.", avatar: "PR", verified: true },
  { name: "Karthik Nair", rating: 5, date: "2 months ago", text: "I was confused between MBA colleges after my CAT score. DekhoCampus counselors helped me shortlist top B-schools. Got into IIM Indore! 🎉", avatar: "KN", verified: true },
  { name: "Sneha Gupta", rating: 5, date: "3 weeks ago", text: "Amazing platform! The scholarship information is so detailed. I found a scholarship I didn't even know existed. Saved ₹2 lakhs on my engineering fees.", avatar: "SG", verified: true },
  { name: "Arjun Mehta", rating: 5, date: "1 week ago", text: "The 24/7 AI assistant is incredible. I asked about cutoff trends at 2 AM during my exam stress and got perfect answers. This platform truly cares!", avatar: "AM", verified: true },
  { name: "Divya Sharma", rating: 4, date: "2 months ago", text: "Used DekhoCampus for my daughter's college admission. The counselors guided us through the entire CUET process. Very professional and supportive team.", avatar: "DS", verified: true },
];

export function TrustedBySection() {
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const { data: partners } = useTrustedPartners();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [leadInfo, setLeadInfo] = useState<{ name: string; course: string; state: string; city: string } | undefined>();

  const scrollReviews = (dir: "left" | "right") => {
    if (!reviewScrollRef.current) return;
    reviewScrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const avgRating = (googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length).toFixed(1);
  const displayPartners = partners && partners.length > 0 ? partners : null;

  const handleTryAI = () => setIsLeadFormOpen(true);
  const handleLeadSubmit = useCallback((data: { name: string; course: string; state: string; city: string }) => {
    setIsLeadFormOpen(false);
    setLeadInfo(data);
    setIsChatOpen(true);
  }, []);

  return (
    <section className="py-10 md:py-16 bg-muted/30 overflow-hidden" aria-label="Trusted by millions">
      <div className="container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-headline font-bold text-foreground">
            India's Most <span className="text-primary">Trusted</span> Education Platform
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
            Join over 1 million students who found their perfect college through DekhoCampus
          </p>
        </motion.div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {trustStats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        {displayPartners && (
          <div className="mb-10">
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              Partnered with India's top institutions
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
              <div className="flex animate-marquee hover:[animation-play-state:paused]">
                {[...displayPartners, ...displayPartners].map((partner, i) => (
                  <div key={`${partner.id}-${i}`} className="flex-shrink-0 mx-2 px-4 py-2.5 bg-card rounded-lg border border-border flex items-center gap-2 min-w-[160px]">
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="w-8 h-8 rounded-lg object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Try AI CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="bg-primary rounded-2xl p-6 md:p-10 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">Try DC Educational AI Free</h3>
            <p className="text-primary-foreground/80 text-sm mb-5 max-w-md mx-auto">Get instant answers about colleges, courses, exams, and career guidance</p>
            <button
              onClick={handleTryAI}
              className="inline-flex items-center gap-2 px-8 py-3 bg-background text-foreground rounded-xl font-semibold text-sm hover:bg-background/90 transition-colors"
            >
              <GraduationCap className="w-5 h-5" />
              Start Free AI Counselling
            </button>
          </div>
        </motion.div>

        {/* Reviews */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-foreground">Google Reviews</span>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-card rounded-lg border border-border">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-bold text-foreground">{avgRating}</span>
                <span className="text-xs text-muted-foreground">({googleReviews.length})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollReviews("left")} className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollReviews("right")} className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={reviewScrollRef} className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {googleReviews.map((review, i) => (
              <motion.div key={review.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex-shrink-0 w-[280px] snap-start bg-card rounded-xl border border-border p-4 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "text-primary fill-primary" : "text-border"}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{review.date}</span>
                </div>
                <p className="text-sm text-foreground mb-3 flex-1 line-clamp-4">"{review.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{review.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{review.name}</p>
                    <p className="text-xs text-muted-foreground">Google Review</p>
                  </div>
                  {review.verified && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-4">
            <a href="https://g.co/kgs/dekhocampus" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              View all reviews on Google <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <AILeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} onSubmit={handleLeadSubmit} />
      <AIChatFullScreen isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} leadData={leadInfo} />
    </section>
  );
}
