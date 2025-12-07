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

// Cards de categorias (2 linhas)
const categoriasLinha1 = [
  {
    nome: "Animais à venda",
    slug: "animais",
    href: "/pets/lista?subcategoria=Animais",
  },
  {
    nome: "Adoção & resgate",
    slug: "adocao",
    href: "/pets/lista?tipo=Adoção",
  },
  {
    nome: "Rações & acessórios",
    slug: "racoes-acessorios",
    href: "/pets/lista?subcategoria=Rações & acessórios",
  },
  {
    nome: "Petshops & clínicas",
    slug: "petshops-clinicas",
    href: "/pets/lista?subcategoria=Petshop / Clínica",
  },
];

const categoriasLinha2 = [
  {
    nome: "Serviços pet",
    slug: "servicos-pet",
    href: "/pets/lista?subcategoria=Serviços pet",
  },
  {
    nome: "Banho & tosa",
    slug: "banho-tosa",
    href: "/pets/lista?subcategoria=Banho & tosa",
  },
  {
    nome: "Veterinários",
    slug: "veterinarios",
    href: "/pets/lista?subcategoria=Veterinário / Clínica",
  },
  {
    nome: "Outros pets",
    slug: "outros",
    href: "/pets/lista?subcategoria=Outros pets",
  },
];

