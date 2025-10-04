import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use Gemini's vision capabilities for OCR
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert OCR system. Extract all visible text from images with high accuracy. Parse and identify: author name, title/source, context/quote text, and any other relevant metadata. Return results as JSON with fields: text, author, title, context, confidence (0-1).'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text from this image and identify the author, title, and quote/context if present.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_text_metadata',
              description: 'Extract text and metadata from document image',
              parameters: {
                type: 'object',
                properties: {
                  text: { type: 'string', description: 'Full extracted text' },
                  author: { type: 'string', description: 'Author name if identifiable' },
                  title: { type: 'string', description: 'Title or source name if identifiable' },
                  context: { type: 'string', description: 'Main quote or context text' },
                  confidence: { type: 'number', description: 'Confidence score 0-1' }
                },
                required: ['text', 'confidence'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_text_metadata' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to process image');
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback if no tool call
    throw new Error('No valid response from AI');

  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        text: '',
        confidence: 0
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
