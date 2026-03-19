"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

/* =========================
   CONFIG
========================= */

const CIDADES = [
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

/* =========================
   BANNERS NOTÍCIAS (NOVO PADRÃO)
========================= */

function getBannersTopoNoticias() {
  return [
    { src: "/banners/topo/topo-noticias-01.webp", href: "#", alt: "Topo 1" },
    { src: "/banners/topo/topo-noticias-02.webp", href: "#", alt: "Topo 2" },
    { src: "/banners/topo/topo-noticias-03.webp", href: "#", alt: "Topo 3" },
  ];
}

function getBannersRodapeNoticias() {
  return [
    { src: "/banners/rodape/rodape-noticias-01.webp", href: "#", alt: "Rodapé 1" },
    { src: "/banners/rodape/rodape-noticias-02.webp", href: "#", alt: "Rodapé 2" },
    { src: "/banners/rodape/rodape-noticias-03.webp", href: "#", alt: "Rodapé 3" },
  ];
}

/* =========================
   HELPERS
========================= */

function formatDateBR(value) {
  try {
    return new Date(value).toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

/* =========================
   BANNER ROTATOR
========================= */

function BannerRotator({ banners = [], height = 120 }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % banners.length);
    }, 4000);
    return () => clearInterval(t);
  }, [banners]);

  const current = banners[idx];

  return (
    <div className="w-full flex justify-center py-4">
      <Link href={current.href} target="_blank">
        <Image
          src={current.src}
          alt={current.alt}
          width={900}
          height={height}
          className="rounded-xl object-contain"
        />
      </Link>
    </div>
  );
}

/* =========================
   HERO MAPA (AJUSTADO)
========================= */

function HeroMapaNoticias({ cidadeAtiva, onSelectCidade }) {
  const pins = [
    { cidade: "Maricá", left: "34%", top: "82%" },
    { cidade: "Saquarema", left: "45%", top: "82%" },
    { cidade: "Araruama", left: "53%", top: "75%" },
    { cidade: "Iguaba Grande", left: "58%", top: "71%" },
    { cidade: "São Pedro da Aldeia", left: "62%", top: "72%" },
    { cidade: "Cabo Frio", left: "66%", top: "79%" },
    { cidade: "Arraial do Cabo", left: "67%", top: "91%" },
    { cidade: "Búzios", left: "75%", top: "60%" },
    { cidade: "Rio das Ostras", left: "74%", top: "30%" },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-4">
      <Image
        src="/hero/noticias-mapa.webp"
        alt="Mapa Região dos Lagos"
        width={1200}
        height={400}
        className="rounded-xl"
      />

      {pins.map((p) => (
        <button
          key={p.cidade}
          onClick={() => onSelectCidade(p.cidade)}
          className="absolute group"
          style={{ left: p.left, top: p.top }}
        >
          <div className="w-3 h-3 bg-yellow-400 rounded-full border border-black"></div>

          <span className="absolute left-1/2 -translate-x-1/2 mt-1 text-[10px] font-bold text-black">
            {p.cidade}
          </span>
        </button>
      ))}
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function NoticiasHomePage() {
  const [noticias, setNoticias] = useState([]);
  const [cidadeFiltro, setCidadeFiltro] = useState("Todas");

  useEffect(() => {
    const fetchNoticias = async () => {
      const { data } = await supabase
        .from("noticias")
        .select("*")
        .eq("status", "publicado")
        .order("created_at", { ascending: false });

      setNoticias(data || []);
    };

    fetchNoticias();
  }, []);

  const noticiasFiltradas = useMemo(() => {
    if (cidadeFiltro === "Todas") return noticias;
    return noticias.filter((n) => n.cidade === cidadeFiltro);
  }, [noticias, cidadeFiltro]);

  return (
    <main className="bg-[#F5FBFF] min-h-screen">

      {/* TOPO */}
      <BannerRotator banners={getBannersTopoNoticias()} />

      {/* MAPA */}
      <HeroMapaNoticias
        cidadeAtiva={cidadeFiltro}
        onSelectCidade={setCidadeFiltro}
      />

      {/* LISTA */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold mb-4">
          Notícias - {cidadeFiltro}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {noticiasFiltradas.map((n) => (
            <Link
              key={n.id}
              href={`/noticias/${n.id}`}
              className="bg-white rounded-xl overflow-hidden shadow"
            >
              <img
                src={n.imagem_capa || "/banners/noticias-default.webp"}
                className="w-full h-40 object-cover"
              />

              <div className="p-3">
                <p className="text-xs text-blue-600 font-semibold">
                  {n.cidade}
                </p>

                <h3 className="text-sm font-bold line-clamp-2">
                  {n.titulo}
                </h3>

                <p className="text-xs text-gray-500">
                  {formatDateBR(n.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RODAPÉ */}
      <BannerRotator banners={getBannersRodapeNoticias()} />

    </main>
  );
}
