"use client";

import Link from "next/link";
import Image from "next/image";

export default function LancamentoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* FUNDO */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/fundo-mar.webp"
          alt="Região dos Lagos"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[85vh]">

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl">
          Faça parte do lançamento do Classilagos 🚀
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl">
          A nova plataforma da Região dos Lagos para divulgar negócios,
          serviços, vagas e oportunidades.
        </p>

        <p className="mt-2 text-base text-gray-300">
          Anuncie gratuitamente e seja um dos primeiros a aparecer.
        </p>

        {/* CTA PRINCIPAL */}
        <div className="mt-10">
          <Link
            href="/anunciar"
            className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-10 py-5 rounded-full text-lg shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Anunciar grátis agora
          </Link>
        </div>

        {/* PROVA VISUAL */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
          <span className="bg-white/10 px-4 py-2 rounded-full">100% gratuito</span>
          <span className="bg-white/10 px-4 py-2 rounded-full">Rápido e simples</span>
          <span className="bg-white/10 px-4 py-2 rounded-full">Região dos Lagos</span>
        </div>

      </section>

      {/* SEÇÃO VISUAL (PILARES) */}
      <section className="relative z-10 pb-20 px-6">

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            { nome: "Serviços", img: "/icons/servicos.webp" },
            { nome: "Empregos", img: "/icons/empregos.webp" },
            { nome: "Imóveis", img: "/icons/imoveis.webp" },
            { nome: "Veículos", img: "/icons/veiculos.webp" },
          ].map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-28">
                <Image
                  src={item.img}
                  alt={item.nome}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>

              <div className="p-3 text-center bg-white/10 backdrop-blur">
                <p className="font-semibold">{item.nome}</p>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 pb-24 text-center px-6">

        <h2 className="text-2xl md:text-3xl font-bold">
          Comece agora e saia na frente 🚀
        </h2>

        <div className="mt-6">
          <Link
            href="/anunciar"
            className="inline-block bg-orange-400 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
          >
            Anunciar grátis
          </Link>
        </div>

      </section>

    </main>
  );
}
