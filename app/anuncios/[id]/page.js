"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import BannerRotator from "../../components/BannerRotator";

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

      const { data: similaresData } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, preco, tipo_imovel, imagens, categoria, subcategoria_servico"
        )
        .eq("categoria", data.categoria || "imoveis")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(4);

      setSimilares(similaresData || []);
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

  // Imagens (galeria não é usada para currículo, vagas, nem LagoListas)
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;
  const mostrarGaleria =
    temImagens && !isCurriculo && !isEmprego && !isLagolistas;

  // Contatos
  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";
  const imobiliaria = anuncio.imobiliaria || "";
  const corretor = anuncio.corretor || "";
  const creci = anuncio.creci || "";

  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos e gostaria de mais informações.`
        )}`
      : null;

  // Compartilhamento
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este anúncio no Classilagos: ${anuncio.titulo}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Endereço para mapa
  const enderecoCompleto = [
    anuncio.endereco || "",
    anuncio.bairro || "",
    anuncio.cidade || "",
  ]
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

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
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
    {/* GALERIA DE FOTOS (não mostra para VAGAS, CURRÍCULO nem LAGOLISTAS) */}
{mostrarGaleria && (
  <section
    className="w-full flex flex-col gap-3"
    id="fachada" // âncora p/outros tipos
  >
    {/* FOTO PRINCIPAL um pouco menor e sem cortar a imagem */}
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-slate-100 flex items-center justify-center">
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px]">
        <img
          src={imagens[fotoIndex]}
          alt={anuncio.titulo}
          className="w-full h-full object-contain bg-white"
        />
      </div>
    </div>

    {/* MINIATURAS (todas as fotos) */}
    {imagens.length > 1 && (
      <div className="w-full max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {imagens.map((url, index) => (
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
              className="w-full h-16 object-contain"
            />
          </button>
        ))}
      </div>
    )}
  </section>
)}


        {/* GRID PRINCIPAL: ESQUERDA / DIREITA */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-4">
            {/* ===================== CURRÍCULO ===================== */}
            {isCurriculo ? (
              <>
                {/* Card principal do candidato */}
                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    {/* FOTO DO CANDIDATO */}
                    {anuncio.curriculo_foto_url && (
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                          <img
                            src={anuncio.curriculo_foto_url}
                            alt={
                              anuncio.nome_contato || "Foto do candidato"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* TEXTOS CABEÇALHO */}
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

                {/* Resumo profissional */}
                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Resumo profissional
                  </h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line">
                    {anuncio.descricao ||
                      "O candidato ainda não preencheu o resumo profissional."}
                  </p>
                </section>

                {/* Experiências profissionais */}
                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Experiências profissionais
                  </h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line">
                    {anuncio.experiencias_profissionais ||
                      "O candidato ainda não descreveu experiências profissionais."}
                  </p>
                </section>

                {/* Formação acadêmica / cursos + Escolaridade */}
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

                  {!anuncio.escolaridade_minima &&
                    !anuncio.formacao_academica && (
                      <p className="text-xs text-slate-500">
                        O candidato ainda não informou formação acadêmica.
                      </p>
                    )}
                </section>

                {/* Habilidades e competências */}
                <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Habilidades e competências
                  </h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line">
                    {anuncio.habilidades ||
                      "O candidato ainda não descreveu habilidades e competências."}
                  </p>
                </section>

                {/* Idiomas (mostra só se tiver) */}
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

                {/* Link para baixar PDF do currículo, se existir */}
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
                {/* Aqui, para os outros tipos (imóvel, veículo, serviço etc.),
                    segue o conteúdo padrão da página */}
              </>
            )}

            {/* Resumo do anúncio (vale para todos os tipos) */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Resumo do anúncio
              </h2>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                {anuncio.preco && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Valor:{" "}
                    </span>
                    R$ {anuncio.preco}
                  </div>
                )}
                {isEmprego && anuncio.faixa_salarial && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Faixa salarial:{" "}
                    </span>
                    {anuncio.faixa_salarial}
                  </div>
                )}
                {isServico && anuncio.faixa_preco && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Faixa de preço:{" "}
                    </span>
                    {anuncio.faixa_preco}
                  </div>
                )}

                {anuncio.tipo_imovel && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo:{" "}
                    </span>
                    {anuncio.tipo_imovel}
                  </div>
                )}
                {anuncio.finalidade && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Finalidade:{" "}
                    </span>
                    {anuncio.finalidade === "venda" && "Venda"}
                    {anuncio.finalidade === "aluguel_fixo" && "Aluguel fixo"}
                    {anuncio.finalidade === "aluguel" && "Aluguel"}
                    {anuncio.finalidade === "temporada" &&
                      "Aluguel por temporada"}
                  </div>
                )}
                {anuncio.area && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Área:{" "}
                    </span>
                    {anuncio.area} m²
                  </div>
                )}
                {anuncio.quartos && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Quartos:{" "}
                    </span>
                    {anuncio.quartos}
                  </div>
                )}
                {anuncio.banheiros && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Banheiros:{" "}
                    </span>
                    {anuncio.banheiros}
                  </div>
                )}
                {anuncio.vagas && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Vagas:{" "}
                    </span>
                    {anuncio.vagas}
                  </div>
                )}

                {isEmprego && anuncio.area_profissional && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Área:{" "}
                    </span>
                    {anuncio.area_profissional}
                  </div>
                )}
                {isEmprego && anuncio.tipo_vaga && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo de vaga:{" "}
                    </span>
                    {anuncio.tipo_vaga}
                  </div>
                )}
                {isEmprego && anuncio.modelo_trabalho && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Modelo:{" "}
                    </span>
                    {anuncio.modelo_trabalho}
                  </div>
                )}
                {isEmprego && anuncio.carga_horaria && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Carga horária:{" "}
                    </span>
                    {anuncio.carga_horaria}
                  </div>
                )}

                {isServico && anuncio.subcategoria_servico && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo de serviço:{" "}
                    </span>
                    {anuncio.subcategoria_servico === "classimed" &&
                      "Saúde (Classimed)"}
                    {anuncio.subcategoria_servico === "eventos" &&
                      "Festas & Eventos"}
                    {anuncio.subcategoria_servico === "profissionais" &&
                      "Profissionais & Serviços"}
                  </div>
                )}
                {isServico && anuncio.nome_negocio && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Nome do negócio:{" "}
                    </span>
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
                {isServico &&
                  typeof anuncio.atende_domicilio === "boolean" && (
                    <div>
                      <span className="font-semibold text-slate-900">
                        Atende em domicílio:{" "}
                      </span>
                      {anuncio.atende_domicilio ? "Sim" : "Não"}
                    </div>
                  )}

                {anuncio.marca && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Marca:{" "}
                    </span>
                    {anuncio.marca}
                  </div>
                )}
                {anuncio.modelo && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Modelo:{" "}
                    </span>
                    {anuncio.modelo}
                  </div>
                )}
                {anuncio.ano && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Ano:{" "}
                    </span>
                    {anuncio.ano}
                  </div>
                )}
                {anuncio.km && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Km:{" "}
                    </span>
                    {anuncio.km}
                  </div>
                )}
              </div>
            </div>

            {/* BLOCO ESPECIAL LAGOLISTAS – INFORMAÇÕES DO ESTABELECIMENTO */}
            {isLagolistas && (
              <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">
                  Informações do estabelecimento
                </h2>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                  {/* Logo / miniatura */}
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

                  {/* Dados em colunas */}
                  <div className="grid gap-2 text-xs md:text-sm flex-1 md:grid-cols-2">
                    {anuncio.nome_negocio && (
                      <div>
                        <p className="font-medium text-slate-800">
                          Nome do comércio
                        </p>
                        <p className="text-slate-700">
                          {anuncio.nome_negocio}
                        </p>
                      </div>
                    )}

                    {anuncio.razao_social && (
                      <div>
                        <p className="font-medium text-slate-800">
                          Razão social
                        </p>
                        <p className="text-slate-700">
                          {anuncio.razao_social}
                        </p>
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
                        <p className="font-medium text-slate-800">
                          Inscrição municipal
                        </p>
                        <p className="text-slate-700">
                          {anuncio.inscricao_municipal}
                        </p>
                      </div>
                    )}

                    {anuncio.registro_profissional && (
                      <div>
                        <p className="font-medium text-slate-800">
                          Registro profissional
                        </p>
                        <p className="text-slate-700">
                          {anuncio.registro_profissional}
                        </p>
                      </div>
                    )}

                    {(anuncio.endereco ||
                      anuncio.bairro ||
                      anuncio.cidade) && (
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
                                : `https://instagram.com/${anuncio.instagram.replace(
                                    "@",
                                    ""
                                  )}`
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

                {(anuncio.condominio ||
                  anuncio.iptu ||
                  anuncio.aceita_financiamento) && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    {anuncio.condominio && (
                      <div>
                        <span className="font-semibold text-slate-900">
                          Condomínio:{" "}
                        </span>
                        R$ {anuncio.condominio}
                      </div>
                    )}
                    {anuncio.iptu && (
                      <div>
                        <span className="font-semibold text-slate-900">
                          IPTU (ano):{" "}
                        </span>
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
                        <span className="font-semibold text-slate-900">
                          Site:{" "}
                        </span>
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
                        <span className="font-semibold text-slate-900">
                          Instagram:{" "}
                        </span>
                        <a
                          href={
                            anuncio.instagram.startsWith("http")
                              ? anuncio.instagram
                              : `https://instagram.com/${anuncio.instagram.replace(
                                  "@",
                                  ""
                                )}`
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
                  O mapa é aproximado e pode não indicar o endereço exato.
                  Confirme sempre com o anunciante.
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

          {/* COLUNA DIREITA: CONTATO + MERCADO LIVRE */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                {isCurriculo
                  ? "Falar com o candidato"
                  : "Fale com o anunciante"}
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
                    <span className="font-semibold text-slate-900">
                      WhatsApp:{" "}
                    </span>
                    {whatsappRaw}
                  </p>
                )}
                {telefoneRaw && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      Telefone:{" "}
                    </span>
                    {telefoneRaw}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      E-mail:{" "}
                    </span>
                    {email}
                  </p>
                )}
              </div>

              {(imobiliaria || corretor || creci) && !isCurriculo && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                  {imobiliaria && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Imobiliária:{" "}
                      </span>
                      {imobiliaria}
                    </p>
                  )}
                  {corretor && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Corretor:{" "}
                      </span>
                      {corretor}
                    </p>
                  )}
                  {creci && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        CRECI:{" "}
                      </span>
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
                Em breve este bloco poderá usar seus links de afiliado
                personalizados.
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
              <p className="text-[11px] text-slate-600">
                {textoSimilaresVazio}
              </p>
            )}

            {similares.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
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
                        <p className="font-semibold line-clamp-2">
                          {item.titulo}
                        </p>
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
      </section>
    </main>
  );
}

