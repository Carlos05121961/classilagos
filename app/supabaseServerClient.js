import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Preferência: Service Role no server (API routes)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Se você quiser permitir sem service role (não recomendo p/ publicar),
// descomente a linha abaixo e ajuste a lógica.
// const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
