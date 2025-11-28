import { NextResponse } from "next/server";

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

  // Aqui, futuramente, você pode chamar uma IA para melhorar título/texto.
  // Por enquanto, apenas retornamos uma mensagem amigável.
  return NextResponse.json({
    message:
      "Refino com IA ainda não está implementado, mas a notícia continua salva como rascunho.",
  });
}
