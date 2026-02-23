import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID não informado." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { message: "ENV faltando: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error, count } = await supabaseAdmin
      .from("noticias")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: error.message || "Erro ao excluir." },
        { status: 500 }
      );
    }

    if (!count) {
      return NextResponse.json(
        { message: "Nada foi excluído (ID não encontrado)." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notícia excluída com sucesso." });
  } catch (e) {
    return NextResponse.json(
      { message: "Erro inesperado ao excluir." },
      { status: 500 }
    );
  }
}
