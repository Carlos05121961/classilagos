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

  // troca de imagem do hero
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
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

      {/* HERO PRINCIPAL – como no print, com textos sobre a imagem */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] overflow-hidden">
          {/* imagem do hero */}
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          {/* leve escurecida pra dar contraste */}
          <div className="absolute inset-0 bg-black/10" />

          {/* TÍTULO PRINCIPAL (parte de cima do print) */}
          <div className="absolute top-[18%] w-full flex justify-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 drop-shadow">
              Classilagos – Empregos
            </h1>
          </div>

          {/* TEXTO EM BLOCOS (como se estivesse dentro da lupa) */}
          <div className="absolute top-[38%] w-full flex justify-center px-4 text-center">
            <div className="text-black font-extrabold leading-tight drop-shadow-md">
              <p className="text-lg md:text-2xl">VAGAS DE EMPREGO</p>
              <p className="text-lg md:text-2xl">BANCO DE CURRÍCULOS</p>
              <p className="text-lg md:text-2xl">E OPORTUNIDADES</p>
              <p className="text-lg md:text-2xl">EM TODA A REGIÃO DOS LAGOS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÕES PRINCIPAIS */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CARD – CADASTRAR CURRÍCULO */}
          <Link
            href="/anunciar/curriculo"
            className="group block rounded-3xl border border-emerald-500 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                📄
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Para candidatos
                </p>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  Quero cadastrar meu currículo
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-3">
              Cadastre seu perfil no banco de talentos do Classilagos e seja
              encontrado por empresas de toda a região.
            </p>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
              Começar agora <span>➜</span>
            </span>
          </Link>

          {/* CARD – ANUNCIAR VAGA */}
          <Link
            href="/anunciar/empregos"
            className="group block rounded-3xl border border-sky-500 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                💼
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                  Para empresas e comércios
                </p>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  Quero anunciar uma vaga
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-3">
              Divulgue gratuitamente oportunidades de trabalho e receba candidatos
              qualificados de toda a Região dos Lagos.
            </p>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 group-hover:gap-2 transition-all">
              Publicar vaga <span>➜</span>
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
          <p className="text-slate-500 text-sm">
            Nenhuma vaga cadastrada ainda.
          </p>
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
          <p className="text-slate-500 text-sm">
            Nenhum currículo cadastrado ainda.
          </p>
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

      {/* RODAPÉ */}
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

