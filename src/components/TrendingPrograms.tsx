import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeadGateDialog } from "@/components/LeadGateDialog";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price}`;
}

export function TrendingPrograms() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLead, setShowLead] = useState(false);

  const { data: programs, isLoading } = useQuery({
    queryKey: ["promoted-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promoted_programs")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (isLoading) return null;
  if (!programs || programs.length === 0) return null;

  return (
    <>
      <section className="py-10 md:py-16" aria-labelledby="trending-programs-heading">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <GraduationCap className="w-4 h-4" /> Trending Courses
            </div>
            <h2 id="trending-programs-heading" className="text-headline font-bold text-foreground">
              Explore our <span className="text-gradient">most popular programs</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">Premium courses from IITs & IIMs at exclusive prices on DekhoCampus</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9" onClick={() => scroll("left")}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9" onClick={() => scroll("right")}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </motion.div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {programs.map((prog: any, i: number) => {
            const discountedPrice = prog.original_price * (1 - prog.discount_percent / 100);
            return (
              <motion.article key={prog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="min-w-[280px] snap-start lg:min-w-0 bg-card rounded-2xl border border-border p-5 flex flex-col hover:shadow-lg transition-all card-elevated">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant={prog.badge_variant as any} className="text-[10px] font-bold px-2">{prog.badge}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{prog.college_name}</p>
                <h3 className="text-sm font-bold text-foreground mb-3 line-clamp-2 min-h-[2.5rem]">{prog.title}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><GraduationCap className="w-3.5 h-3.5" /><span>{prog.program_type}</span></div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="w-3.5 h-3.5" /><span>{prog.duration}</span></div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-muted-foreground">{formatPrice(prog.original_price)}</span>
                    <Badge variant="outline" className="text-[10px] border-accent/30 text-accent font-bold">{prog.discount_percent}% OFF</Badge>
                  </div>
                  <p className="text-lg font-bold text-foreground">{formatPrice(discountedPrice)} <span className="text-xs font-normal text-muted-foreground">only on DekhoCampus</span></p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" className="flex-1 rounded-xl h-9 text-xs" onClick={() => setShowLead(true)}>View Program</Button>
                  <Button className="rounded-xl h-9 text-xs gradient-accent text-white border-0 btn-accent-glow px-3" onClick={() => setShowLead(true)}>
                    <Download className="w-3.5 h-3.5 mr-1" /> Syllabus
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <LeadGateDialog
        open={showLead}
        onOpenChange={setShowLead}
        title="🎓 Get Program Details & Free Counseling"
        subtitle="Fill the form to download syllabus & get ₹999 counselling FREE!"
        source="trending_program_click"
      />
    </>
  );
}
