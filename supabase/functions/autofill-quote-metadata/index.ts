import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteText, ocrContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert at analyzing quotes and extracting metadata. Given a quote and its surrounding context from OCR text, extract as much information as possible about:
- Author name
- Date (in YYYY-MM-DD format if possible)
- Context (what the quote is about, circumstances)
- Source title (book, speech, document name)
- Topics (relevant themes or subjects)

Be conservative - only provide information you're confident about based on the text. If you can't determine something, leave it null.`;

    const userPrompt = `Quote: "${quoteText}"

OCR Context: ${ocrContext || 'No additional context available'}

Extract all available metadata for this quote.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_quote_metadata",
            description: "Extract metadata from a quote",
            parameters: {
              type: "object",
              properties: {
                author: { type: "string", description: "The author's name" },
                date: { type: "string", description: "Date in YYYY-MM-DD format" },
                context: { type: "string", description: "Context about the quote" },
                sourceTitle: { type: "string", description: "Title of the source" },
                topics: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Relevant topics or themes"
                }
              },
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_quote_metadata" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI Gateway error');
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No metadata extracted');
    }

    const metadata = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(metadata),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in autofill-quote-metadata:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to extract metadata' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
