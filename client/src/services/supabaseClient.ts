import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jzsvbqqckuqwcwbcgdwz.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__vkpt96SLRRkr8BZ6rlRvw_f_cTGNH9';

export const supabaseAnonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Creates an authenticated Supabase client using Clerk session token for native auth.uid() RLS binding.
 */
export function getAuthenticatedSupabaseClient(clerkToken?: string) {
  if (!clerkToken) return supabaseAnonClient;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
}
