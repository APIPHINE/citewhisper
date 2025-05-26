
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
    
    // Transform our Quote structure to match the new database schema
    const dbQuote = {
      quote_text: quoteData.text,
      author_name: quoteData.author,
      date_original: quoteData.date,
      quote_image_url: quoteData.evidenceImage,
      quote_context: quoteData.context,
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
      const sourceId = await createOriginalSource(quoteData.originalSource);
      if (sourceId) {
        // Update quote with source_id
        await supabase
          .from('quotes')
          .update({ source_id: sourceId })
          .eq('id', data.id);
      }
    }

    // Handle topics if provided
    if (Array.isArray(quoteData.topics) && quoteData.topics.length > 0) {
      await createQuoteTopics(data.id, quoteData.topics);
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
 * Creates an original source record
 * 
 * @param originalSourceData - The original source data
 * @returns The ID of the created source or null if failed
 */
async function createOriginalSource(
  originalSourceData: Quote['originalSource']
): Promise<string | null> {
  if (!originalSourceData) return null;

  const dbOriginalSource = {
    title: originalSourceData.title,
    publisher: originalSourceData.publisher,
    publication_year: originalSourceData.publicationDate,
    archive_url: originalSourceData.sourceUrl
  };

  console.log('Creating original source:', dbOriginalSource);

  try {
    const { data, error } = await supabase
      .from('original_sources')
      .insert([dbOriginalSource])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating original source:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in createOriginalSource:', error);
    return null;
  }
}

/**
 * Creates topic records and links them to a quote
 * 
 * @param quoteId - The ID of the quote
 * @param topics - Array of topic names
 */
async function createQuoteTopics(
  quoteId: string, 
  topics: string[]
): Promise<void> {
  if (!Array.isArray(topics) || topics.length === 0) return;

  try {
    // First, ensure all topics exist in the topics table
    for (const topicName of topics) {
      const seoSlug = topicName.toLowerCase().replace(/\s+/g, '-');
      
      // Insert topic if it doesn't exist
      await supabase
        .from('topics')
        .upsert({ 
          topic_name: topicName, 
          seo_slug: seoSlug 
        }, { 
          onConflict: 'topic_name' 
        });
    }

    // Get topic IDs
    const { data: topicsData, error: topicsError } = await supabase
      .from('topics')
      .select('id, topic_name')
      .in('topic_name', topics);

    if (topicsError) {
      console.error('Error fetching topics:', topicsError);
      return;
    }

    // Create quote-topic relationships
    const quoteTopics = topicsData.map(topic => ({
      quote_id: quoteId,
      topic_id: topic.id
    }));

    console.log('Creating quote topics:', quoteTopics);

    const { error } = await supabase
      .from('quote_topics')
      .insert(quoteTopics);

    if (error) {
      console.error('Error creating quote topics:', error);
    }
  } catch (error) {
    console.error('Error in createQuoteTopics:', error);
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
      translated_text: translation.text,
      source: translation.source,
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
