import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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
      // externas: fonte (com variações) OU url_origem/link_original preenchido
      .or([
        "fonte.ilike.%g1%",
        "fonte.ilike.%rc24%",
        "url_origem.not.is.null",
        "link_original.not.is.null",
        "url_origem.neq.\"\"",
        "link_original.neq.\"\"",
      ].join(","))
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

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
