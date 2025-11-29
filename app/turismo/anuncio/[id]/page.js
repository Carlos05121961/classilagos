"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";
import BannerRotator from "../../../components/BannerRotator";

export default function TurismoAnuncioPage() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  // URL atual para compartilhar
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Buscar anúncio + similares
  useEffect(() => {
    if (!id) return;

    const carregar = async () => {
      setLoading(true);
      setErro("");

      // 1) Busca o anúncio pelo ID
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          `
          id,
          categoria,
          titulo,
          descricao,
          cidade,
          bairro,
          imagens,
          contato,
          telefone,
          whatsapp,
          email,
          nome_negocio,
          faixa_preco,
          site_url,
          instagram,
          cnpj,
          razao_social,
          inscricao_municipal,
          registro_profissional,
          pilar_turismo,
          subcategoria_turismo,
          tipo_passeio,
          duracao_passeio,
          valor_passeio_pessoa,
          valor_passeio_fechado,
          ponto_embarque,
          itens_inclusos,
          video_url,
          endereco,
          created_at
        `
        )
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        setErro("Anúncio não encontrado ou indisponível.");
        setLoading(false);
        return;
      }

      // Garante que é turismo
      if (data.categoria !== "turismo") {
        setErro("Este anúncio não é da categoria Turismo.");
        setLoading(false);
        return;
      }

      setAnuncio(data);
      if (data.imagens && data.imagens.length > 0) {
        setFotoIndex(0);
      }

      // 2) Busca anúncios de turismo relacionados na mesma cidade
      const { data: rel, error: relError } = await supabase
        .from("anuncios")
        .select(`
          id,
          titulo,
          cidade,
          bairro,
          imagens,
          faixa_preco,
          pilar_turismo,
          subcategoria_turismo
        `)
        .eq("categoria", "turismo")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(8);

      if (!relError && rel) {
        setSimilares(rel);
      }

      setLoading(false);
    };

    carregar();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] pb-12">
        {/* BANNER TOPO */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
            <BannerRotator />
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-slate-600">
          Carregando anúncio de turismo…
        </div>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] pb-12">
        {/* BANNER TOPO */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
            <BannerRotator />
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-10 space-y-4">
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            {erro || "Anúncio não encontrado."}
          </p>
          <Link
            href="/turismo"
            className="inline-flex rounded-full bg-[#21D4FD] px-5 py-2 text-sm text-white font-semibold hover:bg-[#3EC9C3]"
          >
            Voltar para Turismo
          </Link>
        </section>

        <RodapeBasico />
      </main>
    );
  }

  // Flags / dados auxiliares
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;

  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";

  const whatsappDigits = whatsappRaw.replace(/\D/g, "");
  const shareText = encodeURIComponent(
    `Olha este lugar de turismo que encontrei no Classilagos: ${anuncio.titulo}`
  );
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos Turismo e gostaria de mais informações.`
        )}`
      : null;

  const precoExibicao = anuncio.faixa_preco || anuncio.preco || null;

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

  const isPasseio =
    !!anuncio.tipo_passeio ||
    !!anuncio.duracao_passeio ||
    !!anuncio.valor_passeio_pessoa ||
    !!anuncio.valor_passeio_fechado;

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CABEÇALHO TURISMO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-500">
                Classilagos – Turismo &amp; Guia ONDE
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {anuncio.titulo}
              </h1>
              <p className="text-xs md:text-sm text-slate-600">
                {anuncio.cidade}
                {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
              </p>
            </div>

            <Link
              href="/turismo"
              className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Voltar para Turismo
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
        </div>
      </section>

      {/* CONTEÚDO TURISMO */}
      <section className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* GALERIA TURISMO */}
        {temImagens && (
          <section className="w-full flex flex-col gap-3">
            <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
              <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px]">
                <img
                  src={imagens[fotoIndex]}
                  alt={anuncio.titulo}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {imagens.length > 1 && (
              <div className="w-full max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {imagens.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFotoIndex(index)}
                    className={`rounded-xl overflow-hidden border transition ${
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

        {/* GRID PRINCIPAL TURISMO */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA – DESCRIÇÃO, PASSEIO, MAPA, VÍDEO */}
          <div className="space-y-4">
            {/* DESCRIÇÃO */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Sobre este local / serviço
              </h2>
              <p className="text-xs text-slate-700 whitespace-pre-line">
                {anuncio.descricao}
              </p>
            </div>

            {/* DETALHES DE PASSEIO (SE HOUVER) */}
            {isPasseio && (
              <div className="bg-sky-50 rounded-3xl border border-sky-200 px-5 py-4 shadow-sm text-xs text-slate-800 space-y-2">
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Detalhes do passeio / atividade
                </h2>
                {anuncio.tipo_passeio && (
                  <p>
                    <span className="font-semibold">Tipo de passeio: </span>
                    {anuncio.tipo_passeio}
                  </p>
                )}
                {anuncio.duracao_passeio && (
                  <p>
                    <span className="font-semibold">Duração: </span>
                    {anuncio.duracao_passeio}
                  </p>
                )}
                {anuncio.valor_passeio_pessoa && (
                  <p>
                    <span className="font-semibold">Valor por pessoa: </span>
                    {anuncio.valor_passeio_pessoa}
                  </p>
                )}
                {anuncio.valor_passeio_fechado && (
                  <p>
                    <span className="font-semibold">Passeio fechado: </span>
                    {anuncio.valor_passeio_fechado}
                  </p>
                )}
                {anuncio.ponto_embarque && (
                  <p>
                    <span className="font-semibold">Ponto de embarque: </span>
                    {anuncio.ponto_embarque}
                  </p>
                )}
                {anuncio.itens_inclusos && (
                  <p>
                    <span className="font-semibold">Itens inclusos: </span>
                    {anuncio.itens_inclusos}
                  </p>
                )}
              </div>
            )}

            {/* MAPA */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
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

            {/* VÍDEO EMBED (SE HOUVER) */}
            {anuncio.video_url && (
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Vídeo de apresentação
                </h2>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video">
                  <iframe
                    src={anuncio.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Vídeo do anúncio"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA – INFO RÁPIDAS + CONTATO + EMPRESA */}
          <div className="space-y-4">
            {/* INFO RÁPIDAS */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm text-xs text-slate-800 space-y-2">
              {precoExibicao && (
                <div className="mb-2">
                  <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                    Faixa de preço
                  </p>
                  <p className="text-sm font-bold text-emerald-800">
                    {precoExibicao}
                  </p>
                </div>
              )}

              {anuncio.nome_negocio && (
                <p>
                  <span className="font-semibold">Nome do negócio: </span>
                  {anuncio.nome_negocio}
                </p>
              )}
              <p>
                <span className="font-semibold">Cidade: </span>
                {anuncio.cidade}
              </p>
              {anuncio.bairro && (
                <p>
                  <span className="font-semibold">Bairro / região: </span>
                  {anuncio.bairro}
                </p>
              )}
              {anuncio.pilar_turismo && (
                <p>
                  <span className="font-semibold">Guia ONDE: </span>
                  {anuncio.pilar_turismo}
                </p>
              )}
              {anuncio.subcategoria_turismo && (
                <p>
                  <span className="font-semibold">Tipo: </span>
                  {anuncio.subcategoria_turismo}
                </p>
              )}
              {anuncio.site_url && (
                <p>
                  <span className="font-semibold">Site / reservas: </span>
                  <a
                    href={anuncio.site_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {anuncio.site_url}
                  </a>
                </p>
              )}
              {anuncio.instagram && (
                <p>
                  <span className="font-semibold">Instagram: </span>
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
                    className="text-pink-600 hover:underline break-all"
                  >
                    {anuncio.instagram}
                  </a>
                </p>
              )}
            </div>

            {/* DADOS DA EMPRESA / PROFISSIONAL (SE HOUVER) */}
            {(anuncio.cnpj ||
              anuncio.razao_social ||
              anuncio.inscricao_municipal ||
              anuncio.registro_profissional) && (
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm text-[11px] text-slate-800 space-y-1">
                <p className="font-semibold text-slate-900 uppercase tracking-wide mb-1">
                  Dados da empresa / profissional
                </p>
                {anuncio.razao_social && (
                  <p>
                    <span className="font-semibold">Razão social: </span>
                    {anuncio.razao_social}
                  </p>
                )}
                {anuncio.cnpj && (
                  <p>
                    <span className="font-semibold">CNPJ: </span>
                    {anuncio.cnpj}
                  </p>
                )}
                {anuncio.inscricao_municipal && (
                  <p>
                    <span className="font-semibold">
                      Inscrição municipal:{" "}
                    </span>
                    {anuncio.inscricao_municipal}
                  </p>
                )}
                {anuncio.registro_profissional && (
                  <p>
                    <span className="font-semibold">Registro: </span>
                    {anuncio.registro_profissional}
                  </p>
                )}
              </div>
            )}

            {/* CONTATO */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Fale com o anunciante
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

              <p className="text-[11px] text-slate-500 pt-3">
                Anúncio publicado em{" "}
                {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* SIMILARES TURISMO */}
        <section className="mt-6">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Outros lugares de turismo em {anuncio.cidade}
            </h2>

            {similares.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Em breve mais anúncios de turismo nesta região aparecerão aqui.
              </p>
            )}

            {similares.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : null;
                  const precoRel = item.faixa_preco || item.preco || null;

                  return (
                    <Link
                      key={item.id}
                      href={`/turismo/anuncio/${item.id}`}
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
                        {precoRel && (
                          <p className="text-[11px] font-semibold text-emerald-700">
                            {precoRel}
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

        {/* BOTÃO VOLTAR (MOBILE) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/turismo"
            className="rounded-full bg-[#21D4FD] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
          >
            Voltar para Turismo
          </Link>
        </div>

        <RodapeBasico />
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* RODAPÉ BÁSICO                                                      */
/* ------------------------------------------------------------------ */

function RodapeBasico() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-6">
      <div className="max-w-6xl mx-auto px-4 py-6 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href="/quem-somos" className="hover:text-slate-900">
            Quem somos
          </Link>
          <Link href="/fale-conosco" className="hover:text-slate-900">
            Fale conosco
          </Link>
          <Link href="/como-anunciar" className="hover:text-slate-900">
            Como anunciar
          </Link>
          <Link href="/termos-de-uso" className="hover:text-slate-900">
            Termos de uso
          </Link>
          <Link href="/politica-de-privacidade" className="hover:text-slate-900">
            Política de privacidade
          </Link>
        </div>
        <p className="text-[10px] text-slate-400">
          Classilagos – Turismo &amp; Guia ONDE • A vitrine da Região dos Lagos.
        </p>
      </div>
    </footer>
  );
}
