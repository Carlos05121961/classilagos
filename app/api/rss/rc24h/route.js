import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";

export const dynamic = "force-dynamic";

// URL principal do feed do RC24h (WordPress)
const FEED_URL = "https://rc24h.com.br/feed/";

// cidades da Região dos Lagos pra tentar identificar no título/descrição
const CIDADES = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro da Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
  "Macaé",
];

// função simples pra limpar CDATA e HTML básico
function limparTexto(str = "") {
  if (!str) return "";
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "") // remove tags HTML
    .replace(/\s+/g, " ")
    .trim();
}

// parser simples de RSS só usando split/regex (sem libs extras)
function parseRssItems(xml, maxItens = 30) {
  const itens = [];
  const blocos = xml.split("<item>").slice(1);

  for (const bloco of blocos) {
    const [itemXml] = bloco.split("</item>");

    const getTag = (tag) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
      const match = itemXml.match(regex);
      return match ? limparTexto(match[1]) : "";
    };

    const title = getTag("title");
    const link = getTag("link");
    const description = getTag("description");
    const pubDate = getTag("pubDate");

    if (!title || !link) continue;

    itens.push({ title, link, description, pubDate });

    if (itens.length >= maxItens) break;
  }

  return itens;
}

// tenta descobrir a cidade pelo texto
function detectarCidade(texto = "") {
  const t = texto.toLowerCase();
  for (const cidade of CIDADES) {
    if (t.includes(cidade.toLowerCase())) {
      return cidade;
    }
  }
  return "Região dos Lagos";
}

// POST /api/rss/rc24h
export async function POST() {
  try {
    // 1) Buscar o RSS do RC24h
    const resp = await fetch(FEED_URL, { cache: "no-store" });

    if (!resp.ok) {
      return NextResponse.json(
        {
          ok: false,
          source: "rc24h",
          error: `Falha ao buscar RSS do RC24h: ${resp.status}`,
        },
        { status: 500 }
      );
    }

    const xml = await resp.text();

    // 2) Parse simples do XML
    const itens = parseRssItems(xml, 40); // pega até 40 notícias recentes

    if (!itens.length) {
      return NextResponse.json({
        ok: true,
        source: "rc24h",
        found: 0,
        inserted: 0,
        skipped: 0,
        message: "Nenhum item encontrado no feed do RC24h.",
      });
    }

    const urls = itens.map((i) => i.link);

    // 3) Buscar no Supabase quais URLs já existem pra não duplicar
    const { data: existentes, error: erroExistentes } = await supabase
      .from("noticias")
      .select("id, url_origem")
      .in("url_origem", urls);

    if (erroExistentes) {
      console.error("Erro ao buscar notícias existentes (RC24h):", erroExistentes);
    }

    const urlsExistentes = new Set(
      (existentes || []).map((n) => n.url_origem)
    );

    let inseridas = 0;
    let puladas = 0;
    const registrosParaInserir = [];

    // 4) Montar os registros novos (schema SIMPLES)
    for (const item of itens) {
      if (urlsExistentes.has(item.link)) {
        puladas++;
        continue;
      }

      const textoCompleto = item.description || item.title;
      const textoCurto = (textoCompleto || "").slice(0, 220);

      const cidadeDetectada = detectarCidade(
        `${item.title} ${item.description}`
      );

      registrosParaInserir.push({
        titulo: item.title,
        resumo: textoCurto,
        texto: textoCompleto,
        fonte: "RC24h",
        url_origem: item.link,
        cidade: cidadeDetectada,
        categoria: "Geral",
        tipo: "importada",
        status: "rascunho",
      });
    }

    // 5) Inserir no Supabase
    if (registrosParaInserir.length > 0) {
      const { error: insertError } = await supabase
        .from("noticias")
        .insert(registrosParaInserir);

      if (insertError) {
        console.error("Erro ao inserir notícias do RC24h:", insertError);
        return NextResponse.json(
          {
            ok: false,
            source: "rc24h",
            error:
              insertError.message || "Erro ao inserir notícias do RC24h.",
          },
          { status: 500 }
        );
      }

      inseridas = registrosParaInserir.length;
    }

    return NextResponse.json({
      ok: true,
      source: "rc24h",
      found: itens.length,
      inserted: inseridas,
      skipped: puladas,
    });
  } catch (e) {
    console.error("Erro geral ao importar RC24h:", e);
    return NextResponse.json(
      {
        ok: false,
        source: "rc24h",
        error: e.message || "Erro inesperado ao importar RC24h.",
      },
      { status: 500 }
    );
  }
}
