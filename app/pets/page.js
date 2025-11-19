"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/pets/animal-01.jpg",
  "/pets/animal-02.jpg",
  "/pets/animal-03.jpg",
];

export default function PetsPage() {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const categoriasLinha1 = [
    { nome: "Adoção" },
    { nome: "Banho & Tosa" },
    { nome: "Veterinários" },
    { nome: "Hospedagem / Hotel" },
  ];

  const categoriasLinha2 = [
    { nome: "Pet shops" },
    { nome: "Passeadores" },
    { nome: "Adestradores" },
    { nome: "Táxi pet" },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie para Pets - Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO – SÓ FOTO + TEXTO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Pets"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre animais para adoção, venda, serviços pet e muito mais na
              Região dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Pets
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA FORA DA FOTO */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: banho e tosa, hotel para cachorro"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pet */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Pet
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Cachorro</option>
                  <option>Gato</option>
                  <option>Aves</option>
                  <option>Peixes</option>
                  <option>Outros</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              </div>

              {/* Botão */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará ligada aos anúncios reais da plataforma.
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {/* LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100"
            >
              <div className="h-32 md:h-36 w-full bg-emerald-200" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100"
            >
              <div className="h-32 md:h-36 w-full bg-emerald-300" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        {/* DESTAQUES RESERVADOS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl shadow border border-slate-200"
            >
              <div className="h-28 md:h-32 w-full bg-emerald-700" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                Destaque pet
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="bg-white pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 flex items-center justify-center bg-yellow-300 text-slate-900 text-xl font-bold rounded-md"
              >
                Notícias
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Links úteis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Campanhas de vacinação
              </p>
              <p className="text-[12px] text-slate-600">
                Informações sobre vacinação antirrábica e campanhas oficiais.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Centro de Zoonoses
              </p>
              <p className="text-[12px] text-slate-600">
                Orientações sobre saúde pública e animais.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                ONGs e proteção animal
              </p>
              <p className="text-[12px] text-slate-600">
                Contatos de projetos de adoção e resgate de animais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-slate-100 border border-slate-200 px-6 py-7 text-center">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Quer anunciar algo para pets?
            </p>
            <p className="text-xs text-slate-700 mb-4">
              Divulgue serviços, produtos, hotéis, passeios e muito mais para
              pets na Classilagos. Anúncios gratuitos na fase de lançamento.
            </p>

            <Link
              href="/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anuncie para pets grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
