import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { texto } = await req.json();

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
Reescreva o texto abaixo como uma matéria jornalística clara, objetiva e organizada:

${texto}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const refinado = completion.choices?.[0]?.message?.content || texto;

  return NextResponse.json({ refinado });
}
