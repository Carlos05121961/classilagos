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
    title: "Anuncie grátis no Classilagos",
    subtitle: "Alcance toda a Região dos Lagos em um só lugar.",
    helper:
      "Escolha abaixo em qual seção você deseja anunciar. Em poucos minutos seu anúncio estará no ar em toda a Região dos Lagos.",
    bannerInfo: "Espaço para banners institucionais e campanhas oficiais.",
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
    toggle: "Ver em Espanhol",
  },

  es: {
    breadcrumb: "Classilagos • Anuncios",
    title: "Publica gratis en Classilagos",
    subtitle: "Llega a toda la Región de los Lagos en un solo lugar.",
    helper:
      "Elige abajo en qué sección deseas publicar. En pocos minutos tu anuncio estará visible en toda la Región de los Lagos.",
    bannerInfo: "Espacio para campañas institucionales y comunicados oficiales.",
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
    toggle: "Ver en Portugués",
  },
};

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
      {/* FUNDO DO MAR */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/backgrounds/fundo-mar.webp"
          alt="Fundo do mar"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/55 to-slate-50/85" />
      </div>

      <div className="relative">
        {/* BANNER TOPO ROTATIVO */}
        <section className="w-full flex justify-center border-b border-white/30 bg-white/55 backdrop-blur-sm py-4">
          <div className="w-full max-w-[980px] px-4">
            <div className="relative h-[110px] sm:h-[120px] md:h-[130px] rounded-3xl bg-white/80 border border-white/40 shadow-sm overflow-hidden">
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

        {/* TÍTULO */}
        <section className="max-w-6xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] text-slate-600">{t.breadcrumb}</p>

              <h1 className="mt-1 text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t.title}
              </h1>

              <p className="mt-2 text-base md:text-lg font-semibold text-slate-800">
                {t.subtitle}
              </p>

              <p className="mt-2 text-sm text-slate-700 max-w-3xl">
                {t.helper}
              </p>
            </div>

            <button
              onClick={toggleLang}
              className="rounded-full border border-white/50 bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-white"
            >
              🌎 {t.toggle}
            </button>
          </div>
        </section>

        {/* CARDS */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.sections.map((s) => (
              <div
                key={s.title}
                className="rounded-3xl border border-white/45 bg-white/78 backdrop-blur p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src={ICONS[s.key] || "/icons/guia-onde-b.webp"}
                      alt={`Ícone ${s.title}`}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900">
                      {s.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-700">{s.desc}</p>
                  </div>
                </div>

                <Link
                  href={s.href}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                >
                  {s.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
