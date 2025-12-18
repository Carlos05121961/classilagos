"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";

const heroImages = ["/hero/pets-01.webp", "/hero/pets-02.webp", "/hero/pets-03.webp"];

// ✅ BANNERS AFILIADOS (Topo)
const bannersTopo = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

// ✅ BANNERS AFILIADOS (Rodapé) — PRINCIPAL
const bannersRodape = [
  {
    src: "/banners/rodape/banner-rodape-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
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
const tiposPet = ["Animais", "Adoção / Doação", "Achados e perdidos", "Serviços pet & acessórios"];

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

export default function PetsPage() {
  const router = useRouter();

  // ✅ HERO premium (sem piscar)
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState(() => new Set());
  const [fadeIn, setFadeIn] = useState(false);

  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  // Busca premium (vai para /busca)
  const [textoBusca, setTextoBusca] = useState("");
  const [tipoBusca, setTipoBusca] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");

  // Preload das imagens do hero (evita “piscar”)
  useEffect(() => {
    heroImages.forEach((src) => {
      const im = new window.Image();
      im.src = src;
      im.onload = () =>
        setLoadedSet((prev) => {
          const n = new Set(prev);
          n.add(src);
          return n;
        });
    });
  }, []);

  // Rotação do hero
  useEffect(() => {
    if (!heroImages.length) return;
    const t = setInterval(() => {
      setFadeIn(false);
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  // Ativa fade quando a imagem atual estiver carregada
  useEffect(() => {
    const src = heroImages[heroIndex];
    if (loadedSet.has(src)) {
      const id = setTimeout(() => setFadeIn(true), 30);
      return () => clearTimeout(id);
    }
  }, [heroIndex, loadedSet]);

  // Buscar anúncios de pets no Supabase (para vitrine e recentes)
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
          .order("destaque", { ascending: false })
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

  // CLASSIFICA UM ANÚNCIO EM UM DOS 4 GRUPOS (para escolher capa dos cards)
  function classificarAnuncio(item) {
    const cat = norm(item.subcategoria_pet || item.tipo_imovel || "");
    const titulo = norm(item.titulo || "");
    const desc = norm(item.descricao || "");

    // Achados e perdidos
    if (cat.includes("achado") || cat.includes("perdido") || titulo.includes("achado") || titulo.includes("perdido")) {
      return "achados";
    }

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

  // Escolhe um anúncio para ilustrar cada card (usa base total)
  function escolherParaCard(slugGrupo) {
    if (!anuncios || anuncios.length === 0) return null;
    const filtrados = anuncios.filter((a) => classificarAnuncio(a) === slugGrupo);
    if (filtrados.length === 0) return null;

    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  // Anúncios recentes
  const destaques = anuncios && anuncios.length > 0 ? anuncios.slice(0, 12) : [];

  // ✅ Busca PREMIUM: manda para /busca
  function handleBuscar() {
    const partes = [];
    if (textoBusca.trim()) partes.push(textoBusca.trim());
    if (tipoBusca) partes.push(tipoBusca);
    if (cidadeBusca) partes.push(cidadeBusca);

    const q = partes.join(" ").trim();

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("categoria", "pets");

    router.push(`/busca?${params.toString()}`);
  }

  const heroSrc = heroImages[heroIndex];

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (afiliado, rotativo, clicável) */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* ✅ HERO PREMIUM (sem piscar) */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          {/* fundo “nuvem” */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200" />

          {/* imagem em background com fade */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: loadedSet.has(heroSrc) && fadeIn ? 1 : 0,
              backgroundImage: `url(${heroSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* pré-carregamento silencioso */}
          <Image src={heroSrc} alt="Pré-carregamento hero" fill className="opacity-0 pointer-events-none" />
        </div>

        {/* overlay premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/45" />

        {/* textos mais altos + sombra premium */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white translate-y-[-24px] sm:translate-y-[-32px]">
          <p className="text-xs sm:text-sm md:text-base font-medium max-w-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.70)]">
            Encontre animais, acessórios, serviços pet e muito mais na Região dos Lagos.
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold [text-shadow:0_6px_20px_rgba(0,0,0,0.80)]">
            Classilagos – Pets
          </h1>

          <p className="mt-2 text-[11px] sm:text-xs text-amber-100/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
            Anúncios de pets em Maricá, Saquarema, Araruama, Cabo Frio, Búzios e toda a região.
          </p>

          <div className="mt-3 flex justify-center">
            <div className="h-[3px] w-44 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Busca</label>
                <input
                  type="text"
                  placeholder="Ex.: clinica veterinaria, filhotes, banho e tosa"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={textoBusca}
                  onChange={(e) => setTextoBusca(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleBuscar();
                    }
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Tipo</label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tipoBusca}
                  onChange={(e) => setTipoBusca(e.target.value)}
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
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Cidade</label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cidadeBusca}
                  onChange={(e) => setCidadeBusca(e.target.value)}
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
                    setTextoBusca("");
                    setTipoBusca("");
                    setCidadeBusca("");
                  }}
                  className="w-full md:w-auto rounded-full bg-slate-200 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 hover:bg-slate-300"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={handleBuscar}
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">Busca ligada ao motor do Classilagos.</p>
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
                    // eslint-disable-next-line @next/next/no-img-element
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
                  <p className="mt-1 text-[10px] text-slate-300 line-clamp-2">{card.subtitulo}</p>
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

      {/* ANÚNCIOS RECENTES */}
      <section className="bg-white pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">Anúncios recentes de pets</h2>

            <span className="text-[11px] text-slate-500">
              {loadingAnuncios
                ? "Carregando anúncios..."
                : destaques.length === 0
                ? "Nenhum anúncio cadastrado ainda."
                : `${destaques.length} anúncio(s)`}
            </span>
          </div>

          {loadingAnuncios && <p className="text-xs text-slate-500">Buscando anúncios…</p>}

          {!loadingAnuncios && destaques.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              Ainda não há anúncios de pets cadastrados.
              <br />
              <Link
                href="/anunciar?tipo=pets"
                className="inline-flex mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Seja o primeiro a anunciar
              </Link>
            </div>
          )}

          {!loadingAnuncios && destaques.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {destaques.map((a) => {
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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={a.titulo} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      ) : (
                        <div className="w-full h-28 md:h-32 bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-[11px] text-amber-50">
                          Sem foto
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] font-bold uppercase line-clamp-2">{a.titulo}</p>
                      <p className="text-[10px] text-slate-300">
                        {grupo === "animais" && "Animais"}
                        {grupo === "adocao" && "Adoção / Doação"}
                        {grupo === "achados" && "Achados e perdidos"}
                        {grupo === "servicos" && "Serviços pet & acessórios"}
                        {" • "}
                        {a.cidade}
                        {a.bairro ? ` • ${a.bairro}` : ""}
                      </p>
                      {a.preco && <p className="mt-1 text-[11px] font-semibold text-emerald-300">{a.preco}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) — com respiro */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">Links úteis para pets</h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para cuidar bem dos seus animais na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Campanhas de vacinação</h3>
              <p className="text-[11px] text-slate-300">
                Informações sobre vacinação antirrábica e campanhas oficiais nas cidades da região.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Centro de Zoonoses</h3>
              <p className="text-[11px] text-slate-300">
                Endereços e orientações sobre saúde pública, resgate e animais em situação de rua.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">ONGs e proteção animal</h3>
              <p className="text-[11px] text-slate-300">
                Projetos de adoção, lares temporários e feiras de adoção na Região dos Lagos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Dicas de bem-estar pet</h3>
              <p className="text-[11px] text-slate-300">
                Em breve, conteúdos especiais sobre alimentação, comportamento e cuidados gerais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daqui pra baixo entra só o footer global */}
    </main>
  );
}

