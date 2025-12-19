"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AnunciarPage() {
  // ✅ banners topo padrão 720x120 (coloque 5 arquivos)
  const BANNERS_TOPO = useMemo(
    () => [
      "/banners/topo/topo-anunciar-01.webp",
      "/banners/topo/topo-anunciar-02.webp",
      "/banners/topo/topo-anunciar-03.webp",
      "/banners/topo/topo-anunciar-04.webp",
      "/banners/topo/topo-anunciar-05.webp",
    ],
    []
  );

  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerOk, setBannerOk] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIndex((p) => (p + 1) % BANNERS_TOPO.length);
    }, 6000);
    return () => clearInterval(t);
  }, [BANNERS_TOPO.length]);

  const cards = [
    {
      title: "Imóveis",
      desc: "Casas, apartamentos, terrenos, salas e temporada.",
      href: "/anunciar/imoveis",
      icon: "/icons/imoveis.png",
      badge: "Venda • Aluguel • Temporada",
    },
    {
      title: "Veículos",
      desc: "Carros, motos e utilitários novos e usados.",
      href: "/anunciar/veiculos",
      icon: "/icons/veiculos.png",
      badge: "Compra • Venda • Destaque",
    },
    {
      title: "Náutica",
      desc: "Barcos, lanchas, jetski e serviços náuticos.",
      href: "/anunciar/nautica",
      icon: "/icons/nautica.png",
      badge: "Passeios • Venda • Serviços",
    },
    {
      title: "Pets",
      desc: "Adoção, venda, acessórios e serviços.",
      href: "/anunciar/pets",
      icon: "/icons/pets.png",
      badge: "Adoção • Filhotes • Serviços",
    },
    {
      title: "Empregos",
      desc: "Vagas e banco de currículos da Região dos Lagos.",
      href: "/empregos",
      icon: "/icons/empregos.png",
      badge: "Vagas • Currículos",
    },
    {
      title: "Serviços",
      desc: "Profissionais liberais, autônomos e empresas.",
      href: "/anunciar/servicos",
      icon: "/icons/servicos.png",
      badge: "Chame no WhatsApp",
    },
    {
      title: "Turismo",
      desc: "Hospedagem, alimentação, passeios e eventos.",
      href: "/anunciar/turismo",
      icon: "/icons/turismo.png",
      badge: "Guia da Região",
    },
    {
      title: "LagoListas",
      desc: "O guia comercial: telefone, WhatsApp, site e redes.",
      href: "/anunciar/lagolistas",
      icon: "/icons/lagolistas.png",
      badge: "Comércio & Serviços",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO PADRÃO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            {bannerOk ? (
              <>
                <Image
                  key={BANNERS_TOPO[bannerIndex]}
                  src={BANNERS_TOPO[bannerIndex]}
                  alt="Banner Classilagos"
                  fill
                  sizes="720px"
                  className="object-contain"
                  onError={() => setBannerOk(false)}
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {BANNERS_TOPO.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full border border-slate-400 ${
                        i === bannerIndex ? "bg-slate-700" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center px-6">
                <p className="text-xs font-extrabold text-slate-900">
                  Espaço para banners (720x120)
                </p>
                <p className="text-[11px] text-slate-500">
                  Suba os arquivos em <b>/public/banners/topo/</b> como
                  topo-anunciar-01.webp … 05
                </p>
              </div>
            )}
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Área Premium de divulgação (topo do Classilagos).
          </p>
        </div>
      </section>

      {/* TÍTULO / INTRO */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <p className="text-[11px] text-slate-500">Classilagos • Anúncios</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
          Anuncie grátis no Classilagos
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Escolha a seção abaixo. Em poucos minutos seu anúncio estará no ar e
          poderá ser encontrado em toda a Região dos Lagos.
        </p>

        {/* faixa de confiança */}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-extrabold text-sky-700">
              Fase de lançamento
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Aproveite para aparecer desde o início, com anúncios gratuitos.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-extrabold text-emerald-700">
              Busca Premium
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Seus anúncios entram no motor do Classilagos e ganham visibilidade.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-extrabold text-amber-700">
              Destaque opcional
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Depois, você pode ativar destaque e banners para crescer mais.
            </p>
          </div>
        </div>
      </section>

      {/* GRID PREMIUM DOS CARDS */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <Image
                    src={c.icon}
                    alt={c.title}
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-900">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{c.badge}</p>
                </div>
              </div>

              <p className="mt-3 text-[12px] text-slate-600">{c.desc}</p>

              <div className="mt-4 inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-xs font-extrabold text-white group-hover:bg-sky-700">
                Continuar →
              </div>
            </Link>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-7 text-center">
          <p className="text-sm font-extrabold text-slate-900">
            Quer anunciar com mais força?
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Em breve: planos de destaque, banners e impulsionamento por categoria.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/noticias"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Ver Notícias
            </Link>
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Voltar para a Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

