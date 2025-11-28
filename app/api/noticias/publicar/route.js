import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "ID da notícia não informado." },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("noticias")
      .update({ status: "publicado" })
      .eq("id", id);

    if (error) {
      console.error("Erro ao publicar notícia:", error);
      return NextResponse.json(
        { message: error.message || "Erro ao publicar notícia." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Notícia publicada com sucesso." });
  } catch (e) {
    console.error("Erro inesperado ao publicar notícia:", e);
    return NextResponse.json(
      { message: "Erro inesperado ao publicar notícia." },
      { status: 500 }
    );
  }
}
