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

      {/* BOTÕES NEON – OPÇÃO A */}
      <section className="max-w-6xl mx-auto px-4 mt-10 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">
          Explore por categoria
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* BOTÃO COMPONENTE */}
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
                h-20 rounded-2xl font-semibold text-white 
                text-lg shadow-lg shadow-pink-500/20
                bg-gradient-to-br from-pink-500 to-cyan-400
                transition-all duration-300
                hover:scale-105 hover:shadow-pink-500/40 hover:shadow-xl
                border border-white/20 backdrop-blur-sm
              "
            >
              <span className="drop-shadow">{item.name}</span>

              {/* Glow neon externo */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition duration-300 bg-gradient-to-br from-pink-400 to-cyan-300"></div>
            </Link>
          ))}
        </div>
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
