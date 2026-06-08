import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const MODEL = 'google/gemini-2.5-flash';
const PROMPT_VERSION = 1;

async function sha256Hex(input: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function computeQuoteId(quote_id: string | undefined, quote_text: string, author: string) {
  if (quote_id && quote_id.trim()) return Promise.resolve(quote_id.trim());
  return sha256Hex(`${quote_text.trim().toLowerCase()}|${(author || '').trim().toLowerCase()}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { quote_id, quote_text, author } = await req.json();
    if (!quote_text) {
      return new Response(JSON.stringify({ error: 'quote_text required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const id = await computeQuoteId(quote_id, quote_text, author || '');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: existing } = await admin
      .from('quote_ai_cache')
      .select('*')
      .eq('quote_id', id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify(existing), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You enrich literary quotes. Respond with STRICT JSON only matching: {"bio": string, "analysis": string, "tags": string[]}. No markdown, no prose outside JSON.',
          },
          {
            role: 'user',
            content: `Quote: "${quote_text}"\nAuthor: ${author || 'Unknown'}\n\nProvide:\n- bio: 2-3 sentence author bio/context\n- analysis: 2-4 sentence explanation of meaning\n- tags: 3-7 short thematic tags`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResp.ok) {
      console.error('AI error', aiResp.status, await aiResp.text());
      return new Response(JSON.stringify(null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiResp.json();
    const content = aiJson.choices?.[0]?.message?.content;
    let parsed: { bio?: string; analysis?: string; tags?: string[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error('Parse failure', content);
      return new Response(JSON.stringify(null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const row = {
      quote_id: id,
      bio: parsed.bio ?? null,
      analysis: parsed.analysis ?? null,
      tags: Array.isArray(parsed.tags) ? parsed.tags : null,
      related_quote_ids: null,
      model: MODEL,
      prompt_version: PROMPT_VERSION,
    };

    const { data: upserted, error: upErr } = await admin
      .from('quote_ai_cache')
      .upsert(row, { onConflict: 'quote_id' })
      .select('*')
      .maybeSingle();

    if (upErr) {
      console.error('Upsert error', upErr);
      return new Response(JSON.stringify(null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(upserted), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
