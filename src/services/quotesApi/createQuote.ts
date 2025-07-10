
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
  originalSource?: {
    title?: string;
    publisher?: string;
    publicationDate?: string;
    location?: string;
    isbn?: string;
    sourceUrl?: string;
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

    // Create source if provided
    let sourceId: string | null = null;
    const submissionData = quoteData as QuoteSubmissionData;
    if (quoteData.source_title || (quoteData as CreateQuoteRequest).source_author || submissionData.originalSource?.title) {
      const { data: source, error: sourceError } = await supabase
        .from('original_sources')
        .insert({
          title: submissionData.originalSource?.title || quoteData.source_title?.trim(),
          author: (quoteData as CreateQuoteRequest).source_author?.trim(),
          publisher: submissionData.originalSource?.publisher?.trim(),
          publication_year: submissionData.originalSource?.publicationDate?.trim(),
          archive_url: submissionData.originalSource?.sourceUrl || quoteData.source_url?.trim(),
          location: submissionData.originalSource?.location?.trim(),
          source_type: 'book', // Default type
          language: submissionData.originalLanguage
        })
        .select()
        .single();

      if (!sourceError && source) {
        sourceId = source.id;
        
        // Update quote with source reference
        await supabase
          .from('quotes')
          .update({ source_id: sourceId })
          .eq('id', quote.id);
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
              source_url: translation.sourceUrl
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
        has_source: !!sourceId
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
        has_source: !!sourceId
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
