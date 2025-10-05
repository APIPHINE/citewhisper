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
  quote_topics?: string[];
  confidence_score: number;
  processing_notes: string;
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

    const systemPrompt = `You are CQ (CiteQuotes AI), a research assistant that generates historically accurate quotes with proper attribution.

Generate ${count} quote(s) based on this prompt: "${prompt}"${sourceType ? ` (prefer ${sourceType} sources)` : ''}

For each quote, provide:
1. Exact quote text (in quotes)
2. Author's full name
3. Source title (book, speech, article, etc.)
4. Publication/speech date (if known, use YYYY-MM-DD format)
5. Chapter, section, or page reference (if applicable)
6. Context paragraph (2-3 sentences explaining circumstances)
7. Relevant topics/themes (2-5 keywords)
8. Confidence score (0.0-1.0) - how certain you are about accuracy

Important guidelines:
- Generate real, verifiable quotes only - NO fabrications
- If unsure about exact wording, note lower confidence
- Include enough context for verification
- Prefer well-documented historical quotes
- Vary authors and time periods for diversity`;

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
                      quote_text: { type: 'string' },
                      author_name: { type: 'string' },
                      source_title: { type: 'string' },
                      source_date: { type: 'string' },
                      chapter_or_section: { type: 'string' },
                      source_context_text: { type: 'string' },
                      quote_topics: { type: 'array', items: { type: 'string' } },
                      confidence_score: { type: 'number', minimum: 0, maximum: 1 }
                    },
                    required: ['quote_text', 'author_name', 'source_title', 'source_context_text', 'confidence_score']
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

    // Insert into quote_submissions
    const submissions = generatedQuotes.map(quote => ({
      quote_text: quote.quote_text,
      author_name: quote.author_name,
      source_title: quote.source_title,
      source_date: quote.source_date || null,
      chapter_or_section: quote.chapter_or_section || null,
      source_context_text: quote.source_context_text,
      quote_topics: quote.quote_topics || [],
      confidence_score: quote.confidence_score,
      status: 'pending',
      source_app: 'cq_ai_worker',
      processing_notes: `AI-generated by CQ (Confidence: ${(quote.confidence_score * 100).toFixed(0)}%)`,
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
