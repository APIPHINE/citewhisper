
import { supabase } from "../../utils/db.ts";
import { corsHeaders } from "../../utils/cors.ts";

// GET /quotes - List all quotes
export async function getQuotes(req: Request): Promise<Response> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*');
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Transform the response to match the frontend Quote model
    const transformedData = data.map(quote => ({
      id: quote.id,
      text: quote.quote_text || '', // Map DB quote_text to text in model
      author: quote.author,
      date: quote.date,
      topics: quote.topics || [],
      theme: quote.theme || '',
      source: quote.source,
      evidenceImage: quote.quote_image_url, // Map DB quote_image_url to evidenceImage
      sourceUrl: quote.source_url,
      sourcePublicationDate: quote.source_publication_date,
      originalLanguage: quote.original_language,
      originalText: quote.original_text,
      context: quote.context,
      historicalContext: quote.historical_context,
      keywords: quote.keywords || [],
      citationAPA: quote.citation_apa,
      citationMLA: quote.citation_mla,
      citationChicago: quote.citation_chicago,
      shareCount: quote.share_count || 0, // Use actual share_count if available
      attributionStatus: quote.attribution_status || "Pending",
      fairUseJustification: {
        purpose: "Educational/Transformative",
        natureOfWork: "Factual/Published",
        amountUsed: "Limited excerpt",
        marketEffect: "No market substitution"
      }
    }));
    
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
