"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/pets/animal-01.jpg",
  "/pets/animal-02.jpg",
  "/pets/animal-03.jpg",
];

// CARDS PRINCIPAIS — já com subcategorias reais
const categoriasLinha1 = [
  { nome: "Cachorros", sub: "Cachorros" },
  { nome: "Gatos", sub: "Gatos" },
  { nome: "Aves", sub: "Aves" },
  { nome: "Peixes & Aquários", sub: "Peixes" },
];

const categoriasLinha2 = [
  { nome: "Outros Pets", sub: "Outros" },
  { nome: "Rações & Acessórios", sub: "Acessórios" },
  { nome: "Petshops & Clínicas", sub: "Petshop" },
  { nome: "Serviços Pet", sub: "Serviços" },
];

export default function PetsPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  // Troca de foto do hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios reais da categoria PETS
  useEffect(() => {
    const fetchAnuncios = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select("id, titulo, cidade, bairro, preco, imagens, subcategoria_pet")
        .eq("categoria", "pets")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Erro ao carregar PETS:", error);
        setAnuncios([]);
      } else {
        setAnuncios(data || []);
      }
      setLoadingAnuncios(false);
    };

    fetchAnuncios();
  }, []);

  return (
    <main className="bg-white min-h-screen">

      {/* BANNER */}      
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie no Classilagos Pets"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Pets"
            fill
            priority
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-sm md:text-base drop-shadow">
              Encontre animais, produtos, serviços e muito mais.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Pets
            </h1>
            <p className="text-xs mt-2">Anúncios gratuitos em toda a região.</p>
          </div>
        </div>
      </section>

      {/* BUSCA FAKE (igual veículos) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border px-4 py-3">

            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end">

              <div>
                <label className="text-[11px] font-semibold text-slate-600">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: gato para adoção, banho e tosa..."
                  className="w-full rounded-full border px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">
                  Tipo
                </label>
                <select className="w-full rounded-full border px-3 py-1.5 text-xs">
                  <option>Animais</option>
                  <option>Acessórios</option>
                  <option>Serviços</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">
                  Cidade
                </label>
                <select className="w-full rounded-full border px-3 py-1.5 text-xs">
                  <option>Todas</option>
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                </select>
              </div>

              <button className="rounded-full bg-blue-600 px-5 py-2 text-xs text-white">
                Buscar
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center mt-1 text-slate-500">
            Em breve busca real integrada.
          </p>
        </div>
      </section>

      <div className="h-4" />

      {/* CARDS CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 pb-6">

        {/* Linha 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((c) => (
            <Link
              key={c.nome}
              href={`/pets/lista?subcategoria=${encodeURIComponent(c.sub)}`}
              className="group overflow-hidden rounded-2xl shadow border bg-amber-100 hover:-translate-y-1 transition"
            >
              <div className="h-24 bg-amber-200/40" />
              <div className="bg-slate-900 text-white text-xs px-3 py-2">
                {c.nome}
              </div>
            </Link>
          ))}
        </div>

        {/* Linha 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((c) => (
            <Link
              key={c.nome}
              href={`/pets/lista?subcategoria=${encodeURIComponent(c.sub)}`}
              className="group overflow-hidden rounded-2xl shadow border bg-emerald-100 hover:-translate-y-1 transition"
            >
              <div className="h-24 bg-emerald-200/40" />
              <div className="bg-slate-900 text-white text-xs px-3 py-2">
                {c.nome}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ANÚNCIOS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 pb-10">

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">
            Anúncios recentes de pets
          </h2>
        </div>

        {loadingAnuncios && <p className="text-xs text-slate-600">Carregando…</p>}

        {!loadingAnuncios && anuncios.length === 0 && (
          <p className="text-xs text-slate-600">
            Nenhum anúncio encontrado.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {anuncios.map((a) => {
            const img =
              Array.isArray(a.imagens) && a.imagens.length > 0
                ? a.imagens[0]
                : null;

            return (
              <Link
                key={a.id}
                href={`/anuncios/${a.id}`}
                className="group overflow-hidden rounded-2xl shadow border bg-white hover:-translate-y-1 transition"
              >
                <div className="relative h-28 bg-slate-200">
                  {img ? (
                    <Image
                      src={img}
                      alt={a.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px]">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-[11px] font-bold uppercase line-clamp-2">
                    {a.titulo}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    {a.subcategoria_pet || ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

