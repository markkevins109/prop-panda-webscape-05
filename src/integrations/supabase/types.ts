export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_profiles: {
        Row: {
          company_name: string
          created_at: string
          email: string
          experience: number
          id: string
          name: string
          phone_number: string
          specialization: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          experience: number
          id: string
          name: string
          phone_number: string
          specialization: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          experience?: number
          id?: string
          name?: string
          phone_number?: string
          specialization?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_answers: {
        Row: {
          answer_text: string
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          answer_text: string
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          answer_text?: string
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "community_users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_questions: {
        Row: {
          created_at: string
          id: string
          property_interest: string | null
          question_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_interest?: string | null
          question_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_interest?: string | null
          question_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "community_users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          property_interest: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          property_interest?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          property_interest?: string | null
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          agency_name: string
          contact_person_name: string
          created_at: string | null
          email: string
          id: string
          office_address: string
          operating_areas: string
          phone_number: string
          profile_purpose: string
          specializations: string[]
          updated_at: string | null
          user_id: string
          working_hours: string
          years_experience: number
        }
        Insert: {
          agency_name: string
          contact_person_name: string
          created_at?: string | null
          email: string
          id?: string
          office_address: string
          operating_areas: string
          phone_number: string
          profile_purpose: string
          specializations: string[]
          updated_at?: string | null
          user_id: string
          working_hours: string
          years_experience: number
        }
        Update: {
          agency_name?: string
          contact_person_name?: string
          created_at?: string | null
          email?: string
          id?: string
          office_address?: string
          operating_areas?: string
          phone_number?: string
          profile_purpose?: string
          specializations?: string[]
          updated_at?: string | null
          user_id?: string
          working_hours?: string
          years_experience?: number
        }
        Relationships: []
      }
      individual_profiles: {
        Row: {
          agency_name: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          office_address: string
          operating_areas: string
          phone_number: string
          profile_purpose: string
          specializations: string[]
          updated_at: string | null
          user_id: string
          working_hours: string
          years_experience: number
        }
        Insert: {
          agency_name: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          office_address: string
          operating_areas: string
          phone_number: string
          profile_purpose: string
          specializations: string[]
          updated_at?: string | null
          user_id: string
          working_hours: string
          years_experience: number
        }
        Update: {
          agency_name?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          office_address?: string
          operating_areas?: string
          phone_number?: string
          profile_purpose?: string
          specializations?: string[]
          updated_at?: string | null
          user_id?: string
          working_hours?: string
          years_experience?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          is_profile_complete: boolean | null
          location: string | null
          organization: string | null
          phone: string | null
          preferred_property_type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          is_profile_complete?: boolean | null
          location?: string | null
          organization?: string | null
          phone?: string | null
          preferred_property_type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_profile_complete?: boolean | null
          location?: string | null
          organization?: string | null
          phone?: string | null
          preferred_property_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_listings: {
        Row: {
          available_date: string
          created_at: string
          id: string
          pets_allowed: boolean
          preferred_nationality: string
          preferred_profession: Database["public"]["Enums"]["profession_type"]
          preferred_race: Database["public"]["Enums"]["race_type"]
          property_address: string
          property_type: Database["public"]["Enums"]["property_type"]
          rent_per_month: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_date: string
          created_at?: string
          id?: string
          pets_allowed?: boolean
          preferred_nationality?: string
          preferred_profession?: Database["public"]["Enums"]["profession_type"]
          preferred_race?: Database["public"]["Enums"]["race_type"]
          property_address: string
          property_type: Database["public"]["Enums"]["property_type"]
          rent_per_month: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_date?: string
          created_at?: string
          id?: string
          pets_allowed?: boolean
          preferred_nationality?: string
          preferred_profession?: Database["public"]["Enums"]["profession_type"]
          preferred_race?: Database["public"]["Enums"]["race_type"]
          property_address?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          rent_per_month?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_listings_csv: {
        Row: {
          additional_data: Json | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          postcode: string | null
          property_id: string | null
          property_name: string | null
          property_type:
            | Database["public"]["Enums"]["property_listing_type"]
            | null
          room_type: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_data?: Json | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          postcode?: string | null
          property_id?: string | null
          property_name?: string | null
          property_type?:
            | Database["public"]["Enums"]["property_listing_type"]
            | null
          room_type?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_data?: Json | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          postcode?: string | null
          property_id?: string | null
          property_name?: string | null
          property_type?:
            | Database["public"]["Enums"]["property_listing_type"]
            | null
          room_type?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_account_types: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type"]
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "individual" | "company"
      profession_type: "RETIRED" | "STUDENT" | "PROFESSIONAL" | "ANY"
      property_listing_type: "HDB" | "LANDED" | "CONDOMINIUM" | "SHOP"
      property_type: "HDB" | "LANDED" | "CONDOMINIUM" | "SHOP"
      race_type: "INDIAN" | "CHINESE" | "MALAY" | "ANY"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["individual", "company"],
      profession_type: ["RETIRED", "STUDENT", "PROFESSIONAL", "ANY"],
      property_listing_type: ["HDB", "LANDED", "CONDOMINIUM", "SHOP"],
      property_type: ["HDB", "LANDED", "CONDOMINIUM", "SHOP"],
      race_type: ["INDIAN", "CHINESE", "MALAY", "ANY"],
    },
  },
} as const
