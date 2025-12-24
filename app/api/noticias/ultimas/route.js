import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("noticias")
    .select("id,titulo,cidade,categoria,fonte,created_at,imagem_capa,resumo")
    .eq("status", "publicado")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data: data || [] });
}
