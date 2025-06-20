
import { supabase, addAttributionToImage } from "../../utils/db.ts";
import { corsHeaders } from "../../utils/cors.ts";

// POST /quotes - Create a new quote
export async function createQuote(req: Request): Promise<Response> {
  try {
    const quoteData = await req.json();
    
    // Validate required fields
    const requiredFields = ['quote_text', 'author_name'];
    const missingFields = requiredFields.filter(field => !quoteData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate UUID if not provided
    if (!quoteData.id) {
      quoteData.id = crypto.randomUUID();
    }
    
    // Set insertion timestamp
    quoteData.inserted_at = new Date().toISOString();
    quoteData.updated_at = new Date().toISOString();
    
    // Apply attribution metadata if there's an image
    if (quoteData.quote_image_url) {
      const attributionMetadata = {
        author: quoteData.author_name,
        source: quoteData.source_title,
        quote: quoteData.quote_text.substring(0, 100) + (quoteData.quote_text.length > 100 ? '...' : ''),
        submissionDate: quoteData.inserted_at,
        fairUseNotice: "Used under Fair Use (17 U.S.C. § 107) for educational purposes"
      };
      
      // Add attribution metadata to the image
      await addAttributionToImage(quoteData.quote_image_url, attributionMetadata);
    }
    
    // Insert quote into database
    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select();
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
