"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TurismoPage() {
  const heroImages = ["/turismo/hero-turismo.jpg"];
  const [currentHero] = useState(0);

  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[280px] sm:h-[340px] md:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Turismo"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* véu */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Textos */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow">
              Classilagos – Turismo & Guia ONDE
            </h1>

            <p className="mt-3 text-sm md:text-base max-w-2xl drop-shadow">
              Onde ficar, onde comer, onde passear e onde se divertir em Maricá, Saquarema,
              Araruama, Iguaba Grande, São Pedro da Aldeia, Arraial do Cabo, Cabo Frio,
              Búzios e Rio das Ostras.
            </p>
          </div>
        </div>
      </section>

      {/* BOTÃO ANUNCIAR */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link
            href="/anunciar/turismo"
            className="rounded-full bg-blue-600 text-white px-6 py-3 font-semibold text-sm hover:bg-blue-700 shadow"
          >
            Quero anunciar meu negócio de turismo
          </Link>
        </div>
      </section>

      {/* BARRA DE BUSCA */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-white shadow-md rounded-3xl border border-slate-200 p-4 md:p-6">
          <p className="text-xs font-semibold text-slate-700 mb-2">Busca</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <input
              type="text"
              placeholder="Ex.: pousada pé na areia, passeio de barco, restaurante..."
              className="border rounded-xl px-3 py-2 text-sm border-slate-300 w-full"
            />

            <select className="border rounded-xl px-3 py-2 text-sm bg-white border-slate-300 w-full">
              <option>Todos</option>
              <option>Onde ficar</option>
              <option>Onde comer</option>
              <option>Passeios</option>
              <option>Serviços de turismo</option>
            </select>

            <select className="border rounded-xl px-3 py-2 text-sm bg-white border-slate-300 w-full">
              <option>Toda a região</option>
              <option>Maricá</option>
              <option>Saquarema</option>
              <option>Araruama</option>
              <option>Iguaba Grande</option>
              <option>São Pedro da Aldeia</option>
              <option>Arraial do Cabo</option>
              <option>Cabo Frio</option>
              <option>Búzios</option>
              <option>Rio das Ostras</option>
            </select>

            <button className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm hover:bg-blue-700">
              Buscar
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 text-center">
            Em breve esta busca estará ligada diretamente aos anúncios reais de turismo da plataforma.
          </p>
        </div>
      </section>

      {/* GUIA ONDE */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-lg font-bold mb-3">GUIA ONDE – Turismo Classilagos</h2>
        <p className="text-sm text-slate-600 mb-6 max-w-2xl">
          Escolha por tipo de experiência e encontre lugares para se hospedar, comer,
          passear e se divertir em toda a Região dos Lagos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Onde ficar */}
          <div className="rounded-3xl border shadow-sm p-5 text-center bg-white hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">Onde ficar</h3>
            <p className="text-xs text-slate-600 mb-3">
              Pousadas, hotéis, hostels, casas de temporada e camping.
            </p>
            <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm">
              Ver opções
            </button>
          </div>

          {/* Onde comer */}
          <div className="rounded-3xl border shadow-sm p-5 text-center bg-white hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">Onde comer</h3>
            <p className="text-xs text-slate-600 mb-3">
              Bares, restaurantes, quiosques, pizzarias, hamburguerias.
            </p>
            <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm">
              Ver opções
            </button>
          </div>

          {/* Onde se divertir */}
          <div className="rounded-3xl border shadow-sm p-5 text-center bg-white hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">Onde se divertir</h3>
            <p className="text-xs text-slate-600 mb-3">
              Casas de show, música ao vivo, baladas, pubs, eventos.
            </p>
            <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm">
              Ver opções
            </button>
          </div>

          {/* Passeios */}
          <div className="rounded-3xl border shadow-sm p-5 text-center bg-white hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">Onde passear</h3>
            <p className="text-xs text-slate-600 mb-3">
              Passeios de barco, buggy, trilhas, city tour, mergulho.
            </p>
            <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm">
              Ver opções
            </button>
          </div>

          {/* Serviços de turismo */}
          <div className="rounded-3xl border shadow-sm p-5 text-center bg-white hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">
              Outros serviços
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Guias, turismo rural, turismo religioso e mais.
            </p>
            <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm">
              Ver opções
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
