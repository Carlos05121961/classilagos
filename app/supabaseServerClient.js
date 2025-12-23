import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// NÃO estoura erro no build — só cria quando tem as vars
export function getSupabaseServer() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas.");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
