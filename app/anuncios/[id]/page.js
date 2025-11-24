"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [semelhantes, setSemelhantes] = useState([]);

  useEffect(() => {
    if (!id) return;

    async function buscarDados() {
      try {
        setLoading(true);
        setErro(null);

        // 1) Anúncio principal
        const { data, error } = await supabase
          .from("anuncios")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          console.error("Erro ao buscar anúncio:", error);
          setErro("Não foi possível carregar este anúncio.");
          setAnuncio(null);
          setLoading(false);
          return;
        }

        setAnuncio(data);
        setFotoIndex(0);

        // 2) Anúncios semelhantes (mesma categoria e cidade, outro id)
        const { data: similaresData, error: similaresError } = await supabase
          .from("anuncios")
          .select("id, titulo, cidade, imagens")
          .eq("categoria", data.categoria)
          .eq("cidade", data.cidade)
          .neq("id", data.id)
          .limit(4);

        if (!semelhantesError && Array.isArray(similaresData)) {
          setSemelhantes(similaresData);
        }
      } catch (e) {
        console.error(e);
        setErro("Ocorreu um erro ao carregar o anúncio.");
      } finally {
        setLoading(false);
      }
    }

    buscarDados();
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
          href="/imoveis"
          className="rounded-full bg-[#21D4FD] px-5 py-2 text-sm text-white font-semibold hover:bg-[#3EC9C3]"
        >
          Voltar para Imóveis
        </Link>
      </main>
    );
  }

  // Imagens
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;
  const fotoAtiva =
    temImagens && imagens[fotoIndex] ? imagens[fotoIndex] : temImagens ? imagens[0] : null;

  // Endereço + cidade para mapa
  const enderecoCompleto = [anuncio.endereco, anuncio.cidade]
    .filter(Boolean)
    .join(" - ");

  const mapsUrl = enderecoCompleto
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        enderecoCompleto
      )}&output=embed`
    : null;

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO */}
      <section className="bg-gradient-to-r from-[#21D4FD] to-[#3EC9C3] text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide font-semibold">
              Espaço para banner topo
            </p>
            <h2 className="text-sm md:text-base font-bold">
              Aqui pode entrar um banner de patrocinador ou Mercado Livre.
            </h2>
          </div>
          <Link
            href="/anunciar"
            className="rounded-full border border-white/70 px-4 py-1.5 text-[11px] md:text-xs font-semibold hover:bg-white/10 transition"
          >
            Anunciar no Classilagos
          </Link>
        </div>
      </section>

      {/* CABEÇALHO DO ANÚNCIO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-500">
              Classilagos – {anuncio.categoria || "Imóveis"}
            </p>
            <h1 className="text-lg md:text-2xl font-bold text-[#1F2933]">
              {anuncio.titulo}
            </h1>
            {anuncio.cidade && (
              <p className="text-xs md:text-sm text-slate-600">
                {anuncio.cidade}
              </p>
            )}
          </div>

          <Link
            href="/imoveis"
            className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Voltar para Imóveis
          </Link>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* FOTO PRINCIPAL */}
        {fotoAtiva && (
          <div className="w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
            <div className="w-full h-[260px] sm:h-[320px] md:h-[360px]">
              <img
                src={fotoAtiva}
                alt={anuncio.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* MINIATURAS */}
        {imagens.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {imagens.map((url, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFotoIndex(index)}
                className={`relative h-16 rounded-xl overflow-hidden border ${
                  index === fotoIndex
                    ? "border-[#21D4FD] ring-2 ring-[#21D4FD]/40"
                    : "border-slate-200"
                } bg-slate-100`}
              >
                <img
                  src={url}
                  alt={`${anuncio.titulo} - foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* GRID: DESCRIÇÃO + LATERAL */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* DESCRIÇÃO */}
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Descrição do imóvel
            </h2>
            <p className="text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {anuncio.descricao || "Este anúncio ainda não possui descrição detalhada."}
            </p>
          </div>

          {/* LATERAL – DETALHES + CONTATO */}
          <div className="space-y-4">
            {/* Detalhes rápidos */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 text-xs text-slate-700 space-y-2 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Detalhes do imóvel
              </h3>

              {anuncio.preco && (
                <p>
                  <span className="font-semibold text-slate-900">Valor: </span>
                  <span className="text-[#21D4FD] font-semibold">
                    {anuncio.preco}
                  </span>
                </p>
              )}

              {anuncio.cidade && (
                <p>
                  <span className="font-semibold text-slate-900">Cidade: </span>
                  {anuncio.cidade}
                </p>
              )}

              {anuncio.bairro && (
                <p>
                  <span className="font-semibold text-slate-900">Bairro: </span>
                  {anuncio.bairro}
                </p>
              )}

              {anuncio.endereco && (
                <p>
                  <span className="font-semibold text-slate-900">
                    Endereço / referência:{" "}
                  </span>
                  {anuncio.endereco}
                </p>
              )}

              {anuncio.area && (
                <p>
                  <span className="font-semibold text-slate-900">Área: </span>
                  {anuncio.area} m²
                </p>
              )}

              {(anuncio.quartos || anuncio.banheiros || anuncio.vagas) && (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {anuncio.quartos && (
                    <span>Quartos: {anuncio.quartos}</span>
                  )}
                  {anuncio.banheiros && (
                    <span>Banheiros: {anuncio.banheiros}</span>
                  )}
                  {anuncio.vagas && (
                    <span>Vagas: {anuncio.vagas}</span>
                  )}
                </div>
              )}

              {anuncio.condominio && (
                <p>
                  <span className="font-semibold text-slate-900">
                    Condomínio:{" "}
                  </span>
                  {anuncio.condominio}
                </p>
              )}

              {anuncio.iptu && (
                <p>
                  <span className="font-semibold text-slate-900">IPTU: </span>
                  {anuncio.iptu}
                </p>
              )}

              {anuncio.aceita_financiamento && (
                <p>
                  <span className="font-semibold text-slate-900">
                    Aceita financiamento?{" "}
                  </span>
                  {anuncio.aceita_financiamento}
                </p>
              )}

              {anuncio.categoria && (
                <p className="text-[11px] text-slate-500 pt-1">
                  Categoria: {anuncio.categoria}
                </p>
              )}

              <p className="text-[11px] text-slate-500 pt-2">
                Anúncio publicado em{" "}
                {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Fale com o anunciante */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 text-xs text-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Fale com o anunciante
              </h3>
              <p className="text-[11px] text-slate-500 mb-1">
                Entre em contato diretamente com o anunciante. Informe telefone,
                WhatsApp e e-mail ao criar seu anúncio.
              </p>
              <div className="mt-2">
                <p className="text-[11px] font-semibold text-slate-500">
                  Telefone / WhatsApp / E-mail:
                </p>
                <p className="text-sm font-medium text-[#1F2933]">
                  {anuncio.contato || "Contato não informado"}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                A Classilagos não participa das negociações. Verifique todas as
                informações antes de concluir qualquer negócio.
              </p>
            </div>
          </div>
        </div>

        {/* MAPA */}
        {mapsUrl && (
          <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
              <h2 className="text-sm md:text-base font-semibold text-[#1F2933]">
                Localização aproximada
              </h2>
              <p className="text-[11px] text-slate-500">
                {enderecoCompleto}
              </p>
            </div>
            <div className="w-full h-[260px] md:h-[340px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                src={mapsUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        )}

        {/* BLOCO MERCADO LIVRE / BANNERS */}
        <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <h2 className="text-sm md:text-base font-semibold text-[#1F2933]">
              Ofertas relacionadas (Mercado Livre / banners)
            </h2>
            <p className="text-[11px] text-slate-500">
              Espaço reservado para produtos e banners de afiliados.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-[11px] text-slate-500"
              >
                Espaço para card de produto {i}
              </div>
            ))}
          </div>
        </section>

        {/* ANÚNCIOS SEMELHANTES */}
        {semelhantes && semelhantes.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-[#1F2933] mb-3">
              Anúncios semelhantes em {anuncio.cidade}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {semelhantes.map((item) => {
                const imgs = Array.isArray(item.imagens) ? item.imagens : [];
                const thumb = imgs[0] || "/imoveis/imovel-01.jpg";

                return (
                  <Link
                    key={item.id}
                    href={`/anuncios/${item.id}`}
                    className="block rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 hover:shadow-md transition-shadow"
                  >
                    <div className="w-full h-24 bg-slate-200">
                      <img
                        src={thumb}
                        alt={item.titulo || "Imóvel em destaque"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-[#1F2933] line-clamp-2">
                        {item.titulo || "Imóvel em destaque"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {item.cidade}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Voltar (mobile) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/imoveis"
            className="rounded-full bg-[#21D4FD] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
          >
            Voltar para Imóveis
          </Link>
        </div>
      </section>
    </main>
  );
}
