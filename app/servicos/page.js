"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";

// ✅ HERO FIXO (1 imagem só)
const HERO_SRC = "/hero/servicos-01.webp";

// ✅ BANNERS AFILIADOS (Topo)
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

// ✅ BANNERS AFILIADOS (Rodapé) — PRINCIPAL
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

export default function ServicosPage() {
  const router = useRouter();

  const [classimed, setClassimed] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Busca Premium (ligada ao motor)
  const [textoBusca, setTextoBusca] = useState("");
  const [tipoServico, setTipoServico] = useState(""); // "", "classimed", "eventos", "profissionais"
  const [cidadeBusca, setCidadeBusca] = useState("");

  // Buscar serviços no Supabase (vitrine da página)
  useEffect(() => {
    let cancelado = false;

    const fetchServicos = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select("id, titulo, cidade, bairro, faixa_preco, atende_domicilio, subcategoria_servico, imagens, created_at, status, destaque, prioridade")
          .or("categoria.eq.servicos,categoria.eq.servico,categoria.eq.serviços")
          .or("status.is.null,status.eq.ativo")
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false });

        if (cancelado) return;

        if (error) {
          console.error("Erro ao carregar serviços:", error);
          setClassimed([]);
          setEventos([]);
          setProfissionais([]);
          setLoading(false);
          return;
        }

        const lista = data || [];

        setClassimed(lista.filter((s) => s.subcategoria_servico === "classimed").slice(0, 5));
        setEventos(lista.filter((s) => s.subcategoria_servico === "eventos").slice(0, 5));
        setProfissionais(lista.filter((s) => s.subcategoria_servico === "profissionais").slice(0, 5));
      } catch (e) {
        console.error("Erro inesperado ao carregar serviços:", e);
        setClassimed([]);
        setEventos([]);
        setProfissionais([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    fetchServicos();
    return () => {
      cancelado = true;
    };
  }, []);

  // Card reutilizável com miniatura opcional
  const CardServico = ({ item }) => {
    const thumb = Array.isArray(item.imagens) && item.imagens.length > 0 ? item.imagens[0] : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group flex gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md px-4 py-3 min-h-[110px]"
      >
        {thumb ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0">
            Sem foto
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[13px] text-slate-900 truncate">{item.titulo}</p>
          <p className="text-[11px] text-slate-600">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
            {item.faixa_preco && <span className="font-semibold text-emerald-700">{item.faixa_preco}</span>}
            {item.atende_domicilio && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                Atende em domicílio
              </span>
            )}
          </div>

          <span className="mt-1 inline-block text-[11px] text-blue-600 group-hover:underline">
            Ver detalhes do serviço →
          </span>
        </div>
      </Link>
    );
  };

  function handleBuscar() {
    const partes = [];
    if (textoBusca.trim()) partes.push(textoBusca.trim());

    if (tipoServico === "classimed") partes.push("classimed");
    if (tipoServico === "eventos") partes.push("eventos");
    if (tipoServico === "profissionais") partes.push("profissionais");

    if (cidadeBusca) partes.push(cidadeBusca);

    const q = partes.join(" ").trim();

    const params = new URLSearchParams();
    if (q) params.set("q", q);

    // ✅ categoria do motor (padrão Premium)
    params.set("categoria", "servicos");

    router.push(`/busca?${params.toString()}`);
  }

  function handleLimpar() {
    setTextoBusca("");
    setTipoServico("");
    setCidadeBusca("");
  }

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (afiliado, rotativo, clicável) */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* ✅ HERO FIXO (1 imagem) */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image src={HERO_SRC} alt="Classilagos – Serviços" fill priority sizes="100vw" className="object-cover" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/45" />

        {/* ✅ Textos MAIS ALTOS + sombra premium */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white translate-y-[-24px] sm:translate-y-[-32px]">
          <p className="text-xs sm:text-sm md:text-base font-medium max-w-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.70)]">
            Encontre profissionais e empresas para tudo o que você precisar.
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold [text-shadow:0_6px_20px_rgba(0,0,0,0.80)]">
            Classilagos – Serviços
          </h1>

          <div className="mt-3 flex justify-center">
            <div className="h-[3px] w-44 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* ✅ CAIXA DE BUSCA (Padrão Premium - ligada ao motor) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Busca</label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista, diarista, dentista, buffet..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
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

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Tipo</label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={tipoServico}
                  onChange={(e) => setTipoServico(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="classimed">Saúde (Classimed)</option>
                  <option value="eventos">Festas &amp; Eventos</option>
                  <option value="profissionais">Profissionais</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Cidade</label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={cidadeBusca}
                  onChange={(e) => setCidadeBusca(e.target.value)}
                >
                  <option value="">Toda a região</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleLimpar}
                  className="w-full md:w-auto rounded-full bg-slate-100 border border-slate-200 px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Limpar
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleBuscar}
                  className="w-full md:w-auto rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">Busca ligada ao motor do Classilagos (padrão Premium).</p>

          {/* ✅ ACESSO RÁPIDO (VISÍVEL) */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link
              href="/servicos/lista"
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              Ver todos os serviços →
            </Link>

            <Link
              href="/servicos/lista?tipo=classimed"
              className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Saúde (Classimed)
            </Link>

            <Link
              href="/servicos/lista?tipo=eventos"
              className="inline-flex rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-[11px] font-semibold text-pink-700 hover:bg-pink-100"
            >
              Festas &amp; Eventos
            </Link>

            <Link
              href="/servicos/lista?tipo=profissionais"
              className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
            >
              Profissionais
            </Link>
          </div>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* 3 PILARES */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <h2 className="text-center text-sm font-semibold text-slate-900 mb-4">
          Escolha o tipo de serviço que deseja encontrar ou divulgar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <Link
            href="/anunciar/servicos/classimed"
            className="group flex flex-col justify-between h-full rounded-3xl border border-emerald-500 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">🩺</div>
                <div className="text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Saúde &amp; bem-estar</p>
                  <h3 className="text-base md:text-lg font-bold text-slate-900">Classimed</h3>
                </div>
              </div>
              <p className="text-xs text-slate-700">Clínicas, terapeutas, cuidadores, psicólogos, nutricionistas e muito mais.</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-700 group-hover:underline">Anunciar →</span>
              <span className="text-[11px] font-semibold text-slate-600 group-hover:underline">Ver lista →</span>
            </div>
          </Link>

          <Link
            href="/anunciar/servicos/eventos"
            className="group flex flex-col justify-between h-full rounded-3xl border border-pink-400 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-2xl">🎉</div>
                <div className="text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-pink-600">Festas &amp; eventos</p>
                  <h3 className="text-base md:text-lg font-bold text-slate-900">Eventos</h3>
                </div>
              </div>
              <p className="text-xs text-slate-700">Buffet, doces e salgados, fotografia, DJ, decoração, espaços para festas e muito mais.</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-pink-700 group-hover:underline">Anunciar →</span>
              <span className="text-[11px] font-semibold text-slate-600 group-hover:underline">Ver lista →</span>
            </div>
          </Link>

          <Link
            href="/anunciar/servicos/profissionais"
            className="group flex flex-col justify-between h-full rounded-3xl border border-blue-400 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-2xl">🛠️</div>
                <div className="text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">Profissionais &amp; serviços</p>
                  <h3 className="text-base md:text-lg font-bold text-slate-900">Profissionais</h3>
                </div>
              </div>
              <p className="text-xs text-slate-700">Eletricistas, diaristas, manutenção, reboque, arquitetos, engenheiros, piscineiros e muito mais.</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-700 group-hover:underline">Anunciar →</span>
              <span className="text-[11px] font-semibold text-slate-600 group-hover:underline">Ver lista →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* VITRINE 3 COLUNAS */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <h2 className="text-sm md:text-base font-semibold text-slate-900 mb-4 text-center md:text-left">
          Profissionais em destaque na Região dos Lagos
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {/* CLASSIMED */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Saúde (Classimed)</h3>
                {!loading && <p className="text-[11px] text-slate-500">{classimed.length} anúncio(s)</p>}
              </div>

              <Link href="/servicos/lista?tipo=classimed" className="text-[11px] font-semibold text-emerald-700 hover:underline">
                Ver todos →
              </Link>
            </div>

            {loading && classimed.length === 0 && <p className="text-[11px] text-slate-500">Carregando serviços de saúde…</p>}
            {!loading && classimed.length === 0 && <p className="text-[11px] text-slate-500">Ainda não há serviços de saúde cadastrados.</p>}

            <div className="space-y-3">{classimed.map((item) => <CardServico key={item.id} item={item} />)}</div>
          </div>

          {/* EVENTOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Festas &amp; eventos</h3>
                {!loading && <p className="text-[11px] text-slate-500">{eventos.length} anúncio(s)</p>}
              </div>

              <Link href="/servicos/lista?tipo=eventos" className="text-[11px] font-semibold text-pink-700 hover:underline">
                Ver todos →
              </Link>
            </div>

            {loading && eventos.length === 0 && <p className="text-[11px] text-slate-500">Carregando serviços de eventos…</p>}
            {!loading && eventos.length === 0 && <p className="text-[11px] text-slate-500">Ainda não há serviços de festas e eventos cadastrados.</p>}

            <div className="space-y-3">{eventos.map((item) => <CardServico key={item.id} item={item} />)}</div>
          </div>

          {/* PROFISSIONAIS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Profissionais &amp; serviços</h3>
                {!loading && <p className="text-[11px] text-slate-500">{profissionais.length} anúncio(s)</p>}
              </div>

              <Link href="/servicos/lista?tipo=profissionais" className="text-[11px] font-semibold text-blue-700 hover:underline">
                Ver todos →
              </Link>
            </div>

            {loading && profissionais.length === 0 && <p className="text-[11px] text-slate-500">Carregando profissionais…</p>}
            {!loading && profissionais.length === 0 && <p className="text-[11px] text-slate-500">Ainda não há profissionais cadastrados.</p>}

            <div className="space-y-3">{profissionais.map((item) => <CardServico key={item.id} item={item} />)}</div>
          </div>
        </div>
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) — com respiro pra NÃO colar na tarja */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

{/* TARJA PRETA – CONTRATE COM SEGURANÇA */}
<section className="bg-slate-950 text-slate-50">
  <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
    <div>
      <h2 className="text-sm font-semibold">
        Contrate serviços com mais segurança
      </h2>
      <p className="mt-1 text-[11px] text-slate-300 max-w-2xl">
        O Classilagos ajuda você a escolher profissionais confiáveis, evitar problemas
        e tomar decisões mais seguras ao contratar serviços na Região dos Lagos.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      
      {/* CARD 1 */}
      <div className="btn-lente rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-4">
        <h3 className="text-xs font-semibold mb-1">
          Como contratar com segurança
        </h3>
        <p className="text-[11px] text-slate-300">
          Dicas importantes para verificar profissionais, evitar golpes,
          combinar pagamentos e contratar com mais tranquilidade.
        </p>
      </div>

      {/* CARD 2 */}
      <div className="btn-lente rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-4">
        <h3 className="text-xs font-semibold mb-1">
          Profissionais verificados
        </h3>
        <p className="text-[11px] text-slate-300">
          Em breve, perfis com informações completas, histórico,
          avaliações e selo de confiança Classilagos.
        </p>
      </div>

      {/* CARD 3 */}
      <div className="btn-lente rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-4">
        <h3 className="text-xs font-semibold mb-1">
          Indique um profissional
        </h3>
        <p className="text-[11px] text-slate-300">
          Conhece alguém de confiança? Em breve você poderá indicar
          profissionais e ajudar a fortalecer o comércio local.
        </p>
      </div>

    </div>
  </div>
</section>


      {/* Footer global vem do layout */}
    </main>
  );
}
