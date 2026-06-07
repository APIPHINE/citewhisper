// Generate-once, store-forever AI enrichment for quotes.
// Flow: normalize -> exact hash lookup -> fuzzy trigram lookup -> AI generate -> store.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const MODEL = "google/gemini-2.5-flash";
const SIMILARITY_THRESHOLD = 0.78;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

function normalize(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/["'`’‘“”]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface Enrichment {
  context: string;
  source_guess: {
    title: string | null;
    publication_year: string | null;
    medium: string | null;
  };
  topics: string[];
  themes: string[];
  emotional_tone: string | null;
  keywords: string[];
  historical_context: string | null;
  attribution_confidence: number; // 0-1
  notes: string | null;
}

async function generateEnrichment(
  quote_text: string,
  author_name: string,
): Promise<{ data: Enrichment; confidence: number }> {
  const res = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a scholarly quote-metadata researcher. Given a quote and its purported author, return ONLY a JSON object enriching it. Be honest about uncertainty: if attribution is misattributed or unverifiable, set attribution_confidence low and explain in notes. Do not fabricate specific sources.",
          },
          {
            role: "user",
            content: `Quote: """${quote_text}"""\nAuthor (claimed): ${author_name || "unknown"}\n\nReturn JSON with this exact shape:\n{\n  "context": string (1-2 sentence factual context),\n  "source_guess": { "title": string|null, "publication_year": string|null, "medium": string|null },\n  "topics": string[] (3-6),\n  "themes": string[] (1-3),\n  "emotional_tone": string|null,\n  "keywords": string[] (5-10),\n  "historical_context": string|null,\n  "attribution_confidence": number between 0 and 1,\n  "notes": string|null (caveats, misattribution warnings)\n}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    },
  );

  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 429) throw new Error("RATE_LIMITED");
    if (res.status === 402) throw new Error("PAYMENT_REQUIRED");
    throw new Error(`AI gateway error ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? "{}";
  const parsed: Enrichment = JSON.parse(content);
  return { data: parsed, confidence: parsed.attribution_confidence ?? 0.5 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { quote_text, author_name = "" } = await req.json();
    if (typeof quote_text !== "string" || !quote_text.trim()) {
      return new Response(
        JSON.stringify({ error: "quote_text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const normalized_text = normalize(quote_text);
    const author_normalized = normalize(author_name);
    const text_hash = await sha256Hex(`${normalized_text}|${author_normalized}`);

    // 1) Exact hash hit
    const { data: exact } = await supabase
      .from("quote_enrichments")
      .select("id, enrichment, model, confidence")
      .eq("text_hash", text_hash)
      .maybeSingle();

    if (exact) {
      await supabase.rpc("bump_enrichment_hit", { p_id: exact.id });
      return new Response(
        JSON.stringify({
          cache: "exact",
          id: exact.id,
          model: exact.model,
          confidence: exact.confidence,
          enrichment: exact.enrichment,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2) Fuzzy trigram hit
    const { data: fuzzy } = await supabase.rpc("find_similar_enrichment", {
      p_normalized_text: normalized_text,
      p_author_normalized: author_normalized,
      p_threshold: SIMILARITY_THRESHOLD,
    });
    const hit = Array.isArray(fuzzy) ? fuzzy[0] : null;
    if (hit) {
      await supabase.rpc("bump_enrichment_hit", { p_id: hit.id });
      return new Response(
        JSON.stringify({
          cache: "fuzzy",
          id: hit.id,
          model: hit.model,
          confidence: hit.confidence,
          text_similarity: hit.text_similarity,
          author_similarity: hit.author_similarity,
          enrichment: hit.enrichment,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 3) Generate via Lovable AI
    const { data: enrichment, confidence } = await generateEnrichment(
      quote_text,
      author_name,
    );

    // 4) Store forever (race-safe via unique text_hash)
    const { data: inserted, error: insertErr } = await supabase
      .from("quote_enrichments")
      .insert({
        text_hash,
        normalized_text,
        author_normalized,
        original_text: quote_text,
        original_author: author_name || null,
        enrichment: enrichment as unknown as Record<string, unknown>,
        model: MODEL,
        confidence,
      })
      .select("id")
      .single();

    if (insertErr && !insertErr.message.includes("duplicate")) {
      console.error("Insert error:", insertErr);
    }

    return new Response(
      JSON.stringify({
        cache: "miss",
        id: inserted?.id ?? null,
        model: MODEL,
        confidence,
        enrichment,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status =
      msg === "RATE_LIMITED" ? 429 : msg === "PAYMENT_REQUIRED" ? 402 : 500;
    console.error("enrich-quote error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
