
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for fetch compatibility
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = "https://yrafjktkkspcptkcaowj.supabase.co";
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Routes handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace('/quotes-api', '');
  
  console.log(`Handling request: ${req.method} ${path}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Route handling
    if (path === '/quotes' || path === '/quotes/') {
      if (req.method === 'GET') {
        return await getQuotes(req);
      } else if (req.method === 'POST') {
        return await createQuote(req);
      }
    } else if (path === '/original_sources' || path === '/original_sources/') {
      if (req.method === 'POST') {
        return await createOriginalSource(req);
      }
    } else if (path === '/translations' || path === '/translations/') {
      if (req.method === 'POST') {
        return await createTranslation(req);
      }
    }
    
    // If no routes match, return 404
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in request handler:', error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// GET /quotes - List all quotes
async function getQuotes(req: Request): Promise<Response> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*');
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// POST /quotes - Create a new quote
async function createQuote(req: Request): Promise<Response> {
  try {
    const quoteData = await req.json();
    
    // Validate required fields
    const requiredFields = ['text', 'author', 'theme', 'source', 'original_language'];
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

// POST /original_sources - Create a new original source
async function createOriginalSource(req: Request): Promise<Response> {
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

// POST /translations - Create a new translation
async function createTranslation(req: Request): Promise<Response> {
  try {
    const translationData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'quote_id', 
      'language', 
      'text', 
      'source', 
      'translator', 
      'publication', 
      'publication_date'
    ];
    const missingFields = requiredFields.filter(field => !translationData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate ID if not provided, following the required format
    if (!translationData.id) {
      translationData.id = `${translationData.quote_id}_${translationData.language}`;
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

// Start the HTTP server
serve(handleRequest);
