import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";



export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("noticias")
      .select("id, titulo, fonte, created_at, status, tipo")
      .eq("tipo", "importada")
      .eq("status", "rascunho")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Erro ao listar notícias importadas:", error);
      return NextResponse.json(
        { error: "Erro ao listar notícias importadas." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Erro inesperado:", err);
    return NextResponse.json(
      { error: "Erro inesperado ao listar notícias." },
      { status: 500 }
    );
  }
}
