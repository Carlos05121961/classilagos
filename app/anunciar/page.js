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
   IMAGENS REAIS DOS PILARES
   Troque os caminhos se seus arquivos estiverem em outra pasta
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
      {
        key: "imoveis",
        title: "Imóveis",
        href: "/anunciar/imoveis",
      },
      {
        key: "veiculos",
        title: "Veículos",
        href: "/anunciar/veiculos",
      },
      {
        key: "nautica",
        title: "Náutica",
        href: "/anunciar/nautica",
      },
      {
        key: "pets",
        title: "Pets",
        href: "/anunciar/pets",
      },
      {
        key: "empregos",
        title: "Empregos",
        href: "/empregos",
      },
      {
        key: "servicos",
        title: "Serviços",
        href: "/anunciar/servicos",
      },
      {
        key: "turismo",
        title: "Turismo",
        href: "/anunciar/turismo",
      },
      {
        key: "lagolistas",
        title: "LagoListas",
        href: "/anunciar/lagolistas",
      },
    ],
    toggle: "Ver em Espanhol",
  },

  es: {
    breadcrumb: "Classilagos • Anuncios",
    heroTitle: "Publica gratis en Classilagos",
    heroSubtitle: "Elige la categoría y publica en minutos.",
    heroBtn: "Ver categorías",
    heroBadges: ["100% gratis", "Rápido y simple", "Región de los Lagos"],
    bannerInfo: "Espacio para campañas institucionales y comunicados oficiales.",
    sections: [
      {
        key: "imoveis",
        title: "Inmuebles",
        href: "/anunciar/imoveis",
      },
      {
        key: "veiculos",
        title: "Vehículos",
        href: "/anunciar/veiculos",
      },
      {
        key: "nautica",
        title: "Náutica",
        href: "/anunciar/nautica",
      },
      {
        key: "pets",
        title: "Mascotas",
        href: "/anunciar/pets",
      },
      {
        key: "empregos",
        title: "Empleos",
        href: "/empregos",
      },
      {
        key: "servicos",
        title: "Servicios",
        href: "/anunciar/servicos",
      },
      {
        key: "turismo",
        title: "Turismo",
        href: "/anunciar/turismo",
      },
      {
        key: "lagolistas",
        title: "LagoListas",
        href: "/anunciar/lagolistas",
      },
    ],
    toggle: "Ver em Português",
  },
};

function Badge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/85 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
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

  const bannerAtual = useMemo(() => {
    return BANNERS_TOPO[bannerIndex];
  }, [bannerIndex]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* FUNDO PREMIUM CLASSILAGOS */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/backgrounds/fundo-mar.webp"
          alt="Fundo do mar"
          fill
          priority
          className="object-cover opacity-22"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.10),transparent_26%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/92 via-white/72 to-slate-100/92" />
      </div>

      <div className="relative">
        {/* BANNER TOPO */}
        <section className="w-full flex justify-center border-b border-white/30 bg-white/55 backdrop-blur-sm py-4">
          <div className="w-full max-w-[980px] px-4">
            <div className="relative h-[110px] sm:h-[120px] md:h-[130px] rounded-3xl bg-white/85 border border-white/50 shadow-sm overflow-hidden">
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

        {/* HERO CURTO */}
        <section className="max-w-6xl mx-auto px-4 pt-8 md:pt-10 pb-8">
          <div className="relative overflow-hidden rounded-[30px] border border-white/50 bg-white/65 backdrop-blur-xl shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100/55 via-white/25 to-amber-50/45" />
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-amber-200/25 blur-3xl" />

            <div className="relative px-5 md:px-8 py-7 md:py-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                  {t.breadcrumb}
                </p>

                <button
                  onClick={toggleLang}
                  className="rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md active:scale-95"
                >
                  🌎 {t.toggle}
                </button>
              </div>

              <div className="mt-4">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.05]">
                  {t.heroTitle}
                </h1>

                <p className="mt-3 text-base md:text-xl font-semibold text-slate-700">
                  {t.heroSubtitle}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#categorias"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 px-6 py-3 text-sm md:text-base font-bold text-white shadow-lg shadow-sky-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                >
                  {t.heroBtn}
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {t.heroBadges.map((badge) => (
                  <Badge key={badge} text={badge} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GRID DE CATEGORIAS */}
        <section id="categorias" className="max-w-6xl mx-auto px-4 pb-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {t.sections.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group overflow-hidden rounded-[28px] border border-white/55 bg-white/80 backdrop-blur-xl shadow-[0_8px_26px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.14)]"
              >
                <div className="relative h-44 md:h-48 overflow-hidden">
                  <Image
                    src={CARD_IMAGES[s.key] || "/images/anunciar/default.webp"}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-900/10 to-transparent" />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {s.title}
                  </h2>

                  <div className="mt-4">
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
                      Anunciar
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
