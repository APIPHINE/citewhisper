
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for fetch compatibility
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { createSecureResponse } from "./utils/securityHeaders.ts";
import { SecurityService } from "./utils/security.ts";
import { handleRequest } from "./handlers.ts";

// Start the HTTP server
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createSecureResponse(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Extract security context and detect suspicious patterns
    const context = SecurityService.extractSecurityContext(req);
    const suspiciousPatterns = SecurityService.detectSuspiciousPatterns(
      context.userAgent || '', 
      new URL(req.url).pathname
    );
    
    if (suspiciousPatterns.length > 0) {
      SecurityService.logSecurityEvent(
        'SUSPICIOUS_REQUEST_DETECTED',
        { patterns: suspiciousPatterns, context },
        'medium'
      );
    }

    const response = await handleRequest(req);
    return createSecureResponse(response.body, {
      status: response.status,
      headers: response.headers
    });
  } catch (error) {
    console.error('Error in request handler:', error);
    return createSecureResponse(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
