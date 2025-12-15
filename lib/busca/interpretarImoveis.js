// lib/busca/interpretarImoveis.js

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Finalidade: valores EXACT do seu banco: venda | aluguel | temporada
const FINALIDADE_RULES = [
  // PRIORIDADE: temporada ganha se aparecer junto com aluguel
  { value: "temporada", words: ["temporada", "diaria", "diarias", "airbnb", "verao", "fim de semana", "feriado"] },
  { value: "aluguel", words: ["aluguel", "alugar", "locacao", "locar", "alugo"] },
  { value: "venda", words: ["venda", "vendo", "comprar", "compra", "a venda", "à venda", "vende se", "vende-se"] },
];

// Tipo de imóvel: valores EXACT do seu banco
const TIPO_IMOVEL_RULES = [
  { value: "Casa", words: ["casa", "residencia", "residência"] },
  { value: "Apartamento", words: ["apartamento", "apto", "apt", "ap"] },
  { value: "Cobertura", words: ["cobertura"] },
  { value: "Kitnet / Studio", words: ["kitnet", "quitinete", "studio", "stúdio", "estudio"] },
  { value: "Terreno / Lote", words: ["terreno", "lote", "loteamento"] },
  { value: "Loja / Sala", words: ["loja", "sala", "sala comercial", "ponto comercial", "office"] },
  { value: "Galpão", words: ["galpao", "galpão", "deposito", "depósito", "armazem", "armazém"] },
  { value: "Sítio / Chácara", words: ["sitio", "sítio", "chacara", "chácara"] },
  { value: "Comercial", words: ["comercial"] },
  { value: "Outros", words: ["outros"] },
];

// Cidades principais (9) – devolve como você normalmente grava/mostra
const CIDADE_RULES = [
  { value: "Maricá", words: ["marica"] },
  { value: "Saquarema", words: ["saquarema"] },
  { value: "Araruama", words: ["araruama"] },
  { value: "Iguaba Grande", words: ["iguaba", "iguaba grande"] },
  { value: "São Pedro da Aldeia", words: ["sao pedro", "sao pedro da aldeia", "aldeia"] },
  { value: "Arraial do Cabo", words: ["arraial", "arraial do cabo"] },
  { value: "Cabo Frio", words: ["cabo frio"] },
  { value: "Búzios", words: ["buzios", "armacao dos buzios", "armação dos búzios"] },
  { value: "Rio das Ostras", words: ["rio das ostras", "r das ostras", "r. das ostras"] },
];

const STOPWORDS = new Set([
  "em","no","na","nos","nas","de","da","do","das","dos","para","pra","pro",
  "com","sem","perto","proximo","proxima","ao","aos","as","os","um","uma",
  "e","ou","por","entre","bairro","centro"
]);

function findFirstByRules(textNorm, rules) {
  for (const r of rules) {
    for (const w of r.words) {
      const wn = normalize(w);
      const re = new RegExp(`(^|\\s)${wn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i");
      if (re.test(textNorm)) return r.value;
    }
  }
  return null;
}

function extractNumber(textNorm, patterns) {
  for (const re of patterns) {
    const m = textNorm.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

function removeMatchedPhrases(textNorm, phrases) {
  let t = ` ${textNorm} `;
  for (const p of phrases) {
    const pn = normalize(p);
    const re = new RegExp(`(^|\\s)${pn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "gi");
    t = t.replace(re, " ");
  }
  return t.replace(/\s+/g, " ").trim();
}

export function interpretarBuscaImoveis(input = "") {
  const original = input || "";
  const textNorm = normalize(original);

  // Extrai quartos e vagas
  const quartos = extractNumber(textNorm, [
    /(\d+)\s*(quarto|quartos|qt|qts)\b/i,
  ]);

  const vagas = extractNumber(textNorm, [
    /(\d+)\s*(vaga|vagas)\b/i,
  ]);

  // Interpreta finalidade/tipo/cidade
  const finalidade = findFirstByRules(textNorm, FINALIDADE_RULES);   // venda|aluguel|temporada
  const tipo_imovel = findFirstByRules(textNorm, TIPO_IMOVEL_RULES); // valores do DB
  const cidade = findFirstByRules(textNorm, CIDADE_RULES);

  // Remove termos já usados, para sobrar o "livre"
  const phrasesToRemove = ["quarto","quartos","qt","qts","vaga","vagas"];

  for (const r of FINALIDADE_RULES) if (r.value === finalidade) phrasesToRemove.push(...r.words);
  for (const r of TIPO_IMOVEL_RULES) if (r.value === tipo_imovel) phrasesToRemove.push(...r.words);
  for (const r of CIDADE_RULES) if (r.value === cidade) phrasesToRemove.push(...r.words);

  const rest = removeMatchedPhrases(textNorm, phrasesToRemove);

  const termosLivres = rest
    .split(" ")
    .map((x) => x.trim())
    .filter(Boolean)
    .filter((x) => !STOPWORDS.has(x))
    .filter((x) => x.length >= 2);

  return {
    original,
    tipo_imovel,
    finalidade,
    cidade,
    quartos,
    vagas,
    termosLivres,
  };
}
