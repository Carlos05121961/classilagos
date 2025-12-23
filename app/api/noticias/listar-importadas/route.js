import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../supabaseAdminClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Começa simples (pra não quebrar por nome de coluna)
    const { data, error } = await supabase
      .from("noticias")
      .select("id,titulo,cidade,categoria,fonte,status,tipo,created_at")
      .eq("tipo", "importada")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("listar-importadas ERROR:", error);
      return NextResponse.json(
        {
          error: error.message,
          details: error.details || null,
          hint: error.hint || null,
          code: error.code || null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (e) {
    console.error("listar-importadas EXCEPTION:", e);
    return NextResponse.json(
      { error: e?.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}

