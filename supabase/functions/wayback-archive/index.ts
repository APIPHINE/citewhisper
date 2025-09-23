import { corsHeaders } from '../_shared/cors.ts';

const WAYBACK_SAVE_API = 'https://web.archive.org/save/';
const WAYBACK_AVAILABILITY_API = 'https://archive.org/wayback/available';

interface ArchiveRequest {
  url: string;
  quote_id?: string;
}

interface ArchiveResponse {
  success: boolean;
  archived_url?: string;
  original_url?: string;
  timestamp?: string;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const { url, quote_id }: ArchiveRequest = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Starting Wayback Machine archive for URL: ${url}`);

    // First check if URL is already archived recently (within 30 days)
    const availabilityResponse = await fetch(`${WAYBACK_AVAILABILITY_API}?url=${encodeURIComponent(url)}`);
    
    if (availabilityResponse.ok) {
      const availabilityData = await availabilityResponse.json();
      
      if (availabilityData.archived_snapshots?.closest?.available) {
        const snapshot = availabilityData.archived_snapshots.closest;
        const snapshotDate = new Date(snapshot.timestamp.slice(0, 4) + '-' + snapshot.timestamp.slice(4, 6) + '-' + snapshot.timestamp.slice(6, 8));
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        if (snapshotDate > thirtyDaysAgo) {
          console.log(`Recent archive found for ${url}: ${snapshot.url}`);
          return new Response(
            JSON.stringify({
              success: true,
              archived_url: snapshot.url,
              original_url: url,
              timestamp: snapshot.timestamp,
              note: 'Used existing recent archive'
            } as ArchiveResponse),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }
    }

    // Submit URL to Wayback Machine for archiving
    const saveResponse = await fetch(WAYBACK_SAVE_API + encodeURIComponent(url), {
      method: 'GET',
      headers: {
        'User-Agent': 'CiteQuotes/1.0 (Academic quote verification system)',
      },
    });

    if (!saveResponse.ok) {
      throw new Error(`Wayback Machine API error: ${saveResponse.status}`);
    }

    // The Wayback Machine typically redirects to the archived URL
    const finalUrl = saveResponse.url;
    
    if (finalUrl.includes('web.archive.org/web/')) {
      console.log(`Successfully archived ${url} -> ${finalUrl}`);
      
      // Extract timestamp from archived URL
      const timestampMatch = finalUrl.match(/web\.archive\.org\/web\/(\d+)\//);
      const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);

      return new Response(
        JSON.stringify({
          success: true,
          archived_url: finalUrl,
          original_url: url,
          timestamp: timestamp,
          note: 'Newly archived'
        } as ArchiveResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If we get here, the archiving might have failed or is still processing
    throw new Error('Archive URL not found in response');

  } catch (error) {
    console.error('Wayback archiving error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to archive URL',
      } as ArchiveResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});