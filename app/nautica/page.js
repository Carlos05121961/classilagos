"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/nautica/lancha-01.jpg",
  "/nautica/lancha-02.jpg",
  "/nautica/lancha-03.jpg",
];

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

const tiposEmbarcacao = [
  "Lancha",
  "Veleiro",
  "Jetski",
  "Barco de pesca",
  "Stand-up / Caiaque",
  "Vaga em marina",
  "Serviços náuticos",
];

// CATEGORIAS -> slug + href (para /nautica/lista)
const categoriasLinha1 = [
  {
    nome: "Lanchas e veleiros à venda",
    slug: "lanchas-veleiros-venda",
    href: "/nautica/lista?finalidade=venda",
  },
  {
    nome: "Jetski, stand-up & caiaques",
    slug: "jetski-caiaques",
    href: "/nautica/lista?tipo=Jetski",
  },
  {
    nome: "Barcos de pesca",
    slug: "barcos-pesca",
    href: "/nautica/lista?tipo=Barco%20de%20pesca",
  },
  {
    nome: "Motores & equipamentos",
    slug: "motores-equipamentos",
    href: "/nautica/lista?tipo=Outros",
  },
];

const categoriasLinha2 = [
  {
    nome: "Aluguel de embarcações",
    slug: "aluguel-embarcacoes",
    href: "/nautica/lista?finalidade=aluguel",
  },
  {
    nome: "Marinas & guardarias",
    slug: "marinas-guardarias",
    href: "/nautica/lista?tipo=Vaga%20em%20marina",
  },
  {
    nome: "Serviços náuticos",
    slug: "servicos-nauticos",
    href: "/nautica/lista?tipo=Serviços%20náuticos",
  },
  {
    nome: "Peças & acessórios",
    slug: "pecas-acessorios",
    href: "/nautica/lista?tipo=Outros",
  },
];

