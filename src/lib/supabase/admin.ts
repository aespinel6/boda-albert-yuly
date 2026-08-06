import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con SERVICE ROLE — bypassa RLS.
 * SOLO usar en el servidor (Server Actions / route handlers del admin).
 * Nunca importar desde componentes de cliente.
 */
export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
