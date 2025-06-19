
import { supabase } from "@/integrations/supabase/client";
import { quoteValidationSchema, sanitizeText, sanitizeUrl, quoteSubmissionLimiter } from "@/services/validationService";

export interface QuoteSubmissionData {
  quote_text: string;
  author_name: string;
  date_original?: string;
  quote_context?: string;
  source_title?: string;
  source_url?: string;
  topics?: string[];
}

export async function createQuote(data: QuoteSubmissionData, userId?: string): Promise<{ success: boolean; error?: string; quoteId?: string }> {
  try {
    // Authentication check
    if (!userId) {
      return { success: false, error: "Authentication required to submit quotes." };
    }

    // Rate limiting check
    if (!quoteSubmissionLimiter.isAllowed(userId)) {
      const remainingTime = Math.ceil(quoteSubmissionLimiter.getRemainingTime(userId) / 1000);
      return { 
        success: false, 
        error: `Rate limit exceeded. Please wait ${remainingTime} seconds before submitting another quote.` 
      };
    }

    // Validate input data
    const validationResult = quoteValidationSchema.safeParse(data);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(e => e.message).join(', ');
      return { success: false, error: `Validation failed: ${errorMessage}` };
    }

    // Sanitize inputs
    const sanitizedData = {
      quote_text: sanitizeText(data.quote_text),
      author_name: sanitizeText(data.author_name),
      date_original: data.date_original || null,
      quote_context: data.quote_context ? sanitizeText(data.quote_context) : null,
    };

    // Create original source if provided
    let sourceId = null;
    if (data.source_title || data.source_url) {
      const sourceData = {
        title: data.source_title ? sanitizeText(data.source_title) : null,
        archive_url: data.source_url ? sanitizeUrl(data.source_url) : null,
      };

      const { data: sourceResult, error: sourceError } = await supabase
        .from('original_sources')
        .insert(sourceData)
        .select('id')
        .single();

      if (sourceError) {
        console.error('Error creating source:', sourceError);
        return { success: false, error: "Failed to create source record." };
      }

      sourceId = sourceResult.id;
    }

    // Create the quote
    const { data: quoteResult, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        ...sanitizedData,
        source_id: sourceId,
      })
      .select('id')
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      return { success: false, error: "Failed to create quote. Please check your permissions." };
    }

    // Handle topics if provided
    if (data.topics && data.topics.length > 0) {
      try {
        // Note: Topic creation requires admin privileges due to RLS policies
        const topicInserts = data.topics.map(topicName => ({
          quote_id: quoteResult.id,
          topic_id: topicName // This would need to be resolved to actual topic IDs
        }));

        // This would need additional logic to handle topic creation/linking
        console.log('Topics provided but not yet implemented:', topicInserts);
      } catch (topicError) {
        console.warn('Failed to create topic associations:', topicError);
        // Don't fail the quote creation for topic errors
      }
    }

    return { success: true, quoteId: quoteResult.id };

  } catch (error) {
    console.error('Unexpected error creating quote:', error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
