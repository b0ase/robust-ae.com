import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for use in server/client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 