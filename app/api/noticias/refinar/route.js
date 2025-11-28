import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";



export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da notícia não informado." },
        { status: 400 }
      );
    }

    const { data: noticia, error: erroBusca } = await supabase
      .from("noticias")
      .select("id, titulo, resumo, texto, cidade, categoria, fonte")
      .eq("id", id)
      .single();

    if (erroBusca || !noticia) {
      console.error("Erro ao buscar notícia:", erroBusca);
      return NextResponse.json(
        { error: "Notícia não encontrada." },
        { status: 404 }
      );
    }

    const tituloOriginal = noticia.titulo || "";
    const resumoOriginal = noticia.resumo || "";
    const textoOriginal = noticia.texto || "";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY não configurada");
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada no ambiente." },
        { status: 500 }
      );
    }

    const promptUsuario = `
Você é um redator de portal de notícias da Região dos Lagos (Classilagos Notícias).

Reescreva a matéria abaixo em PORTUGUÊS DO BRASIL, criando:
- um NOVO TÍTULO jornalístico, direto e envolvente
- um NOVO RESUMO curto (1 ou 2 frases)
- um NOVO TEXTO COMPLETO mais bem escrito, organizado em parágrafos

Regras:
- NÃO copie frases literalmente
- Mantenha os fatos verdadeiros
- Pode mudar a ordem das informações
- Use linguagem clara, sem exageros
- Não invente dados que não estão no texto

DADOS DA MATÉRIA:

Cidade: ${noticia.cidade || "Região dos Lagos"}
Categoria: ${noticia.categoria || "Geral"}
Fonte: ${noticia.fonte || "Desconhecida"}

Título original:
${tituloOriginal}

Resumo original:
${resumoOriginal}

Texto original:
${textoOriginal}

Responda APENAS em JSON no formato:

{
  "titulo": "...",
  "resumo": "...",
  "texto": "..."
}
`;

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um jornalista profissional de um portal regional chamado Classilagos Notícias.",
          },
          {
            role: "user",
            content: promptUsuario,
          },
        ],
        temperature: 0.5,
      }),
    });

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      console.error("Erro da API OpenAI:", erroTexto);
      return NextResponse.json(
        { error: "Falha ao se comunicar com a IA." },
        { status: 500 }
      );
    }

    const data = await resposta.json();
    const conteudo = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(conteudo);
    } catch (err) {
      console.error("Falha ao interpretar JSON da IA:", err, conteudo);
      return NextResponse.json(
        { error: "Resposta da IA em formato inesperado." },
        { status: 500 }
      );
    }

    const novoTitulo = parsed.titulo || tituloOriginal;
    const novoResumo = parsed.resumo || resumoOriginal;
    const novoTexto = parsed.texto || textoOriginal;

    const { error: erroUpdate } = await supabase
      .from("noticias")
      .update({
        titulo: novoTitulo,
        resumo: novoResumo,
        texto: novoTexto,
      })
      .eq("id", id);

    if (erroUpdate) {
      console.error("Erro ao atualizar notícia refinada:", erroUpdate);
      return NextResponse.json(
        { error: "Erro ao salvar notícia refinada." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Notícia refinada com IA e atualizada com sucesso.",
      titulo: novoTitulo,
      resumo: novoResumo,
    });
  } catch (err) {
    console.error("Erro geral ao refinar notícia:", err);
    return NextResponse.json(
      { error: "Erro interno ao refinar notícia." },
      { status: 500 }
    );
  }
}
