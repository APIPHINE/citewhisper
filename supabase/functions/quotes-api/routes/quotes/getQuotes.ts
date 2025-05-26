
import { supabase } from "../../utils/db.ts";
import { corsHeaders } from "../../utils/cors.ts";

// GET /quotes - List all quotes
export async function getQuotes(req: Request): Promise<Response> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        source:original_sources(*),
        quote_topics(
          topic:topics(topic_name)
        )
      `);
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Transform the response to match the frontend Quote model
    const transformedData = data.map(quote => {
      // Extract topics from the junction table
      const topics = quote.quote_topics?.map(qt => qt.topic?.topic_name).filter(Boolean) || [];

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
        keywords: quote.seo_keywords || [],
        citationAPA: '',
        citationMLA: '',
        citationChicago: '',
        shareCount: 0,
        attributionStatus: "Pending",
        fairUseJustification: {
          purpose: "Educational/Transformative",
          natureOfWork: "Factual/Published",
          amountUsed: "Limited excerpt",
          marketEffect: "No market substitution"
        }
      };
    });
    
    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in getQuotes:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
