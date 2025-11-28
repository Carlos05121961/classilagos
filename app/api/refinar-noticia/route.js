import { NextResponse } from "next/server";

export async function POST(req) {
  const { texto } = await req.json();

  // Refinamento simples local (sem OpenAI):
  // - remove espaços duplicados
  // - faz trim nas bordas
  const refinado = (texto || "").replace(/\s+/g, " ").trim();

  return NextResponse.json({ refinado });
}
