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
        .limit(6);

      setVagasRecentes(error ? [] : data || []);
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
        .limit(6);

      setCurriculosRecentes(error ? [] : data || []);
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
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          {/* véu suave */}
          <div className="absolute inset-0 bg-black/10" />

          {/* TEXTOS */}
          <div className="absolute inset-x-0 top-[20%] flex flex-col items-center px-4 text-center text-black">
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
              Classilagos – Empregos
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-50 max-w-2xl drop-shadow">
              Vagas de emprego, banco de currículos e oportunidades em toda a Região dos Lagos.
            </p>
          </div>
        </div>
      </section>

      {/* BOTÕES PRINCIPAIS */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Botão — CADASTRAR CURRÍCULO */}
          <Link
            href="/anunciar/curriculo"
            className="group bg-emerald-600 text-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold mb-2">
              Quero cadastrar meu currículo
            </h2>
            <p className="text-sm text-emerald-50 mb-3">
              Empresas poderão encontrar você facilmente no banco de talentos.
            </p>
            <span className="inline-block mt-2 group-hover:translate-x-1 transition">
              👉 Começar agora
            </span>
          </Link>

          {/* Botão — ANUNCIAR VAGA */}
          <Link
            href="/anunciar/empregos"
            className="group bg-sky-600 text-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold mb-2">
              Quero anunciar uma vaga
            </h2>
            <p className="text-sm text-sky-50 mb-3">
              Divulgue vagas para toda a região e receba candidatos rapidamente.
            </p>
            <span className="inline-block mt-2 group-hover:translate-x-1 transition">
              👔 Publicar vaga
            </span>
          </Link>

        </div>
      </section>

      {/* VAGAS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Vagas recentes
        </h2>

        {!loadingVagas && vagasRecentes.length === 0 && (
          <p className="text-slate-500 text-sm">Nenhuma vaga cadastrada ainda.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vagasRecentes.map((vaga) => (
            <Link
              key={vaga.id}
              href={`/anuncios/${vaga.id}`}
              className="rounded-2xl border p-4 bg-slate-50 hover:bg-slate-100 shadow-sm hover:shadow transition"
            >
              <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                {vaga.titulo}
              </p>
              <p className="text-[11px] text-slate-600 mb-1">
                {vaga.cidade}
              </p>
              {vaga.faixa_salarial && (
                <p className="text-[11px] text-emerald-700 font-semibold">
                  {vaga.faixa_salarial}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* CURRÍCULOS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Currículos recentes
        </h2>

        {!loadingCurriculos && curriculosRecentes.length === 0 && (
          <p className="text-slate-500 text-sm">Nenhum currículo cadastrado ainda.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {curriculosRecentes.map((cv) => (
            <Link
              key={cv.id}
              href={`/anuncios/${cv.id}`}
              className="rounded-2xl border p-4 bg-white hover:bg-slate-50 shadow-sm hover:shadow transition"
            >
              <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
                {cv.nome_contato || "Candidato"}
              </p>
              <p className="text-[11px] text-slate-600 mb-1">
                {cv.area_profissional}
              </p>
              <p className="text-[11px] text-slate-600">
                {cv.cidade}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* RODAPÉ PADRÃO */}
      <footer className="bg-slate-100 border-t py-6 text-center text-xs text-slate-600">
        <p>Classilagos © {new Date().getFullYear()}</p>
        <p className="mt-1">
          <Link href="/quem-somos" className="hover:underline">Quem somos</Link> •{" "}
          <Link href="/contato" className="hover:underline">Contato</Link> •{" "}
          <Link href="/politica" className="hover:underline">Política de privacidade</Link>
        </p>
      </footer>
    </main>
  );
}
