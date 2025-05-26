
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/utils/quotesData";

/**
 * Fetches quotes from the database and transforms them into the application's Quote model
 * @returns Array of Quote objects
 */
export async function fetchQuotes(): Promise<Quote[]> {
  try {
    // Fetch main quotes data with source relationship
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        *,
        source:original_sources(*)
      `);
    
    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      throw quotesError;
    }

    // Fetch translations
    const { data: translationsData, error: translationsError } = await supabase
      .from('translations')
      .select('*');
    
    if (translationsError) {
      console.error('Error fetching translations:', translationsError);
    }
    
    // Fetch quote topics with topic details
    const { data: quoteTopicsData, error: quoteTopicsError } = await supabase
      .from('quote_topics')
      .select(`
        quote_id,
        topic:topics(topic_name)
      `);
    
    if (quoteTopicsError) {
      console.error('Error fetching quote topics:', quoteTopicsError);
    }
    
    // Transform database data into our Quote format
    const quotes: Quote[] = quotesData.map(quote => {
      // Find related translations
      const translations = translationsData
        ?.filter(translation => translation.quote_id === quote.id)
        .map(translation => ({
          language: translation.language,
          text: translation.translated_text,
          source: translation.source,
          translator: translation.translator_name || translation.translator,
          publication: translation.publication,
          publicationDate: translation.publication_date,
          sourceUrl: translation.source_url
        }));
      
      // Find related topics
      const topics = quoteTopicsData
        ?.filter(qt => qt.quote_id === quote.id)
        .map(qt => qt.topic?.topic_name)
        .filter(Boolean) || [];

      // Map DB schema to Quote model
      return {
        id: quote.id,
        text: quote.quote_text || '',
        author: quote.author_name || '',
        date: quote.date_original || new Date().toISOString().split('T')[0],
        topics: topics,
        theme: '',
        source: quote.source?.title || '',
        evidenceImage: quote.quote_image_url,
        sourceUrl: quote.source?.archive_url,
        sourcePublicationDate: quote.source?.publication_year,
        originalLanguage: '',
        originalText: '',
        context: quote.quote_context,
        historicalContext: '',
        keywords: [],
        emotionalTone: '',
        citationAPA: '',
        citationMLA: '',
        citationChicago: '',
        exportFormats: { json: true, csv: true, cff: true },
        shareCount: 0,
        ocrExtractedText: '',
        ocrConfidenceScore: 0,
        originalManuscriptReference: '',
        attributionStatus: '',
        translator: '',
        impact: '',
        citedBy: [],
        originalSource: quote.source ? {
          title: quote.source.title || '',
          publisher: quote.source.publisher || '',
          publicationDate: quote.source.publication_year || '',
          location: quote.source.archive_url || '',
          isbn: '',
          sourceUrl: quote.source.archive_url || ''
        } : undefined,
        translations: translations?.length ? translations : undefined
      };
    });
    
    return quotes;
  } catch (error) {
    console.error('Error in fetchQuotes:', error);
    return [];
  }
}
