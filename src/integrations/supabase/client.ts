// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yrafjktkkspcptkcaowj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyYWZqa3Rra3NwY3B0a2Nhb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzUxOTksImV4cCI6MjA2MTcxMTE5OX0.Nii1IN9hIjxnRszD7NB9TcUfUx3_2I_JEFEcEdT5oWE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);