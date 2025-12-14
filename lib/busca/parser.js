// /lib/busca/parser.js

// -----------------------------
// 1) Helpers
// -----------------------------
export function normalizeText(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, arr) {
  return arr.some((w) => text.includes(w));
}

function removeFoundTokens(text, tokens) {
  let t = text;
  for (const tok of tokens) {
    // remove o token como palavra inteira quando possível
    const re = new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    t = t.replace(re, " ");
  }
  return normalizeText(t);
}

// -----------------------------
// 2) Dicionários do Classilagos
// -----------------------------
const CIDADES = [
  "marica",
  "saquarema",
  "araruama",
  "iguaba grande",
  "sao pedro da aldeia",
  "arraial do cabo",
  "cabo frio",
  "buzios",
  "rio das ostras",
];

// aliases comuns (caso o usuário digite sem espaços, abreviações etc.)
const CIDADE_ALIASES = {
  "sao pedro": "sao pedro da aldeia",
  "s pedro": "sao pedro da aldeia",
  "aldeia": "sao pedro da aldeia",
  "arraial": "arraial do cabo",
  "cabofrio": "cabo frio",
  "riodasostras": "rio das ostras",
  "iguaba": "iguaba grande",
  "buzio": "buzios",
  "buzios rj": "buzios",
};

// categorias (pilar)
const CATEGORIA_KEYWORDS = [
  { categoria: "imoveis", keys: ["imovel", "imoveis", "casa", "apartamento", "apto", "terreno", "kitnet", "loja", "sala", "galpao", "cobertura"] },
  { categoria: "veiculos", keys: ["carro", "moto", "veiculo", "veiculos", "caminhao", "onibus", "van", "pickup", "fiat", "chevrolet", "vw", "toyota", "honda", "hyundai"] },
  { categoria: "nautica", keys: ["lancha", "barco", "iate", "jetski", "jet ski", "veleiro", "passeio de barco", "escuna", "nautica"] },
  { categoria: "pets", keys: ["pet", "pets", "cachorro", "cao", "gato", "filhote", "adocao", "ração", "racao"] },
  { categoria: "empregos", keys: ["vaga", "vagas", "emprego", "trabalho", "contrata", "curriculo", "curriculos"] },
  { categoria: "turismo", keys: ["turismo", "pousada", "hotel", "hostel", "restaurante", "bar", "quiosque", "passeio", "mergulho", "trilha", "city tour"] },
  { categoria: "lagolistas", keys: ["guia", "guia comercial", "comercio", "loja", "servico perto", "empresa", "negocio", "lagolistas"] },
  { categoria: "servico", keys: ["servico", "servicos", "profissional", "profi", "eletricista", "encanador", "diarista", "pintor", "pedreiro", "chaveiro", "guincho", "dj", "buffet", "decoracao"] },
];

// finalidade (principalmente imóveis)
const FINALIDADE_RULES = [
  { finalidade: "aluguel_temporada", keys: ["temporada", "airbnb", "diaria", "diarias", "fim de semana", "final de semana", "feriado"] },
  { finalidade: "aluguel", keys: ["aluguel", "alugar", "locacao", "locar"] },
  { finalidade: "venda", keys: ["venda", "vendo", "comprar", "compra"] },
];

// subcategorias de imóveis (tipo_imovel)
const IMOVEIS_TIPO_RULES = [
  { tipo_imovel: "casa", keys: ["casa"] },
  { tipo_imovel: "apartamento", keys: ["apartamento", "apto"] },
  { tipo_imovel: "terreno", keys: ["terreno", "lote"] },
  { tipo_imovel: "kitnet", keys: ["kitnet", "quitinete", "studio"] },
  { tipo_imovel: "loja", keys: ["loja", "ponto comercial"] },
  { tipo_imovel: "sala", keys: ["sala comercial", "sala"] },
  { tipo_imovel: "galpao", keys: ["galpao", "deposito"] },
  { tipo_imovel: "cobertura", keys: ["cobertura"] },
];

// subcategorias de serviços (subcategoria_servico)
const SERVICO_SUBCATEGORIA_RULES = [
  { subcategoria_servico: "profissionais", keys: ["eletricista", "encanador", "marido de aluguel", "pedreiro", "pintor", "diarista", "chaveiro", "informatica", "refrigeracao", "ar condicionado"] },
  { subcategoria_servico: "eventos", keys: ["buffet", "dj", "som", "iluminacao", "decoracao", "bolo", "salgados", "cerimonial", "fotografia", "filmagem", "brinquedos", "salão", "salao"] },
  { subcategoria_servico: "classimed", keys: ["psicologia", "psicologo", "psiquiatria", "clinica geral", "pediatria", "ginecologia", "nutricao", "fisioterapia", "odontologia", "pilates", "personal"] },
];

