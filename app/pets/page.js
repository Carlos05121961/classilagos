"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

// Imagens do hero
const heroImages = [
  "/pets/animal-01.jpg",
  "/pets/animal-02.jpg",
  "/pets/animal-03.jpg",
];

// Cidades da região
const cidades = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro da Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
];

// Cards de categorias (1ª linha)
const categoriasLinha1 = [
  {
    nome: "Animais à venda",
    slug: "animais",
    filtro: { subcategoria: "Animais" },
  },
  {
    nome: "Acessórios",
    slug: "acessorios",
    filtro: { subcategoria: "Acessórios" },
  },
  {
    nome: "Serviços pet",
    slug: "servicos",
    filtro: { subcategoria: "Serviços pet" },
  },
  {
    nome: "Outros pets",
    slug: "outros",
    filtro: { subcategoria: "Outros" },
  },
];

// 2ª linha (serviços mais detalhados)
const categoriasLinha2 = [
  {
    nome: "Banho & tosa",
    slug: "banho-tosa",
    filtro: { subcategoria: "Serviços pet", tipo: "Banho e tosa" },
  },
  {
    nome: "Veterinários",
    slug: "veterinarios",
    filtro: { subcategoria: "Serviços pet", tipo: "Veterinário" },
  },
  {
    nome: "Pet shops",
    slug: "petshop",
    filtro: { subcategoria: "Serviços pet", tipo: "Petshop" },
  },
  {
    nome: "Adoção",
    slug: "adocao",
    filtro: { tipo: "Adoção" },
  },
];

export default function PetsPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  // Troca das fotos do hero
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios de pets no Supabase
  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        setLoadingAnuncios(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, preco, imagens, subcategoria_pet, tipo_pet, status, categoria, created_at"
          )
          .eq("categoria", "pets")
          .eq("status", "ativo")
          .order("created_at", { ascending: false })
          .limit(40);

        if (error) {
          console.error("Erro ao carregar anúncios de pets:", error);
          setAnuncios([]);
        } else {
          setAnuncios(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao carregar anúncios:", e);
        setAnuncios([]);
      } finally {
        setLoadingAnuncios(false);
      }
    };

    fetchAnuncios();
  }, []);

  // Anúncios recentes na grade inferior
  const anunciosRecentes = anuncios.slice(0, 12);

  // Escolhe imagem para cada card
  function escolherAnuncioParaCard(slug) {
    if (!anuncios || anuncios.length === 0) return null;

    let filtrados = [];

    switch (slug) {
      case "animais":
        filtrados = anuncios.filter((a) => a.subcategoria_pet === "Animais");
        break;

      case "acessorios":
        filtrados = anuncios.filter((a) => a.subcategoria_pet === "Acessórios");
        break;

      case "servicos":
        filtrados = anuncios.filter((a) => a.subcategoria_pet === "Serviços pet");
        break;

      case "banho-tosa":
        filtrados = anuncios.filter(
          (a) =>
            a.subcategoria_pet === "Serviços pet" &&
            (a.tipo_pet || "").toLowerCase().includes("banho")
        );
        break;

      case "veterinarios":
        filtrados = anuncios.filter(
          (a) =>
            a.subcategoria_pet === "Serviços pet" &&
            (a.tipo_pet || "").toLowerCase().includes("veterin")
        );
        break;

      case "petshop":
        filtrados = anuncios.filter(
          (a) =>
            a.subcategoria_pet === "Serviços pet" &&
            (a.tipo_pet || "").toLowerCase().includes("petshop")
        );
        break;

      case "adocao":
        filtrados = anuncios.filter(
          (a) => (a.tipo_pet || "").toLowerCase().includes("adoção")
        );
        break;

      default:
        filtrados = [];
    }

    return filtrados.length > 0 ? filtrados[0] : null;
  }

  return (
    <main className="bg-white min-h-screen">

      {/* BANNER NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow flex items-center justify-center overflow-hidden">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Pets"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <p className="text-sm font-medium drop-shadow">
              Encontre animais, acessórios e serviços pet na Região dos Lagos
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg mt-2">
              Classilagos – Pets
            </h1>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 py-6">

        {/* LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categoriasLinha1.map((cat) => {
            const cardAnuncio = escolherAnuncioParaCard(cat.slug);
            const capa = Array.isArray(cardAnuncio?.imagens)
              ? cardAnuncio.imagens[0]
              : null;

            return (
              <Link
                key={cat.slug}
                href={`/pets/lista?subcategoria=${encodeURIComponent(
                  cat.filtro.subcategoria || ""
                )}`}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="relative h-28 md:h-32 bg-slate-200 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                      Em breve
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs font-semibold">{cat.nome}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categoriasLinha2.map((cat) => {
            const cardAnuncio = escolherAnuncioParaCard(cat.slug);
            const capa = Array.isArray(cardAnuncio?.imagens)
              ? cardAnuncio.imagens[0]
              : null;

            return (
              <Link
                key={cat.slug}
                href={`/pets/lista?subcategoria=${encodeURIComponent(
                  cat.filtro.subcategoria || ""
                )}&tipo=${encodeURIComponent(cat.filtro.tipo || "")}`}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="relative h-28 md:h-32 bg-slate-200 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                      Em breve
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs font-semibold">{cat.nome}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ANÚNCIOS RECENTES */}
      <section className="bg-white pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-2">
            Anúncios recentes de pets
          </h2>

          {!loadingAnuncios && anunciosRecentes.length === 0 && (
            <p className="text-xs text-slate-500">Nenhum anúncio ainda.</p>
          )}

          {!loadingAnuncios && anunciosRecentes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {anunciosRecentes.map((a) => {
                const capa =
                  Array.isArray(a.imagens) && a.imagens.length > 0
                    ? a.imagens[0]
                    : null;

                return (
                  <Link
                    key={a.id}
                    href={`/anuncios/${a.id}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 overflow-hidden transition"
                  >
                    <div className="relative h-28 md:h-32 bg-slate-200 overflow-hidden">
                      {capa ? (
                        <img
                          src={capa}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[11px] text-white bg-rose-400">
                          Sem foto
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] font-bold uppercase line-clamp-2">
                        {a.titulo}
                      </p>
                      <p className="text-[10px] text-slate-300">
                        {a.subcategoria_pet}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* LINKS ÚTEIS — COLADO NO FOOTER */}
      <section className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">
            Links úteis para pets
          </h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Guia rápido para cuidar dos seus animais na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <h3 className="text-sm font-semibold text-white mb-1">
                Campanhas de vacinação
              </h3>
              <p className="text-[11px] text-slate-300">
                Informações oficiais sobre vacinação antirrábica.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <h3 className="text-sm font-semibold text-white mb-1">
                Centro de Zoonoses
              </h3>
              <p className="text-[11px] text-slate-300">
                Endereços e telefones úteis para emergências.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <h3 className="text-sm font-semibold text-white mb-1">
                ONGs & Adoção
              </h3>
              <p className="text-[11px] text-slate-300">
                Projetos de resgate e feiras de adoção na região.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
              <h3 className="text-sm font-semibold text-white mb-1">
                Bem-estar animal
              </h3>
              <p className="text-[11px] text-slate-300">
                Conteúdos especiais sobre alimentação e cuidados pet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
