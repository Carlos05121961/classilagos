import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .eq("tipo", "importada")
      .eq("status", "rascunho")
      .order("created_at", { ascending: false });

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
