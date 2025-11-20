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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          target_user_id: string | null
          timestamp: string
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          timestamp?: string
        }
        Update: {
          action?: string
          admin_user_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "fk_cms_articles_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      evidence_submissions: {
        Row: {
          approval_status: string | null
          attribution_metadata: Json | null
          created_at: string
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          quote_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_by: string
        }
        Insert: {
          approval_status?: string | null
          attribution_metadata?: Json | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          quote_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_by: string
        }
        Update: {
          approval_status?: string | null
          attribution_metadata?: Json | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          quote_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_submissions_quote_id_fkey"
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
      performance_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          metric_value: number
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          metric_value: number
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      popular_unverified_quotes: {
        Row: {
          actual_author_if_known: string | null
          alternative_attributions: Json | null
          attribution_notes: string | null
          commonly_attributed_to: string | null
          confidence_score: number | null
          created_at: string
          created_by: string | null
          earliest_known_date: string | null
          earliest_known_source: string | null
          id: string
          popularity_score: number | null
          quote_text: string
          research_notes: string | null
          source_app: string | null
          status: Database["public"]["Enums"]["popular_quote_status"] | null
          updated_at: string
          verification_attempts: Json | null
          verified_by: string | null
        }
        Insert: {
          actual_author_if_known?: string | null
          alternative_attributions?: Json | null
          attribution_notes?: string | null
          commonly_attributed_to?: string | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          earliest_known_date?: string | null
          earliest_known_source?: string | null
          id?: string
          popularity_score?: number | null
          quote_text: string
          research_notes?: string | null
          source_app?: string | null
          status?: Database["public"]["Enums"]["popular_quote_status"] | null
          updated_at?: string
          verification_attempts?: Json | null
          verified_by?: string | null
        }
        Update: {
          actual_author_if_known?: string | null
          alternative_attributions?: Json | null
          attribution_notes?: string | null
          commonly_attributed_to?: string | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          earliest_known_date?: string | null
          earliest_known_source?: string | null
          id?: string
          popularity_score?: number | null
          quote_text?: string
          research_notes?: string | null
          source_app?: string | null
          status?: Database["public"]["Enums"]["popular_quote_status"] | null
          updated_at?: string
          verification_attempts?: Json | null
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
      quote_attribution_research: {
        Row: {
          conclusion: string | null
          confidence_level: number | null
          created_at: string
          id: string
          quote_id: string
          research_notes: string
          researcher_id: string
          sources_consulted: Json | null
        }
        Insert: {
          conclusion?: string | null
          confidence_level?: number | null
          created_at?: string
          id?: string
          quote_id: string
          research_notes: string
          researcher_id: string
          sources_consulted?: Json | null
        }
        Update: {
          conclusion?: string | null
          confidence_level?: number | null
          created_at?: string
          id?: string
          quote_id?: string
          research_notes?: string
          researcher_id?: string
          sources_consulted?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_attribution_research_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "popular_unverified_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_drafts: {
        Row: {
          author_name: string | null
          created_at: string
          date_original: string | null
          evidence_image_name: string | null
          id: string
          image_url: string | null
          ocr_text: string | null
          quote_context: string | null
          quote_text: string | null
          source_info: Json | null
          topics: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          date_original?: string | null
          evidence_image_name?: string | null
          id?: string
          image_url?: string | null
          ocr_text?: string | null
          quote_context?: string | null
          quote_text?: string | null
          source_info?: Json | null
          topics?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          date_original?: string | null
          evidence_image_name?: string | null
          id?: string
          image_url?: string | null
          ocr_text?: string | null
          quote_context?: string | null
          quote_text?: string | null
          source_info?: Json | null
          topics?: string[] | null
          updated_at?: string
          user_id?: string
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
      quote_submissions: {
        Row: {
          author_name: string
          chapter_or_section: string | null
          citation_style: string | null
          confidence_score: number | null
          created_at: string
          device_type: string | null
          duplicate_check_performed: boolean | null
          evidence_type: string | null
          external_submission_id: string | null
          final_quote_id: string | null
          generated_citation: string | null
          id: string
          image_crop_coords: Json | null
          image_language_hint: string | null
          image_url: string | null
          is_translation: boolean | null
          ocr_text: string | null
          original_language: string | null
          potential_duplicate_ids: string[] | null
          processed_at: string | null
          processed_by: string | null
          processing_notes: string | null
          quote_rating: number | null
          quote_text: string
          quote_topics: string[] | null
          seo_keywords: string[] | null
          seo_slug: string | null
          source_app: string
          source_context_text: string | null
          source_date: string | null
          source_manifest_url: string | null
          source_title: string
          source_verification_status:
            | Database["public"]["Enums"]["source_verification_status"]
            | null
          status: string
          target_collection:
            | Database["public"]["Enums"]["target_collection_type"]
            | null
          translated_quote: string | null
          translation_language: string | null
          translator_name: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          author_name: string
          chapter_or_section?: string | null
          citation_style?: string | null
          confidence_score?: number | null
          created_at?: string
          device_type?: string | null
          duplicate_check_performed?: boolean | null
          evidence_type?: string | null
          external_submission_id?: string | null
          final_quote_id?: string | null
          generated_citation?: string | null
          id?: string
          image_crop_coords?: Json | null
          image_language_hint?: string | null
          image_url?: string | null
          is_translation?: boolean | null
          ocr_text?: string | null
          original_language?: string | null
          potential_duplicate_ids?: string[] | null
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          quote_rating?: number | null
          quote_text: string
          quote_topics?: string[] | null
          seo_keywords?: string[] | null
          seo_slug?: string | null
          source_app: string
          source_context_text?: string | null
          source_date?: string | null
          source_manifest_url?: string | null
          source_title: string
          source_verification_status?:
            | Database["public"]["Enums"]["source_verification_status"]
            | null
          status?: string
          target_collection?:
            | Database["public"]["Enums"]["target_collection_type"]
            | null
          translated_quote?: string | null
          translation_language?: string | null
          translator_name?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          author_name?: string
          chapter_or_section?: string | null
          citation_style?: string | null
          confidence_score?: number | null
          created_at?: string
          device_type?: string | null
          duplicate_check_performed?: boolean | null
          evidence_type?: string | null
          external_submission_id?: string | null
          final_quote_id?: string | null
          generated_citation?: string | null
          id?: string
          image_crop_coords?: Json | null
          image_language_hint?: string | null
          image_url?: string | null
          is_translation?: boolean | null
          ocr_text?: string | null
          original_language?: string | null
          potential_duplicate_ids?: string[] | null
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          quote_rating?: number | null
          quote_text?: string
          quote_topics?: string[] | null
          seo_keywords?: string[] | null
          seo_slug?: string | null
          source_app?: string
          source_context_text?: string | null
          source_date?: string | null
          source_manifest_url?: string | null
          source_title?: string
          source_verification_status?:
            | Database["public"]["Enums"]["source_verification_status"]
            | null
          status?: string
          target_collection?:
            | Database["public"]["Enums"]["target_collection_type"]
            | null
          translated_quote?: string | null
          translation_language?: string | null
          translator_name?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_submissions_final_quote_id_fkey"
            columns: ["final_quote_id"]
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
          created_by: string | null
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
          updated_by: string | null
        }
        Insert: {
          author_name?: string | null
          created_by?: string | null
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
          updated_by?: string | null
        }
        Update: {
          author_name?: string | null
          created_by?: string | null
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
          updated_by?: string | null
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
      rate_limit_log: {
        Row: {
          action: string
          attempt_count: number | null
          created_at: string
          id: string
          ip_address: unknown
          user_id: string | null
          window_start: string
        }
        Insert: {
          action: string
          attempt_count?: number | null
          created_at?: string
          id?: string
          ip_address?: unknown
          user_id?: string | null
          window_start?: string
        }
        Update: {
          action?: string
          attempt_count?: number | null
          created_at?: string
          id?: string
          ip_address?: unknown
          user_id?: string | null
          window_start?: string
        }
        Relationships: []
      }
      source_info: {
        Row: {
          act_scene: string | null
          amazon_link: string | null
          archive_location: string | null
          arxiv_id: string | null
          arxiv_link: string | null
          author: string | null
          backup_url: string | null
          call_number: string | null
          chapter_number: string | null
          chapter_title: string | null
          collection_name: string | null
          confidence_score: number | null
          created_at: string
          created_by: string | null
          doi: string | null
          doi_url: string | null
          edition: string | null
          google_books_link: string | null
          id: string
          isbn: string | null
          isbn_link: string | null
          issn: string | null
          issue_number: string | null
          journal_name: string | null
          jstor_link: string | null
          language: string | null
          line_number: string | null
          magazine_name: string | null
          minute_mark: string | null
          newspaper_name: string | null
          page_number: string | null
          page_range: string | null
          paragraph_number: string | null
          pmid: string | null
          primary_url: string | null
          publication_date: string | null
          publisher: string | null
          publisher_url: string | null
          pubmed_link: string | null
          quote_id: string | null
          section_title: string | null
          series_title: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          spotify_link: string | null
          stanza_number: string | null
          timestamp_end: string | null
          timestamp_start: string | null
          title: string | null
          translation_info: string | null
          updated_at: string
          updated_by: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          verse_reference: string | null
          volume_number: string | null
          youtube_link: string | null
        }
        Insert: {
          act_scene?: string | null
          amazon_link?: string | null
          archive_location?: string | null
          arxiv_id?: string | null
          arxiv_link?: string | null
          author?: string | null
          backup_url?: string | null
          call_number?: string | null
          chapter_number?: string | null
          chapter_title?: string | null
          collection_name?: string | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          doi?: string | null
          doi_url?: string | null
          edition?: string | null
          google_books_link?: string | null
          id?: string
          isbn?: string | null
          isbn_link?: string | null
          issn?: string | null
          issue_number?: string | null
          journal_name?: string | null
          jstor_link?: string | null
          language?: string | null
          line_number?: string | null
          magazine_name?: string | null
          minute_mark?: string | null
          newspaper_name?: string | null
          page_number?: string | null
          page_range?: string | null
          paragraph_number?: string | null
          pmid?: string | null
          primary_url?: string | null
          publication_date?: string | null
          publisher?: string | null
          publisher_url?: string | null
          pubmed_link?: string | null
          quote_id?: string | null
          section_title?: string | null
          series_title?: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          spotify_link?: string | null
          stanza_number?: string | null
          timestamp_end?: string | null
          timestamp_start?: string | null
          title?: string | null
          translation_info?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          verse_reference?: string | null
          volume_number?: string | null
          youtube_link?: string | null
        }
        Update: {
          act_scene?: string | null
          amazon_link?: string | null
          archive_location?: string | null
          arxiv_id?: string | null
          arxiv_link?: string | null
          author?: string | null
          backup_url?: string | null
          call_number?: string | null
          chapter_number?: string | null
          chapter_title?: string | null
          collection_name?: string | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          doi?: string | null
          doi_url?: string | null
          edition?: string | null
          google_books_link?: string | null
          id?: string
          isbn?: string | null
          isbn_link?: string | null
          issn?: string | null
          issue_number?: string | null
          journal_name?: string | null
          jstor_link?: string | null
          language?: string | null
          line_number?: string | null
          magazine_name?: string | null
          minute_mark?: string | null
          newspaper_name?: string | null
          page_number?: string | null
          page_range?: string | null
          paragraph_number?: string | null
          pmid?: string | null
          primary_url?: string | null
          publication_date?: string | null
          publisher?: string | null
          publisher_url?: string | null
          pubmed_link?: string | null
          quote_id?: string | null
          section_title?: string | null
          series_title?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          spotify_link?: string | null
          stanza_number?: string | null
          timestamp_end?: string | null
          timestamp_start?: string | null
          title?: string | null
          translation_info?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          verse_reference?: string | null
          volume_number?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_info_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
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
          ai_model: string | null
          confidence_score: number | null
          created_by: string | null
          id: string
          language: string
          publication: string | null
          publication_date: string | null
          quality_rating: number | null
          quote_id: string | null
          source: string | null
          source_reference: string | null
          source_url: string | null
          translated_text: string
          translation_notes: string | null
          translation_type: string | null
          translator: string | null
          translator_name: string | null
          translator_type: string | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          ai_model?: string | null
          confidence_score?: number | null
          created_by?: string | null
          id?: string
          language: string
          publication?: string | null
          publication_date?: string | null
          quality_rating?: number | null
          quote_id?: string | null
          source?: string | null
          source_reference?: string | null
          source_url?: string | null
          translated_text: string
          translation_notes?: string | null
          translation_type?: string | null
          translator?: string | null
          translator_name?: string | null
          translator_type?: string | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          ai_model?: string | null
          confidence_score?: number | null
          created_by?: string | null
          id?: string
          language?: string
          publication?: string | null
          publication_date?: string | null
          quality_rating?: number | null
          quote_id?: string | null
          source?: string | null
          source_reference?: string | null
          source_url?: string | null
          translated_text?: string
          translation_notes?: string | null
          translation_type?: string | null
          translator?: string | null
          translator_name?: string | null
          translator_type?: string | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_contributions: {
        Row: {
          contribution_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          points_earned: number | null
          quote_id: string | null
          user_id: string
        }
        Insert: {
          contribution_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number | null
          quote_id?: string | null
          user_id: string
        }
        Update: {
          contribution_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number | null
          quote_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_contributions_quote_id_fkey"
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
      check_rate_limit_db: {
        Args: {
          action_param: string
          max_attempts?: number
          user_id_param: string
          window_minutes?: number
        }
        Returns: boolean
      }
      check_submission_duplicates: {
        Args: { submission_id: string }
        Returns: string[]
      }
      cleanup_old_performance_metrics: { Args: never; Returns: undefined }
      get_user_privilege: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_privilege"]
      }
      get_users_for_admin: {
        Args: { requesting_user_id?: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          privilege: Database["public"]["Enums"]["user_privilege"]
          user_id: string
        }[]
      }
      has_privilege_level: {
        Args: {
          required_level: Database["public"]["Enums"]["user_privilege"]
          user_id: string
        }
        Returns: boolean
      }
      increment_quote_share_count:
        | { Args: never; Returns: undefined }
        | { Args: { quote_id: string }; Returns: undefined }
      log_user_activity: {
        Args: {
          p_action_details?: Json
          p_action_type: string
          p_ip_address?: unknown
          p_resource_id?: string
          p_resource_type: string
          p_session_id?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      log_user_contribution: {
        Args: {
          p_contribution_type: string
          p_description?: string
          p_metadata?: Json
          p_points?: number
          p_quote_id?: string
          p_user_id: string
        }
        Returns: string
      }
      process_quote_submission: {
        Args: { approve: boolean; submission_id: string }
        Returns: string
      }
      secure_update_user_privilege: {
        Args: {
          admin_user_id?: string
          new_privilege: Database["public"]["Enums"]["user_privilege"]
          target_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      content_status: "draft" | "review" | "published" | "archived"
      media_type: "image" | "video" | "audio" | "document" | "other"
      popular_quote_status:
        | "unverified"
        | "disputed"
        | "misattributed"
        | "researching"
      source_type:
        | "book"
        | "journal_article"
        | "newspaper"
        | "magazine"
        | "website"
        | "speech"
        | "interview"
        | "letter"
        | "diary"
        | "manuscript"
        | "documentary"
        | "podcast"
        | "social_media"
        | "government_document"
        | "legal_document"
        | "academic_thesis"
        | "conference_paper"
        | "other"
      source_verification_status: "verified" | "needs_review" | "uncertain"
      suggestion_status: "pending" | "approved" | "rejected" | "implemented"
      target_collection_type: "verified_quotes" | "popular_unverified"
      user_privilege: "user" | "moderator" | "admin" | "super_admin"
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
      content_status: ["draft", "review", "published", "archived"],
      media_type: ["image", "video", "audio", "document", "other"],
      popular_quote_status: [
        "unverified",
        "disputed",
        "misattributed",
        "researching",
      ],
      source_type: [
        "book",
        "journal_article",
        "newspaper",
        "magazine",
        "website",
        "speech",
        "interview",
        "letter",
        "diary",
        "manuscript",
        "documentary",
        "podcast",
        "social_media",
        "government_document",
        "legal_document",
        "academic_thesis",
        "conference_paper",
        "other",
      ],
      source_verification_status: ["verified", "needs_review", "uncertain"],
      suggestion_status: ["pending", "approved", "rejected", "implemented"],
      target_collection_type: ["verified_quotes", "popular_unverified"],
      user_privilege: ["user", "moderator", "admin", "super_admin"],
    },
  },
} as const
