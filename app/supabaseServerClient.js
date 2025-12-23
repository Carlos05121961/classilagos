import { createClient } from "@supabase/supabase-js";

// URL do projeto (obrigatória)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// SERVICE ROLE (somente servidor) — obrigatória para deletar sem RLS
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
}

// Client ADMIN (server-only)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
