"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/hero/pets-01.webp",
  "/hero/pets-02.webp",
  "/hero/pets-03.webp",
];

// CIDADES DA REGIÃO
const cidades = [
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

// OPÇÕES DO SELECT "Tipo"
const tiposPet = [
  "Animais",
  "Adoção / Doação",
  "Achados e perdidos",
  "Serviços pet & acessórios",
];

// CARDS – 4 GRUPOS
const cardsPets = [
  {
    slug: "animais",
    titulo: "Animais à venda",
    subtitulo: "Filhotes e adultos para compra",
    href: "/pets/lista?subcategoria=Animais",
  },
  {
    slug: "adocao",
    titulo: "Adoção / Doação",
    subtitulo: "Ajude a encontrar um novo lar",
    href: "/pets/lista?subcategoria=Adoção / Doação",
  },
  {
    slug: "achados",
    titulo: "Achados e perdidos",
    subtitulo: "Divulgue animais desaparecidos ou encontrados",
    href: "/pets/lista?subcategoria=Achados e perdidos",
  },
  {
    slug: "servicos",
    titulo: "Serviços pet & acessórios",
    subtitulo: "Banho, tosa, clínicas, hotel, acessórios...",
    href: "/pets/lista?subcategoria=Serviços pet & acessórios",
  },
];

function normalizeText(str) {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // tira pontuação
    .replace(/\s+/g, " ")
    .trim();
}

const STOPWORDS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "para",
  "pra",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "com",
  "e",
  "a",
  "o",
  "as",
  "os",
  "um",
  "uma",
  "uns",
  "umas",
  "por",
  "sem",
]);

function tokensFromQuery(q) {
  const t = normalizeText(q);
  if (!t) return [];
  return t.split(" ").filter((w) => w && !STOPWORDS.has(w));
}

/**
 * ✅ Sinônimos/variações (bem simples, mas resolve MUITO)
 * Tudo aqui já deve estar sem acento e em minúsculo (a normalizeText garante isso).
 */
const SYNONYMS = {
  caes: ["cao", "cachorro", "dog", "canino"],
  cao: ["caes", "cachorro", "dog", "canino"],
  cachorro: ["cao", "caes", "dog", "canino"],
  gatos: ["gato", "felino", "cat"],
  gato: ["gatos", "felino", "cat"],

  adocao: ["adotar", "doacao", "doar", "adocao", "adocao"],
  doacao: ["doar", "adocao", "adotar"],
  doar: ["doacao", "adocao"],

  clinica: ["veterinaria", "veterinario", "vet", "hospital"],
  veterinaria: ["veterinario", "vet", "clinica"],
  veterinario: ["veterinaria", "vet", "clinica"],
  vet: ["veterinaria", "veterinario", "clinica"],

  banho: ["tosa", "banhoetosa", "higiene"],
  tosa: ["banho", "banhoetosa", "higiene"],
  racao: ["ração", "alimento", "alimentacao"], // (a normalizeText tira o acento de "ração")
  alimentacao: ["racao", "alimento"],

  filhotes: ["filhote", "bebe", "bb"],
  filhote: ["filhotes", "bebe", "bb"],

  perdido: ["desaparecido", "sumiu", "fugiu", "perdida"],
  achado: ["encontrado", "encontrei", "achei", "achada"],
};

function singularize(tok) {
  // regras simples para PT
  if (!tok) return tok;

  if (tok === "caes") return "cao";
  if (tok.endsWith("oes")) return tok.slice(0, -3) + "ao"; // adoções -> adocao (mas já vem normalizado geralmente)
  if (tok.endsWith("ais")) return tok.slice(0, -3) + "al"; // animais -> animal
  if (tok.endsWith("eis")) return tok.slice(0, -3) + "el";
  if (tok.endsWith("is")) return tok.slice(0, -2) + "il";
  if (tok.endsWith("es") && tok.length > 3) return tok.slice(0, -2); // filhotes -> filhot (não é perfeito, mas ajuda pouco)
  if (tok.endsWith("s") && tok.length > 3) return tok.slice(0, -1); // gatos -> gato
  return tok;
}

function expandToken(tok) {
  const t = normalizeText(tok);
  const set = new Set();
  if (!t) return set;

  set.add(t);

  const sing = singularize(t);
  if (sing && sing !== t) set.add(sing);

  const syn = SYNONYMS[t];
  if (Array.isArray(syn)) syn.forEach((w) => set.add(normalizeText(w)));

  const syn2 = SYNONYMS[sing];
  if (Array.isArray(syn2)) syn2.forEach((w) => set.add(normalizeText(w)));

  // remove vazios
  [...set].forEach((x) => {
    if (!x) set.delete(x);
  });

  return set;
}

