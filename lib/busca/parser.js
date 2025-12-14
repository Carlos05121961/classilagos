// lib/busca/parser.js
import {
  CIDADES_OFICIAIS,
  CIDADES_ALIASES,
  FINALIDADES,
  FINALIDADE_KEYWORDS,
  CATEGORIAS,
  CATEGORIA_KEYWORDS,
  TIPO_IMOVEL_ALIASES,
  SUBCATEGORIAS_SERVICO,
  SERVICO_SUBCATEGORIA_KEYWORDS,
  STOPWORDS,
} from "./dicionario";

// 1) Helpers
export function normalizeText(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // remove pontuação
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, arr) {
  return arr.some((w) => text.includes(normalizeText(w)));
}

function tokenize(text) {
  const n = normalizeText(text);
  if (!n) return [];
  return n.split(" ").filter((t) => t && !STOPWORDS.has(t));
}

// 2) Detectores

export function detectCidade(query) {
  const n = normalizeText(query);

  // tenta aliases (frases)
  const aliasKeys = Object.keys(CIDADES_ALIASES);
  for (const key of aliasKeys) {
    if (n.includes(normalizeText(key))) return CIDADES_ALIASES[key];
  }

  // tenta cidade oficial por token ou frase
  for (const c of CIDADES_OFICIAIS) {
    const cc = normalizeText(c);
    if (n.includes(cc)) return c;
  }

  return null;
}

export function detectFinalidade(query) {
  const n = normalizeText(query);

  // regra: temporada vence se aparecer
  if (includesAny(n, FINALIDADE_KEYWORDS[FINALIDADES.ALUGUEL_TEMPORADA])) {
    return FINALIDADES.ALUGUEL_TEMPORADA;
  }

  if (includesAny(n, FINALIDADE_KEYWORDS[FINALIDADES.ALUGUEL])) {
    return FINALIDADES.ALUGUEL;
  }

  if (includesAny(n, FINALIDADE_KEYWORDS[FINALIDADES.VENDA])) {
    return FINALIDADES.VENDA;
  }

  return null;
}

export function detectCategoria(query) {
  const n = normalizeText(query);

  // pontuação por ocorrências simples
  const scores = {};
  for (const cat of Object.values(CATEGORIAS)) scores[cat] = 0;

  for (const [cat, words] of Object.entries(CATEGORIA_KEYWORDS)) {
    for (const w of words) {
      if (n.includes(normalizeText(w))) scores[cat] += 1;
    }
  }

  // escolhe maior score (>=1), senão null
  let best = null;
  let bestScore = 0;
  for (const [cat, sc] of Object.entries(scores)) {
    if (sc > bestScore) {
      bestScore = sc;
      best = cat;
    }
  }

  return bestScore >= 1 ? best : null;
}

export function detectTipoImovel(query) {
  const n = normalizeText(query);

  // tenta bater frases primeiro (ex: "sala comercial")
  const keys = Object.keys(TIPO_IMOVEL_ALIASES).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (n.includes(normalizeText(k))) return TIPO_IMOVEL_ALIASES[k];
  }

  return null;
}

export function detectSubcategoriaServico(query) {
  const n = normalizeText(query);

  if (includesAny(n, SERVICO_SUBCATEGORIA_KEYWORDS[SUBCATEGORIAS_SERVICO.EVENTOS])) {
    return SUBCATEGORIAS_SERVICO.EVENTOS;
  }

  if (includesAny(n, SERVICO_SUBCATEGORIA_KEYWORDS[SUBCATEGORIAS_SERVICO.CLASSIMED])) {
    return SUBCATEGORIAS_SERVICO.CLASSIMED;
  }

  // default “profissionais” só se a categoria for servico lá fora
  return SUBCATEGORIAS_SERVICO.PROFISSIONAIS;
}

// 3) Parser principal
// Retorna um objeto “intenção” que você vai usar para montar a query no Supabase
export function parseBusca(query = "") {
  const raw = String(query || "");
  const normalized = normalizeText(raw);
  const tokens = tokenize(raw);

  const cidade = detectCidade(raw);
  const finalidade = detectFinalidade(raw);

  // categoria pode vir do texto, mas se a finalidade existe é um indício forte de IMÓVEIS
  let categoria = detectCategoria(raw);
  if (!categoria && finalidade) categoria = CATEGORIAS.IMOVEIS;

  const tipo_imovel = categoria === CATEGORIAS.IMOVEIS ? detectTipoImovel(raw) : null;

  // subcategoria_servico só faz sentido se categoria for servico
  const subcategoria_servico =
    categoria === CATEGORIAS.SERVICO ? detectSubcategoriaServico(raw) : null;

  // palavras restantes (para buscar em titulo/descricao)
  // remove tokens que sejam cidades/finalidade/tipos conhecidos (heurístico simples)
  const blacklist = new Set();

  if (cidade) {
    tokenize(cidade).forEach((t) => blacklist.add(t));
  }
  if (finalidade) {
    // adiciona keywords da finalidade detectada
    FINALIDADE_KEYWORDS[finalidade]?.forEach((w) => tokenize(w).forEach((t) => blacklist.add(t)));
  }
  if (tipo_imovel) {
    tokenize(tipo_imovel).forEach((t) => blacklist.add(t));
  }

  const termosLivres = tokens.filter((t) => !blacklist.has(t));

  return {
    raw,
    normalized,
    tokens,
    termosLivres,

    // filtros principais
    cidade,
    categoria,
    finalidade, // só usar quando categoria==imoveis (ou quando quiser forçar)
    tipo_imovel,

    // serviços
    subcategoria_servico,

    // pronto pro próximo passo (montar query)
    debug: {
      blacklist: Array.from(blacklist),
      scoreHint: "categoria por palavras-chave + finalidade força imoveis",
    },
  };
}

