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
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          id: string
          new_values: Json | null
          old_values: Json | null
          target_user_id: string | null
          timestamp: string
        }
        Insert: {
          action: string
          admin_user_id: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          timestamp?: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
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
      cms_article_categories: {
        Row: {
          article_id: string | null
          category_id: string | null
          id: string
        }
        Insert: {
          article_id?: string | null
          category_id?: string | null
          id?: string
        }
        Update: {
          article_id?: string | null
          category_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_article_categories_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "cms_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_article_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_article_tags: {
        Row: {
          article_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          article_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          article_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "cms_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "cms_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_articles: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      cms_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_comments: {
        Row: {
          author_email: string | null
          author_id: string | null
          author_name: string | null
          content: string
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          parent_id: string | null
          status: string | null
        }
        Insert: {
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          content: string
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          status?: string | null
        }
        Update: {
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          content?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media: {
        Row: {
          alt_text: string | null
          approval_status: string | null
          caption: string | null
          created_at: string | null
          file_path: string
          file_size: number
          filename: string
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_filename: string
          reviewed_at: string | null
          reviewed_by: string | null
          uploaded_by: string
        }
        Insert: {
          alt_text?: string | null
          approval_status?: string | null
          caption?: string | null
          created_at?: string | null
          file_path: string
          file_size: number
          filename: string
          id?: string
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_filename: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          uploaded_by: string
        }
        Update: {
          alt_text?: string | null
          approval_status?: string | null
          caption?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          mime_type?: string
          original_filename?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_homepage: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          template: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_homepage?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          template?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_homepage?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          template?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: []
      }
      cms_tags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      edit_suggestions: {
        Row: {
          admin_notes: string | null
          content_id: string | null
          content_type: string
          created_at: string | null
          id: string
          reason: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["suggestion_status"] | null
          suggested_by: string | null
          suggested_changes: Json
        }
        Insert: {
          admin_notes?: string | null
          content_id?: string | null
          content_type: string
          created_at?: string | null
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"] | null
          suggested_by?: string | null
          suggested_changes: Json
        }
        Update: {
          admin_notes?: string | null
          content_id?: string | null
          content_type?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"] | null
          suggested_by?: string | null
          suggested_changes?: Json
        }
        Relationships: []
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
          display_name: string | null
          id: string
          privilege: Database["public"]["Enums"]["user_privilege"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          display_name?: string | null
          id?: string
          privilege?: Database["public"]["Enums"]["user_privilege"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          display_name?: string | null
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
      get_users_for_admin: {
        Args: { requesting_user_id?: string }
        Returns: {
          user_id: string
          email: string
          full_name: string
          privilege: Database["public"]["Enums"]["user_privilege"]
          created_at: string
        }[]
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
      secure_update_user_privilege: {
        Args: {
          target_user_id: string
          new_privilege: Database["public"]["Enums"]["user_privilege"]
          admin_user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      content_status: "draft" | "review" | "published" | "archived"
      media_type: "image" | "video" | "audio" | "document" | "other"
      suggestion_status: "pending" | "approved" | "rejected" | "implemented"
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
      content_status: ["draft", "review", "published", "archived"],
      media_type: ["image", "video", "audio", "document", "other"],
      suggestion_status: ["pending", "approved", "rejected", "implemented"],
      user_privilege: ["user", "moderator", "admin", "super_admin"],
    },
  },
} as const
