"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";
import SiteFooter from "../components/SiteFooter";

const heroImages = [
  "/nautica/lancha-01.jpg",
  "/nautica/lancha-02.jpg",
  "/nautica/lancha-03.jpg",
];

const cidades = [
  "Maricá", "Saquarema", "Araruama", "Iguaba Grande",
  "São Pedro da Aldeia", "Arraial do Cabo", "Cabo Frio",
  "Búzios", "Rio das Ostras",
];

const categoriasLinha1 = [
  { nome: "Lanchas e veleiros à venda", slug: "lanchas", href: "/nautica/lista?finalidade=venda" },
  { nome: "Jetski, stand-up & caiaques", slug: "jetski", href: "/nautica/lista?tipo=Jetski" },
  { nome: "Barcos de pesca", slug: "pesca", href: "/nautica/lista?tipo=Barco%20de%20pesca" },
  { nome: "Motores & equipamentos", slug: "motores", href: "/nautica/lista?tipo=Outros" },
];

const categoriasLinha2 = [
  { nome: "Aluguel de embarcações", slug: "aluguel", href: "/nautica/lista?finalidade=aluguel" },
  { nome: "Marinas & guardarias", slug: "marina", href: "/nautica/lista?tipo=Vaga%20em%20marina" },
  { nome: "Serviços náuticos", slug: "servicos", href: "/nautica/lista?tipo=Serviços%20náuticos" },
  { nome: "Peças & acessórios", slug: "pecas", href: "/nautica/lista?tipo=Outros" },
];
export default function NauticaPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // HERO rotativo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // BUSCAR ANÚNCIOS DA NÁUTICA (sem filtros que escondem anúncios)
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "nautica")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(60);

      if (!error && data) {
        setAnuncios(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // ESCOLHER 1 anúncio para aparecer no card da categoria
  function escolherCard(slug) {
    if (anuncios.length === 0) return null;

    let lista = [...anuncios];

    if (slug === "lanchas") {
      lista = lista.filter(a =>
        (a.subcategoria_nautica || "").toLowerCase().includes("lancha") ||
        (a.subcategoria_nautica || "").toLowerCase().includes("veleiro")
      );
    }

    if (slug === "jetski") {
      lista = lista.filter(a =>
        (a.subcategoria_nautica || "").toLowerCase().includes("jet") ||
        (a.subcategoria_nautica || "").toLowerCase().includes("ski")
      );
    }

    if (slug === "pesca") {
      lista = lista.filter(a =>
        (a.subcategoria_nautica || "").toLowerCase().includes("pesca")
      );
    }

    if (slug === "motores") {
      lista = lista.filter(a =>
        (a.subcategoria_nautica || "").toLowerCase().includes("motor")
      );
    }

    if (lista.length === 0) return null;
    return lista[0];
  }
  return (
    <>
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Náutica Classilagos"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
            <p className="text-sm md:text-base drop-shadow">
              Lanchas, veleiros, jetski e serviços náuticos na Região dos Lagos
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg mt-3">
              Classilagos – Náutica
            </h1>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categoriasLinha1.map(cat => {
            const ann = escolherCard(cat.slug);
            const img = Array.isArray(ann?.imagens) ? ann.imagens[0] : null;

            return (
              <Link key={cat.slug} href={cat.href}
                className="rounded-2xl overflow-hidden shadow border border-slate-200 bg-white hover:-translate-y-1 transition">
                
                <div className="relative h-28 bg-slate-300">
                  {img ? (
                    <img src={img} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                      Em breve anúncios
                    </div>
                  )}
                </div>

                <div className="bg-sky-950 text-white px-3 py-2">
                  <p className="text-sm font-semibold">{cat.nome}</p>
                  {ann && (
                    <p className="text-xs text-sky-300 line-clamp-1">
                      {ann.titulo} • {ann.cidade}
                    </p>
                  )}
                </div>

              </Link>
            );
          })}
        </div>
        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map(cat => {
            const ann = escolherCard(cat.slug);
            const img = Array.isArray(ann?.imagens) ? ann.imagens[0] : null;

            return (
              <Link key={cat.slug} href={cat.href}
                className="rounded-2xl overflow-hidden shadow border border-slate-200 bg-white hover:-translate-y-1 transition">
                
                <div className="relative h-28 bg-slate-300">
                  {img ? (
                    <img src={img} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                      Em breve anúncios
                    </div>
                  )}
                </div>

                <div className="bg-sky-950 text-white px-3 py-2">
                  <p className="text-sm font-semibold">{cat.nome}</p>
                </div>

              </Link>
            );
          })}
        </div>

        {/* TÍTULO DOS ANÚNCIOS RECENTES */}
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Anúncios recentes de náutica
        </h2>

        {/* LISTA COMPLETA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading && (
            <p className="text-slate-500 text-sm">Carregando anúncios…</p>
          )}

          {!loading && anuncios.length === 0 && (
            <p className="text-slate-500 text-sm">Nenhum anúncio ainda.</p>
          )}

          {!loading && anuncios.length > 0 && anuncios.map(a => {
            const img = Array.isArray(a.imagens) ? a.imagens[0] : null;

            return (
              <Link key={a.id} href={`/anuncios/${a.id}`}
                className="rounded-2xl overflow-hidden border shadow bg-white hover:-translate-y-1 transition">
                
                <div className="relative h-28 bg-slate-200">
                  {img ? (
                    <img src={img} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="bg-sky-950 text-white px-3 py-2">
                  <p className="text-sm font-bold">{a.titulo}</p>
                  <p className="text-xs text-sky-300">
                    {a.cidade} {a.bairro ? `• ${a.bairro}` : ""}
                  </p>
                  {a.preco && (
                    <p className="text-xs font-semibold text-emerald-300">
                      {a.preco}
                    </p>
                  )}
                </div>

              </Link>
            );
          })}
        </div>

      </section>
    </main>

    <SiteFooter />
    </>
  );
}

