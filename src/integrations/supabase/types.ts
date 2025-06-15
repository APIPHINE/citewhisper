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
      iiif_manifests: {
        Row: {
          created_at: string
          host_name: string
          id: string
          manifest_url: string
          title: string
        }
        Insert: {
          created_at?: string
          host_name: string
          id?: string
          manifest_url: string
          title: string
        }
        Update: {
          created_at?: string
          host_name?: string
          id?: string
          manifest_url?: string
          title?: string
        }
        Relationships: []
      }
      original_sources: {
        Row: {
          archive_url: string | null
          author: string | null
          created_at: string | null
          edition: string | null
          id: string
          language: string | null
          notes: string | null
          page_reference: string | null
          publication_year: string | null
          publisher: string | null
          source_type: string | null
          title: string | null
          verified_by: string | null
        }
        Insert: {
          archive_url?: string | null
          author?: string | null
          created_at?: string | null
          edition?: string | null
          id?: string
          language?: string | null
          notes?: string | null
          page_reference?: string | null
          publication_year?: string | null
          publisher?: string | null
          source_type?: string | null
          title?: string | null
          verified_by?: string | null
        }
        Update: {
          archive_url?: string | null
          author?: string | null
          created_at?: string | null
          edition?: string | null
          id?: string
          language?: string | null
          notes?: string | null
          page_reference?: string | null
          publication_year?: string | null
          publisher?: string | null
          source_type?: string | null
          title?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      quote_genconten: {
        Row: {
          academic_citation_style: string | null
          alt_text: string | null
          audio_url: string | null
          audio_voice_style: string | null
          created_at: string | null
          id: string
          image_url: string | null
          language: string | null
          quote_id: string
          seo_keywords: string[] | null
          seo_slug: string | null
          style_description: string | null
          transcript_or_caption_url: string | null
        }
        Insert: {
          academic_citation_style?: string | null
          alt_text?: string | null
          audio_url?: string | null
          audio_voice_style?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          language?: string | null
          quote_id: string
          seo_keywords?: string[] | null
          seo_slug?: string | null
          style_description?: string | null
          transcript_or_caption_url?: string | null
        }
        Update: {
          academic_citation_style?: string | null
          alt_text?: string | null
          audio_url?: string | null
          audio_voice_style?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          language?: string | null
          quote_id?: string
          seo_keywords?: string[] | null
          seo_slug?: string | null
          style_description?: string | null
          transcript_or_caption_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_genconten_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_paraphrases: {
        Row: {
          audience_context: string | null
          created_at: string | null
          creator_name: string | null
          id: string
          language: string
          paraphrase_text: string
          paraphrase_type: string | null
          quote_id: string
        }
        Insert: {
          audience_context?: string | null
          created_at?: string | null
          creator_name?: string | null
          id?: string
          language: string
          paraphrase_text: string
          paraphrase_type?: string | null
          quote_id: string
        }
        Update: {
          audience_context?: string | null
          created_at?: string | null
          creator_name?: string | null
          id?: string
          language?: string
          paraphrase_text?: string
          paraphrase_type?: string | null
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_paraphrases_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_topics: {
        Row: {
          id: string
          quote_id: string
          topic_id: string
        }
        Insert: {
          id?: string
          quote_id: string
          topic_id: string
        }
        Update: {
          id?: string
          quote_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_topics_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author_name: string | null
          date_original: string | null
          id: string
          inserted_at: string | null
          quote_context: string | null
          quote_image_url: string | null
          quote_text: string
          seo_keywords: string[] | null
          seo_slug: string | null
          source_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          date_original?: string | null
          id?: string
          inserted_at?: string | null
          quote_context?: string | null
          quote_image_url?: string | null
          quote_text: string
          seo_keywords?: string[] | null
          seo_slug?: string | null
          source_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          date_original?: string | null
          id?: string
          inserted_at?: string | null
          quote_context?: string | null
          quote_image_url?: string | null
          quote_text?: string
          seo_keywords?: string[] | null
          seo_slug?: string | null
          source_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotes_source_id"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "original_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          id: string
          seo_slug: string | null
          topic_name: string | null
        }
        Insert: {
          id?: string
          seo_slug?: string | null
          topic_name?: string | null
        }
        Update: {
          id?: string
          seo_slug?: string | null
          topic_name?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          id: string
          language: string
          publication: string | null
          publication_date: string | null
          quote_id: string | null
          source: string | null
          source_reference: string | null
          source_url: string | null
          translated_text: string
          translation_notes: string | null
          translator: string | null
          translator_name: string | null
        }
        Insert: {
          id?: string
          language: string
          publication?: string | null
          publication_date?: string | null
          quote_id?: string | null
          source?: string | null
          source_reference?: string | null
          source_url?: string | null
          translated_text: string
          translation_notes?: string | null
          translator?: string | null
          translator_name?: string | null
        }
        Update: {
          id?: string
          language?: string
          publication?: string | null
          publication_date?: string | null
          quote_id?: string | null
          source?: string | null
          source_reference?: string | null
          source_url?: string | null
          translated_text?: string
          translation_notes?: string | null
          translator?: string | null
          translator_name?: string | null
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
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          privilege: Database["public"]["Enums"]["user_privilege"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          privilege?: Database["public"]["Enums"]["user_privilege"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          privilege?: Database["public"]["Enums"]["user_privilege"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_privilege: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_privilege"]
      }
      has_privilege_level: {
        Args: {
          user_id: string
          required_level: Database["public"]["Enums"]["user_privilege"]
        }
        Returns: boolean
      }
      increment_quote_share_count: {
        Args: Record<PropertyKey, never> | { quote_id: string }
        Returns: undefined
      }
    }
    Enums: {
      user_privilege: "user" | "moderator" | "admin" | "super_admin"
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
      user_privilege: ["user", "moderator", "admin", "super_admin"],
    },
  },
} as const
