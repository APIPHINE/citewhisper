
import { corsHeaders } from "./utils/cors.ts";
import { getQuotes } from "./routes/quotes/getQuotes.ts";
import { createQuote } from "./routes/quotes/createQuote.ts";
import { createOriginalSource } from "./routes/sources/createOriginalSource.ts";
import { createTranslation } from "./routes/translations/createTranslation.ts";

// Main request handler that routes to appropriate handler functions
export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace('/quotes-api', '');
  
  console.log(`Handling request: ${req.method} ${path}`);
  
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
}
