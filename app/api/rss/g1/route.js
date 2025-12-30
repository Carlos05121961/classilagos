import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEED_URL = "https://g1.globo.com/rss/g1/rio-de-janeiro/regiao-dos-lagos/";

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
];

function getAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

function limparTexto(str = "") {
  return (str || "")
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&#8230;/g, "...")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extrairTag(bloco, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = bloco.match(regex);
  return match ? match[1] : null; // aqui ainda vem com HTML/CDATA
}

function extrairAtributoTag(bloco, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]+)"[^>]*\\/?>`, "i");
  const match = bloco.match(regex);
  return match ? match[1] : null;
}

function extrairImagem(bloco, descricaoRaw = "") {
  // 1) <media:content url="...">
  const media = extrairAtributoTag(bloco, "media:content", "url");
  if (media) return media;

  // 2) <enclosure url="...">
  const enclosure = extrairAtributoTag(bloco, "enclosure", "url");
  if (enclosure) return enclosure;

  // 3) <img src="..."> dentro do description/content
  const imgMatch = (descricaoRaw || "").match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return null;
}

function detectarCidade(texto) {
  const lower = (texto || "").toLowerCase();
  for (const cidade of CIDADES) {
    if (lower.includes(cidade.toLowerCase())) return cidade;
  }
  return "Região dos Lagos";
}

function cortarResumo(texto, max = 240) {
  const t = limparTexto(texto || "");
  if (!t) return "";
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "").trim() + "...";
}

function parseRss(xml) {
  const partes = xml.split("<item>").slice(1);

  return partes
    .map((parte) => {
      const bloco = parte.split("</item>")[0];

      const tituloRaw = extrairTag(bloco, "title");
      const linkRaw = extrairTag(bloco, "link");

      const descRaw =
        extrairTag(bloco, "description") ||
        extrairTag(bloco, "content:encoded") ||
        "";

      const titulo = limparTexto(tituloRaw || "");
      const link = limparTexto(linkRaw || "");

      if (!titulo || !link) return null;

      const cidade = detectarCidade(`${titulo} ${limparTexto(descRaw)}`);

      const imagem = extrairImagem(bloco, descRaw);
      const resumo = cortarResumo(descRaw, 240);
      const texto = limparTexto(descRaw) || resumo || titulo;

      return {
        titulo,
        link_original: link,
        resumo: resumo || titulo,
        texto: texto || titulo,
        cidade,
        categoria: "Geral",
        imagem_capa: imagem,
      };
    })
    .filter(Boolean);
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

    const res = await fetch(FEED_URL, {
      cache: "no-store",
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; ClassilagosBot/1.0; +https://classilagos.shop)",
        accept:
          "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8,*/*;q=0.1",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    // validação robusta
    const pareceRss = text.includes("<item>") || text.includes("<rss");
    if (!res.ok || (!pareceRss && !contentType.includes("xml"))) {
      return NextResponse.json(
        {
          ok: false,
          error: "O G1 não retornou RSS/XML válido.",
          http_status: res.status,
          content_type: contentType,
          preview: text.slice(0, 250),
        },
        { status: 500 }
      );
    }

    const itens = parseRss(text).slice(0, 20);

    let inseridas = 0;
    let puladas = 0;

    for (const item of itens) {
      const { data: existente } = await supabase
        .from("noticias")
        .select("id")
        .eq("link_original", item.link_original)
        .maybeSingle();

      if (existente) {
        puladas++;
        continue;
      }

      const { error } = await supabase.from("noticias").insert({
        titulo: item.titulo,
        cidade: item.cidade,
        categoria: item.categoria,
        resumo: item.resumo || item.titulo,
        texto: item.texto || item.titulo,
        imagem_capa: item.imagem_capa || null,
        fonte: "G1 Região dos Lagos",
        link_original: item.link_original,
        tipo: "importada",
        status: "rascunho",
      });

      if (!error) inseridas++;
    }

    return NextResponse.json({
      ok: true,
      source: "g1",
      found: itens.length,
      inserted: inseridas,
      skipped: puladas,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, source: "g1", error: e?.message || "Erro inesperado no G1." },
      { status: 500 }
    );
  }
}

