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

export default function ImoveisPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [destaques, setDestaques] = useState([]);

  // Rotação das imagens do hero
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  // Busca os anúncios da categoria "imoveis"
  useEffect(() => {
    const fetchDestaques = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "imoveis")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Erro ao buscar anúncios de imóveis:", error);
      } else {
        setDestaques(data || []);
      }
    };

    fetchDestaques();
  }, []);

  const categoriasLinha1 = [
    { nome: "Casas à venda" },
    { nome: "Apartamentos à venda" },
    { nome: "Lançamentos" },
    { nome: "Oportunidades" },
  ];

  const categoriasLinha2 = [
    { nome: "Aluguel residencial" },
    { nome: "Aluguel comercial" },
    { nome: "Temporada" },
    { nome: "Terrenos & Lotes" },
  ];

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
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre casas, apartamentos, terrenos e oportunidades
              imobiliárias em toda a Região dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Imóveis
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
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Terreno</option>
                  <option>Comercial</option>
                  <option>Sítio / Chácara</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
          {categoriasLinha1.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100"
            >
              <div className="h-32 md:h-36 w-full bg-slate-300" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        {/* CATEGORIAS LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100"
            >
              <div className="h-32 md:h-36 w-full bg-slate-400" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        {/* IMÓVEIS EM DESTAQUE – anúncios reais do Supabase */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Imóveis em destaque
          </h2>

          {destaques.length === 0 ? (
            <p className="text-xs text-slate-500">
              Ainda não há imóveis cadastrados. Seja o primeiro a anunciar!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {destaques.map((anuncio) => {
                const href = `/anuncios/${anuncio.id}`;
                const imagens = Array.isArray(anuncio.imagens)
                  ? anuncio.imagens
                  : [];

                // 👇 AQUI ENTRA A MUDANÇA:
                // se não tiver imagem, usa /imoveis/sem-foto.jpg
                const capa =
                  imagens.length > 0 ? imagens[0] : "/imoveis/sem-foto.jpg";

                return (
                  <Link
                    key={anuncio.id}
                    href={href}
                    className="group block overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    {/* Capa com foto (ou sem-foto) */}
                    <div className="relative h-24 md:h-28 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={capa}
                        alt={anuncio.titulo || "Imóvel"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Título + cidade */}
                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] md:text-xs font-semibold line-clamp-2">
                        {anuncio.titulo}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        {anuncio.cidade}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Aqui você pode manter/voltar a ter Notícias, Links úteis e chamada final,
          como já existia antes, se quiser. */}
    </main>
  );
}
