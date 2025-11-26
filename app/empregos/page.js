"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function EmpregosPage() {
  /* HERO – alternando 2 imagens */
  const heroImages = [
    "/empregos/hero-empregos.png",
    "/empregos/hero-vagas.jpg",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  // Listas do Supabase
  const [vagasRecentes, setVagasRecentes] = useState([]);
  const [curriculosRecentes, setCurriculosRecentes] = useState([]);
  const [loadingVagas, setLoadingVagas] = useState(true);
  const [loadingCurriculos, setLoadingCurriculos] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Buscar vagas e currículos
  useEffect(() => {
    const fetchVagas = async () => {
      setLoadingVagas(true);
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, area_profissional, tipo_vaga, faixa_salarial, created_at"
        )
        .eq("categoria", "emprego")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error) setVagasRecentes(data || []);
      else setVagasRecentes([]);

      setLoadingVagas(false);
    };

    const fetchCurriculos = async () => {
      setLoadingCurriculos(true);
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, nome_contato, cidade, bairro, area_profissional, created_at"
        )
        .eq("categoria", "curriculo")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error) setCurriculosRecentes(data || []);
      else setCurriculosRecentes([]);

      setLoadingCurriculos(false);
    };

    fetchVagas();
    fetchCurriculos();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
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

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">

          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-white/15" />

          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center text-black">
            <p className="text-sm md:text-base font-medium">
              Encontre oportunidades e seja encontrado pelas empresas da Região dos Lagos.
            </p>

            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
              Classilagos – Empregos
            </h1>

            <p className="mt-2 text-xs md:text-sm text-slate-800 max-w-2xl">
              Vagas de trabalho, banco de currículos e conexões entre talentos e empresas
              em Maricá, Saquarema, Araruama, Cabo Frio, Búzios e toda a Região dos Lagos.
            </p>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3 items-end text-xs md:text-sm">

              {/* Busca */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: atendente, garçom, auxiliar, vendedor..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800">
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
              </div>

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
            Em breve, essa busca estará ligada às vagas e currículos reais da plataforma.
          </p>
        </div>
      </section>

      {/* BOTÕES CHAMATIVOS */}
      <section className="max-w-6xl mx-auto px-4 mt-6 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Link
            href="/anunciar/curriculo"
            className="flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 
                       px-6 py-4 text-white text-sm sm:text-base font-semibold shadow-md transition text-center"
          >
            📄 Cadastrar currículo
          </Link>

          <Link
            href="/anunciar/empregos"
            className="flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 
                       px-6 py-4 text-white text-sm sm:text-base font-semibold shadow-md transition text-center"
          >
            💼 Anunciar vaga de emprego
          </Link>

        </div>

        <p className="text-center text-[11px] text-slate-500 mt-2">
          Cadastre seu currículo ou anuncie vagas gratuitamente durante o lançamento.
        </p>
      </section>

      {/* DIVISOR SUAVE */}
      <div className="h-4" />

      {/* VAGAS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Vagas recentes</h2>
          <span className="text-[11px] text-slate-500">
            {loadingVagas
              ? "Carregando vagas..."
              : vagasRecentes.length === 0
              ? "Nenhuma vaga cadastrada ainda."
              : `${vagasRecentes.length} vaga(s)`}
          </span>
        </div>

        {!loadingVagas && vagasRecentes.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-xl px-4 py-6 text-xs text-slate-500 text-center">
            Ainda não há vagas cadastradas.
            <br />
            <Link
              href="/anunciar/empregos"
              className="inline-flex mt-3 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Anunciar primeira vaga
            </Link>
          </div>
        )}

        {!loadingVagas && vagasRecentes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {vagasRecentes.map((vaga) => (
              <Link
                key={vaga.id}
                href={`/anuncios/${vaga.id}`}
                className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition p-3 flex flex-col"
              >
                <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                  {vaga.titulo}
                </p>

                <p className="text-[11px] text-slate-600 mb-1">
                  {vaga.area_profissional}
                </p>

                <p className="text-[11px] text-slate-600 mb-1">
                  {vaga.cidade}
                  {vaga.bairro ? ` • ${vaga.bairro}` : ""}
                </p>

                {vaga.tipo_vaga && (
                  <p className="text-[10px] uppercase tracking-wide text-sky-700 mb-1">
                    {vaga.tipo_vaga}
                  </p>
                )}

                {vaga.faixa_salarial && (
                  <p className="text-[11px] font-semibold text-emerald-700">
                    {vaga.faixa_salarial}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CURRÍCULOS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Currículos recentes</h2>
          <span className="text-[11px] text-slate-500">
            {loadingCurriculos
              ? "Carregando currículos..."
              : curriculosRecentes.length === 0
              ? "Nenhum currículo cadastrado ainda."
              : `${curriculosRecentes.length} currículo(s)`}
          </span>
        </div>

        {!loadingCurriculos && curriculosRecentes.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-xl px-4 py-6 text-xs text-slate-500 text-center">
            Ainda não há currículos cadastrados.
            <br />
            <Link
              href="/anunciar/curriculo"
              className="inline-flex mt-3 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Cadastrar primeiro currículo
            </Link>
          </div>
        )}

        {!loadingCurriculos && curriculosRecentes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {curriculosRecentes.map((cv) => (
              <Link
                key={cv.id}
                href={`/anuncios/${cv.id}`}
                className="group rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition p-3 flex flex-col"
              >
                <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
                  {cv.nome_contato}
                </p>

                <p className="text-[11px] text-slate-600 mb-1">
                  {cv.area_profissional}
                </p>

                <p className="text-[11px] text-slate-600">
                  {cv.cidade}
                  {cv.bairro ? ` • ${cv.bairro}` : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

