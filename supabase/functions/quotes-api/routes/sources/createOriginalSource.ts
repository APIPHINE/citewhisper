
import { supabase } from "../../utils/db.ts";
import { corsHeaders } from "../../utils/cors.ts";

// POST /original_sources - Create a new original source
export async function createOriginalSource(req: Request): Promise<Response> {
  try {
    const sourceData = await req.json();
    
    // Validate required fields
    const requiredFields = ['quote_id', 'title', 'publisher', 'publication_date', 'location'];
    const missingFields = requiredFields.filter(field => !sourceData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Insert original source into database
    const { data, error } = await supabase
      .from('original_sources')
      .insert([sourceData])
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
