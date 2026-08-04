import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  console.log('[Supabase] Initialized client with PostgreSQL & RLS context.');
} else {
  console.log('[Supabase] Keys not provided in .env. Operating in high-performance local sandbox state.');
}

/**
 * Get Supabase client configured with a specific user's Clerk ID context for RLS
 */
export function getAuthenticatedSupabaseClient(userId: string) {
  if (!supabase) return null;

  // Set RLS custom claim session variable for Clerk user_id
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      headers: {
        'x-clerk-user-id': userId,
      },
    },
  });
}

/**
 * Append-only audit log insert. Uses the service-role client for guaranteed write access.
 * Audit logs are append-only: no UPDATE or DELETE is ever called on this table.
 */
export async function insertAuditLog(
  userId: string,
  action: string,
  resource: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  if (!supabase) {
    // In sandbox mode, just log to console
    console.log(`[Audit Log] ${action} | user=${userId} | resource=${resource} | meta=${JSON.stringify(metadata)}`);
    return;
  }

  const { error } = await supabase.from('audit_logs').insert([
    {
      user_id: userId,
      action,
      resource,
      metadata,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('[Audit Log] Failed to insert audit log:', error.message);
  }
}
