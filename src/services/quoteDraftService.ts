import { supabase } from '@/integrations/supabase/client';
import type { QuoteFormValues } from '@/utils/formSchemas';

export interface QuoteDraft {
  id: string;
  user_id: string;
  image_url?: string;
  ocr_text?: string;
  quote_text?: string;
  author_name?: string;
  quote_context?: string;
  date_original?: string;
  topics?: string[];
  source_info?: any;
  evidence_image_name?: string;
  created_at: string;
  updated_at: string;
}

export class QuoteDraftService {
  static async saveDraft(
    userId: string,
    formData: Partial<QuoteFormValues>,
    imageUrl?: string,
    ocrText?: string,
    evidenceImageName?: string
  ): Promise<{ success: boolean; draftId?: string; error?: string }> {
    try {
      const draftData = {
        user_id: userId,
        image_url: imageUrl,
        ocr_text: ocrText,
        quote_text: formData.text,
        author_name: formData.author,
        quote_context: formData.context,
        date_original: formData.date,
        topics: formData.topics,
        source_info: formData.sourceInfo,
        evidence_image_name: evidenceImageName,
      };

      // Upsert based on user_id and image_url (unique constraint)
      const { data, error } = await supabase
        .from('quote_drafts')
        .upsert(draftData, { 
          onConflict: 'user_id,image_url',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, draftId: data.id };
    } catch (error) {
      console.error('Error saving draft:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save draft' 
      };
    }
  }

  static async getUserDrafts(userId: string): Promise<QuoteDraft[]> {
    try {
      const { data, error } = await supabase
        .from('quote_drafts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching drafts:', error);
      return [];
    }
  }

  static async deleteDraft(draftId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('quote_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting draft:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete draft' 
      };
    }
  }

  static async deleteDraftByImage(userId: string, imageUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('quote_drafts')
        .delete()
        .eq('user_id', userId)
        .eq('image_url', imageUrl);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting draft by image:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete draft' 
      };
    }
  }

  static async loadDraft(draftId: string): Promise<{ success: boolean; draft?: QuoteDraft; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('quote_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) throw error;
      return { success: true, draft: data };
    } catch (error) {
      console.error('Error loading draft:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to load draft' 
      };
    }
  }
}
