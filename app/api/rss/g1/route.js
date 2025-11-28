import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "../../../supabaseServerClient";

export const dynamic = "force-dynamic";

const FEED_URL =
  "https://g1.globo.com/rss/g1/rio-de-janeiro/regiao-dos-lagos/";

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

// Remove CDATA, HTML e algumas entidades básicas
function limparTexto(str = "") {
  return str
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "") // remove tags HTML
    .replace(/&#8230;/g, "...") // reticências
    .replace(/&#8220;|&#8221;/g, '"') // aspas duplas
    .replace(/&#8216;|&#8217;/g, "'") // aspas simples
    .replace(/&#8211;/g, "-") // travessão/traço
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extrairTag(bloco, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = bloco.match(regex);
  return match ? limparTexto(match[1]) : null;
}

function detectarCidade(texto) {
  const lower = (texto || "").toLowerCase();
  for (const cidade of CIDADES) {
    if (lower.includes(cidade.toLowerCase())) {
      return cidade;
    }
  }
  return "Região dos Lagos";
}

function parseRss(xml) {
  const partes = xml.split("<item>").slice(1); // ignora cabeçalho
  const itens = partes.map((parte) => {
    const bloco = parte.split("</item>")[0];

    const titulo = extrairTag(bloco, "title");
    const link = extrairTag(bloco, "link");
    const descricao = extrairTag(bloco, "description");
    const pubDate = extrairTag(bloco, "pubDate");

    if (!titulo || !link) return null;

    const cidade = detectarCidade(`${titulo} ${descricao || ""}`);

    return {
      titulo,
      link_original: link,
      resumo: descricao || "",
      texto: descricao || "",
      cidade,
      categoria: "Geral",
      pubDate,
    };
  });

  return itens.filter(Boolean);
}

// AGORA A ROTA É POST (igual RC24h)
export async function POST() {
  try {
    const res = await fetch(FEED_URL, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Falha ao buscar RSS do G1." },
        { status: 500 }
      );
    }

    const xml = await res.text();
    const itens = parseRss(xml).slice(0, 15); // limita para não exagerar

    const inseridos = [];
    const pulados = [];

    for (const item of itens) {
      // verifica se já existe notícia com esse link_original
      const { data: existente, error: erroBusca } = await supabase
        .from("noticias")
        .select("id")
        .eq("link_original", item.link_original)
        .maybeSingle();

      if (erroBusca) {
        console.error("Erro ao verificar notícia existente:", erroBusca);
        continue;
      }

      if (existente) {
        pulados.push(item.titulo);
        continue;
      }

      const { error: insertError } = await supabase.from("noticias").insert({
        titulo: item.titulo,
        cidade: item.cidade,
        categoria: item.categoria,
        resumo: item.resumo || item.titulo,
        texto: item.texto || item.titulo,
        imagem_capa: null,
        fonte: "G1 Região dos Lagos",
        link_original: item.link_original,
        tipo: "importada",
        status: "rascunho",
      });

      if (insertError) {
        console.error("Erro ao inserir notícia importada (G1):", insertError);
        continue;
      }

      inseridos.push(item.titulo);
    }

    return NextResponse.json({
      ok: true,
      mensagem: "Importação do G1 concluída.",
      total_encontrados: itens.length,
      inseridos: inseridos.length,
      pulados: pulados.length,
      titulos_inseridos: inseridos,
      titulos_pulados: pulados,
    });
  } catch (err) {
    console.error("Erro geral na importação do G1:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao importar RSS do G1." },
      { status: 500 }
    );
  }
}

