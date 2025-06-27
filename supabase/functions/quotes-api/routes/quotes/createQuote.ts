
import { SecurityService } from '../../utils/security.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = "https://yrafjktkkspcptkcaowj.supabase.co";
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function handleCreateQuote(req: Request): Promise<Response> {
  try {
    // Extract security context
    const securityContext = SecurityService.extractSecurityContext(req);
    
    // Validate authentication
    const authResult = await SecurityService.validateAuth(req.headers.get('authorization'));
    if (!authResult.userId) {
      await SecurityService.logSecurityEvent(
        'unauthorized_quote_creation_attempt',
        { error: authResult.error },
        'medium',
        securityContext
      );
      
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const rateLimitOk = await SecurityService.checkRateLimit(
      authResult.userId,
      securityContext.ipAddress || 'unknown',
      'quote_creation',
      5, // 5 attempts
      1   // per minute
    );

    if (!rateLimitOk) {
      await SecurityService.logSecurityEvent(
        'rate_limit_exceeded',
        { 
          action: 'quote_creation',
          user_id: authResult.userId,
          ip: securityContext.ipAddress 
        },
        'high',
        securityContext
      );

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    
    // Sanitize inputs
    const sanitizedData = {
      quote_text: SecurityService.sanitizeInput(body.quote_text || ''),
      author_name: SecurityService.sanitizeInput(body.author_name || ''),
      quote_context: SecurityService.sanitizeInput(body.quote_context || ''),
      source_title: SecurityService.sanitizeInput(body.source_title || ''),
      source_author: SecurityService.sanitizeInput(body.source_author || ''),
      source_publisher: SecurityService.sanitizeInput(body.source_publisher || ''),
      source_year: SecurityService.sanitizeInput(body.source_year || ''),
      source_url: body.source_url || '',
      seo_keywords: Array.isArray(body.seo_keywords) ? 
        body.seo_keywords.map((k: string) => SecurityService.sanitizeInput(k)).slice(0, 10) : []
    };

    // Validate required fields
    if (!sanitizedData.quote_text.trim()) {
      return new Response(
        JSON.stringify({ error: 'Quote text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL if provided
    if (sanitizedData.source_url && !sanitizedData.source_url.match(/^https?:\/\/.+/)) {
      return new Response(
        JSON.stringify({ error: 'Invalid source URL format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        quote_text: sanitizedData.quote_text,
        author_name: sanitizedData.author_name || null,
        date_original: body.date_original || null,
        quote_context: sanitizedData.quote_context || null,
        seo_keywords: sanitizedData.seo_keywords,
        created_by: authResult.userId,
        updated_by: authResult.userId
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Quote creation error:', quoteError);
      
      await SecurityService.logSecurityEvent(
        'quote_creation_database_error',
        { error: quoteError.message, user_id: authResult.userId },
        'medium',
        securityContext
      );

      return new Response(
        JSON.stringify({ error: 'Failed to create quote' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create source if provided
    let sourceId: string | null = null;
    if (sanitizedData.source_title || sanitizedData.source_author) {
      const { data: source, error: sourceError } = await supabase
        .from('original_sources')
        .insert({
          title: sanitizedData.source_title || null,
          author: sanitizedData.source_author || null,
          publisher: sanitizedData.source_publisher || null,
          publication_year: sanitizedData.source_year || null,
          archive_url: sanitizedData.source_url || null
        })
        .select()
        .single();

      if (!sourceError && source) {
        sourceId = source.id;
        
        // Update quote with source reference
        await supabase
          .from('quotes')
          .update({ source_id: sourceId })
          .eq('id', quote.id);
      }
    }

    // Log the activity using the new function
    await supabase.rpc('log_user_activity', {
      p_user_id: authResult.userId,
      p_action_type: 'create',
      p_resource_type: 'quote',
      p_resource_id: quote.id,
      p_ip_address: securityContext.ipAddress,
      p_user_agent: securityContext.userAgent,
      p_action_details: {
        quote_text_length: sanitizedData.quote_text.length,
        author_name: sanitizedData.author_name,
        has_source: !!sourceId
      },
      p_session_id: securityContext.sessionId
    });

    // Log the contribution
    const contributionId = await supabase.rpc('log_user_contribution', {
      p_user_id: authResult.userId,
      p_contribution_type: 'quote_submission',
      p_quote_id: quote.id,
      p_points: 10,
      p_description: `Submitted quote: "${sanitizedData.quote_text.substring(0, 50)}..."`,
      p_metadata: {
        quote_id: quote.id,
        author_name: sanitizedData.author_name,
        has_source: !!sourceId
      }
    });

    // Log successful creation
    await SecurityService.logSecurityEvent(
      'quote_created_successfully',
      { 
        quote_id: quote.id,
        user_id: authResult.userId,
        has_source: !!sourceId,
        contribution_id: contributionId
      },
      'low',
      securityContext
    );

    return new Response(
      JSON.stringify({
        success: true,
        quote_id: quote.id,
        contribution_id: contributionId
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in handleCreateQuote:', error);
    
    await SecurityService.logSecurityEvent(
      'quote_creation_system_error',
      { error: error.message },
      'high'
    );

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
