"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";
import SmartSelect from "../components/SmartSelect";

/* ✅ BANNERS AFILIADOS (TOPO) */
const bannersTopo = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

/* ✅ BANNERS AFILIADOS (RODAPÉ) — PRINCIPAL */
const bannersRodape = [
  {
    src: "/banners/rodape/banner-rodape-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

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

/* ✅ HERO Premium (sem piscar) */
const heroImages = ["/hero/empregos-01.webp", "/hero/empregos-02.webp"];

// ✅ LINKS DAS LISTAS (bem importante ficar padronizado)
const URL_LISTA_VAGAS = "/empregos/lista?categoria=emprego";
const URL_LISTA_CURRICULOS = "/empregos/lista?categoria=curriculo";

export default function EmpregosPage() {
  const router = useRouter();

  const [vagasRecentes, setVagasRecentes] = useState([]);
  const [curriculosRecentes, setCurriculosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ✅ BUSCA PREMIUM (padrão /busca)
  const [textoBusca, setTextoBusca] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [modoBusca, setModoBusca] = useState("emprego"); // "emprego" | "curriculo"

  function handleBuscar() {
    const partes = [];
    if (textoBusca.trim()) partes.push(textoBusca.trim());
    if (cidadeBusca) partes.push(cidadeBusca);

    const q = partes.join(" ").trim();

    const params = new URLSearchParams();
    if (q) params.set("q", q);

    // ✅ Empregos tem duas categorias distintas no banco: "emprego" e "curriculo"
    params.set("categoria", modoBusca);

    router.push(`/busca?${params.toString()}`);
  }

  // ✅ HERO — sem piscar (preload + fade)
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState(() => new Set());
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    heroImages.forEach((src) => {
      const im = new window.Image();
      im.src = src;
      im.onload = () =>
        setLoadedSet((prev) => {
          const n = new Set(prev);
          n.add(src);
          return n;
        });
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFadeIn(false);
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const src = heroImages[heroIndex];
    if (loadedSet.has(src)) {
      const id = setTimeout(() => setFadeIn(true), 30);
      return () => clearTimeout(id);
    }
  }, [heroIndex, loadedSet]);

  const heroSrc = heroImages[heroIndex];

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
      {/* ✅ BANNER TOPO (afiliado, rotativo, clicável) */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator
            images={bannersTopo}
            interval={6000}
            height={120}
            maxWidth={720}
          />
        </div>
      </section>

      {/* ✅ HERO PREMIUM */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200" />

          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: loadedSet.has(heroSrc) && fadeIn ? 1 : 0,
              backgroundImage: `url(${heroSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <Image
            src={heroSrc}
            alt="Pré-carregamento hero"
            fill
            className="opacity-0 pointer-events-none"
          />
        </div>

        <div className="absolute inset-0 bg-white/10" />

        <div className="absolute inset-x-0 top-[12%] flex flex-col items-center px-4 text-center">
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-black [text-shadow:0_3px_14px_rgba(255,255,255,0.85)]">
            Classilagos – Empregos
          </h1>

          <p className="mt-4 text-base md:text-lg font-extrabold uppercase text-black leading-tight [text-shadow:0_3px_14px_rgba(255,255,255,0.85)]">
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
      </section>

      {/* ✅ CAIXA DE BUSCA PREMIUM */}
      <section className="bg-[#F5FBFF]">
        <div className="max-w-5xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
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

              <SmartSelect
                label="Buscar em"
                value={modoBusca === "curriculo" ? "Currículos" : "Vagas"}
                onChange={(v) =>
                  setModoBusca(v === "Currículos" ? "curriculo" : "emprego")
                }
                options={["Vagas", "Currículos"]}
              />

              <SmartSelect
                label="Cidade"
                value={cidadeBusca || "Todas"}
                onChange={(v) => setCidadeBusca(v === "Todas" ? "" : v)}
                options={["Todas", ...cidades]}
              />

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

          {/* ✅ ATALHOS PREMIUM (VISÍVEIS) PARA AS LISTAS */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={URL_LISTA_VAGAS}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              Ver todas as vagas →
            </Link>
            <Link
              href={URL_LISTA_CURRICULOS}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              Ver banco de currículos →
            </Link>
          </div>
        </div>
      </section>

      {/* BLOCO – ESCOLHA CANDIDATO / EMPRESA */}
      <section className="max-w-5xl mx-auto px-4 mt-6 grid gap-4 md:grid-cols-2">
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
          <div className="flex flex-wrap gap-2">
            <Link
              href="/anunciar/curriculo"
              className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Começar agora →
            </Link>
            <Link
              href={URL_LISTA_CURRICULOS}
              className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Ver currículos →
            </Link>
          </div>
        </div>

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
          <div className="flex flex-wrap gap-2">
            <Link
              href="/anunciar/empregos"
              className="inline-flex items-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
            >
              Publicar vaga →
            </Link>
            <Link
              href={URL_LISTA_VAGAS}
              className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-900 hover:bg-cyan-100"
            >
              Ver vagas →
            </Link>
          </div>
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-900">
              Vagas recentes
            </h2>
            <Link
              href={URL_LISTA_VAGAS}
              className="text-[11px] font-semibold text-emerald-700 underline"
            >
              Ver todas →
            </Link>
          </div>

          {loading && <p className="text-[11px] text-slate-500">Carregando vagas…</p>}

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
                    {logo ? (
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
                    ) : (
                      <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                        Logo
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                        {vaga.titulo}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {vaga.cidade}
                        {vaga.bairro ? ` • ${vaga.bairro}` : ""}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        {vaga.tipo_vaga || ""}
                        {vaga.faixa_salarial ? ` • ${vaga.faixa_salarial}` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CURRÍCULOS RECENTES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-900">
              Currículos recentes
            </h2>
            <Link
              href={URL_LISTA_CURRICULOS}
              className="text-[11px] font-semibold text-slate-700 underline"
            >
              Ver todos →
            </Link>
          </div>

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

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) */}
      <section className="bg-[#F5FBFF] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator
            images={bannersRodape}
            interval={6500}
            height={170}
            maxWidth={720}
          />
        </div>
      </section>

{/* FAIXA – SERVIÇOS (EMPREGOS) */}
<section className="bg-slate-900 py-8">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-sm font-semibold text-white mb-1">
      Serviços e informações para Empregos
    </h2>

    <p className="text-xs text-slate-300 mb-4 max-w-2xl">
      Atalhos úteis para vagas oficiais, qualificação profissional e oportunidades na Região dos Lagos.
    </p>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* CARD 1 — Vagas (SINE / MTE) */}
      <a
        href="https://servicos.mte.gov.br/empregador/#/login"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-lente rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm block transition hover:bg-slate-800"
      >
        <h3 className="text-sm font-semibold text-white mb-1">
          Vagas oficiais (SINE / MTE)
        </h3>
        <p className="text-[11px] text-slate-300">
          Acesso ao portal oficial do Ministério do Trabalho para vagas e serviços do emprego.
        </p>
      </a>

      {/* CARD 2 — Cursos / Qualificação (Caminho Digital) */}
      <a
        href="https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/qualificacao-profissional/caminho-digital"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-lente rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm block transition hover:bg-slate-800"
      >
        <h3 className="text-sm font-semibold text-white mb-1">
          Cursos e qualificação (gratuitos)
        </h3>
        <p className="text-[11px] text-slate-300">
          Caminho Digital: cursos e trilhas de qualificação profissional (oficial).
        </p>
      </a>

      {/* CARD 3 — Concursos (em espera) */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-1">
          Concursos e seleções
        </h3>
        <p className="text-[11px] text-slate-300">
          Em breve: página oficial estável com consultas por órgão e período.
        </p>
      </div>

      {/* CARD 4 — Banco de empregos (Classilagos) */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-1">
          Banco de empregos Classilagos
        </h3>
        <p className="text-[11px] text-slate-300">
          Em breve: vagas locais, currículos e oportunidades na região.
        </p>
      </div>
    </div>
  </div>
</section>



      {/* rodapé global vem do layout */}
    </main>
  );
}