// turismo (pilar_turismo / subcategoria_turismo) — aqui fica “leve”, o formulário já padronizou bem
const TURISMO_PILAR_RULES = [
  { pilar_turismo: "onde_ficar", keys: ["pousada", "hotel", "hostel", "hospedagem", "temporada"] },
  { pilar_turismo: "onde_comer", keys: ["restaurante", "pizzaria", "hamburgueria", "bar", "quiosque", "cafeteria", "sorveteria", "doceria"] },
  { pilar_turismo: "onde_passear", keys: ["passeio", "escuna", "barco", "lancha", "trilha", "mergulho", "city tour", "tour"] },
  { pilar_turismo: "onde_se_divertir", keys: ["show", "musica ao vivo", "balada", "pub", "festival", "evento"] },
];

// -----------------------------
// 3) Parser principal
// -----------------------------
export function parseBuscaClassilagos(rawQuery = "") {
  const original = rawQuery;
  let q = normalizeText(rawQuery);

  const debug = {
    original,
    normalized: q,
    detected: {},
    removedTokens: [],
  };

  // (A) Detecta cidade
  let cidade = null;

  // tenta aliases primeiro (ex.: "cabofrio")
  for (const [alias, canon] of Object.entries(CIDADE_ALIASES)) {
    if (q.includes(alias)) {
      cidade = canon;
      debug.detected.cidade = canon;
      debug.removedTokens.push(alias);
      q = removeFoundTokens(q, [alias]);
      break;
    }
  }

  if (!cidade) {
    for (const c of CIDADES) {
      if (q.includes(c)) {
        cidade = c;
        debug.detected.cidade = c;
        debug.removedTokens.push(c);
        q = removeFoundTokens(q, [c]);
        break;
      }
    }
  }

  // (B) Detecta categoria
  // Heurística: escolhe a categoria que tiver mais “matches”
  let categoria = null;
  let bestScore = 0;

  for (const item of CATEGORIA_KEYWORDS) {
    let score = 0;
    for (const k of item.keys) {
      if (q.includes(k)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      categoria = item.categoria;
    }
  }

  if (categoria) {
    debug.detected.categoria = categoria;
  }

  // (C) Detecta finalidade (principalmente para imóveis)
  let finalidade = null;
  for (const rule of FINALIDADE_RULES) {
    if (includesAny(q, rule.keys)) {
      finalidade = rule.finalidade;
      debug.detected.finalidade = finalidade;
      debug.removedTokens.push(...rule.keys.filter((k) => q.includes(k)));
      q = removeFoundTokens(q, rule.keys);
      break;
    }
  }

  // (D) Detecta subcategoria por categoria
  const filters = {};

  if (cidade) filters.cidade = denormalizeCidade(cidade);

  if (categoria) filters.categoria = categoria;

  // imóveis
  if (categoria === "imoveis") {
    if (finalidade) filters.finalidade = finalidade;

    // tipo_imovel
    for (const rule of IMOVEIS_TIPO_RULES) {
      if (includesAny(q, rule.keys)) {
        filters.tipo_imovel = rule.tipo_imovel;
        debug.detected.tipo_imovel = rule.tipo_imovel;
        debug.removedTokens.push(...rule.keys.filter((k) => q.includes(k)));
        q = removeFoundTokens(q, rule.keys);
        break;
      }
    }
  }

  // serviços
  if (categoria === "servico") {
    for (const rule of SERVICO_SUBCATEGORIA_RULES) {
      if (includesAny(q, rule.keys)) {
        filters.subcategoria_servico = rule.subcategoria_servico;
        debug.detected.subcategoria_servico = rule.subcategoria_servico;
        debug.removedTokens.push(...rule.keys.filter((k) => q.includes(k)));
        q = removeFoundTokens(q, rule.keys);
        break;
      }
    }
  }

  // turismo
  if (categoria === "turismo") {
    for (const rule of TURISMO_PILAR_RULES) {
      if (includesAny(q, rule.keys)) {
        filters.pilar_turismo = rule.pilar_turismo;
        debug.detected.pilar_turismo = rule.pilar_turismo;
        debug.removedTokens.push(...rule.keys.filter((k) => q.includes(k)));
        q = removeFoundTokens(q, rule.keys);
        break;
      }
    }
  }

  // empregos/curriculo: se digitou "curriculo" dá preferência em entender como categoria curriculo (opcional)
  // (deixe comentado por enquanto — você decide se curriculo é categoria separada no motor)
  // if (includesAny(normalizeText(original), ["curriculo", "curriculos"])) filters.categoria = "curriculo";

  // (E) texto restante vira busca livre (titulo/descricao/bairro/nome_negocio etc.)
  const textQuery = q; // já normalizado e "limpo" dos tokens fortes
  debug.remainingText = textQuery;

  return { filters, textQuery, debug };
}

// volta a cidade para forma com acento/maiúscula do seu select
function denormalizeCidade(c) {
  const map = {
    "marica": "Maricá",
    "saquarema": "Saquarema",
    "araruama": "Araruama",
    "iguaba grande": "Iguaba Grande",
    "sao pedro da aldeia": "São Pedro da Aldeia",
    "arraial do cabo": "Arraial do Cabo",
    "cabo frio": "Cabo Frio",
    "buzios": "Búzios",
    "rio das ostras": "Rio das Ostras",
  };
  return map[c] || c;
}
