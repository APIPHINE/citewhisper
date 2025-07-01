
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const supabaseUrl = "https://yrafjktkkspcptkcaowj.supabase.co";
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'POST' && path === '/submit') {
      return await handleSubmission(req);
    } else if (req.method === 'GET' && path === '/status') {
      return await handleStatusCheck(req);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Error in external-quote-submissions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleSubmission(req: Request) {
  const submissionData = await req.json();

  // Validate required fields
  const requiredFields = ['quote_text', 'author_name', 'source_title', 'source_app'];
  for (const field of requiredFields) {
    if (!submissionData[field]) {
      return new Response(JSON.stringify({ 
        error: `Missing required field: ${field}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // Rate limiting check (basic implementation)
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  const { data: recentSubmissions } = await supabase
    .from('quote_submissions')
    .select('id')
    .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
    .limit(10);

  if (recentSubmissions && recentSubmissions.length >= 5) {
    return new Response(JSON.stringify({ 
      error: 'Rate limit exceeded. Please wait before submitting again.' 
    }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Insert submission
  const { data, error } = await supabase
    .from('quote_submissions')
    .insert({
      quote_text: submissionData.quote_text,
      author_name: submissionData.author_name,
      source_title: submissionData.source_title,
      source_app: submissionData.source_app,
      external_submission_id: submissionData.external_submission_id,
      original_language: submissionData.original_language || 'English',
      translation_language: submissionData.translation_language,
      translated_quote: submissionData.translated_quote,
      is_translation: submissionData.is_translation || false,
      source_date: submissionData.source_date,
      chapter_or_section: submissionData.chapter_or_section,
      translator_name: submissionData.translator_name,
      ocr_text: submissionData.ocr_text,
      image_url: submissionData.image_url,
      image_crop_coords: submissionData.image_crop_coords,
      image_language_hint: submissionData.image_language_hint,
      citation_style: submissionData.citation_style || 'CiteQuotes',
      generated_citation: submissionData.generated_citation,
      evidence_type: submissionData.evidence_type,
      source_manifest_url: submissionData.source_manifest_url,
      source_context_text: submissionData.source_context_text,
      quote_topics: submissionData.quote_topics,
      seo_slug: submissionData.seo_slug,
      seo_keywords: submissionData.seo_keywords,
      quote_rating: submissionData.quote_rating,
      device_type: submissionData.device_type,
      user_agent: req.headers.get('user-agent')
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting submission:', error);
    return new Response(JSON.stringify({ error: 'Failed to process submission' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Check for duplicates
  if (data?.id) {
    try {
      await supabase.rpc('check_submission_duplicates', { submission_id: data.id });
    } catch (dupError) {
      console.error('Error checking duplicates:', dupError);
      // Don't fail the submission if duplicate check fails
    }
  }

  return new Response(JSON.stringify({
    success: true,
    submission_id: data.id,
    status: 'pending',
    message: 'Quote submission received and is being reviewed'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleStatusCheck(req: Request) {
  const url = new URL(req.url);
  const submissionId = url.searchParams.get('id');
  const externalId = url.searchParams.get('external_id');

  if (!submissionId && !externalId) {
    return new Response(JSON.stringify({ 
      error: 'Missing submission ID or external ID' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let query = supabase
    .from('quote_submissions')
    .select('id, status, final_quote_id, processing_notes, processed_at');

  if (submissionId) {
    query = query.eq('id', submissionId);
  } else if (externalId) {
    query = query.eq('external_submission_id', externalId);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return new Response(JSON.stringify({ 
      error: 'Submission not found' 
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    submission_id: data.id,
    status: data.status,
    final_quote_id: data.final_quote_id,
    processing_notes: data.processing_notes,
    processed_at: data.processed_at
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
