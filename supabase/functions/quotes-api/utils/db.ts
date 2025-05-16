
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = "https://yrafjktkkspcptkcaowj.supabase.co";
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set! Edge functions may not work correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
