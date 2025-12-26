"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import BannerRotator from "../../components/BannerRotator";

// BANNERS (padrão HOME)
const BANNERS_TOPO = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Praia e Camping (Mercado Livre)",
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

const BANNERS_RODAPE = [
  {
    src: "/banners/rodape/banner-rodape-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Praia e Camping (Mercado Livre)",
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

export default function AnuncioDetalhePage() {
  const { id } = useParams();

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [similares, setSimilares] = useState([]);

  // URL atual (para compartilhar)
  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  // Buscar anúncio + similares
  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      setLoading(true);
      setErro(null);

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar anúncio:", error);
        setErro("Não foi possível carregar este anúncio.");
        setLoading(false);
        return;
      }

      setAnuncio(data);
      setFotoIndex(0);

      const campos =
        "id, titulo, cidade, bairro, preco, faixa_preco, tipo_imovel, finalidade, imagens, categoria, pilar_turismo, subcategoria_turismo, area_profissional, subcategoria_servico, created_at, destaque";

      // helpers
      const norm = (v) =>
        (v || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
      const isTemporada = (v) => {
        const f = norm(v);
        return (
          f === "temporada" ||
          f === "aluguel temporada" ||
          f === "aluguel_temporada"
        );
      };
      const isAluguel = (v) => {
        const f = norm(v);
        return f === "aluguel" || f === "aluguel fixo" || f === "aluguel_fixo";
      };

      const categoriaAtual = data.categoria || "";
      const cidadeAtual = data.cidade || "";
      const bairroAtual = data.bairro || "";
      const tipoImovelAtual = data.tipo_imovel || "";
      const pilarTurismoAtual = data.pilar_turismo || "";
      const subcatTurismoAtual = data.subcategoria_turismo || "";
      const areaProfAtual = data.area_profissional || "";
      const subcatServicoAtual = data.subcategoria_servico || "";
      const fAtual = norm(data.finalidade);

      // filtro de finalidade (só para imoveis, onde isso existe)
      const aplicarFiltroFinalidade = (q) => {
        if (categoriaAtual !== "imoveis") return q;

        if (isTemporada(fAtual)) {
          return q.or(
            "finalidade.eq.temporada,finalidade.eq.aluguel temporada,finalidade.eq.aluguel_temporada"
          );
        }
        if (isAluguel(fAtual)) {
          return q.or(
            "finalidade.eq.aluguel,finalidade.eq.aluguel fixo,finalidade.eq.aluguel_fixo"
          );
        }
        if (fAtual) return q.eq("finalidade", data.finalidade);
        return q;
      };

      let lista = [];

      // Estratégia Premium (sem complicar):
      // 1) mesma categoria + mesma cidade + (refino por campo quando existir)
      // 2) mesma categoria + mesma cidade
      // 3) mesma categoria (geral)
      try {
        let q1 = supabase
          .from("anuncios")
          .select(campos)
          .eq("categoria", categoriaAtual)
          .eq("status", "ativo")
          .neq("id", data.id)
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(16);

        q1 = aplicarFiltroFinalidade(q1);

        if (cidadeAtual) q1 = q1.eq("cidade", cidadeAtual);

        // refinamentos por categoria
        if (categoriaAtual === "imoveis" && tipoImovelAtual) {
          q1 = q1.eq("tipo_imovel", tipoImovelAtual);
        }
        if (categoriaAtual === "turismo" && pilarTurismoAtual) {
          q1 = q1.eq("pilar_turismo", pilarTurismoAtual);
          if (subcatTurismoAtual) q1 = q1.eq("subcategoria_turismo", subcatTurismoAtual);
        }
        if (categoriaAtual === "emprego" && areaProfAtual) {
          q1 = q1.eq("area_profissional", areaProfAtual);
        }
        if (categoriaAtual === "servico" && subcatServicoAtual) {
          q1 = q1.eq("subcategoria_servico", subcatServicoAtual);
        }
        if (bairroAtual && (categoriaAtual === "lagolistas" || categoriaAtual === "servico")) {
          q1 = q1.eq("bairro", bairroAtual);
        }

        const r1 = await q1;
        if (!r1.error && Array.isArray(r1.data)) lista = r1.data;
      } catch (e) {
        console.warn("Falha ao buscar similares (r1):", e);
      }

      if (lista.length < 4) {
        try {
          let q2 = supabase
            .from("anuncios")
            .select(campos)
            .eq("categoria", categoriaAtual)
            .eq("status", "ativo")
            .neq("id", data.id)
            .order("destaque", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(16);

          q2 = aplicarFiltroFinalidade(q2);
          if (cidadeAtual) q2 = q2.eq("cidade", cidadeAtual);

          const r2 = await q2;
          if (!r2.error && Array.isArray(r2.data)) {
            const ids = new Set(lista.map((x) => x.id));
            r2.data.forEach((x) => {
              if (!ids.has(x.id)) {
                ids.add(x.id);
                lista.push(x);
              }
            });
          }
        } catch (e) {
          console.warn("Falha ao buscar similares (r2):", e);
        }
      }

      if (lista.length < 4) {
        try {
          let q3 = supabase
            .from("anuncios")
            .select(campos)
            .eq("categoria", categoriaAtual)
            .eq("status", "ativo")
            .neq("id", data.id)
            .order("destaque", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(16);

          q3 = aplicarFiltroFinalidade(q3);

          const r3 = await q3;
          if (!r3.error && Array.isArray(r3.data)) {
            const ids = new Set(lista.map((x) => x.id));
            r3.data.forEach((x) => {
              if (!ids.has(x.id)) {
                ids.add(x.id);
                lista.push(x);
              }
            });
          }
        } catch (e) {
          console.warn("Falha ao buscar similares (r3):", e);
        }
      }

      setSimilares(lista.slice(0, 4));
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-600">Carregando anúncio…</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <p className="text-sm text-slate-700 mb-4">
          {erro || "Anúncio não encontrado."}
        </p>
        <Link
          href="/"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700"
        >
          Voltar para a página inicial
        </Link>
      </main>
    );
  }

  // Flags por tipo
  const isCurriculo = anuncio.categoria === "curriculo";
  const isEmprego = anuncio.categoria === "emprego";
  const isServico = anuncio.categoria === "servico";
  const isLagolistas = anuncio.categoria === "lagolistas";
  const isPets = anuncio.categoria === "pets";
  const isImoveis = anuncio.categoria === "imoveis";
  const isVeiculos = anuncio.categoria === "veiculos";
  const isTurismo = anuncio.categoria === "turismo";

  // Imagens
  const imagens = useMemo(
    () => (Array.isArray(anuncio.imagens) ? anuncio.imagens.filter(Boolean) : []),
    [anuncio.imagens]
  );

  const temImagens = imagens.length > 0;
  const mostrarGaleria = temImagens && !isCurriculo && !isEmprego;

  const fotoAtual = temImagens
    ? imagens[Math.min(fotoIndex, imagens.length - 1)]
    : null;

  // Contatos
  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";
  const imobiliaria = anuncio.imobiliaria || "";
  const corretor = anuncio.corretor || "";
  const creci = anuncio.creci || "";

  const whatsappDigits = (whatsappRaw || "").replace(/\D/g, "");

  const whatsappLink = whatsappDigits
    ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
        `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos e gostaria de mais informações.`
      )}`
    : null;

  // WhatsApp do PARCEIRO (por enquanto: anunciante)
  const parceiroDigits = whatsappDigits;

  // Compartilhamento
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este anúncio no Classilagos: ${anuncio.titulo}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Endereço para mapa
  const enderecoCompleto = [anuncio.endereco || "", anuncio.bairro || "", anuncio.cidade || ""]
    .join(" ")
    .trim();

  const mapaQuery = encodeURIComponent(
    enderecoCompleto || anuncio.cidade || "Região dos Lagos RJ"
  );
  const mapaUrl = `https://www.google.com/maps?q=${mapaQuery}&output=embed`;

  // Título dinâmico da seção de similares
  const tituloSimilares =
    anuncio.categoria === "veiculos"
      ? "Veículos similares na Região dos Lagos"
      : anuncio.categoria === "imoveis"
      ? "Imóveis similares na Região dos Lagos"
      : anuncio.categoria === "emprego"
      ? "Vagas que podem interessar"
      : anuncio.categoria === "curriculo"
      ? "Currículos recentes na Região dos Lagos"
      : anuncio.categoria === "servico"
      ? "Serviços similares na Região dos Lagos"
      : anuncio.categoria === "lagolistas"
      ? "Comércios similares na Região dos Lagos"
      : anuncio.categoria === "pets"
      ? "Anúncios de pets similares na Região dos Lagos"
      : anuncio.categoria === "turismo"
      ? "Turismo: opções parecidas na Região dos Lagos"
      : "Anúncios similares na Região dos Lagos";

  // Texto dinâmico quando não houver similares
  const textoSimilaresVazio =
    anuncio.categoria === "veiculos"
      ? "Em breve mais veículos nesta região aparecerão aqui."
      : anuncio.categoria === "imoveis"
      ? "Em breve mais imóveis nesta região aparecerão aqui."
      : anuncio.categoria === "emprego"
      ? "Em breve mais vagas aparecerão aqui."
      : anuncio.categoria === "curriculo"
      ? "Em breve mais currículos cadastrados aparecerão aqui."
      : anuncio.categoria === "servico"
      ? "Em breve mais serviços cadastrados aparecerão aqui."
      : anuncio.categoria === "lagolistas"
      ? "Em breve mais comércios desta região aparecerão aqui."
      : anuncio.categoria === "pets"
      ? "Em breve mais anúncios de pets nesta região aparecerão aqui."
      : anuncio.categoria === "turismo"
      ? "Em breve mais opções de turismo aparecerão aqui."
      : "Em breve mais anúncios nesta região aparecerão aqui.";

  // Rota para o "voltar"
  const rotaVoltar =
    anuncio.categoria === "veiculos"
      ? "/veiculos"
      : anuncio.categoria === "imoveis"
      ? "/imoveis"
      : anuncio.categoria === "emprego" || anuncio.categoria === "curriculo"
      ? "/empregos"
      : anuncio.categoria === "servico"
      ? "/servicos"
      : anuncio.categoria === "lagolistas"
      ? "/lagolistas"
      : anuncio.categoria === "pets"
      ? "/pets"
      : anuncio.categoria === "turismo"
      ? "/turismo"
      : "/";

  const textoVoltar =
    anuncio.categoria === "veiculos"
      ? "Veículos"
      : anuncio.categoria === "imoveis"
      ? "Imóveis"
      : anuncio.categoria === "emprego" || anuncio.categoria === "curriculo"
      ? "Empregos"
      : anuncio.categoria === "servico"
      ? "Serviços"
      : anuncio.categoria === "lagolistas"
      ? "LagoListas"
      : anuncio.categoria === "pets"
      ? "Pets"
      : anuncio.categoria === "turismo"
      ? "Turismo"
      : "a lista";

  // helper: preço numérico para simulação (robusto)
  const precoNumero = (() => {
    const raw = (anuncio?.preco ?? "").toString();
    const digits = raw.replace(/[^\d]/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? n : 0;
  })();

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      {/* BANNER TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator images={BANNERS_TOPO} height={120} maxWidth={900} interval={5000} />
        </div>
      </section>

      {/* CABEÇALHO DO ANÚNCIO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
          {isLagolistas ? (
            <div className="rounded-3xl bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-100 border border-amber-200 px-4 py-3 md:px-6 md:py-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-900/80">
                    Classilagos – LagoListas
                  </p>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">
                    {anuncio.titulo}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-800/80">
                    {anuncio.cidade}
                    {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                  </p>
                </div>

                <Link
                  href={rotaVoltar}
                  className="hidden sm:inline-flex rounded-full border border-slate-900/20 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-white"
                >
                  Voltar para {textoVoltar}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-slate-800/80">Compartilhar:</span>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
                >
                  🟢 WhatsApp
                </a>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#1877F2] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
                >
                  📘 Facebook
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] text-slate-500">
                    Classilagos –{" "}
                    {isVeiculos
                      ? "Veículos"
                      : isImoveis
                      ? "Imóveis"
                      : isEmprego
                      ? "Empregos"
                      : isCurriculo
                      ? "Currículos"
                      : isServico
                      ? "Serviços"
                      : isLagolistas
                      ? "LagoListas"
                      : isPets
                      ? "Pets"
                      : isTurismo
                      ? "Turismo"
                      : "Anúncios"}
                  </p>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                    {anuncio.titulo}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600">
                    {anuncio.cidade}
                    {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                  </p>
                </div>

                <Link
                  href={rotaVoltar}
                  className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Voltar para {textoVoltar}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-slate-500">Compartilhar:</span>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
                >
                  🟢 WhatsApp
                </a>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#1877F2] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
                >
                  📘 Facebook
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* GALERIA DE FOTOS */}
        {mostrarGaleria && (
          <section className="w-full flex flex-col gap-3" id="fachada">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-4xl aspect-[16/9] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg">
                {fotoAtual ? (
                  <img
                    src={fotoAtual}
                    alt={anuncio.titulo}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                    Sem fotos para exibir
                  </div>
                )}
              </div>
            </div>

            {imagens.length > 1 && (
              <div className="w-full max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {imagens.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFotoIndex(index)}
                    className={`rounded-xl overflow-hidden border bg-white transition ${
                      Math.min(fotoIndex, imagens.length - 1) === index
                        ? "border-cyan-500 ring-2 ring-cyan-400/40"
                        : "border-slate-300 hover:border-cyan-400"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-4">
            {/* CURRÍCULO */}
            {isCurriculo ? (
              <>
                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    {anuncio.curriculo_foto_url && (
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                          <img
                            src={anuncio.curriculo_foto_url}
                            alt={anuncio.nome_contato || "Foto do candidato"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h2 className="text-base md:text-lg font-bold text-slate-900">
                        {anuncio.titulo?.startsWith("Currículo - ")
                          ? anuncio.titulo.replace("Currículo - ", "")
                          : anuncio.titulo}
                      </h2>

                      {anuncio.area_profissional && (
                        <p className="text-[11px] md:text-xs font-semibold text-emerald-700">
                          {anuncio.area_profissional}
                        </p>
                      )}

                      {(anuncio.cidade || anuncio.bairro) && (
                        <p className="text-[11px] text-slate-500">
                          {anuncio.cidade}
                          {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Resumo profissional
                  </h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line">
                    {anuncio.descricao ||
                      "O candidato ainda não preencheu o resumo profissional."}
                  </p>
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Experiências profissionais
                  </h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line">
                    {anuncio.experiencias_profissionais ||
                      "O candidato ainda não descreveu experiências profissionais."}
                  </p>
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Formação acadêmica / cursos
                  </h3>

                  {anuncio.escolaridade_minima && (
                    <p className="text-[11px] text-slate-700">
                      <span className="font-semibold">Escolaridade: </span>
                      {anuncio.escolaridade_minima}
                    </p>
                  )}

                  {anuncio.formacao_academica && (
                    <p className="mt-1 text-xs text-slate-700 whitespace-pre-line">
                      {anuncio.formacao_academica}
                    </p>
                  )}

                  {!anuncio.escolaridade_minima && !anuncio.formacao_academica && (
                    <p className="text-xs text-slate-500">
                      O candidato ainda não informou formação acadêmica.
                    </p>
                  )}
                </section>

                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Habilidades e competências
                  </h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line">
                    {anuncio.habilidades ||
                      "O candidato ainda não descreveu habilidades e competências."}
                  </p>
                </section>

                {anuncio.idiomas && (
                  <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      Idiomas
                    </h3>
                    <p className="text-xs text-slate-700 whitespace-pre-line">
                      {anuncio.idiomas}
                    </p>
                  </section>
                )}

                {anuncio.curriculo_pdf_url && (
                  <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      Currículo em PDF
                    </h3>
                    <a
                      href={anuncio.curriculo_pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Baixar currículo em PDF
                    </a>
                  </section>
                )}
              </>
            ) : null}

            {/* Resumo do anúncio */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Resumo do anúncio
              </h2>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                {/* preço (somente onde faz sentido) */}
                {(isImoveis || isVeiculos || isPets) && anuncio.preco && (
                  <div>
                    <span className="font-semibold text-slate-900">Valor: </span>
                    R$ {anuncio.preco}
                  </div>
                )}

                {isEmprego && anuncio.faixa_salarial && (
                  <div>
                    <span className="font-semibold text-slate-900">Faixa salarial: </span>
                    {anuncio.faixa_salarial}
                  </div>
                )}

                {isServico && anuncio.faixa_preco && (
                  <div>
                    <span className="font-semibold text-slate-900">Faixa de preço: </span>
                    {anuncio.faixa_preco}
                  </div>
                )}

                {anuncio.tipo_imovel && (
                  <div>
                    <span className="font-semibold text-slate-900">Tipo: </span>
                    {anuncio.tipo_imovel}
                  </div>
                )}

                {anuncio.finalidade && (
                  <div>
                    <span className="font-semibold text-slate-900">Finalidade: </span>
                    {anuncio.finalidade === "venda" && "Venda"}
                    {anuncio.finalidade === "aluguel_fixo" && "Aluguel fixo"}
                    {anuncio.finalidade === "aluguel" && "Aluguel"}
                    {anuncio.finalidade === "temporada" && "Aluguel por temporada"}
                    {["aluguel temporada", "aluguel_temporada"].includes(anuncio.finalidade) &&
                      "Aluguel por temporada"}
                  </div>
                )}

                {anuncio.area && (
                  <div>
                    <span className="font-semibold text-slate-900">Área: </span>
                    {anuncio.area} m²
                  </div>
                )}
                {anuncio.quartos && (
                  <div>
                    <span className="font-semibold text-slate-900">Quartos: </span>
                    {anuncio.quartos}
                  </div>
                )}
                {anuncio.banheiros && (
                  <div>
                    <span className="font-semibold text-slate-900">Banheiros: </span>
                    {anuncio.banheiros}
                  </div>
                )}
                {anuncio.vagas && (
                  <div>
                    <span className="font-semibold text-slate-900">Vagas: </span>
                    {anuncio.vagas}
                  </div>
                )}

                {isEmprego && anuncio.area_profissional && (
                  <div>
                    <span className="font-semibold text-slate-900">Área: </span>
                    {anuncio.area_profissional}
                  </div>
                )}
                {isEmprego && anuncio.tipo_vaga && (
                  <div>
                    <span className="font-semibold text-slate-900">Tipo de vaga: </span>
                    {anuncio.tipo_vaga}
                  </div>
                )}
                {isEmprego && anuncio.modelo_trabalho && (
                  <div>
                    <span className="font-semibold text-slate-900">Modelo: </span>
                    {anuncio.modelo_trabalho}
                  </div>
                )}
                {isEmprego && anuncio.carga_horaria && (
                  <div>
                    <span className="font-semibold text-slate-900">Carga horária: </span>
                    {anuncio.carga_horaria}
                  </div>
                )}

                {isServico && anuncio.subcategoria_servico && (
                  <div>
                    <span className="font-semibold text-slate-900">Tipo de serviço: </span>
                    {anuncio.subcategoria_servico === "classimed" && "Saúde (Classimed)"}
                    {anuncio.subcategoria_servico === "eventos" && "Festas & Eventos"}
                    {anuncio.subcategoria_servico === "profissionais" && "Profissionais & Serviços"}
                  </div>
                )}

                {isServico && anuncio.nome_negocio && (
                  <div>
                    <span className="font-semibold text-slate-900">Nome do negócio: </span>
                    {anuncio.nome_negocio}
                  </div>
                )}

                {isServico && anuncio.horario_atendimento && (
                  <div>
                    <span className="font-semibold text-slate-900">Horário de atendimento: </span>
                    {anuncio.horario_atendimento}
                  </div>
                )}

                {isServico && typeof anuncio.atende_domicilio === "boolean" && (
                  <div>
                    <span className="font-semibold text-slate-900">Atende em domicílio: </span>
                    {anuncio.atende_domicilio ? "Sim" : "Não"}
                  </div>
                )}

                {anuncio.marca && (
                  <div>
                    <span className="font-semibold text-slate-900">Marca: </span>
                    {anuncio.marca}
                  </div>
                )}
                {anuncio.modelo && (
                  <div>
                    <span className="font-semibold text-slate-900">Modelo: </span>
                    {anuncio.modelo}
                  </div>
                )}
                {anuncio.ano && (
                  <div>
                    <span className="font-semibold text-slate-900">Ano: </span>
                    {anuncio.ano}
                  </div>
                )}
                {anuncio.km && (
                  <div>
                    <span className="font-semibold text-slate-900">Km: </span>
                    {anuncio.km}
                  </div>
                )}
              </div>
            </div>

            {/* BLOCO ESPECIAL LAGOLISTAS */}
            {isLagolistas && (
              <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Informações do estabelecimento
                </h2>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                  <div className="flex-shrink-0">
                    {imagens && imagens.length > 0 && (
                      <div className="block">
                        <img
                          src={imagens[0]}
                          alt={anuncio.titulo || "Foto do estabelecimento"}
                          className="h-24 w-24 md:h-28 md:w-28 rounded-xl object-cover border border-slate-200"
                        />
                        <span className="mt-1 block text-[11px] text-slate-600">
                          Logo / fachada do comércio
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 text-xs md:text-sm flex-1 md:grid-cols-2">
                    {anuncio.nome_negocio && (
                      <div>
                        <p className="font-medium text-slate-800">Nome do comércio</p>
                        <p className="text-slate-700">{anuncio.nome_negocio}</p>
                      </div>
                    )}

                    {anuncio.razao_social && (
                      <div>
                        <p className="font-medium text-slate-800">Razão social</p>
                        <p className="text-slate-700">{anuncio.razao_social}</p>
                      </div>
                    )}

                    {anuncio.cnpj && (
                      <div>
                        <p className="font-medium text-slate-800">CNPJ</p>
                        <p className="text-slate-700">{anuncio.cnpj}</p>
                      </div>
                    )}

                    {anuncio.inscricao_municipal && (
                      <div>
                        <p className="font-medium text-slate-800">Inscrição municipal</p>
                        <p className="text-slate-700">{anuncio.inscricao_municipal}</p>
                      </div>
                    )}

                    {anuncio.registro_profissional && (
                      <div>
                        <p className="font-medium text-slate-800">Registro profissional</p>
                        <p className="text-slate-700">{anuncio.registro_profissional}</p>
                      </div>
                    )}

                    {(anuncio.endereco || anuncio.bairro || anuncio.cidade) && (
                      <div className="md:col-span-2">
                        <p className="font-medium text-slate-800">Endereço</p>
                        <p className="text-slate-700">
                          {anuncio.endereco && `${anuncio.endereco}`}
                          {anuncio.bairro && ` - ${anuncio.bairro}`}
                          {anuncio.cidade && `, ${anuncio.cidade}`}
                        </p>
                      </div>
                    )}

                    {(anuncio.site_url || anuncio.instagram) && (
                      <div className="md:col-span-2 flex flex-wrap gap-3 mt-1">
                        {anuncio.site_url && (
                          <a
                            href={anuncio.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] md:text-xs text-blue-600 underline"
                          >
                            Visitar site
                          </a>
                        )}
                        {anuncio.instagram && (
                          <a
                            href={
                              anuncio.instagram.startsWith("http")
                                ? anuncio.instagram
                                : `https://instagram.com/${anuncio.instagram.replace("@", "")}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] md:text-xs text-pink-600 underline"
                          >
                            Ver Instagram
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Descrição + mapa */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Descrição
                </h2>
                <p className="text-xs text-slate-700 whitespace-pre-line">
                  {anuncio.descricao}
                </p>

                {(anuncio.condominio || anuncio.iptu || anuncio.aceita_financiamento) && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    {anuncio.condominio && (
                      <div>
                        <span className="font-semibold text-slate-900">Condomínio: </span>
                        R$ {anuncio.condominio}
                      </div>
                    )}
                    {anuncio.iptu && (
                      <div>
                        <span className="font-semibold text-slate-900">IPTU (ano): </span>
                        R$ {anuncio.iptu}
                      </div>
                    )}
                    {anuncio.aceita_financiamento && (
                      <div className="col-span-full">
                        <span className="font-semibold text-slate-900">
                          Aceita financiamento:{" "}
                        </span>
                        {anuncio.aceita_financiamento}
                      </div>
                    )}
                  </div>
                )}

                {/* Links extras para serviços */}
                {isServico && (anuncio.site_url || anuncio.instagram) && (
                  <div className="mt-4 space-y-1 text-xs text-slate-700">
                    {anuncio.site_url && (
                      <p>
                        <span className="font-semibold text-slate-900">Site: </span>
                        <a
                          href={anuncio.site_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {anuncio.site_url}
                        </a>
                      </p>
                    )}
                    {anuncio.instagram && (
                      <p>
                        <span className="font-semibold text-slate-900">Instagram: </span>
                        <a
                          href={
                            anuncio.instagram.startsWith("http")
                              ? anuncio.instagram
                              : `https://instagram.com/${anuncio.instagram.replace("@", "")}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {anuncio.instagram}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-2">
                <h3 className="text-xs font-semibold text-slate-900 mb-2">
                  Localização aproximada
                </h3>
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <iframe
                    title="Mapa do anúncio"
                    src={mapaUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  O mapa é aproximado e pode não indicar o endereço exato. Confirme sempre com o anunciante.
                </p>
              </div>
            </div>

            {/* Vídeo */}
            {anuncio.video_url && (
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Vídeo
                </h2>
                <p className="text-xs text-slate-700 mb-3">
                  Assista ao vídeo completo deste anúncio no YouTube.
                </p>
                <a
                  href={anuncio.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Ver vídeo no YouTube
                </a>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                {isCurriculo ? "Falar com o candidato" : "Fale com o anunciante"}
              </h2>

              {whatsappLink && (
                <div className="mb-4">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1EBE57]"
                  >
                    <span className="mr-2 text-sm">🟢</span>
                    Conversar no WhatsApp
                  </a>
                </div>
              )}

              <div className="space-y-1 text-xs text-slate-700">
                {whatsappRaw && (
                  <p>
                    <span className="font-semibold text-slate-900">WhatsApp: </span>
                    {whatsappRaw}
                  </p>
                )}
                {telefoneRaw && (
                  <p>
                    <span className="font-semibold text-slate-900">Telefone: </span>
                    {telefoneRaw}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-semibold text-slate-900">E-mail: </span>
                    {email}
                  </p>
                )}
              </div>

              {(imobiliaria || corretor || creci) && !isCurriculo && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                  {imobiliaria && (
                    <p>
                      <span className="font-semibold text-slate-900">Imobiliária: </span>
                      {imobiliaria}
                    </p>
                  )}
                  {corretor && (
                    <p>
                      <span className="font-semibold text-slate-900">Corretor: </span>
                      {corretor}
                    </p>
                  )}
                  {creci && (
                    <p>
                      <span className="font-semibold text-slate-900">CRECI: </span>
                      {creci}
                    </p>
                  )}
                </div>
              )}

              <p className="text-[11px] text-slate-500 pt-3">
                Anúncio publicado em{" "}
                {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* SIMULADOR (SÓ IMÓVEIS) */}
            {isImoveis && precoNumero > 0 && (
              <div className="bg-white rounded-3xl border border-emerald-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Simule o financiamento deste imóvel
                </h2>
                <p className="text-[11px] text-slate-600 mb-3">
                  Simulação aproximada. Valores reais dependem da análise de crédito.
                </p>

                {(() => {
                  const valor = precoNumero;
                  const entrada = Math.round(valor * 0.2);
                  const financiamento = Math.max(0, valor - entrada);
                  const meses = 360;
                  const juros = 0.009;
                  const parcela =
                    financiamento > 0
                      ? Math.round(financiamento * (juros / (1 - Math.pow(1 + juros, -meses))))
                      : 0;

                  return (
                    <div className="space-y-2 text-xs text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">Valor do imóvel: </span>
                        R$ {valor.toLocaleString("pt-BR")}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Entrada estimada (20%): </span>
                        R$ {entrada.toLocaleString("pt-BR")}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Financiamento: </span>
                        R$ {financiamento.toLocaleString("pt-BR")}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Parcela estimada: </span>
                        <span className="font-semibold text-emerald-700">
                          R$ {parcela.toLocaleString("pt-BR")} / mês
                        </span>
                      </p>
                    </div>
                  );
                })()}

                {parceiroDigits ? (
                  <a
                    href={`https://wa.me/55${parceiroDigits}?text=${encodeURIComponent(
                      `Olá! Vi este imóvel no Classilagos (ID ${anuncio.id}) e gostaria de uma simulação oficial de financiamento.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Falar com consultor de financiamento
                  </a>
                ) : (
                  <p className="mt-3 text-[11px] text-slate-500">
                    Em breve: atendimento com consultor parceiro.
                  </p>
                )}
              </div>
            )}

            {/* SEGURO (SÓ IMÓVEIS) */}
            {isImoveis && (
              <div className="bg-white rounded-3xl border border-blue-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Seguro residencial & fiança
                </h2>
                <p className="text-[11px] text-slate-600 mb-3">
                  Proteja seu imóvel ou alugue com mais segurança.
                </p>

                {parceiroDigits ? (
                  <a
                    href={`https://wa.me/55${parceiroDigits}?text=${encodeURIComponent(
                      `Olá! Vi um imóvel no Classilagos (ID ${anuncio.id}) e gostaria de cotar seguro residencial e/ou seguro fiança.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Cotar seguro agora
                  </a>
                ) : (
                  <span className="inline-flex w-full items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                    Em breve no Classilagos
                  </span>
                )}

                <p className="mt-2 text-[10px] text-slate-400">
                  Atendimento com corretor parceiro.
                </p>
              </div>
            )}

            {/* Mercado Livre */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Ofertas que combinam com este anúncio (Mercado Livre)
              </h2>
              <p className="text-[11px] text-slate-600 mb-3">
                Itens para equipar ou cuidar melhor deste imóvel, veículo ou ambiente.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li>
                  <a
                    href="https://www.mercadolivre.com.br/ofertas?c=decoracao-sala"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Sofás e decoração para sala de estar
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mercadolivre.com.br/ofertas?c=cozinha-planejada"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Eletrodomésticos e itens de cozinha
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mercadolivre.com.br/ofertas?c=area-gourmet"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Churrasqueiras, mesas externas e área gourmet
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-[10px] text-slate-400">
                Em breve este bloco poderá usar seus links de afiliado personalizados.
              </p>
            </div>
          </div>
        </div>

        {/* AVISO IMPORTANTE + DENÚNCIA */}
        <section className="mt-6">
          <div className="bg-white rounded-3xl border border-amber-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Aviso importante
            </h2>
            <p className="text-[11px] text-slate-600">
              O Classilagos é um espaço de anúncios e não se responsabiliza
              pela veracidade das informações publicadas. Negocie sempre com
              cuidado, verifique os dados do anunciante e evite pagamentos
              adiantados sem segurança.
            </p>
            <p className="mt-2 text-[11px] text-slate-600">
              Identificou algum erro ou algo suspeito neste anúncio?{" "}
              <Link
                href={`/fale-conosco?assunto=denuncia-anuncio&id=${anuncio.id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Denuncie este anúncio
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Similares */}
        <section className="mt-8">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              {tituloSimilares}
            </h2>

            {similares.length === 0 && (
              <p className="text-[11px] text-slate-600">{textoSimilaresVazio}</p>
            )}

            {similares.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img = Array.isArray(item.imagens)
                    ? item.imagens.find((u) => typeof u === "string" && u.trim() !== "")
                    : null;

                  const precoOuFaixa =
                    item.faixa_preco ||
                    (item.preco ? `R$ ${item.preco}` : "");

                  return (
                    <Link
                      key={item.id}
                      href={`/anuncios/${item.id}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                    >
                      {img && (
                        <div className="w-full h-24 overflow-hidden">
                          <img
                            src={img}
                            alt={item.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="px-3 py-2 space-y-1">
                        <p className="font-semibold line-clamp-2">{item.titulo}</p>
                        <p className="text-[11px] text-slate-600">
                          {item.cidade}
                          {item.bairro ? ` • ${item.bairro}` : ""}
                        </p>
                        {!!precoOuFaixa && (
                          <p className="text-[11px] font-semibold text-slate-900">
                            {precoOuFaixa}
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

        {/* Botão voltar (mobile) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href={rotaVoltar}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Voltar
          </Link>
        </div>

        {/* BANNER RODAPÉ */}
        <section className="mt-8">
          <div className="max-w-5xl mx-auto px-0">
            <BannerRotator
              images={BANNERS_RODAPE}
              height={120}
              maxWidth={900}
              interval={6000}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
