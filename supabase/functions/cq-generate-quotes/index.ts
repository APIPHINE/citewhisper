import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateQuotesRequest {
  prompt: string;
  count: number;
  sourceType?: string;
  targetCollection?: 'verified_quotes' | 'popular_unverified';
}

interface GeneratedQuote {
  quote_text: string;
  author_name: string;
  source_title: string;
  source_date?: string;
  chapter_or_section?: string;
  source_context_text: string;
  quote_context: string;
  quote_topics?: string[];
  seo_keywords?: string[];
  original_language?: string;
  translator_name?: string;
  confidence_score: number;
  source_verification_status: 'verified' | 'needs_review' | 'uncertain';
  commonly_attributed_to?: string;
  attribution_notes?: string;
  earliest_known_source?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and super_admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is super_admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('privilege')
      .eq('user_id', user.id)
      .single();

    if (roleError || roleData?.privilege !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized: Super admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting check - max 50 quotes per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from('quote_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('source_app', 'cq_ai_worker')
      .gte('created_at', oneHourAgo);

    if (recentCount && recentCount >= 50) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded: Maximum 50 quotes per hour' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, count, sourceType, targetCollection = 'verified_quotes' }: GenerateQuotesRequest = await req.json();

    if (!prompt || count < 1 || count > 10) {
      return new Response(JSON.stringify({ error: 'Invalid parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Lovable AI with Gemini
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const isPopularCollection = targetCollection === 'popular_unverified';
    
    const systemPrompt = isPopularCollection 
      ? `You are CQ (CiteQuotes) AI, generating POPULAR QUOTES where attribution may be uncertain or disputed.

CRITICAL INSTRUCTIONS FOR POPULAR QUOTES:
1. Focus on well-known, widely-circulated quotes
2. Be HONEST about attribution uncertainty
3. If a quote is commonly misattributed, note the real author if known
4. Include notes about why attribution is uncertain
5. Provide earliest known source if available, even if uncertain
6. Set confidence_score based on attribution certainty (0.3-0.7 range)
7. Always set source_verification_status to 'uncertain' or 'needs_review'

POPULAR QUOTE EXAMPLES:
- "Be the change you wish to see in the world" (commonly attributed to Gandhi, but paraphrased)
- "The definition of insanity is..." (often attributed to Einstein, actually unknown origin)
- "Well-behaved women seldom make history" (attributed to many, actually Laurel Thatcher Ulrich)

For each popular quote, provide:
- commonly_attributed_to: Who most people think said it
- attribution_notes: Explanation of the attribution problem
- earliest_known_source: If you can trace it
- actual_author_if_known: Corrected attribution (in source_context_text)
- confidence_score: 0.3-0.7 (lower = more uncertain)
- source_verification_status: 'uncertain' (default for popular quotes)

Generate ${count} popular but attribution-uncertain quotes based on: "${prompt}"`
      : `You are CQ (CiteQuotes) AI, a specialized quote generation and verification assistant.

**CRITICAL SOURCE VERIFICATION REQUIREMENTS:**
1. NEVER generate a quote unless you have a SPECIFIC, VERIFIABLE source
2. source_date MUST be specific: reject "unknown", "circa", "approximately"
3. Verify the source actually exists - no fictional or uncertain sources
4. Set source_verification_status:
   - 'verified': You're confident the source exists and is correct
   - 'needs_review': Source seems correct but needs human verification
   - 'uncertain': Cannot verify source with high confidence (DO NOT USE for verified quotes)
5. confidence_score must be ≥ 0.7 for verified quotes
6. If you cannot verify a source, DO NOT generate that quote

**REQUIRED METADATA (ALL fields must be filled):**
1. source_title: Full title of the source work
2. source_date: Specific publication date (YYYY, YYYY-MM-DD only)
3. author_name: Full name of the person quoted
4. quote_text: The exact quotation
5. source_context_text: Historical and publication context (2-3 sentences minimum)
6. quote_context: The meaning and significance of the quote (2-3 sentences)
7. confidence_score: 0.7-1.0 for verified
8. source_verification_status: 'verified' or 'needs_review'

**RECOMMENDED METADATA (provide when available):**
- chapter_or_section: Specific location in source
- quote_topics: 2-5 relevant topics/themes
- seo_keywords: 3-7 search-friendly keywords
- original_language: Language code if not English (e.g., "fr", "de", "la")
- translator_name: If quote is translated

**QUALITY STANDARDS:**
- Quotes must be historically accurate and VERIFIABLE with real sources
- Sources must be real, published works with specific dates
- NO vague dates like "unknown", "circa", "approximately"
- Reject any quote where you cannot verify the source
- Context must provide genuine historical/cultural background
- No modern paraphrases of historical quotes
- Translations must note original language

Generate ${count} high-quality, verified quotes based on: "${prompt}"${sourceType ? ` (preferred source type: ${sourceType})` : ''}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'generate_quotes',
            description: 'Generate quote submissions with metadata',
            parameters: {
              type: 'object',
              properties: {
                quotes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      quote_text: { type: 'string', description: 'The exact quote text' },
                      author_name: { type: 'string', description: 'Full name of author/speaker' },
                      source_title: { type: 'string', description: 'Complete title of the source' },
                      source_date: { type: 'string', description: 'Publication/speech date' },
                      chapter_or_section: { type: 'string', description: 'Chapter, page, section, or verse reference' },
                      source_context_text: { type: 'string', description: 'Historical context (2-4 sentences)' },
                      quote_context: { type: 'string', description: 'What the author meant (1-2 sentences)' },
                      quote_topics: { type: 'array', items: { type: 'string' }, description: '3-5 relevant topics/themes' },
                      seo_keywords: { type: 'array', items: { type: 'string' }, description: '3-7 searchable keywords' },
                      original_language: { type: 'string', description: 'ISO language code if not English' },
                      translator_name: { type: 'string', description: 'Name of translator if applicable' },
                      confidence_score: { type: 'number', minimum: 0, maximum: 1, description: 'Confidence in source accuracy' },
                      source_verification_status: { type: 'string', enum: ['verified', 'needs_review', 'uncertain'], description: 'Source verification status' },
                      commonly_attributed_to: { type: 'string', description: 'Who the quote is commonly attributed to (for popular quotes)' },
                      attribution_notes: { type: 'string', description: 'Notes about attribution uncertainty (for popular quotes)' },
                      earliest_known_source: { type: 'string', description: 'Earliest known source if traceable (for popular quotes)' }
                    },
                    required: ['quote_text', 'author_name', 'source_title', 'source_context_text', 'quote_context', 'confidence_score', 'source_verification_status'],
                    additionalProperties: false
                  }
                }
              },
              required: ['quotes']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_quotes' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'AI rate limit exceeded, please try again later' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted, please add funds' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', JSON.stringify(aiData, null, 2));

    // Extract quotes from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const generatedQuotes: GeneratedQuote[] = JSON.parse(toolCall.function.arguments).quotes;
    console.log(`Parsed ${generatedQuotes.length} quotes from AI response`);

    // Validate and route quotes based on collection type and confidence
    const routedQuotes = generatedQuotes.map(quote => {
      const confidence = quote.confidence_score || 0;
      const verification = quote.source_verification_status || 'needs_review';
      
      // Validation for verified quotes
      if (targetCollection === 'verified_quotes') {
        // Reject quotes with insufficient confidence
        if (confidence < 0.7) {
          console.log(`Rejected quote (low confidence: ${confidence}): "${quote.quote_text.substring(0, 50)}..."`);
          return null;
        }
        
        // Reject quotes with uncertain verification
        if (verification === 'uncertain') {
          console.log(`Rejected quote (uncertain source): "${quote.quote_text.substring(0, 50)}..."`);
          return null;
        }
        
        // Reject quotes with vague dates
        const vagueTerms = ['unknown', 'circa', 'approximately', 'around', 'about'];
        const hasVagueDate = vagueTerms.some(term => 
          quote.source_date?.toLowerCase().includes(term)
        );
        if (hasVagueDate || !quote.source_date) {
          console.log(`Rejected quote (vague/missing date): "${quote.quote_text.substring(0, 50)}..."`);
          return null;
        }
      }
      
      return quote;
    }).filter(Boolean) as GeneratedQuote[];

    console.log(`${routedQuotes.length} quotes passed validation`);

    if (routedQuotes.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No quotes met the quality standards. Try a different prompt or enable "Popular Quotes" mode.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Route quotes to appropriate table based on confidence and collection type
    if (targetCollection === 'popular_unverified') {
      // Insert into popular_unverified_quotes
      const popularQuotes = routedQuotes.map(quote => ({
        quote_text: quote.quote_text,
        commonly_attributed_to: quote.commonly_attributed_to || quote.author_name,
        actual_author_if_known: quote.source_context_text?.includes('actually') ? 
          quote.author_name : null,
        attribution_notes: quote.attribution_notes || 'Attribution uncertain',
        earliest_known_source: quote.earliest_known_source || quote.source_title,
        earliest_known_date: quote.source_date,
        status: 'unverified',
        confidence_score: quote.confidence_score,
        source_app: 'cq_ai_worker',
        created_at: new Date().toISOString()
      }));

      const { data: insertedPopular, error: insertError } = await supabase
        .from('popular_unverified_quotes')
        .insert(popularQuotes)
        .select();

      if (insertError) {
        console.error('Error inserting popular quotes:', insertError);
        throw insertError;
      }

      // Log to audit trail
      await supabase.from('admin_audit_log').insert({
        admin_user_id: user.id,
        action: 'CQ_GENERATE_POPULAR_QUOTES',
        new_values: {
          prompt,
          count: insertedPopular.length,
          quote_ids: insertedPopular?.map(s => s.id)
        }
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: insertedPopular.length,
          quotes: insertedPopular,
          collection: 'popular_unverified'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map quotes to submission format for verified collection
    const quoteSubmissions = routedQuotes.map(quote => ({
      quote_text: quote.quote_text,
      author_name: quote.author_name,
      source_title: quote.source_title,
      source_date: quote.source_date || null,
      chapter_or_section: quote.chapter_or_section || null,
      source_context_text: quote.source_context_text,
      quote_topics: quote.quote_topics || [],
      seo_keywords: quote.seo_keywords || [],
      original_language: quote.original_language || 'en',
      translator_name: quote.translator_name,
      confidence_score: quote.confidence_score,
      source_verification_status: quote.source_verification_status,
      target_collection: 'verified_quotes',
      status: 'pending',
      source_app: 'cq_ai_worker',
      processing_notes: `Generated by CQ AI Worker on ${new Date().toISOString()}. Confidence: ${quote.confidence_score}. Verification: ${quote.source_verification_status}`,
      created_at: new Date().toISOString()
    }));

    // Insert into quote_submissions with comprehensive metadata
    const { data: insertedData, error: insertError } = await supabase
      .from('quote_submissions')
      .insert(quoteSubmissions)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    // Log to audit trail
    await supabase.from('admin_audit_log').insert({
      admin_user_id: user.id,
      action: 'CQ_GENERATE_QUOTES',
      new_values: {
        prompt,
        count: routedQuotes.length,
        submission_ids: insertedData?.map(s => s.id)
      }
    });

    console.log(`Successfully generated ${routedQuotes.length} quotes`);

    return new Response(JSON.stringify({
      success: true,
      count: routedQuotes.length,
      quotes: insertedData,
      collection: 'verified_quotes'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('CQ generation error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
