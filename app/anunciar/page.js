"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* =========================
   BANNERS (ROTATIVO)
========================= */
const BANNERS_TOPO = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

/* =========================
   IMAGENS DOS PILARES
========================= */
const CARD_IMAGES = {
  imoveis: "/icons/imoveis.webp",
  veiculos: "/icons/veiculos.webp",
  nautica: "/icons/nautica.webp",
  pets: "/icons/pets.webp",
  empregos: "/icons/empregos.webp",
  servicos: "/icons/servicos.webp",
  turismo: "/icons/turismo.webp",
  lagolistas: "/icons/lagolistas.webp",
};

/* =========================
   TEXTOS PT / ES
========================= */
const TEXT = {
  pt: {
    breadcrumb: "Classilagos • Anúncios",
    heroTitle: "Anuncie grátis no Classilagos",
    heroSubtitle: "Escolha a categoria e publique em minutos.",
    heroBtn: "Ver categorias",
    heroBadges: ["100% gratuito", "Rápido e simples", "Região dos Lagos"],
    bannerInfo: "Espaço para banners institucionais e campanhas oficiais.",
    sections: [
      { key: "imoveis", title: "Imóveis", href: "/anunciar/imoveis" },
      { key: "veiculos", title: "Veículos", href: "/anunciar/veiculos" },
      { key: "nautica", title: "Náutica", href: "/anunciar/nautica" },
      { key: "pets", title: "Pets", href: "/anunciar/pets" },
      { key: "empregos", title: "Empregos", href: "/empregos" },
      { key: "servicos", title: "Serviços", href: "/anunciar/servicos" },
      { key: "turismo", title: "Turismo", href: "/anunciar/turismo" },
      { key: "lagolistas", title: "LagoListas", href: "/anunciar/lagolistas" },
    ],
    toggle: "Ver em Espanhol",
    cardBtn: "Anunciar",
  },

  es: {
    breadcrumb: "Classilagos • Anuncios",
    heroTitle: "Publica gratis en Classilagos",
    heroSubtitle: "Elige la categoría y publica en minutos.",
    heroBtn: "Ver categorías",
    heroBadges: ["100% gratis", "Rápido y simple", "Región de los Lagos"],
    bannerInfo: "Espacio para campañas institucionales y comunicados oficiales.",
    sections: [
      { key: "imoveis", title: "Inmuebles", href: "/anunciar/imoveis" },
      { key: "veiculos", title: "Vehículos", href: "/anunciar/veiculos" },
      { key: "nautica", title: "Náutica", href: "/anunciar/nautica" },
      { key: "pets", title: "Mascotas", href: "/anunciar/pets" },
      { key: "empregos", title: "Empleos", href: "/empregos" },
      { key: "servicos", title: "Servicios", href: "/anunciar/servicos" },
      { key: "turismo", title: "Turismo", href: "/anunciar/turismo" },
      { key: "lagolistas", title: "LagoListas", href: "/anunciar/lagolistas" },
    ],
    toggle: "Ver em Português",
    cardBtn: "Publicar",
  },
};

function Badge({ text }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[10px] md:text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
      <span className="text-amber-500">✦</span>
      <span>{text}</span>
    </div>
  );
}

export default function AnunciarPage() {
  const [lang, setLang] = useState("pt");
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("classilagos_lang");
    if (saved === "pt" || saved === "es") setLang(saved);
  }, []);

  function toggleLang() {
    const next = lang === "pt" ? "es" : "pt";
    setLang(next);
    localStorage.setItem("classilagos_lang", next);
  }

  useEffect(() => {
    if (!BANNERS_TOPO.length) return;
    const id = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNERS_TOPO.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const t = TEXT[lang];
  const bannerAtual = useMemo(() => BANNERS_TOPO[bannerIndex], [bannerIndex]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* FUNDO */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/backgrounds/fundo-mar.webp"
          alt="Fundo do mar"
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_26%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/92 via-white/72 to-slate-100/92" />
      </div>

      <div className="relative">
        {/* BANNER TOPO */}
        <section className="w-full flex justify-center border-b border-white/30 bg-white/55 backdrop-blur-sm py-3">
          <div className="w-full max-w-[980px] px-4">
            <div className="relative h-[82px] sm:h-[95px] md:h-[110px] rounded-2xl bg-white/85 border border-white/50 shadow-sm overflow-hidden">
              <Link
                href={bannerAtual.href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label={bannerAtual.alt}
              >
                <Image
                  src={bannerAtual.src}
                  alt={bannerAtual.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 980px"
                  priority
                />
              </Link>
            </div>

            <p className="mt-1 text-center text-[10px] text-slate-600">
              {t.bannerInfo}
            </p>
          </div>
        </section>

        {/* HERO */}
        <section className="max-w-5xl mx-auto px-4 pt-5 md:pt-7 pb-5">
          <div className="relative overflow-hidden rounded-[20px] md:rounded-[28px] border border-white/50 bg-white/65 backdrop-blur-xl shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100/55 via-white/25 to-amber-50/45" />
            <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-amber-200/25 blur-3xl" />

            <div className="relative px-4 md:px-7 py-5 md:py-7">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                  {t.breadcrumb}
                </p>

                <button
                  onClick={toggleLang}
                  className="rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-[10px] md:text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md active:scale-95"
                >
                  🌎 {t.toggle}
                </button>
              </div>

              <div className="mt-3">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.05]">
                  {t.heroTitle}
                </h1>

                <p className="mt-2 text-sm md:text-lg font-semibold text-slate-700">
                  {t.heroSubtitle}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <a
                  href="#categorias"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 px-4 py-2 text-sm md:text-base font-bold text-white shadow-lg shadow-sky-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                >
                  {t.heroBtn}
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {t.heroBadges.map((badge) => (
                  <Badge key={badge} text={badge} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GRID DE CATEGORIAS - ULTRA COMPACTA */}
        <section id="categorias" className="max-w-5xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {t.sections.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group overflow-hidden rounded-[18px] md:rounded-[20px] border border-white/60 bg-white/82 backdrop-blur-xl shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.10)]"
              >
<div className="px-2 pt-2">
  <div className="relative h-20 sm:h-24 md:h-28 rounded-[12px] bg-slate-50 overflow-hidden">
    <Image
      src={CARD_IMAGES[s.key] || "/images/anunciar/default.webp"}
      alt={s.title}
      fill
      className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.02]"
      sizes="(max-width: 1024px) 50vw, 25vw"
    />
  </div>
</div>

<div className="px-2 pb-2 pt-1.5">
  <h2 className="text-[12px] md:text-[14px] font-bold text-slate-900 leading-tight">
    {s.title}
  </h2>

  <div className="mt-1">
    <span className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-2 py-1 text-[9px] md:text-[11px] font-bold text-slate-950 shadow-sm shadow-amber-500/20 transition-all duration-200 group-hover:scale-[1.01]">
      {t.cardBtn}
    </span>
  </div>
</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
