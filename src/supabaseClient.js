import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const maskedUrl = supabaseUrl ? `${supabaseUrl.slice(0, 15)}...` : '';

if (maskedUrl) {
  console.log("Supabase Client initialized with URL:", maskedUrl);
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
