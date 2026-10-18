import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// Only instantiate when both env vars look like real values.
// A missing/placeholder config would crash createClient() with a cryptic error.
const isReady =
  url.startsWith('http') &&
  key.length > 20;

/** Supabase client, or `null` when config is absent → app uses fallback data */
export const supabase = isReady ? createClient(url, key) : null;