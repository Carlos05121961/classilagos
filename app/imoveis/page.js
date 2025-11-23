"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient"; // 👈 usa o client que já existe

// Hero com 3 imagens padrão (já renomeadas na /public/imoveis)
const heroImages = [
  "/imoveis/imovel-01.jpg",
  "/imoveis/imovel-02.jpg",
  "/imoveis/imovel-03.jpg",
];

export default function ImoveisPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [destaques, setDestaques] = useState([]);

  // Rotação do hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios reais de imóveis no Supabase
  useEffect(() => {
    const fetchDestaques = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "imoveis")
        .limit(4);

      if (!error && data) {
        setDestaques(data);
      } else {
        console.error("Erro ao buscar anúncios de imóveis:", error);
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

      {/* HERO – FOTO + TEXTO */}
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

      {/* CAIXA DE BUSCA */}
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
                  placeholder="Ex.: casa 2 quartos, frente para o mar"
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
                  <option>Terreno</</option>
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

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {/* LINHA 1 */}
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

        {/* LINHA 2 */}
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

        {/* DESTAQUES – com anúncios reais se existirem */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {(destaques.length > 0 ? destaques : [1, 2, 3, 4]).map(
            (item, idx) => {
              const anuncio = typeof item === "number" ? null : item;
              const href = anuncio ? `/anuncio/${anuncio.id}` : "/anunciar";

              return (
                <Link
                  key={anuncio ? anuncio.id : idx}
                  href={href}
                  className="group block overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <div className="h-28 md:h-32 w-full bg-emerald-800" />
                  <div className="bg-slate-900 text-white px-3 py-2">
                    <p className="text-xs md:text-sm font-semibold">
                      {anuncio?.titulo || "Imóvel destaque"}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {anuncio?.cidade || "Região dos Lagos"}
                    </p>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="bg-white pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 flex items-center justify-center bg-yellow-300 text-slate-900 text-xl font-bold rounded-md"
              >
                Notícias
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Links úteis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">IPTU</p>
              <p className="text-[12px] text-slate-600">
                Consulta de IPTU, emissão de guias e informações por cidade.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Legalização de imóveis
              </p>
              <p className="text-[12px] text-slate-600">
                Orientações sobre obras, habite-se, licenças e regularização.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Registro &amp; cartórios
              </p>
              <p className="text-[12px] text-slate-600">
                Informações sobre escritura, registro de imóveis e cartórios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OFERTAS MERCADO LIVRE */}
      <section className="bg-white py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Ofertas para sua casa no Mercado Livre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <a
              href="https://www.mercadolivre.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <p className="font-semibold text-slate-900 text-sm">
                Kit ferramentas
              </p>
              <p className="text-[12px] text-slate-600">
                Ferramentas para reparos e melhorias no imóvel.
              </p>
            </a>
            <a
              href="https://www.mercadolivre.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <p className="font-semibold text-slate-900 text-sm">
                Materiais de construção
              </p>
              <p className="text-[12px] text-slate-600">
                Tintas, pisos, iluminação e muito mais.
              </p>
            </a>
            <a
              href="https://www.mercadolivre.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <p className="font-semibold text-slate-900 text-sm">
                Móveis &amp; decoração
              </p>
              <p className="text-[12px] text-slate-600">
                Deixe seu novo imóvel com a sua cara.
              </p>
            </a>
            <a
              href="https://www.mercadolivre.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <p className="font-semibold text-slate-900 text-sm">
                Eletrodomésticos
              </p>
              <p className="text-[12px] text-slate-600">
                Geladeira, fogão, máquina de lavar e muito mais.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-slate-100 border border-slate-200 px-6 py-7 text-center">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Quer anunciar seu imóvel?
            </p>
            <p className="text-xs text-slate-700 mb-4">
              Divulgue casas, apartamentos, terrenos e pontos comerciais no
              Classilagos. Anúncios gratuitos na fase de lançamento.
            </p>

            <Link
              href="/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anuncie seu imóvel grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
