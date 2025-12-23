import { supabaseServer as supabase } from "../../../supabaseServerClient";
+ import { supabaseAdmin as supabase } from "../../../supabaseAdminClient";


export const dynamic = "force-dynamic";

export async function DELETE(request) {
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
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir notícia:", error);
      return NextResponse.json(
        { message: error.message || "Erro ao excluir notícia." },
        { status: 500 }
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
