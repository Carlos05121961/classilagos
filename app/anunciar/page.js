"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* =========================
   TEXTOS PT / ES
========================= */
const TEXT = {
  pt: {
    breadcrumb: "Classilagos • Anúncios",
    title: "Anuncie grátis no Classilagos",
    subtitle:
      "Escolha abaixo em qual seção você deseja anunciar. Em poucos minutos seu anúncio estará no ar em toda a Região dos Lagos.",
    bannerInfo: "Espaço para banners institucionais e campanhas oficiais.",
    sections: [
      {
        title: "Imóveis",
        desc: "Casas, apartamentos, terrenos e salas comerciais para venda e aluguel.",
        btn: "Anunciar em Imóveis",
        href: "/anunciar/imoveis",
      },
      {
        title: "Veículos",
        desc: "Carros, motos e outros veículos novos ou usados.",
        btn: "Anunciar em Veículos",
        href: "/anunciar/veiculos",
      },
      {
        title: "Náutica",
        desc: "Barcos, lanchas, jet skis e serviços náuticos.",
        btn: "Anunciar em Náutica",
        href: "/anunciar/nautica",
      },
      {
        title: "Pets",
        desc: "Adoção, venda, serviços e acessórios para pets.",
        btn: "Anunciar em Pets",
        href: "/anunciar/pets",
      },
      {
        title: "Empregos",
        desc: "Vagas e oportunidades de trabalho em toda a região.",
        btn: "Ir para Empregos",
        href: "/empregos",
      },
      {
        title: "Serviços & Profissionais",
        desc: "Profissionais liberais, autônomos e empresas de serviços.",
        btn: "Anunciar em Serviços",
        href: "/anunciar/servicos",
      },
      {
        title: "Turismo",
        desc: "Pousadas, restaurantes, passeios e experiências.",
        btn: "Anunciar no Turismo",
        href: "/anunciar/turismo",
      },
      {
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
    subtitle:
      "Elige abajo en qué sección deseas publicar. En pocos minutos tu anuncio estará visible en toda la Región de los Lagos.",
    bannerInfo: "Espacio para campañas institucionales y comunicados oficiales.",
    sections: [
      {
        title: "Inmuebles",
        desc: "Casas, departamentos, terrenos y locales comerciales.",
        btn: "Publicar en Inmuebles",
        href: "/anunciar/imoveis",
      },
      {
        title: "Vehículos",
        desc: "Autos, motos y otros vehículos nuevos o usados.",
        btn: "Publicar en Vehículos",
        href: "/anunciar/veiculos",
      },
      {
        title: "Náutica",
        desc: "Barcos, lanchas, jet skis y servicios náuticos.",
        btn: "Publicar en Náutica",
        href: "/anunciar/nautica",
      },
      {
        title: "Mascotas",
        desc: "Adopción, venta y servicios para mascotas.",
        btn: "Publicar en Mascotas",
        href: "/anunciar/pets",
      },
      {
        title: "Empleos",
        desc: "Ofertas y oportunidades de trabajo.",
        btn: "Ir a Empleos",
        href: "/empregos",
      },
      {
        title: "Servicios",
        desc: "Profesionales, autónomos y empresas.",
        btn: "Publicar Servicios",
        href: "/anunciar/servicos",
      },
      {
        title: "Turismo",
        desc: "Hoteles, restaurantes y experiencias.",
        btn: "Publicar en Turismo",
        href: "/anunciar/turismo",
      },
      {
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

  useEffect(() => {
    const saved = localStorage.getItem("classilagos_lang");
    if (saved === "pt" || saved === "es") setLang(saved);
  }, []);

  function toggleLang() {
    const next = lang === "pt" ? "es" : "pt";
    setLang(next);
    localStorage.setItem("classilagos_lang", next);
  }

  const t = TEXT[lang];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
      {/* BANNER TOPO */}
      <section className="w-full flex justify-center border-b bg-slate-100 py-4">
        <div className="w-full max-w-[900px] px-4">
          <div className="relative h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/topo/anunciar-01.webp"
              alt="Banner institucional"
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-1 text-center text-[10px] text-slate-500">
            {t.bannerInfo}
          </p>
        </div>
      </section>

      {/* TÍTULO */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] text-slate-500">{t.breadcrumb}</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={toggleLang}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
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
    </main>
  );
}

