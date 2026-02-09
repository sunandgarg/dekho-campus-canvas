import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ExamImportantDate = { event: string; date: string };

export type DbExam = {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  category: string;
  level: string;
  exam_date: string;
  applicants: string;
  eligibility: string;
  mode: string;
  description: string;
  important_dates: ExamImportantDate[];
  syllabus: string[];
  top_colleges: string[];
  image: string;
  registration_url: string;
  duration: string;
  exam_type: string;
  language: string;
  frequency: string;
  application_mode: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function useDbExams() {
  return useQuery({
    queryKey: ["db-exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return (data ?? []).map(mapExam);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllDbExams() {
  return useQuery({
    queryKey: ["db-exams-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data ?? []).map(mapExam);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDbExam(slug: string | undefined) {
  return useQuery({
    queryKey: ["db-exam", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? mapExam(data) : null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

function mapExam(row: any): DbExam {
  return {
    ...row,
    important_dates: Array.isArray(row.important_dates) ? row.important_dates : JSON.parse(row.important_dates || "[]"),
  };
}

export function useSaveExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exam: Partial<DbExam> & { slug: string; name: string }) => {
      const payload = {
        ...exam,
        important_dates: JSON.stringify(exam.important_dates ?? []),
      };
      if (exam.id) {
        const { id, created_at, updated_at, ...rest } = payload;
        const { error } = await supabase.from("exams").update(rest as any).eq("id", id);
        if (error) throw error;
      } else {
        const { id, created_at, updated_at, ...rest } = payload;
        const { error } = await supabase.from("exams").insert(rest as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["db-exams"] });
      toast.success("Exam saved!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });
}

export function useDeleteExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["db-exams"] });
      toast.success("Exam deleted!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });
}
