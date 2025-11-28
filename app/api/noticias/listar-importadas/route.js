import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("noticias")
      .select(
        `
        id,
        titulo,
        resumo,
        texto,
        cidade,
        categoria,
        fonte,
        status,
        tipo,
        created_at
      `
      )
      .eq("tipo", "importada")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Erro ao listar notícias importadas:", error);
      return NextResponse.json(
        { error: error.message || "Erro ao listar notícias." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Erro inesperado em listar-importadas:", e);
    return NextResponse.json(
      { error: "Erro inesperado ao listar notícias importadas." },
      { status: 500 }
    );
  }
}

