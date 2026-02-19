import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CollegeUpdate = {
  id: string;
  college_slug: string;
  type: string;
  title: string;
  content: string;
  image_url: string | null;
  event_date: string | null;
  link_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function useCollegeUpdates(slug: string | undefined) {
  return useQuery({
    queryKey: ["college-updates", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_updates")
        .select("*")
        .eq("college_slug", slug!)
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data as CollegeUpdate[];
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllCollegeUpdates() {
  return useQuery({
    queryKey: ["admin-college-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_updates")
        .select("*")
        .order("college_slug")
        .order("type")
        .order("display_order");
      if (error) throw error;
      return data as CollegeUpdate[];
    },
    staleTime: 2 * 60 * 1000,
  });
}
