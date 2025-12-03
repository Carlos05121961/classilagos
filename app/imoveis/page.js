"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/imoveis/imovel-01.jpg",
  "/imoveis/imovel-02.jpg",
  "/imoveis/imovel-03.jpg",
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

const tiposImovel = [
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

// Cards da primeira faixa
const categoriasLinha1 = [
  { nome: "Casas à venda", slug: "casas-venda" },
  { nome: "Apartamentos à venda", slug: "apartamentos-venda" },
  { nome: "Lançamentos", slug: "lancamentos" },
  { nome: "Oportunidades", slug: "oportunidades" },
];

// Cards da segunda faixa
const categoriasLinha2 = [
  { nome: "Aluguel residencial", slug: "aluguel-residencial" },
  { nome: "Aluguel comercial", slug: "aluguel-comercial" },
  { nome: "Temporada", slug: "temporada" },
  { nome: "Terrenos & Lotes", slug: "terrenos-lotes" },
];

export default function ImoveisPage() {
  const [currentHero, setCurrentHero] = useState(0);

  // Lista geral de imóveis para montar tudo (cards + destaques)
  const [imoveis, setImoveis] = useState([]);
  const [loadingImoveis, setLoadingImoveis] = useState(true);

  // Rotação das imagens do hero
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  // Busca TODOS os imóveis (até 40) para montar cards e destaques
  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoadingImoveis(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "imoveis")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(40);

        if (error) {
          console.error("Erro ao buscar imóveis:", error);
        } else {
          setImoveis(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao buscar imóveis:", e);
      } finally {
        setLoadingImoveis(false);
      }
    }

    fetchImoveis();
  }, []);

  // Escolhe um anúncio para representar cada card de categoria
  function escolherAnuncioParaCard(slug) {
    if (!imoveis || imoveis.length === 0) return null;

    let filtrados = [...imoveis];

    switch (slug) {
      case "casas-venda":
        filtrados = filtrados.filter(
          (a) =>
            a.finalidade === "venda" &&
            (a.tipo_imovel === "Casa" || a.tipo_imovel === "casa")
        );
        break;

      case "apartamentos-venda":
        filtrados = filtrados.filter(
          (a) =>
            a.finalidade === "venda" &&
            (a.tipo_imovel === "Apartamento" ||
              a.tipo_imovel === "apartamento")
        );
        break;

      case "lancamentos": {
        // Lançamento = anúncios mais recentes (ex.: últimos 30 dias)
        const agora = new Date();
        const trintaDiasAtras = new Date(
          agora.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        filtrados = filtrados.filter((a) => {
          if (!a.created_at) return false;
          const criado = new Date(a.created_at);
          return criado >= trintaDiasAtras;
        });
        break;
      }

      case "oportunidades":
        // Por enquanto: qualquer imóvel em destaque entra como oportunidade
        filtrados = filtrados.filter((a) => a.destaque === true);
        break;

      case "aluguel-residencial":
        filtrados = filtrados.filter(
          (a) =>
            a.finalidade === "aluguel" &&
            a.tipo_imovel &&
            a.tipo_imovel.toLowerCase() !== "comercial"
        );
        break;

      case "aluguel-comercial":
        filtrados = filtrados.filter(
          (a) =>
            a.finalidade === "aluguel" &&
            a.tipo_imovel &&
            a.tipo_imovel.toLowerCase().includes("comercial")
        );
        break;

      case "temporada":
        filtrados = filtrados.filter((a) => a.finalidade === "temporada");
        break;

      case "terrenos-lotes":
        filtrados = filtrados.filter(
          (a) =>
            a.tipo_imovel &&
            a.tipo_imovel.toLowerCase().includes("terreno")
        );
        break;

      default:
        break;
    }

    if (filtrados.length === 0) return null;

    // Prioriza um anúncio em destaque dentro dessa categoria
    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  // Lista de destaques para a seção "Imóveis em destaque"
  const listaDestaques = (() => {
    if (!imoveis || imoveis.length === 0) return [];
    const soDestaques = imoveis.filter((a) => a.destaque === true);
    if (soDestaques.length > 0) return soDestaques.slice(0, 8);
    return imoveis.slice(0, 8);
  })();

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu IMÓVEL totalmente GRÁTIS - Classilagos"
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
            alt="Classilagos Imóveis"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
        </div>

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-sm md:text-base font-medium drop-shadow">
            Encontre casas, apartamentos, terrenos e oportunidades imobiliárias
            em toda a Região dos Lagos.
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
            Classilagos – Imóveis
          </h1>
        </div>
      </section>

      {/* CAIXA DE BUSCA (ainda estática, mas já no padrão) */}
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
                  placeholder="Ex.: casa 2 quartos, frente para a lagoa"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos</option>
                  {tiposImovel.map((t) => (
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
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
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

      {/* CATEGORIAS + DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {/* CATEGORIAS LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa =
              imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={`/imoveis/lista`}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, imóveis aqui
                    </div>
                  )}
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

        {/* CATEGORIAS LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa =
              imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={`/imoveis/lista`}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-400 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-700">
                      Em breve, imóveis aqui
                    </div>
                  )}
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

        {/* IMÓVEIS EM DESTAQUE – anúncios reais do Supabase */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Imóveis em destaque
          </h2>

          {loadingImoveis ? (
            <p className="text-xs text-slate-500">
              Carregando imóveis em destaque...
            </p>
          ) : listaDestaques.length === 0 ? (
            <p className="text-xs text-slate-500">
              Ainda não há imóveis cadastrados. Seja o primeiro a anunciar!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {listaDestaques.map((anuncio) => {
                const href = `/anuncios/${anuncio.id}`;
                const imagens = Array.isArray(anuncio.imagens)
                  ? anuncio.imagens
                  : [];
                const capa =
                  imagens.length > 0 ? imagens[0] : "/imoveis/sem-foto.jpg";

                return (
                  <Link
                    key={anuncio.id}
                    href={href}
                    className="group block overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    <div className="relative h-24 md:h-28 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={capa}
                        alt={anuncio.titulo || "Imóvel"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] md:text-xs font-semibold line-clamp-2">
                        {anuncio.titulo}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        {anuncio.cidade}{" "}
                        {anuncio.bairro ? `• ${anuncio.bairro}` : ""}
                      </p>
                      {anuncio.preco && (
                        <p className="mt-1 text-[11px] text-emerald-200 font-semibold">
                          {anuncio.preco}
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

      {/* NOVA FAIXA – SERVIÇOS E INFORMAÇÕES PARA IMÓVEIS */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">
            Serviços e informações para imóveis
          </h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para entender tributos, documentos
            e serviços importantes na hora de comprar, vender ou alugar um
            imóvel na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                IPTU e tributos
              </h3>
              <p className="text-[11px] text-slate-300">
                Em breve, links diretos para consultar IPTU, taxas municipais e
                informações das prefeituras da região.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Financiamento imobiliário
              </h3>
              <p className="text-[11px] text-slate-300">
                Dicas básicas sobre crédito, simulações e contato com bancos
                para financiar seu imóvel.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Regularização e documentos
              </h3>
              <p className="text-[11px] text-slate-300">
                Orientações sobre escritura, registro em cartório, habite-se e
                outros documentos essenciais.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Serviços para o seu imóvel
              </h3>
              <p className="text-[11px] text-slate-300">
                Em breve, integração com o LagoListas para você encontrar
                arquitetos, pedreiros, eletricistas e outros profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

