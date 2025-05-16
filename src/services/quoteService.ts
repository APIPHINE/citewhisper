
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/utils/quotesData";

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
      // Note: quote_text in DB maps to text in our model
      return {
        id: quote.id,
        text: quote.quote_text || '', // Map quote_text from DB to text in model
        author: quote.author,
        date: quote.date,
        topics: quote.topics || [],
        theme: quote.theme || '',
        source: quote.source,
        evidenceImage: quote.quote_image_url, // Map quote_image_url to evidenceImage
        sourceUrl: quote.source_url,
        sourcePublicationDate: quote.source_publication_date,
        originalLanguage: quote.original_language,
        originalText: quote.original_text,
        context: quote.context,
        historicalContext: quote.historical_context,
        keywords: quote.keywords || [],
        emotionalTone: quote.emotional_tone || '', // Properly map the emotional_tone field
        citationAPA: quote.citation_apa,
        citationMLA: quote.citation_mla,
        citationChicago: quote.citation_chicago,
        // Default export formats if not provided
        exportFormats: { json: true, csv: true, cff: true },
        shareCount: 0, // Default share count
        // The following fields may not exist in the DB yet
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

export async function uploadEvidenceImage(file: File, attributionMetadata: Record<string, any>): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('quote_evidence')
      .upload(filePath, file, {
        metadata: attributionMetadata
      });

    if (uploadError) {
      console.error('Error uploading evidence image:', uploadError);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('quote_evidence')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadEvidenceImage:', error);
    return null;
  }
}

export async function createQuote(quoteData: Partial<Quote>): Promise<Quote | null> {
  try {
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
      emotional_tone: quoteData.emotionalTone || '', // Map emotionalTone to emotional_tone for DB
      quote_image_url: quoteData.evidenceImage, // Map evidenceImage to quote_image_url
      citation_apa: quoteData.citationAPA,
      citation_mla: quoteData.citationMLA,
      citation_chicago: quoteData.citationChicago
    };

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

    // Handle original source if provided
    if (quoteData.originalSource) {
      const originalSourceData = {
        quote_id: data.id,
        title: quoteData.originalSource.title,
        publisher: quoteData.originalSource.publisher,
        publication_date: quoteData.originalSource.publicationDate,
        location: quoteData.originalSource.location,
        isbn: quoteData.originalSource.isbn,
        source_url: quoteData.originalSource.sourceUrl
      };

      const { error: originalSourceError } = await supabase
        .from('original_sources')
        .insert([originalSourceData]);

      if (originalSourceError) {
        console.error('Error creating original source:', originalSourceError);
      }
    }

    // Handle translations if provided
    if (Array.isArray(quoteData.translations)) {
      const translationsData = quoteData.translations.map(translation => ({
        quote_id: data.id,
        language: translation.language,
        text: translation.text,
        source: translation.source,
        translator: translation.translator,
        publication: translation.publication,
        publication_date: translation.publicationDate,
        source_url: translation.sourceUrl
      }));

      const { error: translationsError } = await supabase
        .from('translations')
        .insert(translationsData);

      if (translationsError) {
        console.error('Error creating translations:', translationsError);
      }
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

export async function incrementShareCount(quoteId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_quote_share_count', { quote_id: quoteId });
    if (error) {
      console.error('Error incrementing share count:', error);
    }
  } catch (error) {
    console.error('Error in incrementShareCount:', error);
  }
}
