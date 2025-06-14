
import { supabase } from "../../utils/db.ts";
import { corsHeaders } from "../../utils/cors.ts";

// POST /translations - Create a new translation
export async function createTranslation(req: Request): Promise<Response> {
  try {
    const translationData = await req.json();
    
    // Validate required fields for the new schema
    const requiredFields = ['quote_id', 'language', 'translated_text'];
    const missingFields = requiredFields.filter(field => !translationData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Insert translation into database
    const { data, error } = await supabase
      .from('translations')
      .insert([translationData])
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
