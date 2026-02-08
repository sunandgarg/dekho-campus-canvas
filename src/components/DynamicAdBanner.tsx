import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { useAds } from "@/hooks/useAds";

interface DynamicAdBannerProps {
  variant?: "horizontal" | "vertical" | "square" | "leaderboard";
  position?: string;
  page?: string;
  itemSlug?: string;
  city?: string;
  className?: string;
}

export function DynamicAdBanner({
  variant = "horizontal",
  position = "mid-page",
  page,
  itemSlug,
  city,
  className = "",
}: DynamicAdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { data: ad } = useAds({ page, itemSlug, city, variant, position });

  if (!isVisible || !ad) return null;

  const { title, subtitle, cta_text, link_url, bg_gradient } = ad;

  if (variant === "leaderboard") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-r ${bg_gradient} h-14 md:h-16 flex items-center justify-center px-4 ${className}`}
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <p className="text-white text-sm md:text-base font-medium truncate animate-marquee">
            {title}
          </p>
          <a
            href={link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-4 py-1.5 bg-white text-foreground text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            {cta_text}
          </a>
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white" aria-label="Close ad">
          <X className="w-4 h-4" />
        </button>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/50 uppercase tracking-wider">Ad</span>
      </motion.div>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative bg-gradient-to-r ${bg_gradient} h-24 md:h-28 rounded-2xl overflow-hidden ${className}`}
      >
        <div className="relative h-full flex items-center justify-between px-6 md:px-8">
          <div className="flex-1">
            <h4 className="text-lg md:text-xl font-bold text-white">{title}</h4>
            {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
          </div>
          <a href={link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white text-foreground font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
            {cta_text}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <span className="absolute left-3 bottom-2 text-[10px] text-white/40 uppercase tracking-wider">Ad</span>
      </motion.div>
    );
  }

  if (variant === "vertical") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`relative bg-gradient-to-b ${bg_gradient} min-h-[280px] rounded-2xl overflow-hidden flex flex-col justify-between p-5 ${className}`}
      >
        <div>
          <span className="text-[10px] text-white/50 uppercase tracking-wider mb-3 block">Ad</span>
          <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
        <a href={link_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-white text-foreground font-semibold rounded-xl hover:bg-white/90 transition-colors mt-4 text-center block">
          {cta_text}
        </a>
      </motion.div>
    );
  }

  // Square
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative bg-gradient-to-br ${bg_gradient} aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center p-5 text-center ${className}`}
    >
      <span className="absolute top-2 left-2 text-[10px] text-white/50 uppercase tracking-wider">Ad</span>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      {subtitle && <p className="text-white/80 text-sm mb-4">{subtitle}</p>}
      <a href={link_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white text-foreground font-semibold rounded-xl hover:bg-white/90 transition-colors">
        {cta_text}
      </a>
    </motion.div>
  );
}
