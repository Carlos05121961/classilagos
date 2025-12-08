"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function EmpregosPage() {
  const [vagasRecentes, setVagasRecentes] = useState([]);
  const [curriculosRecentes, setCurriculosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // VAGAS
        const { data: vagas, error: vagasError } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, faixa_salarial, tipo_vaga, modelo_trabalho, imagens"
          )
          .eq("categoria", "emprego")
          .order("created_at", { ascending: false })
          .limit(6);

        if (vagasError) throw vagasError;

        // CURRÍCULOS
        const { data: curriculos, error: curriculosError } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, area_profissional, curriculo_foto_url"
          )
          .eq("categoria", "curriculo")
          .order("created_at", { ascending: false })
          .limit(6);

        if (curriculosError) throw curriculosError;

        setVagasRecentes(vagas || []);
        setCurriculosRecentes(curriculos || []);
        setLoading(false);
      } catch (e) {
        console.error("Erro ao carregar empregos:", e);
        setErro(
          "Não foi possível carregar vagas e currículos neste momento. Tente novamente em alguns instantes."
        );
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const heroImage = "/empregos/hero-empregos.jpg"; // o mesmo fundo azul com lupa

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* HERO */}
      <section className="relative w-full border-b border-slate-200 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-12">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 -z-10">
            <img
              src={heroImage}
              alt="Classilagos Empregos"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Texto sobreposto */}
          <div className="max-w-xl text-white">
            <h1 className="text-2xl md:text-3xl font-black drop-shadow">
              Classilagos – Empregos
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-100">
              Vagas de emprego, banco de currículos e oportunidades em toda a
              Região dos Lagos.
            </p>

            <p className="mt-4 text-xs md:text-sm font-semibold uppercase">
              Vagas de emprego<br />
              Banco de currículos<br />
              E oportunidades em toda a Região dos Lagos.
            </p>
          </div>
        </div>
      </section>

      {/* BLOCO – ESCOLHA CANDIDATO / EMPRESA */}
      <section className="max-w-5xl mx-auto px-4 mt-6 grid gap-4 md:grid-cols-2">
        {/* Card candidato */}
        <div className="rounded-3xl border border-emerald-200 bg-white shadow-sm p-5">
          <p className="text-[11px] font-semibold text-emerald-700 mb-1">
            PARA CANDIDATOS
          </p>
          <h2 className="text-sm md:text-base font-semibold text-slate-900 mb-1">
            Quero cadastrar meu currículo
          </h2>
          <p className="text-[11px] text-slate-600 mb-3">
            Cadastre seu perfil no banco de talentos do Classilagos e seja
            encontrado por empresas de toda a região.
          </p>
          <Link
            href="/empregos/curriculos/anunciar"
            className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Começar agora →
          </Link>
        </div>

        {/* Card empresa */}
        <div className="rounded-3xl border border-cyan-200 bg-white shadow-sm p-5">
          <p className="text-[11px] font-semibold text-cyan-700 mb-1">
            PARA EMPRESAS E COMÉRCIOS
          </p>
          <h2 className="text-sm md:text-base font-semibold text-slate-900 mb-1">
            Quero anunciar uma vaga
          </h2>
          <p className="text-[11px] text-slate-600 mb-3">
            Divulgue gratuitamente oportunidades de trabalho e receba candidatos
            qualificados de toda a Região dos Lagos.
          </p>
          <Link
            href="/empregos/anunciar"
            className="inline-flex items-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
          >
            Publicar vaga →
          </Link>
        </div>
      </section>

      {/* LISTAGENS */}
      <section className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        {erro && (
          <p className="text-xs text-red-600 border border-red-100 rounded-md bg-red-50 px-3 py-2">
            {erro}
          </p>
        )}

        {/* VAGAS RECENTES */}
        <div className="space-y-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Vagas recentes
          </h2>

          {loading && (
            <p className="text-[11px] text-slate-500">Carregando vagas…</p>
          )}

          {!loading && vagasRecentes.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Ainda não há vagas cadastradas. Em breve, novas oportunidades
              aparecerão aqui.
            </p>
          )}

          {vagasRecentes.length > 0 && (
            <div className="grid gap-3 md:grid-cols-3">
              {vagasRecentes.map((vaga) => {
                const logo =
                  Array.isArray(vaga.imagens) && vaga.imagens.length > 0
                    ? vaga.imagens[0]
                    : null;

                return (
                  <Link
                    key={vaga.id}
                    href={`/anuncios/${vaga.id}`}
                    className="group rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition flex flex-row gap-3 px-4 py-3 items-center"
                  >
                    {/* Logo da empresa */}
                    {logo && (
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                          <img
                            src={logo}
                            alt={vaga.titulo}
                            className="h-10 w-10 object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Texto */}
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                        {vaga.titulo}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {vaga.cidade}
                        {vaga.bairro ? ` • ${vaga.bairro}` : ""}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        {vaga.tipo_vaga || ""}{" "}
                        {vaga.faixa_salarial ? `• ${vaga.faixa_salarial}` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CURRÍCULOS RECENTES – AGORA COM FOTO */}
        <div className="space-y-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Currículos recentes
          </h2>

          {loading && (
            <p className="text-[11px] text-slate-500">Carregando currículos…</p>
          )}

          {!loading && curriculosRecentes.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Ainda não há currículos cadastrados. Em breve, novos candidatos
              aparecerão aqui.
            </p>
          )}

          {curriculosRecentes.length > 0 && (
            <div className="grid gap-3 md:grid-cols-3">
              {curriculosRecentes.map((cv) => {
                const nomeLimpo = cv.titulo?.startsWith("Currículo - ")
                  ? cv.titulo.replace("Currículo - ", "")
                  : cv.titulo;

                return (
                  <Link
                    key={cv.id}
                    href={`/anuncios/${cv.id}`}
                    className="group rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition px-4 py-3 flex flex-row items-center gap-3"
                  >
                    {/* FOTO DO CANDIDATO */}
                    <div className="flex-shrink-0">
                      {cv.curriculo_foto_url ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                          <img
                            src={cv.curriculo_foto_url}
                            alt={nomeLimpo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-[11px] text-slate-400">
                          CV
                        </div>
                      )}
                    </div>

                    {/* TEXTO */}
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                        {nomeLimpo}
                      </p>
                      {cv.area_profissional && (
                        <p className="text-[11px] text-slate-600">
                          {cv.area_profissional}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">
                        {cv.cidade}
                        {cv.bairro ? ` • ${cv.bairro}` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RODAPÉ SIMPLES DA PÁGINA EMPREGOS */}
      <section className="mt-8">
        <footer className="text-center text-[11px] text-slate-500 space-y-1">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/quem-somos" className="hover:underline">
              Quem somos
            </Link>
            <Link href="/contato" className="hover:underline">
              Contato
            </Link>
            <Link href="/politica-de-privacidade" className="hover:underline">
              Política de privacidade
            </Link>
          </div>
          <p>Classilagos © 2025</p>
        </footer>
      </section>

      {/* TARJA ANTES DO RODAPÉ DO PEIXINHO – LINKS ÚTEIS */}
      <section className="mt-6 bg-slate-900 text-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-6 grid gap-4 md:grid-cols-[2fr,3fr]">
          <div>
            <h2 className="text-sm font-semibold">
              Links úteis para quem busca emprego
            </h2>
            <p className="mt-1 text-[11px] text-slate-300">
              Acesse serviços oficiais e materiais que podem ajudar na sua
              recolocação profissional.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <a
              href="https://empregabrasil.mte.gov.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-500 px-3 py-1 hover:bg-slate-800"
            >
              SINE / Emprega Brasil
            </a>
            <a
              href="https://www.gov.br/trabalho-e-emprego/pt-br"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-500 px-3 py-1 hover:bg-slate-800"
            >
              Ministério do Trabalho
            </a>
            <a
              href="#"
              className="rounded-full border border-slate-500 px-3 py-1 hover:bg-slate-800"
            >
              Em breve: Dicas de currículo e entrevista
            </a>
          </div>
        </div>
      </section>
      {/* O rodapé do peixinho vem depois, no layout global */}
    </main>
  );
}

