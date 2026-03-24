export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "rascunho" | "publicado" | null

    let query = supabase
      .from("noticias")
      .select("*")
      .or("fonte.ilike.%g1%,fonte.ilike.%rc24%")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro listar-importadas:", error);
      return NextResponse.json(
        { message: "Erro ao buscar notícias importadas." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (e) {
    console.error("Erro geral listar-importadas:", e);
    return NextResponse.json(
      { message: "Erro interno ao listar notícias importadas." },
      { status: 500 }
    );
  }
}