export default function NauticaPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  // Troca de foto do hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios de náutica no Supabase
  useEffect(() => {
    const fetchAnuncios = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, preco, imagens, subcategoria_nautica, finalidade_nautica, destaque"
        )
        .eq("categoria", "nautica")
        // <<< REMOVEMOS o filtro .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(40);

      if (error) {
        console.error("Erro ao carregar anúncios de náutica:", error);
        setAnuncios([]);
      } else {
        setAnuncios(data || []);
      }
      setLoadingAnuncios(false);
    };

    fetchAnuncios();
  }, []);

  // Escolhe um anúncio para representar cada card de categoria
  function escolherAnuncioParaCard(slug) {
    if (!anuncios || anuncios.length === 0) return null;

    let filtrados = [...anuncios];

    switch (slug) {
      case "lanchas-veleiros-venda":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          const fin = (a.finalidade_nautica || "").toLowerCase();
          return (
            fin === "venda" &&
            (sub.includes("lancha") || sub.includes("veleiro"))
          );
        });
        break;

      case "jetski-caiaques":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          return (
            sub.includes("jet") ||
            sub.includes("ski") ||
            sub.includes("stand-up") ||
            sub.includes("stand up") ||
            sub.includes("caiaque")
          );
        });
        break;

      case "barcos-pesca":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          return sub.includes("pesca");
        });
        break;

      case "motores-equipamentos":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          return sub.includes("motor") || sub.includes("equip");
        });
        break;

      case "aluguel-embarcacoes":
        filtrados = filtrados.filter((a) => {
          const fin = (a.finalidade_nautica || "").toLowerCase();
          return fin === "aluguel";
        });
        break;

      case "marinas-guardarias":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          return sub.includes("marina") || sub.includes("guardaria");
        });
        break;

      case "servicos-nauticos":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          return (
            sub.includes("serviço") ||
            sub.includes("servico") ||
            sub.includes("manutenção") ||
            sub.includes("manutencao") ||
            sub.includes("reforma")
          );
        });
        break;

      case "pecas-acessorios":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_nautica || "").toLowerCase();
          return (
            sub.includes("peça") ||
            sub.includes("peca") ||
            sub.includes("acess")
          );
        });
        break;

      default:
        break;
    }

    if (filtrados.length === 0) return null;

    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  // Lista de destaques – até 12 anúncios
  const destaques = (() => {
    if (!anuncios || anuncios.length === 0) return [];
    const soDestaques = anuncios.filter((a) => a.destaque === true);
    if (soDestaques.length > 0) return soDestaques.slice(0, 12);
    return anuncios.slice(0, 12);
  })();

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie na Náutica - Classilagos"
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
            alt="Classilagos Náutica"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-xs sm:text-sm md:text-base font-medium mb-2 max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Encontre lanchas, veleiros, jetski, motores e serviços náuticos
              em toda a Região dos Lagos.
            </p>

            <h1 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
              Classilagos – Náutica
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA (ainda estática) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: lancha 30 pés, jetski, vaga em marina"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Tipo */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Todos</option>
                  {tiposEmbarcacao.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão fake */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará ligada aos anúncios reais da plataforma.
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* CATEGORIAS – CARDS COM FOTO E LINK PARA /nautica/lista */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        {/* LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa = imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="relative h-24 md:h-28 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, anúncios aqui
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">
                    {cat.nome}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categoriasLinha2.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa = imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="relative h-24 md:h-28 w-full bg-slate-400 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-700">
                      Em breve, anúncios aqui
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">
                    {cat.nome}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* EMBARCAÇÕES EM DESTAQUE – até 12 anúncios */}
      <section className="bg-white pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              Embarcações e anúncios náuticos
            </h2>
            <span className="text-[11px] text-slate-500">
              {loadingAnuncios
                ? "Carregando anúncios..."
                : destaques.length === 0
                ? "Nenhum anúncio cadastrado ainda."
                : `${destaques.length} anúncio(s)`}
            </span>
          </div>

          {loadingAnuncios && (
            <p className="text-xs text-slate-500">Buscando anúncios…</p>
          )}

          {!loadingAnuncios && destaques.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              Ainda não há anúncios de náutica cadastrados.
              <br />
              <Link
                href="/anunciar?tipo=nautica"
                className="inline-flex mt-3 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Seja o primeiro a anunciar sua embarcação
              </Link>
            </div>
          )}

          {!loadingAnuncios && destaques.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {destaques.map((item) => {
                const img =
                  Array.isArray(item.imagens) && item.imagens.length > 0
                    ? item.imagens[0]
                    : null;

                const finalidadeLabel = item.finalidade_nautica || "";

                return (
                  <Link
                    key={item.id}
                    href={`/anuncios/${item.id}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                  >
                    {img ? (
                      <div className="w-full h-28 md:h-32 overflow-hidden bg-slate-200">
                        <img
                          src={img}
                          alt={item.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-28 md:h-32 bg-gradient-to-br from-sky-900 to-slate-900 flex items-center justify-center text-[11px] text-sky-100">
                        Sem foto
                      </div>
                    )}

                    <div className="px-3 py-2 space-y-1">
                      <p className="font-semibold leading-snug line-clamp-2 text-slate-900">
                        {item.titulo}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {item.subcategoria_nautica
                          ? `${item.subcategoria_nautica} · `
                          : ""}
                        {item.cidade}
                        {item.bairro ? ` • ${item.bairro}` : ""}
                      </p>
                      {item.preco && (
                        <p className="text-[11px] font-semibold text-emerald-700">
                          {item.preco}
                        </p>
                      )}
                      {finalidadeLabel && (
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          {finalidadeLabel}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SERVIÇOS E INFORMAÇÕES PARA NÁUTICA – rodapé da página */}
      <section className="bg-slate-950 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-base md:text-lg font-semibold mb-2">
            Serviços e informações para náutica
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mb-6 max-w-3xl">
            Use o Classilagos também como guia para entender documentação,
            segurança, marinas e serviços importantes na hora de comprar,
            manter ou alugar uma embarcação na Região dos Lagos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs md:text-sm">
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-4">
              <p className="font-semibold mb-1">Documentação da embarcação</p>
              <p className="text-slate-300 text-[12px] leading-snug">
                Em breve, links para Capitania dos Portos, registro de
                embarcações, vistoria e normas de segurança.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-4">
              <p className="font-semibold mb-1">Habilitação náutica</p>
              <p className="text-slate-300 text-[12px] leading-snug">
                Informações sobre Arrais, Mestre e Motonauta, cursos e
                procedimentos para obter a carteira.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-4">
              <p className="font-semibold mb-1">Marinas e estrutura</p>
              <p className="text-slate-300 text-[12px] leading-snug">
                Em breve, integração com LagoListas para encontrar marinas,
                guardarias, vagas secas e molhadas em toda a região.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-4">
              <p className="font-semibold mb-1">Serviços para sua embarcação</p>
              <p className="text-slate-300 text-[12px] leading-snug">
                Oficinas mecânicas, elétrica náutica, lavagem, pintura e outros
                serviços especializados próximos a você.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
