"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

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

export default function EmpregosPage() {
  const router = useRouter();

  const [vagasRecentes, setVagasRecentes] = useState([]);
  const [curriculosRecentes, setCurriculosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ✅ BUSCA PREMIUM (padrão /busca)
  const [textoBusca, setTextoBusca] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [modoBusca, setModoBusca] = useState("emprego"); // "emprego" (vagas) | "curriculo" (currículos)

  function handleBuscar() {
    const partes = [];
    if (textoBusca.trim()) partes.push(textoBusca.trim());
    if (cidadeBusca) partes.push(cidadeBusca);

    const q = partes.join(" ").trim();

    const params = new URLSearchParams();
    if (q) params.set("q", q);

    // ✅ aqui é o ponto chave do padrão:
    // Empregos tem duas categorias distintas no banco: "emprego" e "curriculo"
    params.set("categoria", modoBusca);

    router.push(`/busca?${params.toString()}`);
  }

  // HERO – alternando 2 imagens no topo (padrão novo)
const heroImages = ["/empregos/empregos-01.webp", "/empregos/empregos-02.webp"];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setErro("");

        // VAGAS
        const { data: vagas, error: vagasError } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, faixa_salarial, tipo_vaga, modelo_trabalho, imagens, created_at, status"
          )
          .eq("categoria", "emprego")
          .order("created_at", { ascending: false })
          .limit(6);

        if (vagasError) throw vagasError;

        // CURRÍCULOS
        const { data: curriculos, error: curriculosError } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, area_profissional, curriculo_foto_url, created_at, status"
          )
          .eq("categoria", "curriculo")
          .order("created_at", { ascending: false })
          .limit(6);

        if (curriculosError) throw curriculosError;

        setVagasRecentes(vagas || []);
        setCurriculosRecentes(curriculos || []);
      } catch (e) {
        console.error("Erro ao carregar empregos:", e);
        setErro(
          "Não foi possível carregar vagas e currículos neste momento. Tente novamente em alguns instantes."
        );
        setVagasRecentes([]);
        setCurriculosRecentes([]);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* HERO PRINCIPAL – FOTO DE FUNDO + TEXTOS EM PRETO COM SOMBRA */}
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

          {/* Textos centralizados sobre a imagem */}
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center">
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-black объяс drop-shadow-md">
              Classilagos – Empregos
            </h1>

            {/* BLOCO DE TEXTO (O MESMO DA LUPA) – EM PRETO COM SOMBRA */}
            <p className="mt-4 text-base md:text-lg font-extrabold uppercase text-black leading-tight drop-shadow-md">
              VAGAS DE EMPREGO
              <br />
              BANCO DE CURRÍCULOS
              <br />
              E OPORTUNIDADES
              <br />
              EM TODA A REGIÃO
              <br />
              DOS LAGOS.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ CAIXA DE BUSCA PREMIUM (padrão Náutica: manda pra /busca) */}
      <section className="bg-[#F5FBFF]">
        <div className="max-w-5xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: atendente, auxiliar, diarista, home office..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={textoBusca}
                  onChange={(e) => setTextoBusca(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleBuscar();
                    }
                  }}
                />
              </div>

              {/* Buscar em */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Buscar em
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={modoBusca}
                  onChange={(e) => setModoBusca(e.target.value)}
                >
                  <option value="emprego">Vagas</option>
                  <option value="curriculo">Currículos</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={cidadeBusca}
                  onChange={(e) => setCidadeBusca(e.target.value)}
                >
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTextoBusca("");
                    setCidadeBusca("");
                    setModoBusca("emprego");
                  }}
                  className="w-full md:w-auto rounded-full bg-slate-200 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 hover:bg-slate-300"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={handleBuscar}
                  className="w-full md:w-auto rounded-full bg-emerald-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Busca ligada ao motor do Classilagos (padrão Premium).
          </p>
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
            href="/anunciar/curriculo"
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
            href="/anunciar/empregos"
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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

        {/* CURRÍCULOS RECENTES – COM FOTO */}
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* TARJA ANTES DO RODAPÉ DO PEIXINHO – SERVIÇOS E INFORMAÇÕES PARA EMPREGO */}
      <section className="mt-10 bg-slate-950 text-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div>
            <h2 className="text-sm font-semibold">
              Serviços e informações para quem busca emprego
            </h2>
            <p className="mt-1 text-[11px] text-slate-300 max-w-2xl">
              Use o Classilagos também como guia para acessar serviços oficiais
              e conteúdos que ajudam na sua recolocação profissional.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-4 text-[11px]">
              <h3 className="text-xs font-semibold mb-1">SINE / Emprega Brasil</h3>
              <p className="text-slate-300 mb-3">
                Cadastro, consulta de vagas e serviços do sistema nacional de
                emprego.
              </p>
              <a
                href="https://empregabrasil.mte.gov.br/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-emerald-400 px-3 py-1 font-semibold text-[11px] text-emerald-300 hover:bg-emerald-400/10"
              >
                Acessar site oficial →
              </a>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-4 text-[11px]">
              <h3 className="text-xs font-semibold mb-1">Ministério do Trabalho</h3>
              <p className="text-slate-300 mb-3">
                Informações sobre carteira de trabalho, direitos trabalhistas,
                programas e serviços.
              </p>
              <a
                href="https://www.gov.br/trabalho-e-emprego/pt-br"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-sky-400 px-3 py-1 font-semibold text-[11px] text-sky-300 hover:bg-sky-400/10"
              >
                Ver portal do governo →
              </a>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-4 text-[11px]">
              <h3 className="text-xs font-semibold mb-1">
                Dicas de currículo e entrevista
              </h3>
              <p className="text-slate-300 mb-3">
                Em breve, conteúdos exclusivos do Classilagos para você se
                preparar melhor para os processos seletivos.
              </p>
              <span className="inline-flex items-center rounded-full border border-slate-500 px-3 py-1 font-semibold text-[11px] text-slate-200">
                Em breve no Classilagos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* O rodapé do peixinho vem depois, no layout global */}
    </main>
  );
}