export default function PetsPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState<any[]>([]);
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
            "id, titulo, cidade, bairro, preco, imagens, subcategoria_pet, tipo_pet, status, categoria, destaque, created_at"
          )
          // pega qualquer coisa cuja categoria contenha "pets" (maiúsculo/minúsculo tanto faz)
          .ilike("categoria", "pets")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(40);

        if (error) {
          console.error("Erro ao carregar anúncios de pets:", error);
          setAnuncios([]);
        } else {
          setAnuncios(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao carregar anúncios de pets:", e);
        setAnuncios([]);
      } finally {
        setLoadingAnuncios(false);
      }
    };

    fetchAnuncios();
  }, []);

  // Anúncios recentes (para a grade de baixo)
  const anunciosRecentes = anuncios.slice(0, 12);

  // Escolhe 1 anúncio para ilustrar cada card de categoria
  function escolherAnuncioParaCard(slug: string) {
    if (!anuncios || anuncios.length === 0) return null;

    let filtrados = [...anuncios];

    switch (slug) {
      case "animais":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_pet || "").toLowerCase();
          const tipo = (a.tipo_pet || "").toLowerCase();
          return (
            sub.includes("animal") ||
            sub.includes("cachorro") ||
            sub.includes("gato") ||
            tipo.includes("animal")
          );
        });
        break;

      case "adocao":
        filtrados = filtrados.filter((a) => {
          const tipo = (a.tipo_pet || "").toLowerCase();
          const sub = (a.subcategoria_pet || "").toLowerCase();
          return tipo.includes("adoção") || tipo.includes("adocao") || sub.includes("adoção");
        });
        break;

      case "racoes-acessorios":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_pet || "").toLowerCase();
          return (
            sub.includes("ração") ||
            sub.includes("rações") ||
            sub.includes("racao") ||
            sub.includes("racoes") ||
            sub.includes("acess")
          );
        });
        break;

      case "petshops-clinicas":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_pet || "").toLowerCase();
          const tipo = (a.tipo_pet || "").toLowerCase();
          return (
            sub.includes("petshop") ||
            sub.includes("clínica") ||
            sub.includes("clinica") ||
            sub.includes("veterin") ||
            tipo.includes("petshop") ||
            tipo.includes("clinica")
          );
        });
        break;

      case "servicos-pet":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_pet || "").toLowerCase();
          const tipo = (a.tipo_pet || "").toLowerCase();
          return (
            sub.includes("serviço") ||
            sub.includes("servicos") ||
            sub.includes("serviço") ||
            tipo.includes("serviço")
          );
        });
        break;

      case "banho-tosa":
        filtrados = filtrados.filter((a) => {
          const tipo = (a.tipo_pet || "").toLowerCase();
          const sub = (a.subcategoria_pet || "").toLowerCase();
          return (
            sub.includes("banho") ||
            sub.includes("tosa") ||
            tipo.includes("banho") ||
            tipo.includes("tosa")
          );
        });
        break;

      case "veterinarios":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_pet || "").toLowerCase();
          const tipo = (a.tipo_pet || "").toLowerCase();
          return sub.includes("veterin") || tipo.includes("veterin");
        });
        break;

      case "outros":
        filtrados = filtrados.filter((a) => {
          const sub = (a.subcategoria_pet || "").toLowerCase();
          const tipo = (a.tipo_pet || "").toLowerCase();
          return sub.includes("outros") || sub.includes("outro") || tipo.includes("outro");
        });
        break;

      default:
        break;
    }

    if (filtrados.length === 0) return null;

    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie para pets no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO – FOTO + TEXTO */}
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
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-xs sm:text-sm md:text-base font-medium drop-shadow max-w-2xl">
            Encontre animais, acessórios, serviços pet e muito mais na Região
            dos Lagos.
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
            Classilagos – Pets
          </h1>
          <p className="mt-2 text-[11px] sm:text-xs text-amber-100/90">
            Anúncios de pets em Maricá, Saquarema, Araruama, Cabo Frio,
            Búzios e toda a região.
          </p>
        </div>
      </section>

      {/* CAIXA DE BUSCA (ainda fake) */}
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
                  placeholder="Ex.: adoção de cachorro, banho e tosa, veterinário"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos</option>
                  <option>Animais</option>
                  <option>Acessórios</option>
                  <option>Serviços pet</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
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

      {/* CATEGORIAS VISUAIS + CARDS DINÂMICOS */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        {/* Linha 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa = imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="relative h-28 md:h-32 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, anúncios aqui
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">
                    {cat.nome}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Linha 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa = imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="relative h-28 md:h-32 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, anúncios aqui
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">
                    {cat.nome}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ANÚNCIOS RECENTES DE PETS */}
      <section className="bg-white pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              Anúncios recentes de pets
            </h2>
            <span className="text-[11px] text-slate-500">
              {loadingAnuncios
                ? "Carregando anúncios..."
                : anunciosRecentes.length === 0
                ? "Nenhum anúncio cadastrado ainda."
                : `${anunciosRecentes.length} anúncio(s) encontrado(s)`}
            </span>
          </div>

          {loadingAnuncios && (
            <div className="text-xs text-slate-500">Buscando anúncios…</div>
          )}

          {!loadingAnuncios && anunciosRecentes.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              Ainda não há anúncios de pets cadastrados.
              <br />
              <Link
                href="/anunciar?tipo=pets"
                className="inline-flex mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Seja o primeiro a anunciar
              </Link>
            </div>
          )}

          {!loadingAnuncios && anunciosRecentes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {anunciosRecentes.map((a) => {
                const img =
                  Array.isArray(a.imagens) && a.imagens.length > 0
                    ? a.imagens[0]
                    : null;

                return (
                  <Link
                    key={a.id}
                    href={`/anuncios/${a.id}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={a.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-amber-50 bg-gradient-to-br from-amber-500 to-rose-500">
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
          )}
        </div>
      </section>

      {/* LINKS ÚTEIS – COLADO NO FOOTER */}
      <section className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">
            Links úteis para pets
          </h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para cuidar bem dos seus animais
            na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Campanhas de vacinação
              </h3>
              <p className="text-[11px] text-slate-300">
                Informações sobre vacinação antirrábica e campanhas oficiais
                nas cidades da região.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Centro de Zoonoses
              </h3>
              <p className="text-[11px] text-slate-300">
                Endereços e orientações sobre saúde pública, resgate e animais
                em situação de rua.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                ONGs e proteção animal
              </h3>
              <p className="text-[11px] text-slate-300">
                Projetos de adoção, lares temporários e feiras de adoção na
                Região dos Lagos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">
                Dicas de bem-estar pet
              </h3>
              <p className="text-[11px] text-slate-300">
                Em breve, conteúdos especiais sobre alimentação, comportamento e
                cuidados gerais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