/**
 * ✅ Match AND, mas cada token pode bater em QUALQUER variante/sinônimo.
 * Ex.: "caes adocao" bate se o texto tiver "cao" e "adotar".
 */
function matchAllTokensSmart(query, haystack) {
  const tokens = tokensFromQuery(query);
  if (tokens.length === 0) return true;

  const text = normalizeText(haystack);

  return tokens.every((tok) => {
    const variants = expandToken(tok);
    if (variants.size === 0) return true;
    return [...variants].some((v) => text.includes(v));
  });
}

export default function PetsPage() {
  const [currentHero, setCurrentHero] = useState(0);

  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  // ✅ motorzinho (busca real)
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(""); // Animais | Adoção... | Achados... | Serviços...
  const [cidadeFiltro, setCidadeFiltro] = useState("");

  // Troca das fotos do hero
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios de pets no Supabase
  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        setLoadingAnuncios(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select(
            `
            id,
            titulo,
            descricao,
            cidade,
            bairro,
            preco,
            imagens,
            categoria,
            subcategoria_pet,
            tipo_imovel,
            status,
            created_at,
            destaque
          `
          )
          .eq("categoria", "pets")
          .eq("status", "ativo")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao carregar anúncios de pets:", error);
          setAnuncios([]);
        } else {
          setAnuncios(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao carregar anúncios de pets:", e);
        setAnuncios([]);
      } finally {
        setLoadingAnuncios(false);
      }
    };

    fetchAnuncios();
  }, []);

  const norm = (s) => (s || "").toLowerCase();

  // CLASSIFICA UM ANÚNCIO EM UM DOS 4 GRUPOS
  function classificarAnuncio(item) {
    const cat = norm(item.subcategoria_pet || item.tipo_imovel || "");
    const titulo = norm(item.titulo || "");
    const desc = norm(item.descricao || "");

    // Achados e perdidos
    if (
      cat.includes("achado") ||
      cat.includes("perdido") ||
      titulo.includes("achado") ||
      titulo.includes("perdido")
    )
      return "achados";

    // Adoção / doação
    if (
      cat.includes("adoção") ||
      cat.includes("adocao") ||
      cat.includes("doação") ||
      cat.includes("doacao") ||
      titulo.includes("adoção") ||
      titulo.includes("adocao") ||
      desc.includes("adoção") ||
      desc.includes("adocao")
    ) {
      return "adocao";
    }

    // Serviços pet & acessórios
    if (
      cat.includes("serviços pet & acessórios") ||
      cat.includes("servicos pet & acessorios") ||
      cat.includes("serviços pet") ||
      cat.includes("servicos pet") ||
      cat.includes("serviço") ||
      cat.includes("servico") ||
      cat.includes("banho") ||
      cat.includes("tosa") ||
      cat.includes("hotel") ||
      cat.includes("hospedagem") ||
      cat.includes("hosped") ||
      cat.includes("clínica") ||
      cat.includes("clinica") ||
      cat.includes("veterin") ||
      titulo.includes("veterin") ||
      desc.includes("veterin") ||
      desc.includes("banho") ||
      desc.includes("tosa") ||
      desc.includes("clinica") ||
      desc.includes("clínica")
    ) {
      return "servicos";
    }

    return "animais";
  }

  // ✅ aplica filtros do motorzinho (busca + tipo + cidade)
  const anunciosFiltrados = useMemo(() => {
    let lista = Array.isArray(anuncios) ? [...anuncios] : [];

    if (cidadeFiltro) {
      lista = lista.filter((a) => (a.cidade || "").trim() === cidadeFiltro);
    }

    if (tipoFiltro) {
      const slug =
        tipoFiltro === "Animais"
          ? "animais"
          : tipoFiltro === "Adoção / Doação"
          ? "adocao"
          : tipoFiltro === "Achados e perdidos"
          ? "achados"
          : "servicos";

      lista = lista.filter((a) => classificarAnuncio(a) === slug);
    }

    if (busca.trim()) {
      lista = lista.filter((a) => {
        const haystack = [
          a.titulo,
          a.descricao,
          a.subcategoria_pet,
          a.tipo_imovel,
          a.cidade,
          a.bairro,
        ].join(" ");
        return matchAllTokensSmart(busca, haystack);
      });
    }

    return lista;
  }, [anuncios, busca, tipoFiltro, cidadeFiltro]);

  // Escolhe um anúncio para ilustrar cada card (usa base total, não a busca)
  function escolherParaCard(slugGrupo) {
    if (!anuncios || anuncios.length === 0) return null;
    const filtrados = anuncios.filter((a) => classificarAnuncio(a) === slugGrupo);
    if (filtrados.length === 0) return null;

    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  // Anúncios recentes (agora respeita o motorzinho)
  const anunciosRecentes = anunciosFiltrados.slice(0, 12);

  const temFiltroAtivo = !!(busca.trim() || tipoFiltro || cidadeFiltro);

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie para pets no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Pets"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-xs sm:text-sm md:text-base font-medium drop-shadow max-w-2xl">
              Encontre animais, acessórios, serviços pet e muito mais na Região
              dos Lagos.
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Pets
            </h1>
            <p className="mt-2 text-[11px] sm:text-xs text-amber-100/90">
              Anúncios de pets em Maricá, Saquarema, Araruama, Cabo Frio,
              Búzios e toda a região.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ CAIXA DE BUSCA (AGORA LIGADA) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: clinica veterinaria, filhotes de caes, banho e tosa"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  {tiposPet.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cidadeFiltro}
                  onChange={(e) => setCidadeFiltro(e.target.value)}
                >
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    setTipoFiltro("");
                    setCidadeFiltro("");
                    setTimeout(() => {
                      const el = document.getElementById("resultados-pets");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  className="w-full md:w-auto rounded-full bg-slate-200 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 hover:bg-slate-300"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("resultados-pets");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            ✅ Busca ligada aos anúncios reais (com normalização + sinônimos).
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* 4 CARDS PRINCIPAIS */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {cardsPets.map((card) => {
            const anuncio = escolherParaCard(card.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens) ? anuncio.imagens : [];
            const capa = imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={card.slug}
                href={card.href}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="relative h-24 md:h-28 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || card.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[11px] text-slate-600">
                      <span>Em breve, anúncios aqui</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">{card.titulo}</p>
                  <p className="mt-1 text-[10px] text-slate-300 line-clamp-2">
                    {card.subtitulo}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-amber-300 line-clamp-1">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ANÚNCIOS RECENTES (AGORA RESPEITA O MOTORZINHO) */}
      <section className="bg-white pb-10" id="resultados-pets">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              {temFiltroAtivo ? "Resultados da sua busca" : "Anúncios recentes de pets"}
            </h2>
            <span className="text-[11px] text-slate-500">
              {loadingAnuncios
                ? "Carregando anúncios..."
                : anunciosRecentes.length === 0
                ? "Nenhum anúncio encontrado."
                : `${anunciosRecentes.length} anúncio(s)`}
            </span>
          </div>

          {loadingAnuncios && (
            <p className="text-xs text-slate-500">Buscando anúncios…</p>
          )}

          {!loadingAnuncios && anunciosRecentes.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              {temFiltroAtivo ? (
                <>
                  Nenhum anúncio bateu com sua busca.
                  <br />
                  <button
                    onClick={() => {
                      setBusca("");
                      setTipoFiltro("");
                      setCidadeFiltro("");
                    }}
                    className="inline-flex mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black"
                  >
                    Limpar filtros
                  </button>
                </>
              ) : (
                <>
                  Ainda não há anúncios de pets cadastrados.
                  <br />
                  <Link
                    href="/anunciar?tipo=pets"
                    className="inline-flex mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Seja o primeiro a anunciar
                  </Link>
                </>
              )}
            </div>
          )}

          {!loadingAnuncios && anunciosRecentes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {anunciosRecentes.map((a) => {
                const img = Array.isArray(a.imagens) && a.imagens.length > 0 ? a.imagens[0] : null;
                const grupo = classificarAnuncio(a);

                return (
                  <Link
                    key={a.id}
                    href={`/anuncios/${a.id}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={a.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-amber-50 bg-gradient-to-br from-amber-500 to-rose-500">
                          Sem foto
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] font-bold uppercase line-clamp-2">
                        {a.titulo}
                      </p>
                      <p className="text-[10px] text-slate-300">
                        {grupo === "animais" && "Animais"}
                        {grupo === "adocao" && "Adoção / Doação"}
                        {grupo === "achados" && "Achados e perdidos"}
                        {grupo === "servicos" && "Serviços pet & acessórios"}
                        {" • "}
                        {a.cidade}
                        {a.bairro ? ` • ${a.bairro}` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">
            Links úteis para pets
          </h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para cuidar bem dos seus animais
            na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Campanhas de vacinação
              </h3>
              <p className="text-[11px] text-slate-300">
                Informações sobre vacinação antirrábica e campanhas oficiais
                nas cidades da região.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Centro de Zoonoses
              </h3>
              <p className="text-[11px] text-slate-300">
                Endereços e orientações sobre saúde pública, resgate e animais
                em situação de rua.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                ONGs e proteção animal
              </h3>
              <p className="text-[11px] text-slate-300">
                Projetos de adoção, lares temporários e feiras de adoção na
                Região dos Lagos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Dicas de bem-estar pet
              </h3>
              <p className="text-[11px] text-slate-300">
                Em breve, conteúdos especiais sobre alimentação, comportamento e
                cuidados gerais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

