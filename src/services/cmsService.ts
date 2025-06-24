
import { supabase } from '@/integrations/supabase/client';
import type { 
  CMSArticle, 
  CMSPage, 
  CMSMedia, 
  CMSCategory, 
  CMSTag, 
  EditSuggestion, 
  CMSComment, 
  CMSSetting,
  ContentStatus,
  SuggestionStatus 
} from '@/types/cms';

// Article Management
export const fetchArticles = async (status?: ContentStatus): Promise<CMSArticle[]> => {
  try {
    let query = supabase
      .from('cms_articles')
      .select(`
        *,
        author:profiles!author_id(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

export const fetchArticleBySlug = async (slug: string): Promise<CMSArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('cms_articles')
      .select(`
        *,
        author:profiles!author_id(full_name, email)
      `)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
};

export const createArticle = async (article: Partial<CMSArticle>): Promise<CMSArticle> => {
  const { data, error } = await supabase
    .from('cms_articles')
    .insert([article])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateArticle = async (id: string, updates: Partial<CMSArticle>): Promise<CMSArticle> => {
  const { data, error } = await supabase
    .from('cms_articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cms_articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Page Management
export const fetchPages = async (status?: ContentStatus): Promise<CMSPage[]> => {
  try {
    let query = supabase
      .from('cms_pages')
      .select(`
        *,
        author:profiles!author_id(full_name, email)
      `)
      .order('sort_order', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
};

export const fetchPageBySlug = async (slug: string): Promise<CMSPage | null> => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select(`
        *,
        author:profiles!author_id(full_name, email)
      `)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
};

export const createPage = async (page: Partial<CMSPage>): Promise<CMSPage> => {
  const { data, error } = await supabase
    .from('cms_pages')
    .insert([page])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePage = async (id: string, updates: Partial<CMSPage>): Promise<CMSPage> => {
  const { data, error } = await supabase
    .from('cms_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Media Management
export const fetchMedia = async (approvalStatus?: string): Promise<CMSMedia[]> => {
  try {
    let query = supabase
      .from('cms_media')
      .select(`
        *,
        uploader:profiles!uploaded_by(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (approvalStatus) {
      query = query.eq('approval_status', approvalStatus);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
};

export const updateMediaApproval = async (
  id: string, 
  status: string, 
  reviewerId: string
): Promise<CMSMedia> => {
  const { data, error } = await supabase
    .from('cms_media')
    .update({
      approval_status: status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Category Management
export const fetchCategories = async (): Promise<CMSCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (category: Partial<CMSCategory>): Promise<CMSCategory> => {
  const { data, error } = await supabase
    .from('cms_categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Tag Management
export const fetchTags = async (): Promise<CMSTag[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

export const createTag = async (tag: Partial<CMSTag>): Promise<CMSTag> => {
  const { data, error } = await supabase
    .from('cms_tags')
    .insert([tag])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Edit Suggestions
export const fetchEditSuggestions = async (status?: SuggestionStatus): Promise<EditSuggestion[]> => {
  try {
    let query = supabase
      .from('edit_suggestions')
      .select(`
        *,
        suggester:profiles!suggested_by(full_name, email),
        reviewer:profiles!reviewer_id(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching edit suggestions:', error);
    return [];
  }
};

export const createEditSuggestion = async (suggestion: Partial<EditSuggestion>): Promise<EditSuggestion> => {
  const { data, error } = await supabase
    .from('edit_suggestions')
    .insert([suggestion])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSuggestionStatus = async (
  id: string, 
  status: SuggestionStatus, 
  reviewerId: string,
  adminNotes?: string
): Promise<EditSuggestion> => {
  const { data, error } = await supabase
    .from('edit_suggestions')
    .update({
      status,
      reviewer_id: reviewerId,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Settings Management
export const fetchSettings = async (): Promise<CMSSetting[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_settings')
      .select('*')
      .order('setting_key', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
};

export const updateSetting = async (
  key: string, 
  value: any, 
  userId: string
): Promise<CMSSetting> => {
  const { data, error } = await supabase
    .from('cms_settings')
    .upsert({
      setting_key: key,
      setting_value: value,
      updated_by: userId,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
