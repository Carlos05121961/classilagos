"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function TurismoPage() {
  // Imagens do hero de Turismo
  const heroImages = [
    "/turismo/hero-turismo01.jpg",
    "/turismo/hero-turismo02.jpg",
    "/turismo/hero-turismo03.jpg",
    "/turismo/hero-turismo04.jpg",
    "/turismo/hero-turismo05.jpg",
    "/turismo/hero-turismo06.jpg",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  // Anúncios de turismo
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ROTATIVO DO HERO
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000); // troca a cada 6 segundos

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Carrega anúncios de turismo
  useEffect(() => {
    const fetchTurismo = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, pilar_turismo, subcategoria_turismo, preco, faixa_preco, imagens, destaque, created_at"
        )
        .eq("categoria", "turismo")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Erro ao carregar anúncios de turismo:", error);
        setErro("Não foi possível carregar os anúncios de turismo no momento.");
        setLoading(false);
        return;
      }

      setAnuncios(data || []);
      setLoading(false);
    };

    fetchTurismo();
  }, []);

  const destaques = anuncios.filter((a) => a.destaque);
  const recentes = anuncios.filter((a) => !a.destaque);

  const labelPilar: Record<string, string> = {
    onde_ficar: "Onde ficar",
    onde_comer: "Onde comer",
    onde_se_divertir: "Onde se divertir",
    onde_passear: "Onde passear",
    servicos_turismo: "Serviços de turismo",
    produtos_turisticos: "Produtos turísticos",
    outros: "Turismo / serviços",
  };

  const labelSubcategoria = (sub?: string | null) => {
    if (!sub) return "";
    return sub
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  // Cards do GUIA ONDE (ícone já com o texto "Onde ficar", etc.)
  const guiaOndeCards = [
    {
      key: "onde_ficar",
      icon: "/turismo/onde-ficar.png",
      desc: "Pousadas, hotéis, hostels, casas de temporada e camping.",
      href: "/turismo?secao=onde_ficar",
    },
    {
      key: "onde_comer",
      icon: "/turismo/onde-comer.png",
      desc: "Bares, restaurantes, quiosques, pizzarias, hamburguerias.",
      href: "/turismo?secao=onde_comer",
    },
    {
      key: "onde_se_divertir",
      icon: "/turismo/onde-se-divertir.png",
      desc: "Casas de show, música ao vivo, baladas, pubs, eventos.",
      href: "/turismo?secao=onde_se_divertir",
    },
    {
      key: "onde_passear",
      icon: "/turismo/onde-passear.png",
      desc: "Passeios de barco, buggy, trilhas, city tour, mergulho.",
      href: "/turismo?secao=onde_passear",
    },
    {
      key: "cartoes_postais",
      icon: "/turismo/cartoes-postais.png",
      desc: "Envie cartões postais digitais da Região dos Lagos para quem você ama.",
      href: "/turismo/cartoes-postais",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO (MESMO PADRÃO DAS OUTRAS PÁGINAS) */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO TURISMO – CARROSSEL DE IMAGENS */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Turismo"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          {/* leve escurecida pra destacar o texto */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Turismo
            </h1>
            <p className="mt-3 text-sm md:text-base max-w-2xl drop-shadow">
              Descubra o melhor da Região dos Lagos em um só lugar.
            </p>
          </div>
        </div>
      </section>

      {/* GUIA ONDE – PILARES DO TURISMO */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          {/* Logo + textos */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Image
                src="/turismo/guia-onde.png"
                alt="Guia ONDE – Turismo Classilagos"
                width={52}
                height={52}
                className="w-12 h-12 rounded-2xl drop-shadow"
              />
              <h2 className="text-sm md:text-base font-semibold text-slate-900">
                GUIA ONDE – Turismo Classilagos
              </h2>
            </div>
            <p className="text-[11px] md:text-xs text-slate-600 max-w-2xl">
              Escolha por tipo de experiência e encontre lugares para se
              hospedar, comer, passear e se divertir em toda a Região dos
              Lagos.
            </p>
          </div>

          {/* Seleção de cidade (ilustrativa por enquanto) */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-600">
              Cidade
            </label>
            <select className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-800">
              <option>Toda a região</option>
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
        </div>

        {/* Grid dos 5 cards GUIA ONDE */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {guiaOndeCards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-20 h-20 flex items-center justify-center">
                  <Image
                    src={card.icon}
                    alt="Guia ONDE"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-600 flex-1 mb-3 text-center">
                {card.desc}
              </p>
              <button
                type="button"
                className="mt-auto inline-flex items-center justify-center rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700"
              >
                Ver opções
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* ESPAÇO */}
      <div className="h-4 sm:h-6" />

      {/* DESTAQUES DE TURISMO */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Destaques de turismo
          </h2>
          <span className="text-[11px] text-slate-500">
            Anúncios com mais destaque aparecem primeiro.
          </span>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3 mb-3">
            {erro}
          </div>
        )}

        {loading ? (
          <p className="text-[11px] text-slate-500">
            Carregando anúncios de turismo…
          </p>
        ) : anuncios.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            Ainda não há anúncios de turismo publicados. Aproveite a fase de
            lançamento para ser um dos primeiros a aparecer aqui!
          </p>
        ) : destaques.length === 0 ? (
          <p className="text-[11px] text-slate-500 mb-2">
            Quando houver anúncios em destaque, eles aparecerão aqui no topo.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {destaques.map((anuncio) => {
              const imagemCapa =
                anuncio.imagens && anuncio.imagens.length > 0
                  ? anuncio.imagens[0]
                  : null;
              const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

              return (
                <Link
                  key={anuncio.id}
                  href={`/turismo/anuncio/${anuncio.id}`}
                  className="group rounded-3xl border border-amber-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="h-36 bg-slate-100 overflow-hidden relative">
                    {imagemCapa && (
                      <img
                        src={imagemCapa}
                        alt={anuncio.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                      />
                    )}
                    <span className="absolute top-2 left-2 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold text-white shadow">
                      Destaque
                    </span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {labelPilar[anuncio.pilar_turismo] || "Turismo"} •{" "}
                        {labelSubcategoria(anuncio.subcategoria_turismo)}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>
                      {precoExibicao && (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          {precoExibicao}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                      Publicado em{" "}
                      {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ÚLTIMOS ANÚNCIOS DE TURISMO */}
      {!loading && anuncios.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-900">
              Últimos anúncios de turismo
            </h2>
            <span className="text-[11px] text-slate-500">
              Em breve: filtros por cidade e por tipo de experiência.
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(recentes.length > 0 ? recentes : anuncios).map((anuncio) => {
              const imagemCapa =
                anuncio.imagens && anuncio.imagens.length > 0
                  ? anuncio.imagens[0]
                  : null;
              const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

              return (
                <Link
                  key={anuncio.id}
                  href={`/turismo/anuncio/${anuncio.id}`}
                  className="group rounded-3xl border border-slate-200 bg-white hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="h-28 bg-slate-100 overflow-hidden">
                    {imagemCapa && (
                      <img
                        src={imagemCapa}
                        alt={anuncio.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition"
                      />
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {labelPilar[anuncio.pilar_turismo] || "Turismo"}
                      </p>
                      <h3 className="text-xs font-semibold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>
                      {precoExibicao && (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          {precoExibicao}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA ANUNCIAR NO TURISMO */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-8 px-4 text-center text-xs sm:text-sm text-slate-600">
          Em breve, o Classilagos Turismo será o grande guia da região, com
          pousadas, hotéis, bares, restaurantes, passeios, eventos, guias e
          muito mais em todas as cidades.
          <br />
          <span className="font-semibold">
            Aproveite a fase de lançamento para anunciar gratuitamente e ganhar
            destaque desde o início.
          </span>
          <div className="mt-4">
            <Link
              href="/anunciar/turismo"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anunciar no turismo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

