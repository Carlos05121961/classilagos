"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function EmpregosPage() {
  /* HERO – alternando 2 imagens */
  const heroImages = ["/empregos/hero-empregos.png", "/empregos/hero-vagas.jpg"];
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
        .select("id, nome_contato, cidade, bairro, area_profissional, created_at")
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
    <main className="bg-slate-50 min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-5xl px-4">
          <div className="relative w-full h-[120px] rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
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
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[360px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* véu/gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/10" />

          {/* TEXTOS */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-emerald-200">
              Oportunidades na Região dos Lagos
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
              Classilagos Empregos
            </h1>
            <p className="mt-3 max-w-2xl text-xs md:text-sm text-slate-100 drop-shadow">
              Vagas de emprego, banco de currículos e oportunidades para as nove cidades da Região dos Lagos.
            </p>
          </div>
        </div>
      </section>

      {/* BOTÕES PRINCIPAIS */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 md:-mt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Botão — CADASTRAR CURRÍCULO */}
          <Link
            href="/anunciar/curriculo"
            className="group bg-emerald-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-emerald-500"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Banco de talentos
            </span>
            <h2 className="text-xl font-bold mb-1">
              Quero cadastrar meu currículo
            </h2>
            <p className="text-sm text-emerald-50">
              Empresas de toda a região poderão encontrar seu perfil profissional com facilidade.
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold">
              👉 Começar agora
            </span>
          </Link>

          {/* Botão — ANUNCIAR VAGA */}
          <Link
            href="/anunciar/empregos"
            className="group bg-sky-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-sky-500"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              Para empresas e comércios
            </span>
            <h2 className="text-xl font-bold mb-1">
              Quero anunciar uma vaga
            </h2>
            <p className="text-sm text-sky-50">
              Divulgue vagas para as nove cidades e receba candidatos qualificados rapidamente.
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold">
              👔 Publicar vaga
            </span>
          </Link>
        </div>
      </section>

      {/* BLOCO LISTAGENS */}
      <section className="max-w-6xl mx-auto px-4 pb-12 space-y-8">
        {/* VAGAS RECENTES */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Vagas recentes
              </h2>
              <p className="text-xs text-slate-500">
                Últimas oportunidades cadastradas por empresas da Região dos Lagos.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-medium text-emerald-800">
              {loadingVagas
                ? "Carregando..."
                : `${vagasRecentes.length || 0} vagas em destaque`}
            </span>
          </div>

          {!loadingVagas && vagasRecentes.length === 0 && (
            <p className="text-slate-500 text-sm">
              Nenhuma vaga cadastrada ainda. Seja o primeiro a anunciar uma oportunidade.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {vagasRecentes.map((vaga) => (
              <Link
                key={vaga.id}
                href={`/anuncios/${vaga.id}`}
                className="rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-sky-50 hover:to-slate-50 shadow-sm hover:shadow transition"
              >
                <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                  {vaga.titulo}
                </p>
                <p className="text-[11px] text-slate-600 mb-1">
                  {vaga.cidade} {vaga.bairro ? `• ${vaga.bairro}` : ""}
                </p>
                {vaga.tipo_vaga && (
                  <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2 py-[2px] text-[10px] font-medium text-sky-700 mb-1">
                    {vaga.tipo_vaga}
                  </span>
                )}
                {vaga.faixa_salarial && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {vaga.faixa_salarial}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* CURRÍCULOS RECENTES */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Currículos recentes
              </h2>
              <p className="text-xs text-slate-500">
                Profissionais que estão buscando oportunidades nas cidades da região.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-[11px] font-medium text-sky-800">
              {loadingCurriculos
                ? "Carregando..."
                : `${curriculosRecentes.length || 0} perfis em destaque`}
            </span>
          </div>

          {!loadingCurriculos && curriculosRecentes.length === 0 && (
            <p className="text-slate-500 text-sm">
              Nenhum currículo cadastrado ainda. Comece criando o seu perfil profissional.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {curriculosRecentes.map((cv) => (
              <Link
                key={cv.id}
                href={`/anuncios/${cv.id}`}
                className="rounded-2xl border border-slate-200 p-4 bg-white hover:bg-slate-50 shadow-sm hover:shadow transition"
              >
                <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
                  {cv.nome_contato || "Candidato"}
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
        </div>
      </section>

      {/* RODAPÉ PADRÃO */}
      <footer className="bg-slate-100 border-t py-6 text-center text-xs text-slate-600">
        <p>Classilagos © {new Date().getFullYear()}</p>
        <p className="mt-1">
          <Link href="/quem-somos" className="hover:underline">
            Quem somos
          </Link>{" "}
          •{" "}
          <Link href="/contato" className="hover:underline">
            Contato
          </Link>{" "}
          •{" "}
          <Link href="/politica" className="hover:underline">
            Política de privacidade
          </Link>
        </p>
      </footer>
    </main>
  );
}

