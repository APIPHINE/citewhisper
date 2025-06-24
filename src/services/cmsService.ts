
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
        author:profiles!cms_articles_author_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(article => ({
      ...article,
      author: {
        full_name: (article as any).author?.full_name || undefined,
        email: undefined
      }
    }));
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
        author:profiles!cms_articles_author_id_fkey(full_name)
      `)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      author: {
        full_name: (data as any).author?.full_name || undefined,
        email: undefined
      }
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
};

export const createArticle = async (article: Partial<CMSArticle>): Promise<CMSArticle> => {
  const articleData = {
    title: article.title || '',
    slug: article.slug || '',
    content: article.content || '',
    author_id: article.author_id || '',
    status: article.status || 'draft' as ContentStatus,
    excerpt: article.excerpt,
    featured_image_url: article.featured_image_url,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    seo_keywords: article.seo_keywords,
    published_at: article.published_at
  };

  const { data, error } = await supabase
    .from('cms_articles')
    .insert(articleData)
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
        author:profiles!cms_pages_author_id_fkey(full_name)
      `)
      .order('sort_order', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(page => ({
      ...page,
      author: {
        full_name: (page as any).author?.full_name || undefined,
        email: undefined
      }
    }));
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
        author:profiles!cms_pages_author_id_fkey(full_name)
      `)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      author: {
        full_name: (data as any).author?.full_name || undefined,
        email: undefined
      }
    };
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
};

export const createPage = async (page: Partial<CMSPage>): Promise<CMSPage> => {
  const pageData = {
    title: page.title || '',
    slug: page.slug || '',
    content: page.content || '',
    author_id: page.author_id || '',
    status: page.status || 'draft' as ContentStatus,
    template: page.template || 'default',
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    seo_keywords: page.seo_keywords,
    is_homepage: page.is_homepage || false,
    sort_order: page.sort_order || 0,
    published_at: page.published_at
  };

  const { data, error } = await supabase
    .from('cms_pages')
    .insert(pageData)
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
        uploader:profiles!cms_media_uploaded_by_fkey(full_name)
      `)
      .order('created_at', { ascending: false });

    if (approvalStatus) {
      query = query.eq('approval_status', approvalStatus);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(media => ({
      ...media,
      uploader: {
        full_name: (media as any).uploader?.full_name || undefined,
        email: undefined
      }
    }));
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
  const categoryData = {
    name: category.name || '',
    slug: category.slug || '',
    description: category.description,
    parent_id: category.parent_id,
    sort_order: category.sort_order || 0
  };

  const { data, error } = await supabase
    .from('cms_categories')
    .insert(categoryData)
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
  const tagData = {
    name: tag.name || '',
    slug: tag.slug || '',
    description: tag.description
  };

  const { data, error } = await supabase
    .from('cms_tags')
    .insert(tagData)
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
        suggester:profiles!edit_suggestions_suggested_by_fkey(full_name),
        reviewer:profiles!edit_suggestions_reviewer_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(suggestion => ({
      ...suggestion,
      suggester: {
        full_name: (suggestion as any).suggester?.full_name || undefined,
        email: undefined
      },
      reviewer: {
        full_name: (suggestion as any).reviewer?.full_name || undefined,
        email: undefined
      }
    }));
  } catch (error) {
    console.error('Error fetching edit suggestions:', error);
    return [];
  }
};

export const createEditSuggestion = async (suggestion: Partial<EditSuggestion>): Promise<EditSuggestion> => {
  const suggestionData = {
    content_type: suggestion.content_type || '',
    suggested_changes: suggestion.suggested_changes || {},
    content_id: suggestion.content_id,
    reason: suggestion.reason,
    suggested_by: suggestion.suggested_by
  };

  const { data, error } = await supabase
    .from('edit_suggestions')
    .insert(suggestionData)
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
      setting_type: typeof value,
      updated_by: userId,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
