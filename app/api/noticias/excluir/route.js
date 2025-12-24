import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "../../../supabaseAdminClient";

export const dynamic = "force-dynamic";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const idNum = Number(id);
  if (!id || Number.isNaN(idNum)) {
    return NextResponse.json(
      { message: "ID da notícia inválido." },
      { status: 400 }
    );
  }

  try {
    // Deleta e devolve o que deletou (pra confirmar)
    const { data, error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", idNum)
      .select("id");

    if (error) {
      console.error("Erro ao excluir notícia:", error);
      return NextResponse.json(
        { message: error.message || "Erro ao excluir notícia." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "Nada foi excluído (ID não encontrado)." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notícia excluída com sucesso." });
  } catch (e) {
    console.error("Erro inesperado ao excluir notícia:", e);
    return NextResponse.json(
      { message: "Erro inesperado ao excluir notícia." },
      { status: 500 }
    );
  }
}
