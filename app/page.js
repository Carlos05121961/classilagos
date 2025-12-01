"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";
import BannerRotator from "./components/BannerRotator";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Home() {
  const heroImages = [
    "/banners/pontanegra.png",
    "/banners/itaipuacu.png",
    "/banners/barra.png",
  ];

  // 🔥 NOVOS ÍCONES PADRONIZADOS
  const categorias = [
    { label: "Imóveis", href: "/imoveis", icon: "/icons/imoveis.png" },
    { label: "Veículos", href: "/veiculos", icon: "/icons/veiculos.png" },
    { label: "Náutica", href: "/nautica", icon: "/icons/nautica.png" },
    { label: "Pets", href: "/pets", icon: "/icons/pets.png" },
    { label: "Empregos", href: "/empregos", icon: "/icons/empregos.png" },
    { label: "Serviços", href: "/servicos", icon: "/icons/servicos.png" },
    { label: "Turismo", href: "/turismo", icon: "/icons/turismo.png" },
    { label: "LagoListas", href: "/lagolistas", icon: "/icons/lagolistas.png" },
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

  const formatCategoria = (cat) => {
    switch (cat) {
      case "imoveis":
        return "Imóveis";
      case "veiculos":
        return "Veículos";
      case "nautica":
        return "Náutica";
      case "pets":
        return "Pets";
      case "emprego":
        return "Empregos";
      case "curriculo":
        return "Currículos";
      case "servico":
        return "Serviços";
      case "turismo":
        return "Turismo";
      case "lagolistas":
        return "LagoListas";
      default:
        return "Classificados";
    }
  };

  // 🔥 DESTAQUES DO SUPABASE
  const [destaques, setDestaques] = useState([]);
  const [loadingDestaques, setLoadingDestaques] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("destaque", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error) setDestaques(data || []);
      setLoadingDestaques(false);
    }
    carregarDestaques();
  }, []);

  return (
    <main className="bg-white">
      {/* BANNER COMERCIAL TOPO */}
      <BannerRotator />

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          
          {/* 🔥 GRADIENTE SUAVE (antes estava muito escuro) */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10">
            <div className="text-center text-white drop-shadow max-w-2xl">
              <p className="text-xs sm:text-sm md:text-base mb-3 text-slate-100">
                O seu guia de compras, serviços, turismo e oportunidades em toda
                a Região dos Lagos.
              </p>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200 bg-clip-text text-transparent tracking-[0.08em] uppercase">
                Classilagos – Região dos Lagos em um só lugar
              </h1>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-4">
          <div className="rounded-3xl bg-slate-950/95 border border-slate-700/70 shadow-[0_0_30px_rgba(0,0,0,0.8)] px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
              
              {/* BUSCA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  O que você procura?
                </label>

                <input
                  type="text"
                  placeholder="Ex.: eletricista, pousada, casa em Cabo Frio..."
                  className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 transition"
                />
              </div>

              {/* SELECT CATEGORIA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50">
                  {categorias.map((c) => (
                    <option key={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* SELECT CIDADE */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50">
                  {cidades.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* BOTÃO BUSCAR */}
              <button className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 font-semibold shadow-md hover:scale-105 transition">
                Buscar
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-slate-400">
            Em breve, essa busca estará totalmente integrada aos anúncios reais.
          </p>
        </div>
      </section>

      {/* PILARES – FUNDOBOTOES + NOVOS ÍCONES */}
      <section className="py-12 bg-[url('/fundobotoes.jpg')] bg-cover bg-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="max-w-[150px] w-full mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-md hover:shadow-lg hover:-translate-y-1 transition flex flex-col items-center justify-between py-4 px-2"
              >
                <div className="relative w-14 h-14 mb-2">
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    fill
                    className="object-contain"
                  />
                </div>

                <span className="text-[12px] font-semibold text-slate-800 uppercase tracking-[0.10em] text-center">
                  {cat.label}
                </span>

                <span className="text-[10px] text-slate-500">Abrir</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- o restante permanece igual --- */}
      {/* NÃO REPETI AQUI PARA O TEXTO NÃO FICAR GIGANTE */}
      {/* MAS POSSO INCLUIR TUDO SE VOCÊ QUISER */}

    </main>
  );
}
