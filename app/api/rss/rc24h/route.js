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
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cortarResumo(texto = "", max = 240) {
  const t = limparTexto(texto);
  if (!t) return "";
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "").trim() + "...";
}

function extrairImagem(itemXml = "") {
  // 1) <media:content url="...">
  const m1 = itemXml.match(/<media:content[^>]+url="([^"]+)"/i);
  if (m1?.[1]) return m1[1];

  // 2) <enclosure url="...">
  const m2 = itemXml.match(/<enclosure[^>]+url="([^"]+)"/i);
  if (m2?.[1]) return m2[1];

  // 3) <img src="..."> dentro do description/content
  const m3 = itemXml.match(/<img[^>]+src="([^"]+)"/i);
  if (m3?.[1]) return m3[1];

  return null;
}

function parseRssItems(xml, maxItens = 40) {
  const itens = [];
  const blocos = xml.split("<item>").slice(1);

  for (const bloco of blocos) {
    const [itemXml] = bloco.split("</item>");

    const getTagRaw = (tag) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
      const match = itemXml.match(regex);
      return match ? match[1] : "";
    };

    const title = limparTexto(getTagRaw("title"));
    const link = limparTexto(getTagRaw("link"));
    const descriptionRaw = getTagRaw("description");
    const description = limparTexto(descriptionRaw);
    const pubDate = limparTexto(getTagRaw("pubDate"));

    if (!title || !link) continue;

    const imagem = extrairImagem(itemXml) || null;

    itens.push({ title, link, description, pubDate, imagem });
    if (itens.length >= maxItens) break;
  }

  return itens;
}

function detectarCidade(texto = "") {
  const t = (texto || "").toLowerCase();
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
      const cidade = detectarCidade(`${item.title} ${item.description}`);

      registrosParaInserir.push({
        titulo: item.title,
        resumo: cortarResumo(textoCompleto, 240) || item.title,
        texto: limparTexto(textoCompleto) || item.title,
        fonte: "RC24h",
        link_original: item.link,
        cidade: cidade || "Região dos Lagos",
        categoria: "Geral",
        imagem_capa: item.imagem || null,
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
