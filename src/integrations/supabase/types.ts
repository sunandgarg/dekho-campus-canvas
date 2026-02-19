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
      ai_providers: {
        Row: {
          api_key_encrypted: string
          base_url: string
          created_at: string
          default_model: string
          display_name: string
          icon_emoji: string
          id: string
          is_active: boolean
          provider_name: string
          updated_at: string
        }
        Insert: {
          api_key_encrypted?: string
          base_url?: string
          created_at?: string
          default_model?: string
          display_name: string
          icon_emoji?: string
          id?: string
          is_active?: boolean
          provider_name: string
          updated_at?: string
        }
        Update: {
          api_key_encrypted?: string
          base_url?: string
          created_at?: string
          default_model?: string
          display_name?: string
          icon_emoji?: string
          id?: string
          is_active?: boolean
          provider_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          description: string
          featured_image: string
          id: string
          is_active: boolean
          meta_description: string
          meta_keywords: string
          meta_title: string
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          vertical: string
          views: number
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          description?: string
          featured_image?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          vertical?: string
          views?: number
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          description?: string
          featured_image?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          vertical?: string
          views?: number
        }
        Relationships: []
      }
      college_updates: {
        Row: {
          college_slug: string
          content: string
          created_at: string
          display_order: number
          event_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          college_slug: string
          content?: string
          created_at?: string
          display_order?: number
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          college_slug?: string
          content?: string
          created_at?: string
          display_order?: number
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          admission_process: string
          approvals: string[]
          banner_ad_image: string
          brochure_url: string
          campus_tour_video_url: string
          carousel_images: string[]
          category: string
          city: string
          course_fee_content: string
          courses_count: number
          created_at: string
          cutoff: string
          description: string
          eligibility_criteria: string
          established: number
          facilities: string[]
          facilities_content: string
          fees: string
          gallery_images: string[]
          highlights: string[]
          hostel_life: string
          id: string
          image: string
          is_active: boolean
          location: string
          logo: string
          meta_description: string
          meta_keywords: string
          meta_title: string
          naac_grade: string
          name: string
          placement: string
          placement_content: string
          ranking: string
          rankings_content: string
          rating: number
          reviews: number
          scholarship_details: string
          short_name: string
          slug: string
          square_ad_image: string
          state: string
          status: string
          tags: string[]
          top_recruiters: string[]
          type: string
          updated_at: string
        }
        Insert: {
          admission_process?: string
          approvals?: string[]
          banner_ad_image?: string
          brochure_url?: string
          campus_tour_video_url?: string
          carousel_images?: string[]
          category?: string
          city?: string
          course_fee_content?: string
          courses_count?: number
          created_at?: string
          cutoff?: string
          description?: string
          eligibility_criteria?: string
          established?: number
          facilities?: string[]
          facilities_content?: string
          fees?: string
          gallery_images?: string[]
          highlights?: string[]
          hostel_life?: string
          id?: string
          image?: string
          is_active?: boolean
          location?: string
          logo?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          naac_grade?: string
          name: string
          placement?: string
          placement_content?: string
          ranking?: string
          rankings_content?: string
          rating?: number
          reviews?: number
          scholarship_details?: string
          short_name?: string
          slug: string
          square_ad_image?: string
          state?: string
          status?: string
          tags?: string[]
          top_recruiters?: string[]
          type?: string
          updated_at?: string
        }
        Update: {
          admission_process?: string
          approvals?: string[]
          banner_ad_image?: string
          brochure_url?: string
          campus_tour_video_url?: string
          carousel_images?: string[]
          category?: string
          city?: string
          course_fee_content?: string
          courses_count?: number
          created_at?: string
          cutoff?: string
          description?: string
          eligibility_criteria?: string
          established?: number
          facilities?: string[]
          facilities_content?: string
          fees?: string
          gallery_images?: string[]
          highlights?: string[]
          hostel_life?: string
          id?: string
          image?: string
          is_active?: boolean
          location?: string
          logo?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          naac_grade?: string
          name?: string
          placement?: string
          placement_content?: string
          ranking?: string
          rankings_content?: string
          rating?: number
          reviews?: number
          scholarship_details?: string
          short_name?: string
          slug?: string
          square_ad_image?: string
          state?: string
          status?: string
          tags?: string[]
          top_recruiters?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          about_content: string
          admission_process: string
          avg_fees: string
          avg_salary: string
          careers: string[]
          category: string
          colleges_count: number
          created_at: string
          cutoff_content: string
          description: string
          domain: string
          duration: string
          duration_type: string
          eligibility: string
          fee: number
          fee_type: string
          fees_content: string
          full_name: string
          growth: string
          high_fee: number
          id: string
          image: string
          is_active: boolean
          level: string
          low_fee: number
          meta_description: string
          meta_keywords: string
          meta_title: string
          mode: string
          name: string
          placements_content: string
          rating: number
          recruiters_content: string
          scope_content: string
          short_description: string
          slug: string
          specialization_content: string
          specializations: string[]
          status: string
          study_type: string
          subjects: string[]
          subjects_content: string
          syllabus_content: string
          syllabus_pdf_url: string
          top_exams: string[]
          updated_at: string
        }
        Insert: {
          about_content?: string
          admission_process?: string
          avg_fees?: string
          avg_salary?: string
          careers?: string[]
          category?: string
          colleges_count?: number
          created_at?: string
          cutoff_content?: string
          description?: string
          domain?: string
          duration?: string
          duration_type?: string
          eligibility?: string
          fee?: number
          fee_type?: string
          fees_content?: string
          full_name?: string
          growth?: string
          high_fee?: number
          id?: string
          image?: string
          is_active?: boolean
          level?: string
          low_fee?: number
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          mode?: string
          name: string
          placements_content?: string
          rating?: number
          recruiters_content?: string
          scope_content?: string
          short_description?: string
          slug: string
          specialization_content?: string
          specializations?: string[]
          status?: string
          study_type?: string
          subjects?: string[]
          subjects_content?: string
          syllabus_content?: string
          syllabus_pdf_url?: string
          top_exams?: string[]
          updated_at?: string
        }
        Update: {
          about_content?: string
          admission_process?: string
          avg_fees?: string
          avg_salary?: string
          careers?: string[]
          category?: string
          colleges_count?: number
          created_at?: string
          cutoff_content?: string
          description?: string
          domain?: string
          duration?: string
          duration_type?: string
          eligibility?: string
          fee?: number
          fee_type?: string
          fees_content?: string
          full_name?: string
          growth?: string
          high_fee?: number
          id?: string
          image?: string
          is_active?: boolean
          level?: string
          low_fee?: number
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          mode?: string
          name?: string
          placements_content?: string
          rating?: number
          recruiters_content?: string
          scope_content?: string
          short_description?: string
          slug?: string
          specialization_content?: string
          specializations?: string[]
          status?: string
          study_type?: string
          subjects?: string[]
          subjects_content?: string
          syllabus_content?: string
          syllabus_pdf_url?: string
          top_exams?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          age_limit: string
          applicants: string
          application_end_date: string
          application_mode: string
          application_process: string
          application_start_date: string
          cast_wise_fee: string
          category: string
          center_content: string
          counselling_content: string
          created_at: string
          cutoff_content: string
          dates_content: string
          description: string
          duration: string
          eligibility: string
          exam_date: string
          exam_pattern: string
          exam_type: string
          frequency: string
          full_name: string
          gender_wise: string
          id: string
          image: string
          important_dates: Json
          is_active: boolean
          is_top_exam: boolean
          language: string
          level: string
          logo: string
          meta_description: string
          meta_keywords: string
          meta_title: string
          mode: string
          name: string
          negative_marking: boolean
          preparation_tips: string
          question_paper: string
          registration_url: string
          result_content: string
          result_date: string
          sample_paper_url: string
          seats: string
          short_name: string
          slug: string
          status: string
          summary_content: string
          syllabus: string[]
          top_colleges: string[]
          updated_at: string
          website: string
        }
        Insert: {
          age_limit?: string
          applicants?: string
          application_end_date?: string
          application_mode?: string
          application_process?: string
          application_start_date?: string
          cast_wise_fee?: string
          category?: string
          center_content?: string
          counselling_content?: string
          created_at?: string
          cutoff_content?: string
          dates_content?: string
          description?: string
          duration?: string
          eligibility?: string
          exam_date?: string
          exam_pattern?: string
          exam_type?: string
          frequency?: string
          full_name?: string
          gender_wise?: string
          id?: string
          image?: string
          important_dates?: Json
          is_active?: boolean
          is_top_exam?: boolean
          language?: string
          level?: string
          logo?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          mode?: string
          name: string
          negative_marking?: boolean
          preparation_tips?: string
          question_paper?: string
          registration_url?: string
          result_content?: string
          result_date?: string
          sample_paper_url?: string
          seats?: string
          short_name?: string
          slug: string
          status?: string
          summary_content?: string
          syllabus?: string[]
          top_colleges?: string[]
          updated_at?: string
          website?: string
        }
        Update: {
          age_limit?: string
          applicants?: string
          application_end_date?: string
          application_mode?: string
          application_process?: string
          application_start_date?: string
          cast_wise_fee?: string
          category?: string
          center_content?: string
          counselling_content?: string
          created_at?: string
          cutoff_content?: string
          dates_content?: string
          description?: string
          duration?: string
          eligibility?: string
          exam_date?: string
          exam_pattern?: string
          exam_type?: string
          frequency?: string
          full_name?: string
          gender_wise?: string
          id?: string
          image?: string
          important_dates?: Json
          is_active?: boolean
          is_top_exam?: boolean
          language?: string
          level?: string
          logo?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          mode?: string
          name?: string
          negative_marking?: boolean
          preparation_tips?: string
          question_paper?: string
          registration_url?: string
          result_content?: string
          result_date?: string
          sample_paper_url?: string
          seats?: string
          short_name?: string
          slug?: string
          status?: string
          summary_content?: string
          syllabus?: string[]
          top_colleges?: string[]
          updated_at?: string
          website?: string
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
      hero_banners: {
        Row: {
          created_at: string
          cta_text: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          link_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string
          title?: string
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
      page_seo: {
        Row: {
          canonical_url: string
          created_at: string
          id: string
          is_active: boolean
          meta_description: string
          meta_keywords: string
          meta_title: string
          og_description: string
          og_image: string
          og_title: string
          page_name: string
          page_path: string
          robots: string
          structured_data: string
          twitter_description: string
          twitter_image: string
          twitter_title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          page_name?: string
          page_path: string
          robots?: string
          structured_data?: string
          twitter_description?: string
          twitter_image?: string
          twitter_title?: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          page_name?: string
          page_path?: string
          robots?: string
          structured_data?: string
          twitter_description?: string
          twitter_image?: string
          twitter_title?: string
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
      promoted_programs: {
        Row: {
          badge: string
          badge_variant: string
          college_name: string
          college_slug: string
          course_slug: string
          created_at: string
          discount_percent: number
          display_order: number
          duration: string
          id: string
          is_active: boolean
          original_price: number
          program_type: string
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string
          badge_variant?: string
          college_name: string
          college_slug?: string
          course_slug?: string
          created_at?: string
          discount_percent?: number
          display_order?: number
          duration?: string
          id?: string
          is_active?: boolean
          original_price?: number
          program_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string
          badge_variant?: string
          college_name?: string
          college_slug?: string
          course_slug?: string
          created_at?: string
          discount_percent?: number
          display_order?: number
          duration?: string
          id?: string
          is_active?: boolean
          original_price?: number
          program_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_reviews: {
        Row: {
          batch_year: number
          college_slug: string
          cons: string
          content: string
          course: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_verified: boolean
          pros: string
          rating: number
          reviewer_name: string
          title: string
          updated_at: string
        }
        Insert: {
          batch_year?: number
          college_slug: string
          cons?: string
          content?: string
          course?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_verified?: boolean
          pros?: string
          rating?: number
          reviewer_name?: string
          title?: string
          updated_at?: string
        }
        Update: {
          batch_year?: number
          college_slug?: string
          cons?: string
          content?: string
          course?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_verified?: boolean
          pros?: string
          rating?: number
          reviewer_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      trusted_partners: {
        Row: {
          college_slug: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          logo_url: string
          name: string
          updated_at: string
        }
        Insert: {
          college_slug?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string
          name: string
          updated_at?: string
        }
        Update: {
          college_slug?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string
          name?: string
          updated_at?: string
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
