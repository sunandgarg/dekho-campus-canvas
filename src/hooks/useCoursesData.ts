import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type DbCourse = {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  category: string;
  duration: string;
  level: string;
  colleges_count: number;
  avg_fees: string;
  avg_salary: string;
  growth: string;
  description: string;
  eligibility: string;
  top_exams: string[];
  careers: string[];
  subjects: string[];
  image: string;
  mode: string;
  specializations: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function useDbCourses() {
  return useQuery({
    queryKey: ["db-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as DbCourse[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllDbCourses() {
  return useQuery({
    queryKey: ["db-courses-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as DbCourse[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDbCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ["db-course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data as DbCourse | null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (course: Partial<DbCourse> & { slug: string; name: string }) => {
      if (course.id) {
        const { id, created_at, updated_at, ...rest } = course;
        const { error } = await supabase.from("courses").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { id, created_at, updated_at, ...rest } = course;
        const { error } = await supabase.from("courses").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["db-courses"] });
      toast.success("Course saved!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["db-courses"] });
      toast.success("Course deleted!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });
}
