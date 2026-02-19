import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type DbCollege = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  location: string;
  city: string;
  state: string;
  type: string;
  category: string;
  rating: number;
  reviews: number;
  courses_count: number;
  fees: string;
  placement: string;
  ranking: string;
  image: string;
  tags: string[];
  established: number;
  description: string;
  highlights: string[];
  facilities: string[];
  approvals: string[];
  naac_grade: string;
  top_recruiters: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  status: string;
  logo: string;
  carousel_images: string[];
  brochure_url: string;
  eligibility_criteria: string;
  admission_process: string;
  scholarship_details: string;
  hostel_life: string;
  gallery_images: string[];
  cutoff: string;
  course_fee_content: string;
  placement_content: string;
  rankings_content: string;
  facilities_content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  banner_ad_image: string;
  square_ad_image: string;
  campus_tour_video_url: string;
};

export function useDbColleges() {
  return useQuery({
    queryKey: ["db-colleges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as DbCollege[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllDbColleges() {
  return useQuery({
    queryKey: ["db-colleges-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as DbCollege[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDbCollege(slug: string | undefined) {
  return useQuery({
    queryKey: ["db-college", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data as DbCollege | null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollegesByState(state: string | undefined, excludeSlug?: string) {
  return useQuery({
    queryKey: ["db-colleges-state", state, excludeSlug],
    queryFn: async () => {
      let q = supabase.from("colleges").select("*").eq("state", state!).eq("is_active", true).limit(6);
      if (excludeSlug) q = q.neq("slug", excludeSlug);
      const { data, error } = await q;
      if (error) throw error;
      return data as DbCollege[];
    },
    enabled: !!state,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollegesByCategory(category: string | undefined, excludeSlug?: string) {
  return useQuery({
    queryKey: ["db-colleges-category", category, excludeSlug],
    queryFn: async () => {
      let q = supabase.from("colleges").select("*").eq("category", category!).eq("is_active", true).limit(6);
      if (excludeSlug) q = q.neq("slug", excludeSlug);
      const { data, error } = await q;
      if (error) throw error;
      return data as DbCollege[];
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveCollege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (college: Partial<DbCollege> & { slug: string; name: string }) => {
      if (college.id) {
        const { id, created_at, updated_at, ...rest } = college;
        const { error } = await supabase.from("colleges").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { id, created_at, updated_at, ...rest } = college;
        const { error } = await supabase.from("colleges").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["db-colleges"] });
      toast.success("College saved!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });
}

export function useDeleteCollege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("colleges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["db-colleges"] });
      toast.success("College deleted!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });
}
