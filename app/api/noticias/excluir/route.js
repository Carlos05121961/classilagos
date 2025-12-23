import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../supabaseServerClient";

export const dynamic = "force-dynamic";

export async function DELETE(request) {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "SUPABASE_SERVICE_ROLE_KEY não configurada no ambiente. Verifique as Environment Variables na Vercel e faça Redeploy.",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "ID da notícia não informado." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("noticias").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao excluir notícia." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Notícia excluída com sucesso." });
}
