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

      {/* BOTÕES NEON – OPÇÃO B (contorno e texto em gradiente) */}
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
              className={`
                group relative flex items-center justify-center
                h-20 rounded-2xl 
                border border-pink-400/60
                bg-slate-950
                shadow-[0_0_18px_rgba(236,72,153,0.35)]
                hover:shadow-[0_0_28px_rgba(34,211,238,0.75)]
                transition-all duration-300
                hover:-translate-y-1
                overflow-hidden
              `}
            >
              {/* Glow de fundo sutil */}
              <div
                className="
                  pointer-events-none
                  absolute inset-0 opacity-0 group-hover:opacity-40
                  bg-gradient-to-r from-pink-500/40 via-fuchsia-500/30 to-cyan-400/40
                  blur-2xl
                  transition-opacity duration-300
                "
              />

              {/* Borda interna de preenchimento escuro */}
              <div
                className="
                  absolute inset-[1px] rounded-2xl
                  bg-gradient-to-r from-slate-950 via-slate-950 to-slate-950
                "
              />

              {/* Texto em gradiente neon */}
              <span
                className="
                  relative z-10
                  text-sm sm:text-base font-extrabold tracking-wide
                  bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300
                  bg-clip-text text-transparent
                "
              >
                {item.name}
              </span>
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
