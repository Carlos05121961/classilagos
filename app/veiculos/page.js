"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/veiculos/carro-01.jpg",
  "/veiculos/carro-02.jpg",
  "/veiculos/carro-03.jpg",
];

export default function VeiculosPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [veiculos, setVeiculos] = useState([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);

  // ROTATIVO DO HERO
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // BUSCAR ANÚNCIOS DE VEÍCULOS NO SUPABASE
  useEffect(() => {
    const fetchVeiculos = async () => {
      setLoadingVeiculos(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select("id, titulo, cidade, bairro, preco, imagens")
        .eq("categoria", "veiculos")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Erro ao buscar veículos:", error);
        setVeiculos([]);
      } else {
        setVeiculos(data || []);
      }

      setLoadingVeiculos(false);
    };

    fetchVeiculos();
  }, []);

  const categoriasLinha1 = [
    { nome: "Carros à venda" },
    { nome: "Motos à venda" },
    { nome: "Seminovos" },
    { nome: "Oportunidades" },
  ];

  const categoriasLinha2 = [
    { nome: "0 km" },
    { nome: "Financiados" },
    { nome: "Consignados" },
    { nome: "Loja / Revenda" },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu veículo totalmente GRÁTIS - Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO – SÓ FOTO + TEXTO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Veículos"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre carros, motos, caminhões e oportunidades em toda a Região
              dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Veículos
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
                  placeholder="Ex.: carro 1.0 completo, moto 150cc"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Carro</option>
                  <option>Moto</option>
                  <option>Caminhonete</option>
                  <option>Caminhão</option>
                  <option>Utilitário</option>
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
            Em breve, essa busca estará ligada aos anúncios reais da
            plataforma.
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

        {/* VEÍCULOS EM DESTAQUE (DINÂMICO DO SUPABASE) */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Veículos em destaque
          </h2>
          {/* Futuramente: botão "ver todos" */}
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {loadingVeiculos && veiculos.length === 0 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl shadow border border-slate-200"
                >
                  <div className="h-28 md:h-32 w-full bg-slate-200 animate-pulse" />
                  <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                    Carregando...
                  </div>
                </div>
              ))}
            </>
          )}

          {!loadingVeiculos && veiculos.length === 0 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl shadow border border-slate-200"
                >
                  <div className="h-28 md:h-32 w-full bg-emerald-800" />
                  <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                    Veículo destaque
                  </div>
                </div>
              ))}
            </>
          )}

          {veiculos.length > 0 &&
            veiculos.map((carro) => {
              const img =
                Array.isArray(carro.imagens) && carro.imagens.length > 0
                  ? carro.imagens[0]
                  : null;

              return (
                <Link
                  key={carro.id}
                  href={`/anuncios/${carro.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    {img ? (
                      <Image
                        src={img}
                        alt={carro.titulo}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2">
                    <p className="text-[11px] font-semibold line-clamp-2 uppercase">
                      {carro.titulo}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-200">
                      {carro.cidade}
                      {carro.bairro ? ` • ${carro.bairro}` : ""}
                    </p>
                    {carro.preco && (
                      <p className="mt-1 text-[11px] font-bold text-emerald-300">
                        R$ {carro.preco}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
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
              <p className="font-semibold text-slate-900 text-sm">Detran</p>
              <p className="text-[12px] text-slate-600">
                Consultas de veículo, multas e documentos.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">IPVA</p>
              <p className="text-[12px] text-slate-600">
                Informações sobre IPVA e pagamentos.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Seguros &amp; proteção
              </p>
              <p className="text-[12px] text-slate-600">
                Proteção veicular, seguros e assistência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-slate-100 border border-slate-200 px-6 py-7 text-center">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Quer anunciar seu veículo?
            </p>
            <p className="text-xs text-slate-700 mb-4">
              Venda seu carro, moto ou utilitário rapidamente no Classilagos.
              Anúncios gratuitos na fase de lançamento.
            </p>

            <Link
              href="/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anuncie seu veículo grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
