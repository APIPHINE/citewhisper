
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/utils/quotesData";

/**
 * Fetches quotes from the database and transforms them into the application's Quote model
 * @returns Array of Quote objects
 */
export async function fetchQuotes(): Promise<Quote[]> {
  try {
    // Fetch main quotes data
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select('*');
    
    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      throw quotesError;
    }

    // Fetch original sources
    const { data: sourcesData, error: sourcesError } = await supabase
      .from('original_sources')
      .select('*');
    
    if (sourcesError) {
      console.error('Error fetching original sources:', sourcesError);
    }
    
    // Fetch translations
    const { data: translationsData, error: translationsError } = await supabase
      .from('translations')
      .select('*');
    
    if (translationsError) {
      console.error('Error fetching translations:', translationsError);
    }
    
    // Fetch cited_by data
    const { data: citedByData, error: citedByError } = await supabase
      .from('cited_by')
      .select('*');
    
    if (citedByError) {
      console.error('Error fetching cited_by data:', citedByError);
    }
    
    // Transform database data into our Quote format
    const quotes: Quote[] = quotesData.map(quote => {
      // Find related original source
      const originalSource = sourcesData?.find(source => source.quote_id === quote.id);
      
      // Find related translations
      const translations = translationsData
        ?.filter(translation => translation.quote_id === quote.id)
        .map(translation => ({
          language: translation.language,
          text: translation.text,
          source: translation.source,
          translator: translation.translator,
          publication: translation.publication,
          publicationDate: translation.publication_date,
          sourceUrl: translation.source_url
        }));
      
      // Find related citations
      const citedBy = citedByData
        ?.filter(citation => citation.quote_id === quote.id)
        .map(citation => ({
          siteName: citation.site_name,
          siteUrl: citation.site_url,
          embedDate: citation.embed_date
        }));

      // Map DB schema to Quote model
      return {
        id: quote.id,
        text: quote.quote_text || '',
        author: quote.author,
        date: quote.date,
        topics: quote.topics || [],
        theme: quote.theme || '',
        source: quote.source,
        evidenceImage: quote.quote_image_url,
        sourceUrl: quote.source_url,
        sourcePublicationDate: quote.source_publication_date,
        originalLanguage: quote.original_language,
        originalText: quote.original_text,
        context: quote.context,
        historicalContext: quote.historical_context,
        keywords: quote.keywords || [],
        emotionalTone: quote.emotional_tone || '',
        citationAPA: quote.citation_apa,
        citationMLA: quote.citation_mla,
        citationChicago: quote.citation_chicago,
        exportFormats: { json: true, csv: true, cff: true },
        shareCount: 0,
        ocrExtractedText: '',
        ocrConfidenceScore: 0,
        originalManuscriptReference: '',
        attributionStatus: '',
        translator: '',
        impact: '',
        citedBy: citedBy,
        originalSource: originalSource ? {
          title: originalSource.title || '',
          publisher: originalSource.publisher || '',
          publicationDate: originalSource.publication_date || '',
          location: originalSource.location || '',
          isbn: originalSource.isbn || '',
          sourceUrl: originalSource.source_url || ''
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
