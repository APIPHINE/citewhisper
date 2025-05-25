
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/utils/quotesData";

/**
 * Creates a quote and its related data in the database
 * 
 * @param quoteData - Partial Quote object with the data to insert
 * @returns The newly created Quote object or null if failed
 */
export async function createQuote(quoteData: Partial<Quote>): Promise<Quote | null> {
  try {
    console.log('Creating quote with data:', quoteData);
    
    // Transform our Quote structure to match the database schema
    const dbQuote = {
      quote_text: quoteData.text, // Map text to quote_text for DB
      author: quoteData.author,
      date: quoteData.date,
      topics: quoteData.topics || [],
      theme: quoteData.theme || '',
      source: quoteData.source,
      source_url: quoteData.sourceUrl,
      source_publication_date: quoteData.sourcePublicationDate,
      original_language: quoteData.originalLanguage,
      original_text: quoteData.originalText,
      context: quoteData.context,
      historical_context: quoteData.historicalContext,
      keywords: quoteData.keywords || [],
      emotional_tone: quoteData.emotionalTone || '',
      quote_image_url: quoteData.evidenceImage, // Map evidenceImage to quote_image_url
      citation_apa: quoteData.citationAPA,
      citation_mla: quoteData.citationMLA,
      citation_chicago: quoteData.citationChicago,
      seo_keywords: quoteData.keywords || [],
      updated_at: new Date().toISOString()
    };

    console.log('Transformed quote data for DB:', dbQuote);

    // Insert the quote
    const { data, error } = await supabase
      .from('quotes')
      .insert([dbQuote])
      .select()
      .single();

    if (error) {
      console.error('Error creating quote:', error);
      return null;
    }

    console.log('Quote created successfully:', data);

    // Handle original source if provided
    if (quoteData.originalSource) {
      await createOriginalSource(data.id, quoteData.originalSource);
    }

    // Handle translations if provided
    if (Array.isArray(quoteData.translations)) {
      await createTranslations(data.id, quoteData.translations);
    }

    // Return the newly created quote
    return {
      ...quoteData,
      id: data.id
    } as Quote;
  } catch (error) {
    console.error('Error in createQuote:', error);
    return null;
  }
}

/**
 * Creates an original source record linked to a quote
 * 
 * @param quoteId - The ID of the quote
 * @param originalSourceData - The original source data
 */
async function createOriginalSource(
  quoteId: string, 
  originalSourceData: Quote['originalSource']
): Promise<void> {
  if (!originalSourceData) return;

  const dbOriginalSource = {
    quote_id: quoteId,
    title: originalSourceData.title,
    publisher: originalSourceData.publisher,
    publication_date: originalSourceData.publicationDate,
    location: originalSourceData.location,
    isbn: originalSourceData.isbn,
    source_url: originalSourceData.sourceUrl
  };

  console.log('Creating original source:', dbOriginalSource);

  try {
    const { error } = await supabase
      .from('original_sources')
      .insert([dbOriginalSource]);

    if (error) {
      console.error('Error creating original source:', error);
    }
  } catch (error) {
    console.error('Error in createOriginalSource:', error);
  }
}

/**
 * Creates translation records linked to a quote
 * 
 * @param quoteId - The ID of the quote
 * @param translationsData - Array of translation data
 */
async function createTranslations(
  quoteId: string, 
  translationsData: Quote['translations']
): Promise<void> {
  if (!Array.isArray(translationsData) || translationsData.length === 0) return;

  try {
    const dbTranslations = translationsData.map(translation => ({
      quote_id: quoteId,
      language: translation.language,
      text: translation.text,
      source: translation.source,
      translator: translation.translator,
      translator_name: translation.translator,
      publication: translation.publication,
      publication_date: translation.publicationDate,
      source_url: translation.sourceUrl,
      source_reference: translation.source
    }));

    console.log('Creating translations:', dbTranslations);

    const { error } = await supabase
      .from('translations')
      .insert(dbTranslations);

    if (error) {
      console.error('Error creating translations:', error);
    }
  } catch (error) {
    console.error('Error in createTranslations:', error);
  }
}
