import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("id");

    const id = Number(rawId);
    if (!rawId || Number.isNaN(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID inválido para exclusão." },
        { status: 400 }
      );
    }

    // 1) Confere se existe
    const { data: found, error: findErr } = await supabase
      .from("noticias")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (findErr) {
      console.error("Erro ao buscar notícia para excluir:", findErr);
      return NextResponse.json(
        { message: "Erro ao localizar a notícia." },
        { status: 500 }
      );
    }

    if (!found) {
      return NextResponse.json(
        { message: "Nada foi excluído (ID não encontrado)." },
        { status: 404 }
      );
    }

    // 2) Exclui
    const { error: delErr } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (delErr) {
      console.error("Erro ao excluir notícia:", delErr);
      return NextResponse.json(
        { message: "Erro ao excluir a notícia." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Notícia excluída com sucesso.", id });
  } catch (e) {
    console.error("Erro geral excluir:", e);
    return NextResponse.json(
      { message: "Erro interno ao excluir notícia." },
      { status: 500 }
    );
  }
}
