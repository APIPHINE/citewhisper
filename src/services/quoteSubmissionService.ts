
import { supabase } from '@/integrations/supabase/client';

export interface QuoteSubmission {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  source_app: 'citequotesfinder_mobile' | 'citequotesfinder_extension' | 'web_form';
  external_submission_id?: string;
  quote_text: string;
  author_name: string;
  source_title: string;
  original_language?: string;
  translation_language?: string;
  translated_quote?: string;
  is_translation?: boolean;
  source_date?: string;
  chapter_or_section?: string;
  translator_name?: string;
  ocr_text?: string;
  image_url?: string;
  image_crop_coords?: Record<string, any>;
  image_language_hint?: string;
  citation_style?: string;
  generated_citation?: string;
  evidence_type?: string;
  source_manifest_url?: string;
  source_context_text?: string;
  quote_topics?: string[];
  seo_slug?: string;
  seo_keywords?: string[];
  quote_rating?: number;
  confidence_score?: number;
  duplicate_check_performed?: boolean;
  potential_duplicate_ids?: string[];
  processing_notes?: string;
  processed_by?: string;
  processed_at?: string;
  device_type?: string;
  user_agent?: string;
  final_quote_id?: string;
}

export class QuoteSubmissionService {
  // Get all submissions (admin only)
  static async getAllSubmissions(): Promise<QuoteSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('quote_submissions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        return [];
      }

      return (data || []) as QuoteSubmission[];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }

  // Get submissions by status
  static async getSubmissionsByStatus(status: QuoteSubmission['status']): Promise<QuoteSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('quote_submissions' as any)
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions by status:', error);
        return [];
      }

      return (data || []) as QuoteSubmission[];
    } catch (error) {
      console.error('Error fetching submissions by status:', error);
      return [];
    }
  }

  // Process a submission (approve/reject)
  static async processSubmission(
    submissionId: string, 
    approve: boolean, 
    notes?: string
  ): Promise<{ success: boolean; quoteId?: string; error?: string }> {
    try {
      // Update processing notes if provided
      if (notes) {
        await supabase
          .from('quote_submissions' as any)
          .update({ processing_notes: notes } as any)
          .eq('id', submissionId);
      }

      // Call the processing function
      const { data, error } = await supabase.rpc('process_quote_submission' as any, {
        submission_id: submissionId,
        approve: approve
      } as any);

      if (error) {
        console.error('Error processing submission:', error);
        return { success: false, error: error.message };
      }

      return { success: true, quoteId: data as string };
    } catch (error) {
      console.error('Error processing submission:', error);
      return { success: false, error: 'Failed to process submission' };
    }
  }

  // Check for duplicates
  static async checkDuplicates(submissionId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.rpc('check_submission_duplicates' as any, {
        submission_id: submissionId
      } as any);

      if (error) {
        console.error('Error checking duplicates:', error);
        return [];
      }

      return (data || []) as string[];
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return [];
    }
  }

  // Get related quotes for duplicate checking
  static async getQuotesByIds(quoteIds: string[]) {
    if (quoteIds.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, quote_text, author_name, inserted_at')
        .in('id', quoteIds);

      if (error) {
        console.error('Error fetching quotes by IDs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching quotes by IDs:', error);
      return [];
    }
  }
}
