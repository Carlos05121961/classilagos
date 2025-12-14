// lib/busca/dicionario.js
// Dicionário oficial de palavras-chave do Classilagos
// (padrão único para parser + busca)

export const CIDADES_OFICIAIS = [
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

// variações aceitas -> cidade oficial
export const CIDADES_ALIASES = {
  // São Pedro da Aldeia
  "sao pedro da aldeia": "São Pedro da Aldeia",
  "sao pedro": "São Pedro da Aldeia",
  "s pedro": "São Pedro da Aldeia",
  "aldeia": "São Pedro da Aldeia",

  // Arraial do Cabo
  "arraial do cabo": "Arraial do Cabo",
  "arraial": "Arraial do Cabo",
  "arraial cabo": "Arraial do Cabo",

  // Cabo Frio
  "cabo frio": "Cabo Frio",
  "cabofrio": "Cabo Frio",

  // Búzios
  "buzios": "Búzios",
  "búzios": "Búzios",
  "armacao dos buzios": "Búzios",
  "armação dos búzios": "Búzios",
  "armacao": "Búzios",
  "armação": "Búzios",

  // Rio das Ostras
  "rio das ostras": "Rio das Ostras",
  "riodasostras": "Rio das Ostras",
  "rio ostras": "Rio das Ostras",
};

// finalidades oficiais (IMÓVEIS) — valores reais do seu banco
export const FINALIDADES = {
  VENDA: "venda",
  ALUGUEL: "aluguel",
  TEMPORADA: "temporada",
};

// palavras que indicam intenção (isso vira FILTRO, não texto livre)
export const FINALIDADE_KEYWORDS = {
  [FINALIDADES.VENDA]: [
    "venda", "vender", "vendo", "comprar", "compra", "a venda", "à venda",
  ],

  // IMPORTANTE: “temporada” é um tipo de aluguel (curta duração)
  // Então qualquer “aluguel temporada / por temporada” entra aqui.
  [FINALIDADES.TEMPORADA]: [
    "temporada",
    "por temporada",
    "aluguel temporada",
    "aluguel por temporada",
    "locacao temporada",
    "locação temporada",
    "diaria",
    "diária",
    "diarias",
    "diárias",
    "fim de semana",
    "feriado",
    "airbnb",
    "booking",
  ],

  [FINALIDADES.ALUGUEL]: [
    "aluguel", "alugar", "alugo",
    "locacao", "locação", "locar",
    "mensal", "anual",
    "contrato", "fiador",
  ],
};


// categorias oficiais (campo categoria no banco)
export const CATEGORIAS = {
  IMOVEIS: "imoveis",
  VEICULOS: "veiculos",
  NAUTICA: "nautica",
  PETS: "pets",
  EMPREGOS: "empregos",
  SERVICO: "servico",
  TURISMO: "turismo",
  LAGOLISTAS: "lagolistas",
};

export const CATEGORIA_KEYWORDS = {
  [CATEGORIAS.IMOVEIS]: [
    "imovel",
    "imóveis",
    "imoveis",
    "casa",
    "apartamento",
    "apto",
    "ap",
    "kitnet",
    "studio",
    "estudio",
    "terreno",
    "lote",
    "cobertura",
    "sitio",
    "sítio",
    "chacara",
    "chácara",
    "fazenda",
    "galpao",
    "galpão",
    "sala comercial",
    "loja",
  ],
  [CATEGORIAS.VEICULOS]: [
    "veiculo",
    "veículos",
    "veiculos",
    "carro",
    "moto",
    "caminhao",
    "caminhão",
    "van",
    "onibus",
    "ônibus",
  ],
  [CATEGORIAS.NAUTICA]: [
    "nautica",
    "náutica",
    "barco",
    "lancha",
    "veleiro",
    "jetski",
    "jet ski",
    "escuna",
    "marina",
    "passeio de barco",
  ],
  [CATEGORIAS.PETS]: [
    "pets",
    "pet",
    "cachorro",
    "gato",
    "filhote",
    "adoção",
    "adocao",
    "ração",
    "racao",
    "veterinario",
    "veterinário",
  ],
  [CATEGORIAS.EMPREGOS]: [
    "emprego",
    "vagas",
    "vaga",
    "trabalho",
    "contratar",
    "curriculo",
    "currículo",
  ],
  [CATEGORIAS.SERVICO]: [
    "servico",
    "serviços",
    "servicos",
    "profissional",
    "profissionais",
    "eletricista",
    "encanador",
    "diarista",
    "buffet",
    "dj",
    "fotografia",
    "filmagem",
    "médico",
    "medico",
    "psicologo",
    "psicólogo",
    "clinica",
    "clínica",
  ],
  [CATEGORIAS.TURISMO]: [
    "turismo",
    "pousada",
    "hotel",
    "hostel",
    "restaurante",
    "bar",
    "quiosque",
    "passeio",
    "trilha",
    "guia",
    "transfer",
    "receptivo",
  ],
  [CATEGORIAS.LAGOLISTAS]: [
    "lagolistas",
    "lago listas",
    "guia comercial",
    "comercio",
    "comércio",
    "empresa",
    "loja",
  ],
};

// IMÓVEIS: valores padronizados para tipo_imovel
export const TIPOS_IMOVEL = {
  APARTAMENTO: "apartamento",
  CASA: "casa",
  KITNET: "kitnet",
  TERRENO: "terreno",
  COBERTURA: "cobertura",
  COMERCIAL: "comercial",
  SITIO_CHACARA: "sitio_chacara",
  OUTROS: "outros",
};

export const TIPO_IMOVEL_ALIASES = {
  apartamento: TIPOS_IMOVEL.APARTAMENTO,
  ap: TIPOS_IMOVEL.APARTAMENTO,
  apto: TIPOS_IMOVEL.APARTAMENTO,
  apart: TIPOS_IMOVEL.APARTAMENTO,

  casa: TIPOS_IMOVEL.CASA,
  sobrado: TIPOS_IMOVEL.CASA,

  kitnet: TIPOS_IMOVEL.KITNET,
  studio: TIPOS_IMOVEL.KITNET,
  "estudio": TIPOS_IMOVEL.KITNET,
  "estúdio": TIPOS_IMOVEL.KITNET,

  terreno: TIPOS_IMOVEL.TERRENO,
  lote: TIPOS_IMOVEL.TERRENO,

  cobertura: TIPOS_IMOVEL.COBERTURA,

  "sala comercial": TIPOS_IMOVEL.COMERCIAL,
  sala: TIPOS_IMOVEL.COMERCIAL,
  loja: TIPOS_IMOVEL.COMERCIAL,
  galpao: TIPOS_IMOVEL.COMERCIAL,
  "galpão": TIPOS_IMOVEL.COMERCIAL,

  sitio: TIPOS_IMOVEL.SITIO_CHACARA,
  "sítio": TIPOS_IMOVEL.SITIO_CHACARA,
  chacara: TIPOS_IMOVEL.SITIO_CHACARA,
  "chácara": TIPOS_IMOVEL.SITIO_CHACARA,
};

// SERVIÇOS: subcategorias oficiais (campo subcategoria_servico)
export const SUBCATEGORIAS_SERVICO = {
  PROFISSIONAIS: "profissionais",
  EVENTOS: "eventos",
  CLASSIMED: "classimed",
};

// palavras para detectar subcategoria_servico
export const SERVICO_SUBCATEGORIA_KEYWORDS = {
  [SUBCATEGORIAS_SERVICO.EVENTOS]: [
    "eventos",
    "festa",
    "festas",
    "casamento",
    "aniversario",
    "aniversário",
    "buffet",
    "dj",
    "cerimonial",
    "decoracao",
    "decoração",
    "filmagem",
    "fotografia",
    "salgados",
    "bolo",
    "doces",
  ],
  [SUBCATEGORIAS_SERVICO.CLASSIMED]: [
    "medico",
    "médico",
    "psicologo",
    "psicólogo",
    "psiquiatra",
    "psiquiatria",
    "clinica",
    "clínica",
    "consultorio",
    "consultório",
    "dentista",
    "odontologia",
    "fisioterapia",
    "nutricao",
    "nutrição",
    "pediatria",
    "ginecologia",
    "terapia",
    "pilates",
  ],
};

// TURISMO: pilares oficiais (campo pilar_turismo)
export const PILARES_TURISMO = {
  ONDE_FICAR: "onde_ficar",
  ONDE_COMER: "onde_comer",
  ONDE_SE_DIVERTIR: "onde_se_divertir",
  ONDE_PASSEAR: "onde_passear",
  SERVICOS_TURISMO: "servicos_turismo",
  PRODUTOS_TURISTICOS: "produtos_turisticos",
  OUTROS: "outros",
};

// TURISMO: subcategorias (campo subcategoria_turismo)
// (mantém a mesma lista que você já usa no FormularioTurismo)
export const TURISMO_SUBCATEGORIAS_POR_PILAR = {
  [PILARES_TURISMO.ONDE_FICAR]: [
    "pousada_hotel_hostel",
    "casa_apartamento_temporada",
    "camping_motorhome",
    "hostel_quarto_compartilhado",
    "outros_hospedagem",
  ],
  [PILARES_TURISMO.ONDE_COMER]: [
    "restaurante",
    "bar_quiosque",
    "pizzaria",
    "hamburgueria",
    "cafeteria_sorveteria",
    "comida_por_kilo_delivery",
    "outros_gastronomia",
  ],
  [PILARES_TURISMO.ONDE_SE_DIVERTIR]: [
    "casa_show_musica_ao_vivo",
    "pub_balada",
    "evento_festival",
    "parque_lazer",
    "outros_diversao",
  ],
  [PILARES_TURISMO.ONDE_PASSEAR]: [
    "passeio_escuna_barco",
    "passeio_lancha_taxi_lancha",
    "passeio_buggy_quadriciclo",
    "trilhas_caminhadas",
    "city_tour_cultural",
    "mergulho_esportes_aquaticos",
    "turismo_rural_ecologico",
    "outros_passeios",
  ],
  [PILARES_TURISMO.SERVICOS_TURISMO]: [
    "agencia_turismo",
    "guia_turistico_credenciado",
    "transfer_transporte_turistico",
    "fotografia_video_turistico",
    "locacao_veiculos_vans",
    "outros_servicos_turismo",
  ],
  [PILARES_TURISMO.PRODUTOS_TURISTICOS]: [
    "souvenir_artesanato",
    "moda_praia",
    "loja_tematica",
    "produtos_regionais",
    "outros_produtos_turisticos",
  ],
  [PILARES_TURISMO.OUTROS]: ["turismo_geral"],
};

// Stopwords (ignoradas)
export const STOPWORDS = new Set([
  "de","da","do","das","dos","em","no","na","nos","nas",
  "para","por","com","sem","e","a","o","os","as","um","uma",
  "ao","aos","à","às","nao","não","rj","regiao","região","doslagos","lagos",
]);
