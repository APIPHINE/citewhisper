import { supabase } from '@/integrations/supabase/client';

export interface GenerateQuotesRequest {
  prompt: string;
  count: number;
  sourceType?: string;
}

export interface GeneratedQuoteSubmission {
  id: string;
  quote_text: string;
  author_name: string;
  source_title: string;
  source_date?: string;
  chapter_or_section?: string;
  source_context_text: string;
  quote_topics?: string[];
  confidence_score: number;
  status: string;
  source_app: string;
  processing_notes: string;
  created_at: string;
}

export interface GenerateQuotesResponse {
  success: boolean;
  count: number;
  quotes: GeneratedQuoteSubmission[];
}

export class CQAiService {
  static async generateQuotes(request: GenerateQuotesRequest): Promise<GenerateQuotesResponse> {
    const { data, error } = await supabase.functions.invoke('cq-generate-quotes', {
      body: request,
    });

    if (error) {
      console.error('CQ generation error:', error);
      throw new Error(error.message || 'Failed to generate quotes');
    }

    return data as GenerateQuotesResponse;
  }

  static async getCQStatistics() {
    const { data: totalData, count: totalCount } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('source_app', 'cq_ai_worker');

    const { data: pendingData, count: pendingCount } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('source_app', 'cq_ai_worker')
      .eq('status', 'pending');

    const { data: approvedData, count: approvedCount } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('source_app', 'cq_ai_worker')
      .eq('status', 'approved');

    const approvalRate = totalCount ? ((approvedCount || 0) / totalCount) * 100 : 0;

    return {
      total: totalCount || 0,
      pending: pendingCount || 0,
      approved: approvedCount || 0,
      approvalRate: approvalRate.toFixed(1),
    };
  }

  static async getRecentGenerations(limit: number = 10) {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('*')
      .eq('action', 'CQ_GENERATE_QUOTES')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent generations:', error);
      return [];
    }

    return data || [];
  }
}
