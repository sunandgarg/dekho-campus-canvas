export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          bg_gradient: string
          created_at: string
          cta_text: string
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string
          position: string
          priority: number
          start_date: string | null
          subtitle: string | null
          target_city: string | null
          target_item_slug: string | null
          target_page: string | null
          target_type: string
          title: string
          updated_at: string
          variant: string
        }
        Insert: {
          bg_gradient?: string
          created_at?: string
          cta_text?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string
          position?: string
          priority?: number
          start_date?: string | null
          subtitle?: string | null
          target_city?: string | null
          target_item_slug?: string | null
          target_page?: string | null
          target_type?: string
          title: string
          updated_at?: string
          variant?: string
        }
        Update: {
          bg_gradient?: string
          created_at?: string
          cta_text?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string
          position?: string
          priority?: number
          start_date?: string | null
          subtitle?: string | null
          target_city?: string | null
          target_item_slug?: string | null
          target_page?: string | null
          target_type?: string
          title?: string
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          approvals: string[]
          category: string
          city: string
          courses_count: number
          created_at: string
          description: string
          established: number
          facilities: string[]
          fees: string
          highlights: string[]
          id: string
          image: string
          is_active: boolean
          location: string
          naac_grade: string
          name: string
          placement: string
          ranking: string
          rating: number
          reviews: number
          short_name: string
          slug: string
          state: string
          tags: string[]
          top_recruiters: string[]
          type: string
          updated_at: string
        }
        Insert: {
          approvals?: string[]
          category?: string
          city?: string
          courses_count?: number
          created_at?: string
          description?: string
          established?: number
          facilities?: string[]
          fees?: string
          highlights?: string[]
          id?: string
          image?: string
          is_active?: boolean
          location?: string
          naac_grade?: string
          name: string
          placement?: string
          ranking?: string
          rating?: number
          reviews?: number
          short_name?: string
          slug: string
          state?: string
          tags?: string[]
          top_recruiters?: string[]
          type?: string
          updated_at?: string
        }
        Update: {
          approvals?: string[]
          category?: string
          city?: string
          courses_count?: number
          created_at?: string
          description?: string
          established?: number
          facilities?: string[]
          fees?: string
          highlights?: string[]
          id?: string
          image?: string
          is_active?: boolean
          location?: string
          naac_grade?: string
          name?: string
          placement?: string
          ranking?: string
          rating?: number
          reviews?: number
          short_name?: string
          slug?: string
          state?: string
          tags?: string[]
          top_recruiters?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          avg_fees: string
          avg_salary: string
          careers: string[]
          category: string
          colleges_count: number
          created_at: string
          description: string
          duration: string
          eligibility: string
          full_name: string
          growth: string
          id: string
          image: string
          is_active: boolean
          level: string
          mode: string
          name: string
          slug: string
          specializations: string[]
          subjects: string[]
          top_exams: string[]
          updated_at: string
        }
        Insert: {
          avg_fees?: string
          avg_salary?: string
          careers?: string[]
          category?: string
          colleges_count?: number
          created_at?: string
          description?: string
          duration?: string
          eligibility?: string
          full_name?: string
          growth?: string
          id?: string
          image?: string
          is_active?: boolean
          level?: string
          mode?: string
          name: string
          slug: string
          specializations?: string[]
          subjects?: string[]
          top_exams?: string[]
          updated_at?: string
        }
        Update: {
          avg_fees?: string
          avg_salary?: string
          careers?: string[]
          category?: string
          colleges_count?: number
          created_at?: string
          description?: string
          duration?: string
          eligibility?: string
          full_name?: string
          growth?: string
          id?: string
          image?: string
          is_active?: boolean
          level?: string
          mode?: string
          name?: string
          slug?: string
          specializations?: string[]
          subjects?: string[]
          top_exams?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          applicants: string
          application_mode: string
          category: string
          created_at: string
          description: string
          duration: string
          eligibility: string
          exam_date: string
          exam_type: string
          frequency: string
          full_name: string
          id: string
          image: string
          important_dates: Json
          is_active: boolean
          language: string
          level: string
          mode: string
          name: string
          registration_url: string
          slug: string
          status: string
          syllabus: string[]
          top_colleges: string[]
          updated_at: string
        }
        Insert: {
          applicants?: string
          application_mode?: string
          category?: string
          created_at?: string
          description?: string
          duration?: string
          eligibility?: string
          exam_date?: string
          exam_type?: string
          frequency?: string
          full_name?: string
          id?: string
          image?: string
          important_dates?: Json
          is_active?: boolean
          language?: string
          level?: string
          mode?: string
          name: string
          registration_url?: string
          slug: string
          status?: string
          syllabus?: string[]
          top_colleges?: string[]
          updated_at?: string
        }
        Update: {
          applicants?: string
          application_mode?: string
          category?: string
          created_at?: string
          description?: string
          duration?: string
          eligibility?: string
          exam_date?: string
          exam_type?: string
          frequency?: string
          full_name?: string
          id?: string
          image?: string
          important_dates?: Json
          is_active?: boolean
          language?: string
          level?: string
          mode?: string
          name?: string
          registration_url?: string
          slug?: string
          status?: string
          syllabus?: string[]
          top_colleges?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          item_slug: string | null
          page: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          item_slug?: string | null
          page?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          item_slug?: string | null
          page?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_colleges: {
        Row: {
          category: string | null
          college_slug: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          state: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          college_slug: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          state?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          college_slug?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          city: string | null
          created_at: string
          current_situation: string | null
          email: string | null
          id: string
          initial_query: string | null
          interested_college_slug: string | null
          interested_course_slug: string | null
          interested_exam_slug: string | null
          name: string | null
          phone: string | null
          source: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          current_situation?: string | null
          email?: string | null
          id?: string
          initial_query?: string | null
          interested_college_slug?: string | null
          interested_course_slug?: string | null
          interested_exam_slug?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          current_situation?: string | null
          email?: string | null
          id?: string
          initial_query?: string | null
          interested_college_slug?: string | null
          interested_course_slug?: string | null
          interested_exam_slug?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      popular_places: {
        Row: {
          college_count: number
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          state: string
          updated_at: string
        }
        Insert: {
          college_count?: number
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          state: string
          updated_at?: string
        }
        Update: {
          college_count?: number
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
