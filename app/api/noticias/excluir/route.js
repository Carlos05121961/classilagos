import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";


export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da notícia não informado." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir notícia:", error);
      return NextResponse.json(
        { error: "Erro ao excluir notícia." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Notícia excluída com sucesso.",
    });
  } catch (err) {
    console.error("Erro interno ao excluir notícia:", err);
    return NextResponse.json(
      { error: "Erro interno ao excluir notícia." },
      { status: 500 }
    );
  }
}
