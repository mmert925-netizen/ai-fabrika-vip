/**
 * Supabase client – Vercel serverless
 * SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (veya SUPABASE_ANON_KEY)
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export function getSupabase() {
  if (!url || !key) return null;
  return createClient(url, key);
}

export function isSupabaseConfigured() {
  return !!(url && key);
}
