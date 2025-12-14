// /lib/busca/parser.js
import { normalizarTexto } from "./normalizarTexto";

// Cidades oficiais
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

// mapeia “apelidos” para o texto oficial do banco (tipo_imovel)
const MAP_TIPO_IMOVEL = [
  { keys: ["casa", "sobrado"], value: "Casa" },
  { keys: ["apartamento", "apto", "ap", "apart"], value: "Apartamento" },
  { keys: ["cobertura"], value: "Cobertura" },
  { keys: ["kitnet", "studio", "estudio", "estúdio"], value: "Kitnet / Studio" },
  { keys: ["terreno", "lote"], value: "Terreno / Lote" },
  { keys: ["comercial"], value: "Comercial" },
  { keys: ["loja", "sala", "sala comercial"], value: "Loja / Sala" },
  { keys: ["galpao", "galpão"], value: "Galpão" },
  { keys: ["sitio", "sítio", "chacara", "chácara"], value: "Sítio / Chácara" },
];

// Categoria oficial do banco (bem simples por enquanto)
function detectarCategoria(t) {
  if (
    t.includes("imovel") || t.includes("imoveis") || t.includes("imóveis") ||
    t.includes("casa") || t.includes("apartamento") || t.includes("apto") || t.includes("kitnet") ||
    t.includes("terreno") || t.includes("lote") || t.includes("cobertura") || t.includes("galpao") ||
    t.includes("loja") || t.includes("sala comercial") || t.includes("sitio") || t.includes("chacara")
  ) return "imoveis";

  if (t.includes("veiculo") || t.includes("veiculos") || t.includes("carro") || t.includes("moto")) return "veiculos";
  if (t.includes("nautica") || t.includes("náutica") || t.includes("lancha") || t.includes("barco") || t.includes("veleiro")) return "nautica";
  if (t.includes("pet") || t.includes("pets") || t.includes("cachorro") || t.includes("gato")) return "pets";
  if (t.includes("emprego") || t.includes("vaga") || t.includes("trabalho")) return "empregos";
  if (t.includes("turismo") || t.includes("pousada") || t.includes("hotel") || t.includes("restaurante") || t.includes("passeio")) return "turismo";

  if (
    t.includes("servico") || t.includes("serviço") || t.includes("servicos") || t.includes("serviços") ||
    t.includes("profissional") || t.includes("profissionais") || t.includes("classimed") ||
    t.includes("evento") || t.includes("eventos")
  ) return "servico";

  if (t.includes("lagolistas") || t.includes("guia comercial") || t.includes("comercio") || t.includes("comércio")) return "lagolistas";

  return null;
}

function detectarCidade(t) {
  for (const c of CIDADES) {
    const cNorm = normalizarTexto(c);
    if (t.includes(cNorm)) return c;
  }
  return null;
}

/**
 * FINALIDADE (valores reais do seu banco):
 * venda | aluguel | temporada
 *
 * Premium:
 * - Detecta “temporada” antes de “aluguel”
 * - Trata “aluguel temporada / aluguel por temporada” como TEMPORADA
 */
function detectarFinalidade(t) {
  // 1) temporada primeiro (frases fortes)
  if (
    t.includes("aluguel por temporada") ||
    t.includes("aluguel temporada") ||
    t.includes("por temporada") ||
    t.includes("temporada") ||
    t.includes("diaria") || t.includes("diária") ||
    t.includes("fim de semana") ||
    t.includes("feriado") ||
    t.includes("airbnb") ||
    t.includes("booking")
  ) return "temporada";

  // 2) aluguel normal
  if (
    t.includes("aluguel") || t.includes("alugar") || t.includes("alugo") ||
    t.includes("locacao") || t.includes("locação") || t.includes("locar") ||
    t.includes("mensal") || t.includes("anual")
  ) return "aluguel";

  // 3) venda
  if (t.includes("venda") || t.includes("comprar") || t.includes("vende") || t.includes("a venda") || t.includes("à venda"))
    return "venda";

  return null;
}

function detectarTipoImovel(t) {
  for (const rule of MAP_TIPO_IMOVEL) {
    if (rule.keys.some((k) => t.includes(normalizarTexto(k)))) return rule.value;
  }
  return null;
}

function detectarSubcategoriaServico(t) {
  if (t.includes("classimed")) return "classimed";
  if (t.includes("evento") || t.includes("eventos")) return "eventos";
  if (t.includes("profissional") || t.includes("profissionais")) return "profissionais";
  return null;
}

/**
 * Remove termos do texto para gerar termosLivres.
 * Premium: remove também frases (ex: “aluguel temporada”, “por temporada”)
 */
function removerTermos(textoNormalizado, termos) {
  let s = ` ${textoNormalizado} `;
  for (const termo of termos) {
    if (!termo) continue;
    const x = normalizarTexto(termo);
    if (!x) continue;

    // remove ocorrências simples (inclui frases)
    // (não depende de estar “isolado” por espaços exatos)
    s = s.replaceAll(x, " ");
  }

  // normaliza espaços
  return normalizarTexto(s);
}

export function parseBusca(texto = "") {
  const original = String(texto || "");
  const t = normalizarTexto(original);

  const categoria = detectarCategoria(t);
  const cidade = detectarCidade(t);
  const finalidade = detectarFinalidade(t); // venda | aluguel | temporada
  const tipo_imovel = detectarTipoImovel(t);
  const subcategoria_servico = detectarSubcategoriaServico(t);

  // termos “de intenção” que NUNCA devem ir para o full-text
  // (é aqui que “aluguel” deixa de matar a busca)
  const TERMOS_INTENCAO = [
    "aluguel por temporada",
    "aluguel temporada",
    "por temporada",
    "temporada",
    "aluguel",
    "alugar",
    "alugo",
    "locacao",
    "locação",
    "mensal",
    "anual",
    "venda",
    "a venda",
    "à venda",
    "comprar",
    "vende",
    "diaria",
    "diária",
    "fim de semana",
    "feriado",
    "airbnb",
    "booking",
  ];

  const termosRemover = [
    cidade,
    categoria,
    finalidade,
    tipo_imovel,
    subcategoria_servico,
    ...TERMOS_INTENCAO,
    // comuns
    "imoveis", "imóveis",
    "servico", "serviço", "servicos", "serviços",
  ];

  const sobra = removerTermos(t, termosRemover);

  const termosLivres = sobra
    ? sobra.split(" ").map((x) => x.trim()).filter(Boolean)
    : [];

  return {
    textoOriginal: original,
    textoNormalizado: t,
    categoria,
    cidade,
    finalidade, // venda | aluguel | temporada
    tipo_imovel,
    subcategoria_servico,
    termosLivres,
  };
}


