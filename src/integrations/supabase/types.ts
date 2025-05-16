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
      cited_by: {
        Row: {
          embed_date: string
          id: string
          quote_id: string | null
          site_name: string
          site_url: string
        }
        Insert: {
          embed_date: string
          id?: string
          quote_id?: string | null
          site_name: string
          site_url: string
        }
        Update: {
          embed_date?: string
          id?: string
          quote_id?: string | null
          site_name?: string
          site_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "cited_by_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      original_sources: {
        Row: {
          isbn: string | null
          location: string | null
          publication_date: string | null
          publisher: string | null
          quote_id: string
          source_url: string | null
          title: string | null
        }
        Insert: {
          isbn?: string | null
          location?: string | null
          publication_date?: string | null
          publisher?: string | null
          quote_id: string
          source_url?: string | null
          title?: string | null
        }
        Update: {
          isbn?: string | null
          location?: string | null
          publication_date?: string | null
          publisher?: string | null
          quote_id?: string
          source_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "original_sources_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author: string
          citation_apa: string | null
          citation_chicago: string | null
          citation_mla: string | null
          context: string | null
          date: string | null
          emotional_tone: string | null
          historical_context: string | null
          id: string
          inserted_at: string | null
          keywords: string[] | null
          original_language: string | null
          original_text: string | null
          quote_image_url: string | null
          quote_text: string
          source: string | null
          source_publication_date: string | null
          source_url: string | null
          theme: string | null
          topics: string[] | null
        }
        Insert: {
          author: string
          citation_apa?: string | null
          citation_chicago?: string | null
          citation_mla?: string | null
          context?: string | null
          date?: string | null
          emotional_tone?: string | null
          historical_context?: string | null
          id?: string
          inserted_at?: string | null
          keywords?: string[] | null
          original_language?: string | null
          original_text?: string | null
          quote_image_url?: string | null
          quote_text: string
          source?: string | null
          source_publication_date?: string | null
          source_url?: string | null
          theme?: string | null
          topics?: string[] | null
        }
        Update: {
          author?: string
          citation_apa?: string | null
          citation_chicago?: string | null
          citation_mla?: string | null
          context?: string | null
          date?: string | null
          emotional_tone?: string | null
          historical_context?: string | null
          id?: string
          inserted_at?: string | null
          keywords?: string[] | null
          original_language?: string | null
          original_text?: string | null
          quote_image_url?: string | null
          quote_text?: string
          source?: string | null
          source_publication_date?: string | null
          source_url?: string | null
          theme?: string | null
          topics?: string[] | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          id: string
          language: string | null
          publication: string | null
          publication_date: string | null
          quote_id: string | null
          source: string | null
          source_url: string | null
          text: string | null
          translator: string | null
        }
        Insert: {
          id?: string
          language?: string | null
          publication?: string | null
          publication_date?: string | null
          quote_id?: string | null
          source?: string | null
          source_url?: string | null
          text?: string | null
          translator?: string | null
        }
        Update: {
          id?: string
          language?: string | null
          publication?: string | null
          publication_date?: string | null
          quote_id?: string | null
          source?: string | null
          source_url?: string | null
          text?: string | null
          translator?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_quote_share_count: {
        Args: Record<PropertyKey, never> | { quote_id: string }
        Returns: undefined
      }
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
