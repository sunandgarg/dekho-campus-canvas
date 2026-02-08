import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string;
  link_url: string;
  image_url: string | null;
  variant: string;
  bg_gradient: string;
  target_type: string;
  target_page: string | null;
  target_item_slug: string | null;
  target_city: string | null;
  position: string;
  priority: number;
  is_active: boolean;
}

/**
 * Fetches ads with fallback priority:
 * 1. Item-specific ad (specific college/course/exam/article)
 * 2. Page + city specific
 * 3. Page-specific (e.g., "colleges" page)
 * 4. City-specific universal
 * 5. Universal fallback
 */
export function useAds(options?: {
  page?: string;
  itemSlug?: string;
  city?: string;
  variant?: string;
  position?: string;
}) {
  return useQuery({
    queryKey: ["ads", options],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Ad[];
    },
    select: (allAds) => {
      if (!allAds.length) return null;

      const { page, itemSlug, city, variant, position } = options ?? {};

      // Filter by variant and position if specified
      let candidates = allAds;
      if (variant) candidates = candidates.filter((a) => a.variant === variant);
      if (position) candidates = candidates.filter((a) => a.position === position);

      // Priority 1: Item-specific
      if (itemSlug) {
        const itemAd = candidates.find(
          (a) => a.target_type === "item" && a.target_item_slug === itemSlug
        );
        if (itemAd) return itemAd;
      }

      // Priority 2: Page + city specific
      if (page && city) {
        const pageCityAd = candidates.find(
          (a) => a.target_type === "page" && a.target_page === page && a.target_city === city
        );
        if (pageCityAd) return pageCityAd;
      }

      // Priority 3: Page-specific
      if (page) {
        const pageAd = candidates.find(
          (a) => a.target_type === "page" && a.target_page === page && !a.target_city
        );
        if (pageAd) return pageAd;
      }

      // Priority 4: City-specific universal
      if (city) {
        const cityAd = candidates.find(
          (a) => a.target_type === "city" && a.target_city === city
        );
        if (cityAd) return cityAd;
      }

      // Priority 5: Universal fallback
      const universalAd = candidates.find((a) => a.target_type === "universal");
      return universalAd ?? null;
    },
    staleTime: 60_000, // cache for 1 minute
  });
}

/** Fetch all ads for admin management */
export function useAllAds() {
  return useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Ad[];
    },
  });
}
