import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroBanners } from "@/hooks/useHeroBanners";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export function HeroBannerCarousel() {
  const { data: banners } = useHeroBanners();
  const [current, setCurrent] = useState(0);
  const [showLead, setShowLead] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string>("#");

  if (!banners || banners.length === 0) return null;

  const banner = banners[current];

  const handleCTA = () => {
    setPendingUrl(banner.link_url);
    setShowLead(true);
  };

  const handleLeadDone = () => {
    setShowLead(false);
    if (pendingUrl && pendingUrl !== "#") {
      window.location.href = pendingUrl;
    }
  };

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="relative rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-48 md:h-72 lg:h-80 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent rounded-2xl" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                {banner.title && (
                  <h3 className="text-xl md:text-3xl font-bold text-background mb-3">{banner.title}</h3>
                )}
                <Button
                  onClick={handleCTA}
                  className="gradient-primary text-primary-foreground rounded-xl px-6 shadow-lg"
                >
                  {banner.cta_text || "Explore Now"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % banners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-background w-6" : "bg-background/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lead capture modal */}
        {showLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={() => setShowLead(false)}>
            <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <LeadCaptureForm
                variant="card"
                title="Get More Details"
                subtitle="Fill in your details and we'll connect you"
                source="hero_banner"
              />
              <button onClick={handleLeadDone} className="w-full mt-2 text-sm text-center text-muted-foreground hover:text-foreground py-2">
                Skip & Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
