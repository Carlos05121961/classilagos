"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import BannerRotator from "../../components/BannerRotator";
import { LINKS_OFICIAIS } from "../../../lib/linksOficiais";

// ⬇️ COLE AQUI (Parte 1)
function normCidade(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLinksCidade(cidade, LINKS_OFICIAIS) {
  if (!cidade) return null;
  if (LINKS_OFICIAIS[cidade]) return LINKS_OFICIAIS[cidade];

  const alvo = normCidade(cidade);
  const chave = Object.keys(LINKS_OFICIAIS).find(
    (k) => normCidade(k) === alvo
  );

  return chave ? LINKS_OFICIAIS[chave] : null;
}
// ⬆️ ATÉ AQUI


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


export default function AnuncioDetalheClient({ id }) {
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [similares, setSimilares] = useState([]);

  const linksCidade = LINKS_OFICIAIS[anuncio?.cidade || ""];

  // URL atual (para compartilhar)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Buscar anúncio + similares
  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
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
        "id, titulo, cidade, bairro, preco, tipo_imovel, finalidade, imagens, categoria, subcategoria_servico, created_at, destaque";

      // helpers (só para esta função)
      const norm = (v) =>
        (v || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
      const isTemporada = (v) => {
        const f = norm(v);
        return f === "temporada" || f === "aluguel temporada" || f === "aluguel_temporada";
      };
      const isAluguel = (v) => {
        const f = norm(v);
        return f === "aluguel" || f === "aluguel fixo" || f === "aluguel_fixo";
      };

      // normaliza a finalidade do anúncio atual para montar o filtro certo
      const fAtual = norm(data.finalidade);

      // monta um "filtro SQL" de finalidade robusto
      const aplicarFiltroFinalidade = (q) => {
        if (isTemporada(fAtual)) {
          return q.or(
            "finalidade.eq.temporada,finalidade.eq.aluguel temporada,finalidade.eq.aluguel_temporada"
          );
        }
        if (isAluguel(fAtual)) {
          return q.or("finalidade.eq.aluguel,finalidade.eq.aluguel fixo,finalidade.eq.aluguel_fixo");
        }
        if (fAtual) {
          return q.eq("finalidade", data.finalidade);
        }
        return q;
      };

      let lista = [];

      // 1) MESMA CATEGORIA + MESMA FINALIDADE + MESMA CIDADE + MESMO TIPO (quando existir)
      try {
        let q1 = supabase
          .from("anuncios")
          .select(campos)
          .eq("categoria", data.categoria)
          .neq("id", data.id)
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(12);

        q1 = aplicarFiltroFinalidade(q1);

        if (data.cidade) q1 = q1.eq("cidade", data.cidade);
        if (data.tipo_imovel) q1 = q1.eq("tipo_imovel", data.tipo_imovel);

        const r1 = await q1;

        if (!r1.error && Array.isArray(r1.data)) {
          lista = r1.data;
        }
      } catch (e) {
        console.warn("Falha ao buscar similares (r1):", e);
      }

      // 2) Se ainda não tem suficientes: MESMA FINALIDADE + MESMA CIDADE (sem tipo)
      if (lista.length < 4) {
        try {
          let q2 = supabase
            .from("anuncios")
            .select(campos)
            .eq("categoria", "imoveis")
            .neq("id", data.id)
            .order("destaque", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(12);

          q2 = aplicarFiltroFinalidade(q2);
          if (data.cidade) q2 = q2.eq("cidade", data.cidade);

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

      // 3) Se ainda não tem suficientes: MESMA FINALIDADE (sem cidade/tipo)
      if (lista.length < 4) {
        try {
          let q3 = supabase
            .from("anuncios")
            .select(campos)
            .eq("categoria", "imoveis")
            .neq("id", data.id)
            .order("destaque", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(12);

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

      // pega só 4 para a UI
      setSimilares(lista.slice(0, 4));

      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex items-center justify-center">
        <p className="text-sm text-slate-600">Carregando anúncio…</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-slate-700 mb-4">
          {erro || "Anúncio não encontrado."}
        </p>
        <Link
          href="/"
          className="rounded-full bg-[#21D4FD] px-5 py-2 text-sm text-white font-semibold hover:bg-[#3EC9C3]"
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

// Imagens
const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens.filter(Boolean) : [];

// Detecta se o anúncio tem perfil "empresa" (revenda / imobiliária / comércio)
// Regra: NÃO aplicar em Lagolistas (pra não duplicar lá)
const temPerfilEmpresa =
  anuncio.categoria !== "lagolistas" &&
  (anuncio.categoria === "veiculos"
    ? Boolean(
        anuncio.loja_revenda ||
          anuncio.lojaRevenda ||
          anuncio.revendedor ||
          anuncio.concessionaria ||
          (typeof anuncio.nome_negocio === "string" && anuncio.nome_negocio.trim()) ||
          (typeof anuncio.razao_social === "string" && anuncio.razao_social.trim()) ||
          (typeof anuncio.cnpj === "string" && anuncio.cnpj.trim())
      )
    : Boolean(
        (typeof anuncio.imobiliaria === "string" && anuncio.imobiliaria.trim()) ||
          (typeof anuncio.corretor === "string" && anuncio.corretor.trim()) ||
          (typeof anuncio.creci === "string" && anuncio.creci.trim()) ||
          (typeof anuncio.nome_negocio === "string" && anuncio.nome_negocio.trim())
      ));


// ✅ Logo "oficial" (se existir um campo separado no banco)
const logoUrl = (anuncio.logo_url || anuncio.logo || "").toString().trim();

// ✅ Compatibilidade com anúncios antigos:
// se for perfil empresa e NÃO tiver logoUrl, tratamos a 1ª imagem como logomarca
const logoLegado = !logoUrl && temPerfilEmpresa && imagens.length > 0 ? imagens[0] : "";

// ✅ Logo final que pode ser exibida no “lugar certo”
const logoFinal = logoUrl || logoLegado;

// ✅ Galeria segura: remove logo da galeria quando for perfil empresa
const galeriaBase =
  temPerfilEmpresa && imagens.length > 1
    ? imagens.slice(1) // remove a 1ª (logo legado)
    : imagens;

const galeriaSafe = galeriaBase.length > 0 ? galeriaBase : imagens;

const temImagens = galeriaSafe.length > 0;

// Agora a galeria funciona para imóveis, veículos, serviços, pets e LAGOLISTAS
const mostrarGaleria = temImagens && !isCurriculo && !isEmprego;



  // Contatos
  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";
  const imobiliaria = anuncio.imobiliaria || "";
  const corretor = anuncio.corretor || "";
  const creci = anuncio.creci || "";

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function normalizeWhatsAppBR(numberRaw) {
  let n = onlyDigits(numberRaw);

  // remove zeros à esquerda
  while (n.startsWith("0")) n = n.slice(1);

  // se já veio com 55, ok
  if (n.startsWith("55")) return n;

  // se veio só com DDD+numero (10/11), prefixa 55
  if (n.length === 10 || n.length === 11) return `55${n}`;

  // se veio curto/estranho, devolve como está (evita quebrar)
  return n;
}

function buildWhatsAppLink(whatsRaw, message) {
  const n = normalizeWhatsAppBR(whatsRaw);
  if (!n) return null;

  const text = encodeURIComponent(message || "");
  return `https://wa.me/${n}${text ? `?text=${text}` : ""}`;
}

const whatsappLink = buildWhatsAppLink(
  whatsappRaw,
  `Olá! Vi o anúncio "${anuncio?.titulo || "no Classilagos"}" e gostaria de mais informações.`
);


  // ✅ WhatsApp do PARCEIRO (financiamento/seguro)
  // Se você quiser, depois a gente troca para um número fixo do parceiro.
  // Por enquanto, se não tiver número do parceiro, usamos o WhatsApp do anunciante (sem quebrar nada).
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
      : "/";

  // Texto "Voltar para ..."
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
      : "a lista";

  // ✅ helper: preço numérico para simulação (robusto)
  const precoNumero = (() => {
    const raw = (anuncio?.preco ?? "").toString();
    const digits = raw.replace(/[^\d]/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? n : 0;
  })();

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
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
            // CABEÇALHO ESPECIAL LAGOLISTAS – TARJA AMARELO MOSTARDA
            <div className="rounded-3xl bg-[#F2B705] px-4 py-3 md:px-6 md:py-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-black/80">
                    Classilagos – LagoListas
                  </p>
                  <h1 className="text-2xl md:text-3xl font-black text-black leading-snug">
                    {anuncio.titulo}
                  </h1>
                  <p className="text-xs md:text-sm text-black/80">
                    {anuncio.cidade}
                    {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                  </p>
                </div>

                <Link
                  href={rotaVoltar}
                  className="hidden sm:inline-flex rounded-full border border-black/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-black hover:bg:white"
                >
                  Voltar para {textoVoltar}
                </Link>
              </div>

              {/* COMPARTILHAR */}
              <div className="flex items-center gap-2 text-[11px] mt-1">
                <span className="text-black/80">Compartilhar:</span>
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
            // CABEÇALHO PADRÃO OUTRAS CATEGORIAS
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] text-slate-500">
                    Classilagos –{" "}
                    {anuncio.categoria === "veiculos"
                      ? "Veículos"
                      : anuncio.categoria === "imoveis"
                      ? "Imóveis"
                      : anuncio.categoria === "emprego"
                      ? "Empregos"
                      : anuncio.categoria === "curriculo"
                      ? "Currículos"
                      : anuncio.categoria === "servico"
                      ? "Serviços"
                      : anuncio.categoria === "lagolistas"
                      ? "LagoListas"
                      : anuncio.categoria === "pets"
                      ? "Pets"
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

              {/* COMPARTILHAR */}
              <div className="flex items-center gap-2 text-[11px]">
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
             <div className="relative w-full max-w-3xl aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg">
                <img
                  src={galeriaSafe[fotoIndex]}
                  alt={anuncio.titulo}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

           {galeriaSafe.length > 1 && (
              <div className="w-full max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
               {galeriaSafe.map((url, index) => ( 
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFotoIndex(index)}
                    className={`rounded-xl overflow-hidden border bg-white transition ${
                      fotoIndex === index
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
            {/* ===================== CURRÍCULO ===================== */}
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
                    {anuncio.descricao || "O candidato ainda não preencheu o resumo profissional."}
                  </p>
                    
{/* LINKS ÚTEIS – IPTU / PREFEITURA */}
{((anuncio?.categoria || "").toLowerCase() === "imoveis") && linksCidade && (
  <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <h3 className="text-sm font-bold text-slate-800">
      Links úteis – Prefeitura de {anuncio.cidade}
    </h3>

    <ul className="mt-3 space-y-2 text-sm">
      {linksCidade.iptu && (
        <li>
          <a
            href={linksCidade.iptu}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-700 hover:underline"
          >
            ▸ IPTU / Portal do contribuinte
          </a>
        </li>
      )}

      {linksCidade.certidoes && (
        <li>
          <a
            href={linksCidade.certidoes}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-700 hover:underline"
          >
            ▸ Certidões municipais
          </a>
        </li>
      )}

      {linksCidade.prefeitura && (
        <li>
          <a
            href={linksCidade.prefeitura}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-700 hover:underline"
          >
            ▸ Site oficial da Prefeitura
          </a>
        </li>
      )}
    </ul>

    <p className="mt-3 text-[11px] text-slate-500">
      Dica: os serviços podem exigir inscrição imobiliária ou CPF/CNPJ do proprietário.
    </p>
  </section>
)}
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
                      className="inline-flex items-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
                    >
                      Baixar currículo em PDF
                    </a>
                  </section>
                )}
              </>
            ) : (
              <>
                {/* Outros tipos seguem o conteúdo padrão */}
              </>
            )}

            {/* Resumo do anúncio */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Resumo do anúncio
              </h2>

           {/* Logo da empresa (quando existir) */}
{(logoFinal) && (
  <div className="mb-3 flex items-center gap-3">
    <img
      src={logoFinal}
      alt="Logomarca"
      className="h-20 w-20 rounded-xl object-cover border border-slate-200 bg-white"
    />
    <div className="text-[11px] text-slate-600 leading-tight">
      <p className="font-semibold text-slate-800">Logomarca</p>
      <p className="text-slate-500">Empresa / Revenda</p>
    </div>
  </div>
)}
          
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                {anuncio.preco && (
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
                    {anuncio.subcategoria_servico === "profissionais" &&
                      "Profissionais & Serviços"}
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
                    <span className="font-semibold text-slate-900">
                      Horário de atendimento:{" "}
                    </span>
                    {anuncio.horario_atendimento}
                  </div>
                )}
                {isServico && typeof anuncio.atende_domicilio === "boolean" && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Atende em domicílio:{" "}
                    </span>
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
                  className="inline-flex items-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
                >
                  Ver vídeo no YouTube
                </a>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: CONTATO + (NOVOS) FINANCIAMENTO + SEGURO + MERCADO LIVRE */}
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

            {/* ✅ NOVO BLOCO PREMIUM: SIMULADOR (SÓ IMÓVEIS) */}
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
                  const juros = 0.009; // 0,9% a.m. (estimado)
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

            {/* ✅ NOVO BLOCO PREMIUM: SEGURO (SÓ IMÓVEIS) */}
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

            {/* Bloco Mercado Livre continua igual para todos os tipos */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Ofertas que combinam com este anúncio (Mercado Livre)
              </h2>
              <p className="text-[11px] text-slate-600 mb-3">
                Itens para equipar ou cuidar melhor deste imóvel, veículo ou
                ambiente de trabalho.
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
                        {item.preco && (
                          <p className="text-[11px] font-semibold text-slate-900">
                            R$ {item.preco}
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
            className="rounded-full bg-[#21D4FD] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
          >
            Voltar
          </Link>
        </div>

              {/* BANNER RODAPÉ */}
<section className="mt-8">
  <div className="max-w-5xl mx-auto px-4">
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

