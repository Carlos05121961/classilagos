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

  // CATEGORIAS QUE VÃO APONTAR PARA /veiculos/lista
  const categoriasLinha1 = [
    {
      nome: "Carros à venda",
      href: "/veiculos/lista?tipo=Carro",
    },
    {
      nome: "Motos à venda",
      href: "/veiculos/lista?tipo=Moto",
    },
    {
      nome: "Seminovos",
      href: "/veiculos/lista?condicao=seminovo",
    },
    {
      nome: "Oportunidades",
      href: "/veiculos/lista", // por enquanto mostra todos
    },
  ];

  const categoriasLinha2 = [
    {
      nome: "0 km",
      href: "/veiculos/lista?condicao=0km",
    },
    {
      nome: "Financiados",
      href: "/veiculos/lista?financiado=1",
    },
    {
      nome: "Consignados",
      href: "/veiculos/lista?consignado=1",
    },
    {
      nome: "Loja / Revenda",
      href: "/veiculos/lista?loja=1",
    },
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
            <Link
              key={cat.nome}
              href={cat.href}
              className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
            >
              <div className="h-32 md:h-36 w-full bg-slate-300 group-hover:bg-slate-200 transition" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </Link>
          ))}
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => (
            <Link
              key={cat.nome}
              href={cat.href}
              className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
            >
              <div className="h-32 md:h-36 w-full bg-slate-400 group-hover:bg-slate-300 transition" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </Link>
          ))}
        </div>

        {/* VEÍCULOS EM DESTAQUE (DINÂMICO DO SUPABASE) */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Veículos em destaque
          </h2>
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

      {/* NOVA FAIXA – SERVIÇOS E INFORMAÇÕES PARA VEÍCULOS */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">
            Serviços e informações para veículos
          </h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para entender documentos, custos
            e serviços importantes na hora de comprar, vender ou trocar seu
            veículo na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                IPVA, multas e documentação
              </h3>
              <p className="text-[11px] text-slate-300">
                Em breve, links diretos para consultar IPVA, multas,
                documentação, licenciamento e serviços do Detran das cidades da
                região.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Financiamento e consórcio
              </h3>
              <p className="text-[11px] text-slate-300">
                Informações básicas sobre financiamento, consórcios,
                simulações e contato com bancos e financeiras parceiras.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Vistoria e laudos
              </h3>
              <p className="text-[11px] text-slate-300">
                Dicas sobre vistorias, laudos cautelares, transferência e
                cuidados ao comprar veículos usados ou seminovos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Serviços para o seu veículo
              </h3>
              <p className="text-[11px] text-slate-300">
                Em breve, integração com o LagoListas para você encontrar
                oficinas, autoelétricas, borracharias, lava-jatos e outros
                serviços automotivos na região.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
