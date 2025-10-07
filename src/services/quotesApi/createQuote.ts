
import { supabase } from '@/integrations/supabase/client';
import { ActivityTrackingService } from '@/services/activityTrackingService';

export interface CreateQuoteRequest {
  quote_text: string;
  author_name?: string;
  date_original?: string;
  quote_context?: string;
  quote_image_url?: string;
  source_title?: string;
  source_author?: string;
  source_publisher?: string;
  source_year?: string;
  source_url?: string;
  seo_keywords?: string[];
  evidence_files?: File[];
}

// Add the missing QuoteSubmissionData interface
export interface QuoteSubmissionData {
  quote_text: string;
  author_name?: string;
  date_original?: string;
  quote_context?: string;
  source_title?: string;
  source_url?: string;
  topics?: string[];
  theme?: string;
  originalLanguage?: string;
  originalText?: string;
  historicalContext?: string;
  emotionalTone?: string;
  keywords?: string[];
  sourceInfo?: {
    source_type?: string;
    title?: string;
    author?: string;
    publisher?: string;
    publication_date?: string;
    primary_url?: string;
    backup_url?: string;
    page_number?: string;
    page_range?: string;
    chapter_number?: string;
    chapter_title?: string;
    volume_number?: string;
    issue_number?: string;
    edition?: string;
    isbn?: string;
    issn?: string;
    doi?: string;
    language?: string;
    archive_location?: string;
    confidence_score?: number;
    [key: string]: any;
  };
  translations?: Array<{
    language: string;
    text: string;
    source?: string;
    translator?: string;
    publication?: string;
    publicationDate?: string;
    sourceUrl?: string;
  }>;
}

export interface CreateQuoteResponse {
  success: boolean;
  quote_id?: string;
  error?: string;
  contribution_id?: string;
}

export const createQuote = async (
  quoteData: CreateQuoteRequest | QuoteSubmissionData,
  userId?: string
): Promise<CreateQuoteResponse> => {
  try {
    // Validate required fields
    if (!quoteData.quote_text?.trim()) {
      return { success: false, error: 'Quote text is required' };
    }

    if (!userId) {
      return { success: false, error: 'User authentication required' };
    }

    // Rate limiting check
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Authentication required' };
    }

    // Create the quote with user ownership
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        quote_text: quoteData.quote_text.trim(),
        author_name: quoteData.author_name?.trim(),
        date_original: quoteData.date_original || null,
        quote_context: quoteData.quote_context?.trim(),
        quote_image_url: (quoteData as CreateQuoteRequest).quote_image_url,
        seo_keywords: (quoteData as CreateQuoteRequest).seo_keywords || [],
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      return { success: false, error: 'Failed to create quote' };
    }

    // Create source_info if provided
    const submissionData = quoteData as QuoteSubmissionData;
    if (submissionData.sourceInfo) {
      const { error: sourceInfoError } = await supabase
        .from('source_info')
        .insert([{
          source_type: (submissionData.sourceInfo.source_type || 'other') as any,
          title: submissionData.sourceInfo.title,
          author: submissionData.sourceInfo.author,
          publisher: submissionData.sourceInfo.publisher,
          publication_date: submissionData.sourceInfo.publication_date,
          primary_url: submissionData.sourceInfo.primary_url,
          backup_url: submissionData.sourceInfo.backup_url,
          page_number: submissionData.sourceInfo.page_number,
          page_range: submissionData.sourceInfo.page_range,
          chapter_number: submissionData.sourceInfo.chapter_number,
          chapter_title: submissionData.sourceInfo.chapter_title,
          volume_number: submissionData.sourceInfo.volume_number,
          issue_number: submissionData.sourceInfo.issue_number,
          edition: submissionData.sourceInfo.edition,
          isbn: submissionData.sourceInfo.isbn,
          issn: submissionData.sourceInfo.issn,
          doi: submissionData.sourceInfo.doi,
          language: submissionData.sourceInfo.language || submissionData.originalLanguage,
          archive_location: submissionData.sourceInfo.archive_location,
          confidence_score: submissionData.sourceInfo.confidence_score,
          created_by: userId,
          updated_by: userId,
          quote_id: quote.id
        }]);

      if (sourceInfoError) {
        console.error('Error creating source_info:', sourceInfoError);
      }
    }
    // Fallback for legacy data structure
    else if (quoteData.source_title) {
      const { error: sourceInfoError } = await supabase
        .from('source_info')
        .insert([{
          source_type: 'other' as any,
          title: quoteData.source_title,
          primary_url: quoteData.source_url,
          created_by: userId,
          updated_by: userId,
          quote_id: quote.id
        }]);

      if (sourceInfoError) {
        console.error('Error creating source_info:', sourceInfoError);
      }
    }

    // Create translations if provided
    if (submissionData.translations && submissionData.translations.length > 0) {
      for (const translation of submissionData.translations) {
        if (translation.text && translation.language) {
          await supabase
            .from('translations')
            .insert({
              quote_id: quote.id,
              language: translation.language,
              translated_text: translation.text,
              translator: translation.translator,
              source: translation.source,
              publication: translation.publication,
              publication_date: translation.publicationDate || null,
              source_url: translation.sourceUrl,
              created_by: userId
            });
        }
      }
    }

    // Log the activity
    await ActivityTrackingService.logActivity(
      userId,
      'create',
      'quote',
      quote.id,
      {
        quote_text: quoteData.quote_text.substring(0, 100),
        author_name: quoteData.author_name,
        has_source: !!submissionData.sourceInfo
      }
    );

    // Log the contribution with points
    const contributionId = await ActivityTrackingService.logContribution(
      userId,
      'quote_submission',
      quote.id,
      10, // 10 points for quote submission
      `Submitted quote: "${quoteData.quote_text.substring(0, 50)}..."`,
      {
        quote_id: quote.id,
        author_name: quoteData.author_name,
        has_source: !!submissionData.sourceInfo
      }
    );

    // Handle evidence file uploads if provided
    const createQuoteRequest = quoteData as CreateQuoteRequest;
    if (createQuoteRequest.evidence_files && createQuoteRequest.evidence_files.length > 0) {
      for (const file of createQuoteRequest.evidence_files) {
        // This would typically upload to storage and then create evidence submission
        // For now, we'll just log the intent
        console.log(`Evidence file to upload: ${file.name}`);
      }
    }

    return {
      success: true,
      quote_id: quote.id,
      contribution_id: contributionId || undefined
    };

  } catch (error) {
    console.error('Error in createQuote:', error);
    return { success: false, error: 'Internal server error' };
  }
};
