// lib/busca/parser.js
import { normalizarTexto } from "./normalizarTexto";
import { DICIONARIO_BUSCA } from "./dicionario";

/**
 * parseBusca(texto)
 * - Recebe o texto digitado pelo usuário
 * - Normaliza
 * - Detecta categoria e filtros (finalidade, tipo, cidade, bairro etc.)
 * - Retorna um objeto "parsed" que será usado pelo queryBuilder do pilar
 */
export function parseBusca(textoOriginal = "") {
  const texto = normalizarTexto(textoOriginal);

  // Base do retorno
  const parsed = {
    raw: textoOriginal,
    texto, // normalizado
    categoria: null,

    // filtros comuns
    cidade: null,
    bairro: null,
    termosLivres: [],

    // imóveis
    finalidade: null,
    tipo_imovel: null,

    // serviços
    subcategoria_servico: null,
    area_profissional: null,

    // turismo
    pilar_turismo: null,
    subcategoria_turismo: null,
  };

  if (!texto || texto.length < 2) return parsed;

  // 1) Detectar categoria (prioridade: a primeira que casar forte)
  parsed.categoria = detectarCategoria(texto);

  // 2) Extrair cidade (se houver)
  parsed.cidade = detectarCidade(texto);

  // 3) Extrair finalidade e tipo (se categoria for imoveis)
  if (parsed.categoria === "imoveis") {
    parsed.finalidade = detectarFinalidadeImoveis(texto);
    parsed.tipo_imovel = detectarTipoImovel(texto);
  }

  // 4) Serviços (categoria "servico")
  if (parsed.categoria === "servico") {
    parsed.subcategoria_servico = detectarSubcategoriaServico(texto); // profissionais/eventos/classimed...
    parsed.area_profissional = detectarAreaProfissional(texto); // ex: eletricista, buffet, psicologia...
  }

  // 5) Turismo
  if (parsed.categoria === "turismo") {
    parsed.pilar_turismo = detectarPilarTurismo(texto);
    parsed.subcategoria_turismo = detectarSubcategoriaTurismo(texto, parsed.pilar_turismo);
  }

  // 6) Termos livres (limpa palavras que são "chaves" já capturadas)
  parsed.termosLivres = extrairTermosLivres(texto, parsed);

  return parsed;
}

/* =======================
   FUNÇÕES AUXILIARES
======================= */

function detectarCategoria(texto) {
  // Ordem importa: primeiro as categorias mais “fortes”
  const categorias = DICIONARIO_BUSCA?.categorias || [];

  for (const cat of categorias) {
    if (matchAlgumaPalavra(texto, cat.palavras)) return cat.value;
  }

  // fallback: se não achou, deixa null
  return null;
}

function detectarCidade(texto) {
  const cidades = DICIONARIO_BUSCA?.cidades || [];
  for (const c of cidades) {
    if (matchAlgumaPalavra(texto, c.palavras)) return c.value; // value já normalizado
  }
  return null;
}

/* ====== IMÓVEIS ====== */

function detectarFinalidadeImoveis(texto) {
  const fins = DICIONARIO_BUSCA?.imoveis?.finalidades || [];
  for (const f of fins) {
    if (matchAlgumaPalavra(texto, f.palavras)) return f.value;
  }
  return null;
}

function detectarTipoImovel(texto) {
  const tipos = DICIONARIO_BUSCA?.imoveis?.tipos || [];
  for (const t of tipos) {
    if (matchAlgumaPalavra(texto, t.palavras)) return t.value;
  }
  return null;
}

/* ====== SERVIÇOS ====== */

function detectarSubcategoriaServico(texto) {
  const subs = DICIONARIO_BUSCA?.servicos?.subcategorias || [];
  for (const s of subs) {
    if (matchAlgumaPalavra(texto, s.palavras)) return s.value; // profissionais/eventos/classimed...
  }
  return null;
}

function detectarAreaProfissional(texto) {
  // reaproveita lista gigante de áreas/serviços
  const areas = DICIONARIO_BUSCA?.servicos?.areas || [];
  for (const a of areas) {
    if (matchAlgumaPalavra(texto, a.palavras)) return a.value;
  }
  return null;
}

/* ====== TURISMO ====== */

function detectarPilarTurismo(texto) {
  const pilares = DICIONARIO_BUSCA?.turismo?.pilares || [];
  for (const p of pilares) {
    if (matchAlgumaPalavra(texto, p.palavras)) return p.value; // onde_ficar, onde_comer...
  }
  return null;
}

function detectarSubcategoriaTurismo(texto, pilar) {
  if (!pilar) return null;
  const mapa = DICIONARIO_BUSCA?.turismo?.subcategoriasPorPilar || {};
  const lista = mapa[pilar] || [];
  for (const s of lista) {
    if (matchAlgumaPalavra(texto, s.palavras)) return s.value;
  }
  return null;
}

/* ====== TERMOS LIVRES ====== */

function extrairTermosLivres(texto, parsed) {
  // palavras a remover (as que já viraram filtro)
  const stop = new Set();

  // Categoria e chaves de imóveis/serviços/turismo
  addPalavrasStop(stop, parsed.categoria);
  addPalavrasStop(stop, parsed.cidade);
  addPalavrasStop(stop, parsed.finalidade);
  addPalavrasStop(stop, parsed.tipo_imovel);
  addPalavrasStop(stop, parsed.subcategoria_servico);
  addPalavrasStop(stop, parsed.area_profissional);
  addPalavrasStop(stop, parsed.pilar_turismo);
  addPalavrasStop(stop, parsed.subcategoria_turismo);

  // quebra em tokens
  const tokens = texto
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // remove tokens muito pequenos, e remove stop-words básicas
  const basicas = new Set(["de", "da", "do", "em", "no", "na", "para", "com", "e", "a", "o"]);

  const livres = [];
  for (const t of tokens) {
    if (t.length < 2) continue;
    if (basicas.has(t)) continue;
    if (stop.has(t)) continue;
    livres.push(t);
  }

  // remove duplicados
  return Array.from(new Set(livres));
}

function addPalavrasStop(stopSet, value) {
  if (!value) return;
  // value pode vir como "aluguel_temporada" → vira tokens também
  const tokens = String(value).split(/[_\s]+/).filter(Boolean);
  tokens.forEach((t) => stopSet.add(t));
}

function matchAlgumaPalavra(texto, palavras = []) {
  if (!palavras || palavras.length === 0) return false;
  return palavras.some((p) => texto.includes(p));
}

