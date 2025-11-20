"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO INDEX */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[430px] overflow-hidden">
          <Image
            src="/banners/hero-index.jpg"
            alt="Classilagos Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-x-0 top-[22%] text-center px-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
              Classilagos – Seu Guia Completo da Região dos Lagos
            </h1>
            <p className="mt-2 text-sm md:text-base text-white/90 drop-shadow">
              Anúncios, imóveis, empregos, turismo e muito mais!
            </p>
          </div>
        </div>
      </section>

      {/* BOTÕES – OPÇÃO C (Praia / Verão / Premium) */}
      <section className="max-w-6xl mx-auto px-4 mt-10 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">
          Explore por categoria
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Imóveis", href: "/imoveis" },
            { name: "Veículos", href: "/veiculos" },
            { name: "Náutica", href: "/nautica" },
            { name: "Pets", href: "/pets" },
            { name: "Empregos", href: "/empregos" },
            { name: "Serviços", href: "/servicos" },
            { name: "Turismo", href: "/turismo" },
            { name: "LagoListas", href: "/lagolistas" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="
                group relative flex items-center justify-center
                h-20 rounded-2xl
                bg-gradient-to-br from-yellow-200 via-yellow-100 to-cyan-100
                shadow-md
                hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
                border border-slate-200
              "
            >
              <span
                className="
                  text-slate-900
                  font-semibold text-base sm:text-lg
                  tracking-wide
                "
              >
                {item.name}
              </span>

              {/* brilho suave no hover */}
              <div
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  opacity-0 group-hover:opacity-30
                  bg-gradient-to-r from-yellow-300 via-yellow-200 to-cyan-200
                  blur-xl transition-all duration-300
                "
              />
            </Link>
          ))}
        </div>

        <p className="mt-5 text-[11px] sm:text-xs text-center text-slate-400">
          Em breve, cada área terá busca completa e anúncios em destaque em toda a Região dos Lagos.
        </p>
      </section>

      {/* ANÚNCIOS EM DESTAQUE */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <h2 className="text-xl font-semibold mb-3 text-slate-700">
          Anúncios em destaque
        </h2>

        <div className="w-full rounded-3xl bg-slate-100 border border-slate-200 h-32 flex items-center justify-center text-slate-500">
          Em breve, os destaques aparecerão aqui.
        </div>
      </section>
    </main>
  );
}
