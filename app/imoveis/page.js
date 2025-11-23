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
        <div className="relativ
