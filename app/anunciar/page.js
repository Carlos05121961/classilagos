"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* =========================
   BANNERS (ROTATIVO) — USA OS ARQUIVOS QUE EXISTEM
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
   ÍCONES
========================= */
const ICONS = {
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
    heroTitle: "Faça parte do lançamento do Classilagos 🚀",
    heroSubtitle:
      "A nova plataforma da Região dos Lagos para divulgar negócios, serviços e oportunidades",
    heroText:
      "Participe desde o início e anuncie gratuitamente. Seja um dos primeiros a colocar seu negócio na nova vitrine digital da região.",
    heroPrimaryBtn: "Anunciar grátis agora",
    heroSecondaryBtn: "Ver categorias",
    heroBadges: ["100% gratuito", "Rápido e simples", "Região dos Lagos"],
    title: "Escolha onde deseja anunciar",
    subtitle: "Tudo organizado por categorias para facilitar sua divulgação.",
    helper:
      "Selecione abaixo a seção ideal para seu anúncio e publique de forma simples, rápida e com foco total na Região dos Lagos.",
    bannerInfo: "Espaço para banners institucionais e campanhas oficiais.",
    launchTitle: "Você está entrando no começo de algo grande",
    launchText:
      "O Classilagos está chegando para conectar empresas, profissionais, serviços, turismo, imóveis, empregos e oportunidades em toda a região.",
    sections: [
      {
        key: "imoveis",
        title: "Imóveis",
        desc: "Casas, apartamentos, terrenos e salas comerciais para venda e aluguel.",
        btn: "Anunciar em Imóveis",
        href: "/anunciar/imoveis",
      },
      {
        key: "veiculos",
        title: "Veículos",
        desc: "Carros, motos e outros veículos novos ou usados.",
        btn: "Anunciar em Veículos",
        href: "/anunciar/veiculos",
      },
      {
        key: "nautica",
        title: "Náutica",
        desc: "Barcos, lanchas, jet skis e serviços náuticos.",
        btn: "Anunciar em Náutica",
        href: "/anunciar/nautica",
      },
      {
        key: "pets",
        title: "Pets",
        desc: "Adoção, venda, serviços e acessórios para pets.",
        btn: "Anunciar em Pets",
        href: "/anunciar/pets",
      },
      {
        key: "empregos",
        title: "Empregos",
        desc: "Vagas e oportunidades de trabalho em toda a região.",
        btn: "Ir para Empregos",
        href: "/empregos",
      },
      {
        key: "servicos",
        title: "Serviços & Profissionais",
        desc: "Profissionais liberais, autônomos e empresas de serviços.",
        btn: "Anunciar em Serviços",
        href: "/anunciar/servicos",
      },
      {
        key: "turismo",
        title: "Turismo",
        desc: "Pousadas, restaurantes, passeios e experiências.",
        btn: "Anunciar no Turismo",
        href: "/anunciar/turismo",
      },
      {
        key: "lagolistas",
        title: "LagoListas",
        desc: "Guia comercial com telefones, WhatsApp e sites.",
        btn: "Anunciar no LagoListas",
        href: "/anunciar/lagolistas",
      },
    ],
    finalTitle: "Não fique de fora desse lançamento",
    finalText:
      "Entre agora, escolha sua categoria e publique seu anúncio gratuitamente no Classilagos.",
    finalBtn: "Começar meu anúncio gratuito",
    toggle: "Ver em Espanhol",
  },

  es: {
    breadcrumb: "Classilagos • Anuncios",
    heroTitle: "Sé parte del lanzamiento de Classilagos 🚀",
    heroSubtitle:
      "La nueva plataforma de la Región de los Lagos para divulgar negocios, servicios y oportunidades",
    heroText:
      "Participa desde el inicio y publica gratis. Sé de los primeros en colocar tu negocio en la nueva vitrina digital de la región.",
    heroPrimaryBtn: "Publicar gratis ahora",
    heroSecondaryBtn: "Ver categorías",
    heroBadges: ["100% gratis", "Rápido y simple", "Región de los Lagos"],
    title: "Elige dónde deseas publicar",
    subtitle: "Todo organizado por categorías para facilitar tu difusión.",
    helper:
      "Selecciona abajo la sección ideal para tu anuncio y publícalo de forma simple, rápida y con foco en la Región de los Lagos.",
    bannerInfo: "Espacio para campañas institucionales y comunicados oficiales.",
    launchTitle: "Estás entrando al comienzo de algo grande",
    launchText:
      "Classilagos está llegando para conectar empresas, profesionales, servicios, turismo, inmuebles, empleos y oportunidades en toda la región.",
    sections: [
      {
        key: "imoveis",
        title: "Inmuebles",
        desc: "Casas, departamentos, terrenos y locales comerciales.",
        btn: "Publicar en Inmuebles",
        href: "/anunciar/imoveis",
      },
      {
        key: "veiculos",
        title: "Vehículos",
        desc: "Autos, motos y otros vehículos nuevos o usados.",
        btn: "Publicar en Vehículos",
        href: "/anunciar/veiculos",
      },
      {
        key: "nautica",
        title: "Náutica",
        desc: "Barcos, lanchas, jet skis y servicios náuticos.",
        btn: "Publicar en Náutica",
        href: "/anunciar/nautica",
      },
      {
        key: "pets",
        title: "Mascotas",
        desc: "Adopción, venta y servicios para mascotas.",
        btn: "Publicar en Mascotas",
        href: "/anunciar/pets",
      },
      {
        key: "empregos",
        title: "Empleos",
        desc: "Ofertas y oportunidades de trabajo.",
        btn: "Ir a Empleos",
        href: "/empregos",
      },
      {
        key: "servicos",
        title: "Servicios",
        desc: "Profesionales, autónomos y empresas.",
        btn: "Publicar Servicios",
        href: "/anunciar/servicos",
      },
      {
        key: "turismo",
        title: "Turismo",
        desc: "Hoteles, restaurantes y experiencias.",
        btn: "Publicar en Turismo",
        href: "/anunciar/turismo",
      },
      {
        key: "lagolistas",
        title: "LagoListas",
        desc: "Guía comercial con teléfonos y WhatsApp.",
        btn: "Publicar en LagoListas",
        href: "/anunciar/lagolistas",
      },
    ],
    finalTitle: "No te quedes fuera de este lanzamiento",
    finalText:
      "Entra ahora, elige tu categoría y publica tu anuncio gratis en Classilagos.",
    finalBtn: "Comenzar mi anuncio gratuito",
    toggle: "Ver en Portugués",
  },
};

function BenefitBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/75 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
      <span className="text-cyan-600">✓</span>
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
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* FUNDO PREMIUM */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/backgrounds/fundo-mar.webp"
          alt="Fundo do mar"
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/8 via-white/70 to-slate-50/95" />
      </div>

      <div className="relative">
        {/* BANNER TOPO ROTATIVO */}
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

        {/* HERO PREMIUM */}
        <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/45 bg-white/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/12 via-sky-500/6 to-blue-500/12" />
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-sky-300/20 blur-3xl" />

            <div className="relative px-6 md:px-10 py-10 md:py-14">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  {t.breadcrumb}
                </p>

                <button
                  onClick={toggleLang}
                  className="rounded-full border border-white/60 bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md active:scale-95"
                >
                  🌎 {t.toggle}
                </button>
              </div>

              <div className="mt-5 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.05]">
                  {t.heroTitle}
                </h1>

                <p className="mt-4 text-lg md:text-2xl font-semibold text-slate-800 leading-snug">
                  {t.heroSubtitle}
                </p>

                <p className="mt-4 max-w-3xl text-sm md:text-base text-slate-700 leading-relaxed">
                  {t.heroText}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#categorias"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 md:px-7 py-3 md:py-3.5 text-sm md:text-base font-bold text-white shadow-lg shadow-cyan-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-cyan-700 active:scale-95"
                >
                  {t.heroPrimaryBtn}
                </Link>

                <a
                  href="#categorias"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 md:px-7 py-3 md:py-3.5 text-sm md:text-base font-bold text-slate-800 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md active:scale-95"
                >
                  {t.heroSecondaryBtn}
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {t.heroBadges.map((badge) => (
                  <BenefitBadge key={badge} text={badge} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO DE OPORTUNIDADE */}
        <section className="max-w-6xl mx-auto px-4 pb-4">
          <div className="rounded-3xl border border-white/40 bg-white/65 backdrop-blur-xl px-6 md:px-8 py-6 shadow-sm">
            <div className="max-w-4xl">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                {t.launchTitle}
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-700 leading-relaxed">
                {t.launchText}
              </p>
            </div>
          </div>
        </section>

        {/* TÍTULO DAS CATEGORIAS */}
        <section className="max-w-6xl mx-auto px-4 pt-8 pb-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.title}
            </h2>

            <p className="mt-2 text-base md:text-lg font-semibold text-slate-800">
              {t.subtitle}
            </p>

            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {t.helper}
            </p>
          </div>
        </section>

        {/* CARDS */}
        <section id="categorias" className="max-w-6xl mx-auto px-4 pb-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.sections.map((s) => (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/45 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-slate-50 ring-1 ring-slate-100 shadow-sm overflow-hidden">
                      <Image
                        src={ICONS[s.key] || "/icons/guia-onde-b.webp"}
                        alt={`Ícone ${s.title}`}
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={s.href}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-cyan-700/15 transition-all duration-200 hover:scale-[1.03] hover:bg-cyan-700 hover:shadow-lg active:scale-95"
                  >
                    {s.btn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="max-w-6xl mx-auto px-4 pb-14">
          <div className="relative overflow-hidden rounded-[32px] border border-white/45 bg-gradient-to-r from-slate-900/95 via-cyan-950/90 to-slate-900/95 px-6 md:px-10 py-10 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_28%)]" />

            <div className="relative max-w-3xl">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                {t.finalTitle}
              </h2>

              <p className="mt-3 text-sm md:text-base text-slate-200 leading-relaxed">
                {t.finalText}
              </p>

              <div className="mt-6">
                <a
                  href="#categorias"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 md:px-7 py-3 md:py-3.5 text-sm md:text-base font-bold text-white shadow-lg shadow-cyan-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-cyan-400 active:scale-95"
                >
                  {t.finalBtn}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
