import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vnlumjpbelelxcjdppng.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/**
 * Public Supabase client for client-side operations (subject to RLS)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
