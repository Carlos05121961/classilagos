import { createClient } from "@supabase/supabase-js";

// MESMAS variáveis que você já usa:
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ATENÇÃO: sem "use client" aqui em cima.
// Este client é para ser usado APENAS em código de servidor (rotas API, etc).

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: variáveis do Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) não estão configuradas."
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
