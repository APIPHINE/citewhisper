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
          created_at: string | null
          id: string
          isbn: string | null
          location: string | null
          publication_date: string | null
          publisher: string | null
          quote_id: string
          source_url: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          isbn?: string | null
          location?: string | null
          publication_date?: string | null
          publisher?: string | null
          quote_id: string
          source_url?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
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
            foreignKeyName: "fk_original_sources_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
          quote_id: string | null
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
          quote_id?: string | null
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
          quote_id?: string | null
          seo_keywords?: string[] | null
          seo_slug?: string | null
          style_description?: string | null
          transcript_or_caption_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_genconten_quote_id"
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
          language: string | null
          paraphrase_text: string | null
          paraphrase_type: string | null
          quote_id: string | null
        }
        Insert: {
          audience_context?: string | null
          created_at?: string | null
          creator_name?: string | null
          id?: string
          language?: string | null
          paraphrase_text?: string | null
          paraphrase_type?: string | null
          quote_id?: string | null
        }
        Update: {
          audience_context?: string | null
          created_at?: string | null
          creator_name?: string | null
          id?: string
          language?: string | null
          paraphrase_text?: string | null
          paraphrase_type?: string | null
          quote_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_paraphrases_quote_id"
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
          quote_id: string | null
          topic_id: string | null
        }
        Insert: {
          id?: string
          quote_id?: string | null
          topic_id?: string | null
        }
        Update: {
          id?: string
          quote_id?: string | null
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_topics_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quote_topics_topic_id"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
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
          seo_keywords: string[] | null
          seo_slug: string | null
          source: string | null
          source_publication_date: string | null
          source_url: string | null
          theme: string | null
          topics: string[] | null
          updated_at: string | null
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
          seo_keywords?: string[] | null
          seo_slug?: string | null
          source?: string | null
          source_publication_date?: string | null
          source_url?: string | null
          theme?: string | null
          topics?: string[] | null
          updated_at?: string | null
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
          seo_keywords?: string[] | null
          seo_slug?: string | null
          source?: string | null
          source_publication_date?: string | null
          source_url?: string | null
          theme?: string | null
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
          language: string | null
          publication: string | null
          publication_date: string | null
          quote_id: string | null
          source: string | null
          source_reference: string | null
          source_url: string | null
          text: string | null
          translation_notes: string | null
          translator: string | null
          translator_name: string | null
        }
        Insert: {
          id?: string
          language?: string | null
          publication?: string | null
          publication_date?: string | null
          quote_id?: string | null
          source?: string | null
          source_reference?: string | null
          source_url?: string | null
          text?: string | null
          translation_notes?: string | null
          translator?: string | null
          translator_name?: string | null
        }
        Update: {
          id?: string
          language?: string | null
          publication?: string | null
          publication_date?: string | null
          quote_id?: string | null
          source?: string | null
          source_reference?: string | null
          source_url?: string | null
          text?: string | null
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
