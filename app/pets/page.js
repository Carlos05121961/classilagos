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

export default function PetsPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios de pets no Supabase
  useEffect(() => {
    const fetchAnuncios = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, preco, imagens, tipo_imovel, descricao, status, categoria"
        )
        .eq("categoria", "pets")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Erro ao carregar anúncios de pets:", error);
        setAnuncios([]);
      } else {
        setAnuncios(data || []);
      }
      setLoadingAnuncios(false);
    };

    fetchAnuncios();
  }, []);

  const categoriasLinha1 = [
    { nome: "Animais" },
    { nome: "Acessórios" },
    { nome: "Serviços pet" },
    { nome: "Pet shops" },
  ];

  const categoriasLinha2 = [
    { nome: "Banho & tosa" },
    { nome: "Veterinários" },
    { nome: "Hospedagem / Hotel" },
    { nome: "Passeios & dog walker" },
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

      {/* CATEGORIAS VISUAIS */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-200"
            >
              <div className="h-24 md:h-28 w-full relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.6),_transparent_60%)]" />
              </div>
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-gradient-to-br from-emerald-100 via-sky-100 to-emerald-200"
            >
              <div className="h-24 md:h-28 w-full relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(52,211,153,0.6),_transparent_60%)]" />
              </div>
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANÚNCIOS REAIS DE PETS */}
      <section className="bg-white pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              Anúncios de pets
            </h2>
            <span className="text-[11px] text-slate-500">
              {loadingAnuncios
                ? "Carregando anúncios..."
                : anuncios.length === 0
                ? "Nenhum anúncio cadastrado ainda."
                : `${anuncios.length} anúncio(s) encontrado(s)`}
            </span>
          </div>

          {loadingAnuncios && (
            <div className="text-xs text-slate-500">Buscando anúncios…</div>
          )}

          {!loadingAnuncios && anuncios.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              Ainda não há anúncios de pets cadastrados.
              <br />
              <Link
                href="/anunciar/pets"
                className="inline-flex mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Seja o primeiro a anunciar
              </Link>
            </div>
          )}

          {!loadingAnuncios && anuncios.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {anuncios.map((item) => {
                const img =
                  Array.isArray(item.imagens) && item.imagens.length > 0
                    ? item.imagens[0]
                    : null;

                return (
                  <Link
                    key={item.id}
                    href={`/anuncios/${item.id}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                  >
                    {img ? (
                      <div className="w-full h-28 md:h-32 overflow-hidden bg-slate-200">
                        <img
                          src={img}
                          alt={item.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-28 md:h-32 bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-[11px] text-amber-50">
                        Sem foto
                      </div>
                    )}

                    <div className="px-3 py-2 space-y-1">
                      <p className="font-semibold leading-snug line-clamp-2 text-slate-900">
                        {item.titulo}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {item.tipo_imovel
                          ? `${item.tipo_imovel} · `
                          : ""}
                        {item.cidade}
                        {item.bairro ? ` • ${item.bairro}` : ""}
                      </p>
                      {item.preco && (
                        <p className="text-[11px] font-semibold text-emerald-700">
                          {item.preco}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
              Divulgue animais, serviços, produtos e muito mais na Classilagos.
              Anúncios gratuitos na fase de lançamento.
            </p>

            <Link
              href="/anunciar/pets"
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

