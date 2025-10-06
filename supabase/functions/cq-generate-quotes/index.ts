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
}

interface GeneratedQuote {
  quote_text: string;
  author_name: string;
  source_title: string;
  source_date?: string;
  chapter_or_section?: string;
  source_context_text: string;
  quote_context?: string;
  quote_topics?: string[];
  seo_keywords?: string[];
  original_language?: string;
  translator_name?: string;
  confidence_score: number;
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

    const { prompt, count, sourceType }: GenerateQuotesRequest = await req.json();

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

    const systemPrompt = `You are CQ (CiteQuotes AI), a research assistant that generates historically accurate quotes with comprehensive attribution and metadata.

Generate ${count} quote(s) based on this prompt: "${prompt}"${sourceType ? ` (prefer ${sourceType} sources)` : ''}

For EACH quote, you MUST provide comprehensive metadata:

REQUIRED FIELDS:
1. quote_text: The exact quote (in quotation marks)
2. author_name: Full name of the author/speaker
3. source_title: Complete title of the source (book, speech, article, document, etc.)
4. source_date: Publication or speech date (YYYY-MM-DD, YYYY-MM, or YYYY format)
5. source_context_text: 2-4 sentences explaining the historical circumstances, setting, and significance of this quote. Include: when it was said/written, what was happening at the time, why it was significant.
6. quote_context: 1-2 sentences explaining what the author meant by this quote and its immediate context within the source.
7. confidence_score: 0.0-1.0 (how certain you are about accuracy and attribution)

HIGHLY RECOMMENDED FIELDS:
8. chapter_or_section: Specific location in source (chapter, page, section, verse, etc.)
9. quote_topics: 3-5 relevant topics/themes as an array (e.g., ["freedom", "justice", "democracy"])
10. seo_keywords: 3-7 searchable keywords as an array for discoverability
11. original_language: ISO language code if not English (e.g., "de" for German, "fr" for French)
12. translator_name: If translated, who translated it (if known)

CRITICAL REQUIREMENTS:
- Generate ONLY real, verifiable quotes - NO fabrications whatsoever
- Source attribution MUST be accurate and specific
- Historical context MUST be factually correct
- If translating, note original language and translator
- Include publication dates whenever possible
- Lower confidence score if any uncertainty exists
- Provide enough detail for academic verification
- Vary authors, time periods, and topics for diversity

Quality checklist for each quote:
✓ Can this quote be verified in the cited source?
✓ Is the historical context accurate and informative?
✓ Does it have proper attribution with date?
✓ Are topics and keywords relevant and useful?
✓ Is the metadata comprehensive enough for citation?`;

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
                      source_date: { type: 'string', description: 'Publication/speech date (YYYY-MM-DD, YYYY-MM, or YYYY)' },
                      chapter_or_section: { type: 'string', description: 'Chapter, page, section, or verse reference' },
                      source_context_text: { type: 'string', description: 'Historical context: circumstances, setting, and significance (2-4 sentences)' },
                      quote_context: { type: 'string', description: 'What the author meant and immediate context (1-2 sentences)' },
                      quote_topics: { type: 'array', items: { type: 'string' }, description: '3-5 relevant topics/themes' },
                      seo_keywords: { type: 'array', items: { type: 'string' }, description: '3-7 searchable keywords' },
                      original_language: { type: 'string', description: 'ISO language code if not English (e.g., "de", "fr")' },
                      translator_name: { type: 'string', description: 'Name of translator if applicable' },
                      confidence_score: { type: 'number', minimum: 0, maximum: 1, description: 'Confidence in accuracy (0.0-1.0)' }
                    },
                    required: ['quote_text', 'author_name', 'source_title', 'source_date', 'source_context_text', 'quote_context', 'confidence_score'],
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

    // Insert into quote_submissions with comprehensive metadata
    const submissions = generatedQuotes.map(quote => ({
      quote_text: quote.quote_text,
      author_name: quote.author_name,
      source_title: quote.source_title,
      source_date: quote.source_date || null,
      chapter_or_section: quote.chapter_or_section || null,
      source_context_text: quote.source_context_text,
      quote_topics: quote.quote_topics || [],
      seo_keywords: quote.seo_keywords || [],
      original_language: quote.original_language || null,
      translator_name: quote.translator_name || null,
      confidence_score: quote.confidence_score,
      status: 'pending',
      source_app: 'cq_ai_worker',
      processing_notes: `AI-generated by CQ with comprehensive attribution (Confidence: ${(quote.confidence_score * 100).toFixed(0)}%). Context: ${quote.quote_context || 'See source context'}`,
    }));

    const { data: insertedData, error: insertError } = await supabase
      .from('quote_submissions')
      .insert(submissions)
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
        count: generatedQuotes.length,
        submission_ids: insertedData?.map(s => s.id)
      }
    });

    console.log(`Successfully generated ${generatedQuotes.length} quotes`);

    return new Response(JSON.stringify({
      success: true,
      count: generatedQuotes.length,
      quotes: insertedData
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
