import { supabase } from '@/integrations/supabase/client';

export interface PopularQuote {
  id: string;
  quote_text: string;
  commonly_attributed_to: string | null;
  actual_author_if_known: string | null;
  attribution_notes: string | null;
  earliest_known_source: string | null;
  earliest_known_date: string | null;
  popularity_score: number;
  verification_attempts: any;
  status: 'unverified' | 'disputed' | 'misattributed' | 'researching';
  research_notes: string | null;
  alternative_attributions: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  verified_by: string | null;
  source_app: string;
  confidence_score: number | null;
}

export interface AttributionResearch {
  id: string;
  quote_id: string;
  researcher_id: string;
  research_notes: string;
  sources_consulted: any;
  conclusion: string | null;
  confidence_level: number | null;
  created_at: string;
}

export class PopularQuotesService {
  static async getAllPopularQuotes(): Promise<PopularQuote[]> {
    const { data, error } = await supabase
      .from('popular_unverified_quotes')
      .select('*')
      .order('popularity_score', { ascending: false });

    if (error) {
      console.error('Error fetching popular quotes:', error);
      throw error;
    }

    return data || [];
  }

  static async getQuotesByStatus(status: PopularQuote['status']): Promise<PopularQuote[]> {
    const { data, error } = await supabase
      .from('popular_unverified_quotes')
      .select('*')
      .eq('status', status)
      .order('popularity_score', { ascending: false });

    if (error) {
      console.error('Error fetching quotes by status:', error);
      throw error;
    }

    return data || [];
  }

  static async updateQuoteStatus(
    quoteId: string,
    status: PopularQuote['status'],
    notes?: string
  ): Promise<void> {
    const updateData: any = { status };
    if (notes) updateData.research_notes = notes;

    const { error } = await supabase
      .from('popular_unverified_quotes')
      .update(updateData)
      .eq('id', quoteId);

    if (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  }

  static async incrementPopularity(quoteId: string): Promise<void> {
    const { data: quote, error: fetchError } = await supabase
      .from('popular_unverified_quotes')
      .select('popularity_score')
      .eq('id', quoteId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('popular_unverified_quotes')
      .update({ popularity_score: (quote.popularity_score || 0) + 1 })
      .eq('id', quoteId);

    if (error) throw error;
  }

  static async submitResearch(research: {
    quote_id: string;
    researcher_id: string;
    research_notes: string;
    sources_consulted: any[];
    conclusion?: string;
    confidence_level?: number;
  }): Promise<void> {
    const { error } = await supabase
      .from('quote_attribution_research')
      .insert(research);

    if (error) {
      console.error('Error submitting research:', error);
      throw error;
    }
  }

  static async getResearchForQuote(quoteId: string): Promise<AttributionResearch[]> {
    const { data, error } = await supabase
      .from('quote_attribution_research')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching research:', error);
      throw error;
    }

    return data || [];
  }

  static async searchPopularQuotes(searchTerm: string): Promise<PopularQuote[]> {
    const { data, error } = await supabase
      .from('popular_unverified_quotes')
      .select('*')
      .or(`quote_text.ilike.%${searchTerm}%,commonly_attributed_to.ilike.%${searchTerm}%`)
      .order('popularity_score', { ascending: false });

    if (error) {
      console.error('Error searching popular quotes:', error);
      throw error;
    }

    return data || [];
  }
}
