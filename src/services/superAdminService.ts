import { supabase } from '@/integrations/supabase/client';
import type { Quote } from '@/utils/quotesData';

export interface QuoteUpdateData {
  text?: string;
  author?: string;
  date?: string;
  source?: string;
  status?: string;
  priority?: number;
  verified?: boolean;
  featured?: boolean;
  public?: boolean;
  keywords?: string[];
  theme?: string;
  context?: string;
  verification_notes?: string;
  citation_format?: string;
  original_language?: string;
  translation_notes?: string;
  historical_context?: string;
  reliability_score?: number;
  editorial_notes?: string;
  content_warnings?: string[];
  accessibility_notes?: string;
  seo_keywords?: string[];
  quality_score?: number;
  engagement_metrics?: any;
  last_verified?: string;
  verification_source?: string;
  modified_by?: string;
}

export const superAdminService = {
  // Create new quote
  async createQuote(quoteData: {
    quote_text: string;
    author_name: string;
    date_original?: string;
    quote_context?: string;
    quote_image_url?: string;
    source_id?: string;
    seo_keywords?: string[];
    seo_slug?: string;
    created_by?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          ...quoteData,
          inserted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating quote:', error);
      return { success: false, error: error.message };
    }
  },

  // Update quote with comprehensive data
  async updateQuote(quoteId: string, updates: QuoteUpdateData) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quoteId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating quote:', error);
      return { success: false, error: error.message };
    }
  },

  // Quick edit single field
  async quickEditField(quoteId: string, field: string, value: any) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quoteId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error quick editing quote:', error);
      return { success: false, error: error.message };
    }
  },

  // Bulk operations
  async bulkUpdateQuotes(quoteIds: string[], updates: Partial<QuoteUpdateData>) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .in('id', quoteIds)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error bulk updating quotes:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete quotes
  async deleteQuotes(quoteIds: string[]) {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .in('id', quoteIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting quotes:', error);
      return { success: false, error: error.message };
    }
  },

  // Fetch quotes with admin metadata
  async fetchQuotesWithMetadata(page = 1, limit = 50, filters: {
    status?: string;
    verified?: boolean;
    featured?: boolean;
    priority?: number;
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1);

      

      if (error) throw error;
      return { success: true, data, count };
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return { success: false, error: error.message };
    }
  },

  // Log admin actions for audit trail
  async logAdminAction(action: string, entityType: string, entityId: string, changes: any, userId: string) {
    try {
      const { error } = await supabase
        .from('admin_audit_log')
        .insert({
          action,
          admin_user_id: userId,
          target_user_id: entityId,
          old_values: changes.old || null,
          new_values: changes.new || null,
          timestamp: new Date().toISOString(),
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error logging admin action:', error);
      return { success: false, error: error.message };
    }
  },

  // Get system analytics
  async getSystemAnalytics() {
    try {
      const [quotesCount, usersCount, recentActivity] = await Promise.all([
        supabase.from('quotes').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('admin_audit_log')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10),
      ]);

      return {
        success: true,
        data: {
          totalQuotes: quotesCount.count || 0,
          totalUsers: usersCount.count || 0,
          recentActivity: recentActivity.data || [],
        },
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error: error.message };
    }
  },
};