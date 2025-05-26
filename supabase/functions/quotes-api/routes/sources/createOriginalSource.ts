
import { supabase } from "../../utils/db.ts";
import { corsHeaders } from "../../utils/cors.ts";

// POST /original_sources - Create a new original source
export async function createOriginalSource(req: Request): Promise<Response> {
  try {
    const sourceData = await req.json();
    
    // No required fields validation since all fields are optional in the new schema
    
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
