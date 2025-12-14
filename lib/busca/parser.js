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

// Tipos de imóvel (valores que existem no seu CHECK do Supabase)
const TIPOS_IMOVEL = [
  "Casa",
  "Apartamento",
  "Cobertura",
  "Kitnet / Studio",
  "Terreno / Lote",
  "Comercial",
  "Loja / Sala",
  "Galpão",
  "Sítio / Chácara",
  "Outros",
];

// mapeia “apelidos” para o texto oficial do banco
const MAP_TIPO_IMOVEL = [
  { keys: ["casa"], value: "Casa" },
  { keys: ["apartamento", "apto"], value: "Apartamento" },
  { keys: ["cobertura"], value: "Cobertura" },
  { keys: ["kitnet", "studio"], value: "Kitnet / Studio" },
  { keys: ["terreno", "lote"], value: "Terreno / Lote" },
  { keys: ["comercial"], value: "Comercial" },
  { keys: ["loja", "sala"], value: "Loja / Sala" },
  { keys: ["galpao", "galpão"], value: "Galpão" },
  { keys: ["sitio", "sítio", "chacara", "chácara"], value: "Sítio / Chácara" },
];

// Categoria oficial do banco
function detectarCategoria(t) {
  // imóveis
  if (t.includes("imovel") || t.includes("imóveis") || t.includes("imoveis")) return "imoveis";

  // veículos
  if (t.includes("veiculo") || t.includes("veículos") || t.includes("veiculos") || t.includes("carro") || t.includes("moto"))
    return "veiculos";

  // náutica
  if (t.includes("nautica") || t.includes("náutica") || t.includes("lancha") || t.includes("barco") || t.includes("veleiro"))
    return "nautica";

  // pets
  if (t.includes("pet") || t.includes("pets") || t.includes("cachorro") || t.includes("gato")) return "pets";

  // empregos
  if (t.includes("emprego") || t.includes("vaga") || t.includes("trabalho")) return "empregos";

  // turismo
  if (t.includes("turismo") || t.includes("pousada") || t.includes("hotel") || t.includes("restaurante") || t.includes("passeio"))
    return "turismo";

  // serviços (IMPORTANTE: no banco é "servico" singular)
  if (
    t.includes("servico") ||
    t.includes("serviço") ||
    t.includes("servicos") ||
    t.includes("serviços") ||
    t.includes("profissional") ||
    t.includes("profissionais") ||
    t.includes("classimed") ||
    t.includes("evento") ||
    t.includes("eventos")
  ) {
    return "servico";
  }

  // lagolistas
  if (t.includes("lagolistas") || t.includes("guia comercial") || t.includes("comercio") || t.includes("comércio"))
    return "lagolistas";

  return null;
}

function detectarCidade(textoNormalizado) {
  const t = textoNormalizado;

  for (const c of CIDADES) {
    const cNorm = normalizarTexto(c);
    // procura a cidade como palavra inteira (aprox.)
    if (t.includes(cNorm)) return c;
  }
  return null;
}

function detectarFinalidade(t) {
  // padrão do seu banco para imóveis: venda|aluguel|temporada
  if (t.includes("temporada") || t.includes("por temporada") || t.includes("aluguel temporada")) return "temporada";
  if (t.includes("aluguel") || t.includes("alugar")) return "aluguel";
  if (t.includes("venda") || t.includes("comprar") || t.includes("vende")) return "venda";
  return null;
}

function detectarTipoImovel(t) {
  for (const rule of MAP_TIPO_IMOVEL) {
    if (rule.keys.some((k) => t.includes(normalizarTexto(k)))) return rule.value;
  }
  return null;
}

function detectarSubcategoriaServico(t) {
  // você já grava subcategoria_servico como:
  // "profissionais" | "eventos" | "classimed"
  if (t.includes("classimed")) return "classimed";
  if (t.includes("evento") || t.includes("eventos")) return "eventos";
  if (t.includes("profissional") || t.includes("profissionais")) return "profissionais";
  return null;
}

// remove termos detectados do texto para gerar termosLivres
function removerTermos(textoNormalizado, termos) {
  let s = ` ${textoNormalizado} `;
  for (const termo of termos) {
    if (!termo) continue;
    const x = normalizarTexto(termo);
    // remove como “contém”, sem regex complicada (simples e seguro)
    s = s.replaceAll(` ${x} `, " ");
  }
  return normalizarTexto(s);
}

export function parseBusca(texto = "") {
  const original = String(texto || "");
  const t = normalizarTexto(original);

  const categoria = detectarCategoria(t);
  const cidade = detectarCidade(t);

  // finalidade é muito importante para IMÓVEIS
  const finalidade = detectarFinalidade(t);

  // tipo de imóvel
  const tipo_imovel = detectarTipoImovel(t);

  // subcategoria de serviços
  const subcategoria_servico = detectarSubcategoriaServico(t);

  // remover “palavras de filtro” para sobrar só termos livres
  const termosRemover = [
    cidade,
    categoria,
    finalidade,
    tipo_imovel,
    subcategoria_servico,
    // também remove sinônimos mais comuns
    "imoveis",
    "imóveis",
    "servico",
    "serviço",
    "servicos",
    "serviços",
  ];

  const sobra = removerTermos(t, termosRemover);

  const termosLivres = sobra
    ? sobra
        .split(" ")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

  return {
    textoOriginal: original,
    textoNormalizado: t,
    categoria,
    cidade,
    finalidade, // => "venda" | "aluguel" | "temporada"
    tipo_imovel,
    subcategoria_servico,
    termosLivres,
  };
}

