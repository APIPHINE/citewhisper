
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for fetch compatibility
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { handleRequest } from "./handlers.ts";

// Start the HTTP server
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    return await handleRequest(req);
  } catch (error) {
    console.error('Error in request handler:', error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
