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
      challenges: {
        Row: {
          id: string
          title: string
          company: string
          company_logo_url?: string | null
          description: string
          long_description: string
          difficulty: string
          participants: number
          deadline: string
          tags: string[]
          featured: boolean
          created_at: string
          updated_at?: string | null
          created_by?: string | null
        }
        Insert: {
          id?: string
          title: string
          company: string
          company_logo_url?: string | null
          description: string
          long_description: string
          difficulty: string
          participants?: number
          deadline: string
          tags: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          company?: string
          company_logo_url?: string | null
          description?: string
          long_description?: string
          difficulty?: string
          participants?: number
          deadline?: string
          tags?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
      }
      challenge_participants: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          submitted_at: string
          score?: number | null
          status: "pending" | "reviewed" | "rejected"
          feedback?: string | null
          github_url?: string | null
          video_url?: string | null
          presentation_url?: string | null
          description?: string | null
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          submitted_at?: string
          score?: number | null
          status?: "pending" | "reviewed" | "rejected"
          feedback?: string | null
          github_url?: string | null
          video_url?: string | null
          presentation_url?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          submitted_at?: string
          score?: number | null
          status?: "pending" | "reviewed" | "rejected"
          feedback?: string | null
          github_url?: string | null
          video_url?: string | null
          presentation_url?: string | null
          description?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          user_type?: "participant" | "company" | null
          company_name?: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          user_type?: "participant" | "company" | null
          company_name?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          user_type?: "participant" | "company" | null
          company_name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
