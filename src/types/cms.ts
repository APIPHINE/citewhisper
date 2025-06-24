
import type { Database } from '@/integrations/supabase/types';

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected' | 'implemented';

export interface CMSArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  author_id: string;
  status: ContentStatus;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name?: string;
    email?: string;
  };
  categories?: CMSCategory[];
  tags?: CMSTag[];
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  template: string;
  author_id: string;
  status: ContentStatus;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  is_homepage: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name?: string;
    email?: string;
  };
}

export interface CMSMedia {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  media_type: MediaType;
  alt_text?: string;
  caption?: string;
  uploaded_by: string;
  approval_status: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  uploader?: {
    full_name?: string;
    email?: string;
  };
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  created_at: string;
  children?: CMSCategory[];
  parent?: CMSCategory;
}

export interface CMSTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface EditSuggestion {
  id: string;
  content_type: string;
  content_id?: string;
  suggested_changes: any;
  reason?: string;
  suggested_by?: string;
  reviewer_id?: string;
  status: SuggestionStatus;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  suggester?: {
    full_name?: string;
    email?: string;
  };
  reviewer?: {
    full_name?: string;
    email?: string;
  };
}

export interface CMSComment {
  id: string;
  content_type: string;
  content_id: string;
  author_id?: string;
  author_name?: string;
  author_email?: string;
  content: string;
  status: string;
  parent_id?: string;
  created_at: string;
  author?: {
    full_name?: string;
    email?: string;
  };
  replies?: CMSComment[];
}

export interface CMSSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description?: string;
  updated_by: string;
  updated_at: string;
}
