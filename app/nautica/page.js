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
          "id, titulo, cidade, bairro, preco, imagens, subcategoria_nautica, finalidade_nautica"
        )
        .eq("categoria", "nautica")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(12);

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

  const categoriasLinha1 = [
    { nome: "Lanchas e veleiros à venda" },
    { nome: "Jetski, stand-up & caiaques" },
    { nome: "Barcos de pesca" },
    { nome: "Motores & equipamentos" },
  ];

  const categoriasLinha2 = [
    { nome: "Aluguel de embarcações" },
    { nome: "Marinas & guardarias" },
    { nome: "Serviços náuticos" },
    { nome: "Peças & acessórios" },
  ];

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

  {/* HERO – FOTO + TEXTO (versão sem degradê e com sombra no texto) */}
<section className="relative w-full">
  <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">

    {/* Foto do Hero */}
    <Image
      key={heroImages[currentHero]}
      src={heroImages[currentHero]}
      alt="Classilagos Náutica"
      fill
      priority
      sizes="100vw"
      className="object-cover transition-opacity duration-700"
    />

    {/* TEXTO COM SOMBRA FORTES (estilo profissional) */}
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">

      <p
        className="
          text-xs sm:text-sm md:text-base font-medium mb-2 max-w-2xl
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
          shadow-black
        "
      >
        Encontre lanchas, veleiros, jetski, motores e serviços náuticos
        em toda a Região dos Lagos.
      </p>

      <h1
        className="
          mt-1 text-3xl md:text-4xl font-extrabold tracking-tight
          drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]
          shadow-black
        "
      >
        Classilagos – Náutica
      </h1>
    </div>
  </div>
</section>


      {/* CAIXA DE BUSCA FORA DA FOTO */}
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

              {/* Tipo de embarcação */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Lancha</option>
                  <option>Veleiro</option>
                  <option>Jetski</option>
                  <option>Barco de pesca</option>
                  <option>Stand-up / Caiaque</option>
                  <option>Vaga em marina</option>
                  <option>Serviços náuticos</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              {/* Botão (ainda fake) */}
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

      {/* CATEGORIAS FIXAS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        {/* LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white"
            >
              <div className="h-24 md:h-28 w-full relative">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#38bdf8,_transparent_60%)]" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>
              <div className="px-3 py-2 text-xs md:text-sm font-semibold flex items-center gap-2">
                <span className="text-base">⚓</span>
                <span>{cat.nome}</span>
              </div>
            </div>
          ))}
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categoriasLinha2.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-gradient-to-br from-sky-800 via-sky-700 to-slate-900 text-white"
            >
              <div className="h-24 md:h-28 w-full relative">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom,_#0ea5e9,_transparent_60%)]" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>
              <div className="px-3 py-2 text-xs md:text-sm font-semibold flex items-center gap-2">
                <span className="text-base">🌊</span>
                <span>{cat.nome}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANÚNCIOS REAIS DE NÁUTICA */}
      <section className="bg-white pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              Embarcações e anúncios náuticos
            </h2>
            <span className="text-[11px] text-slate-500">
              {loadingAnuncios
                ? "Carregando anúncios..."
                : anuncios.length === 0
                ? "Nenhum anúncio cadastrado ainda."
                : `${anuncios.length} anúncio(s) encontrado(s)`}
            </span>
          </div>

          {loadingAnuncios && (
            <div className="text-xs text-slate-500">Buscando anúncios…</div>
          )}

          {!loadingAnuncios && anuncios.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              Ainda não há anúncios de náutica cadastrados.
              <br />
              <Link
                href="/anunciar"
                className="inline-flex mt-3 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Seja o primeiro a anunciar sua embarcação
              </Link>
            </div>
          )}

          {!loadingAnuncios && anuncios.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {anuncios.map((item) => {
                const img =
                  Array.isArray(item.imagens) && item.imagens.length > 0
                    ? item.imagens[0]
                    : null;

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
                      {item.finalidade_nautica && (
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          {item.finalidade_nautica}
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

      {/* LINKS ÚTEIS */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Links úteis para quem navega
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Capitania dos Portos
              </p>
              <p className="text-[12px] text-slate-600">
                Normas de navegação, segurança e documentação de embarcações.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Previsão do tempo &amp; maré
              </p>
              <p className="text-[12px] text-slate-600">
                Consulte vento, ondas e condições do mar antes de sair.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Passeios turísticos
              </p>
              <p className="text-[12px] text-slate-600 mb-1">
                Escunas, mergulho e passeios regulares estão na área de Turismo.
              </p>
              <Link
                href="/turismo"
                className="text-[12px] text-sky-700 font-semibold hover:underline"
              >
                Ver seção de Turismo &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 border border-slate-800 px-6 py-7 text-center text-white">
            <p className="text-sm font-semibold mb-1">
              Quer anunciar sua embarcação ou serviço náutico?
            </p>
            <p className="text-xs text-sky-100 mb-4">
              Divulgue sua lancha, veleiro, jetski, motores, vagas em marinas
              ou serviços especializados no Classilagos. Anúncios gratuitos na
              fase de lançamento.
            </p>

            <Link
              href="/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Anuncie na Náutica grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
