import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEED_URL = "https://rc24h.com.br/feed/";

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

function limparTexto(str = "") {
  if (!str) return "";
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml, maxItens = 40) {
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

function detectarCidade(texto = "") {
  const t = texto.toLowerCase();
  for (const cidade of CIDADES) {
    if (t.includes(cidade.toLowerCase())) return cidade;
  }
  return "Região dos Lagos";
}

function getAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function POST() {
  try {
    const supabase = getAdmin();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "ENV faltando: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const resp = await fetch(FEED_URL, { cache: "no-store" });
    if (!resp.ok) {
      return NextResponse.json(
        { ok: false, source: "rc24h", error: `Falha ao buscar RSS do RC24h: ${resp.status}` },
        { status: 500 }
      );
    }

    const xml = await resp.text();
    const itens = parseRssItems(xml, 40);

    if (!itens.length) {
      return NextResponse.json({ ok: true, source: "rc24h", found: 0, inserted: 0, skipped: 0 });
    }

    const urls = itens.map((i) => i.link);

    const { data: existentes } = await supabase
      .from("noticias")
      .select("link_original")
      .in("link_original", urls);

    const urlsExistentes = new Set((existentes || []).map((n) => n.link_original));

    const registrosParaInserir = [];

    for (const item of itens) {
      if (urlsExistentes.has(item.link)) continue;

      const textoCompleto = item.description || item.title;
      const resumo = (textoCompleto || "").slice(0, 220);
      const cidade = detectarCidade(`${item.title} ${item.description}`);

      registrosParaInserir.push({
        titulo: item.title,
        resumo,
        texto: textoCompleto,
        fonte: "RC24h",
        link_original: item.link,
        cidade,
        categoria: "Geral",
        imagem_capa: null,
        tipo: "importada",
        status: "rascunho",
      });
    }

    if (registrosParaInserir.length) {
      const { error: insertError } = await supabase.from("noticias").insert(registrosParaInserir);
      if (insertError) {
        return NextResponse.json(
          { ok: false, source: "rc24h", error: insertError.message || "Erro ao inserir notícias." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      source: "rc24h",
      found: itens.length,
      inserted: registrosParaInserir.length,
      skipped: itens.length - registrosParaInserir.length,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, source: "rc24h", error: e?.message || "Erro inesperado ao importar RC24h." },
      { status: 500 }
    );
  }
}
