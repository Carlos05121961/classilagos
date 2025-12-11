"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function LagoListasPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");

  // cidades da Região dos Lagos
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

  // segmentos principais do LagoListas (iguais aos do formulário)
  const segmentosLagolistas = [
    "Materiais de construção & reformas",
    "Supermercados & mercearias",
    "Farmácias & drogarias",
    "Bazares & variedades",
    "Piscinas, jardins & paisagismo",
    "Móveis, decoração & utilidades",
    "Serviços em geral",
    "Saúde, beleza & bem-estar",
    "Educação & escolas",
    "Turismo & passeios",
    "Bares, lanchonetes & cafeterias",
    "Pizzarias & delivery",
    "Hotéis, pousadas & hospedagem",
    "Outros",
  ];

  // Buscar cadastros do LagoListas
  useEffect(() => {
    const fetchLagolistas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, descricao, cidade, bairro, area_profissional, telefone, whatsapp, email, site_url, instagram, imagens, destaque, status, categoria"
        )
        .eq("categoria", "lagolistas")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("titulo", { ascending: true });

      if (error) {
        console.error("Erro ao carregar LagoListas:", error);
        setAnuncios([]);
      } else {
        setAnuncios(data || []);
      }

      setLoading(false);
    };

    fetchLagolistas();
  }, []);

  // Filtro em memória (busca, categoria, cidade)
  const filtrados = anuncios.filter((item) => {
    const texto = buscaTexto.trim().toLowerCase();

    const atendeTexto =
      !texto ||
      [
        item.titulo,
        item.descricao,
        item.nome_negocio,
        item.area_profissional,
        item.cidade,
        item.bairro,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(texto);

    const atendeCategoria =
      filtroCategoria === "Todos" ||
      item.area_profissional === filtroCategoria;

    const atendeCidade =
      filtroCidade === "Toda a região" || item.cidade === filtroCidade;

    return atendeTexto && atendeCategoria && atendeCidade;
  });

  // Card de cada cadastro
  const CardLagoLista = ({ item }) => {
    const thumb =
      Array.isArray(item.imagens) && item.imagens.length > 0
        ? item.imagens[0]
        : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group flex gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition shadow-sm hover:shadow-md px-4 py-3"
      >
        {/* Logo / foto */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-yellow-200 flex items-center justify-center text-xs font-semibold text-yellow-700">
          {thumb ? (
            <img
              src={thumb}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <span>{item.titulo?.charAt(0) || "L"}</span>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-[13px] text-slate-900 truncate">
              {item.titulo}
            </p>
            {item.destaque && (
              <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-400 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                DESTAQUE
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 mb-0.5">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          {item.area_profissional && (
            <p className="text-[11px] text-slate-800 mb-1 line-clamp-1">
              {item.area_profissional}
            </p>
          )}

          {item.descricao && (
            <p className="text-[11px] text-slate-700 line-clamp-2">
              {item.descricao}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
            {item.whatsapp && (
              <span className="inline-flex items-center rounded-full bg-green-600 text-white px-2 py-0.5">
                WhatsApp
              </span>
            )}
            {item.telefone && !item.whatsapp && (
              <span className="inline-flex items-center rounded-full bg-slate-800 text-white px-2 py-0.5">
                Telefone
              </span>
            )}
            {item.site_url && (
              <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5">
                Site
              </span>
            )}
          </div>

          <span className="mt-1 inline-block text-[11px] text-blue-700 group-hover:underline">
            Ver detalhes →
          </span>
        </div>
      </Link>
    );
  };

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

      {/* NOVO HERO LAGOLISTAS – 3 FOTOS */}
      <section className="relative w-full bg-[#FEF9C3] border-b border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 grid gap-6 md:grid-cols-[2fr,3fr] items-center">
          {/* Texto principal */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-yellow-700">
              Guia comercial da Região dos Lagos
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
              Classilagos – LagoListas
            </h1>
            <p className="text-xs md:text-sm text-slate-800 max-w-md">
              O maior guia comercial da região para{" "}
              <span className="font-semibold">
                materiais de construção, mercados, farmácias, bazares, móveis,
                serviços e muito mais
              </span>
              . Encontre tudo o que você precisa em Maricá e em toda a Região
              dos Lagos.
            </p>

            <ul className="text-[11px] md:text-xs text-slate-700 space-y-1">
              <li>• Telefones, WhatsApp, endereços e sites sempre à mão.</li>
              <li>• Empresas de bairro até grandes redes da região.</li>
              <li>• Em breve: destaques e ofertas especiais por cidade.</li>
            </ul>
          </div>

          {/* Bloco das 3 fotos */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {/* Construção */}
            <div className="flex flex-col gap-2">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-yellow-200 shadow-md bg-slate-100">
                <Image
                  src="/lagolistas/hero-construcao.webp"
                  alt="Materiais de construção & reformas"
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] font-semibold text-white drop-shadow">
                    Casa & construção
                  </p>
                  <p className="text-[9px] text-slate-100 drop-shadow">
                    Materiais, reformas, piscinas…
                  </p>
                </div>
              </div>
            </div>

            {/* Comércio & bazar */}
            <div className="flex flex-col gap-2 translate-y-3 md:translate-y-6">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-yellow-200 shadow-md bg-slate-100">
                <Image
                  src="/lagolistas/hero-comercio.webp"
                  alt="Comércio & bazares"
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] font-semibold text-white drop-shadow">
                    Comércio & bazares
                  </p>
                  <p className="text-[9px] text-slate-100 drop-shadow">
                    Mercados, lojas, utilidades…
                  </p>
                </div>
              </div>
            </div>

            {/* Saúde & bem-estar */}
            <div className="flex flex-col gap-2 translate-y-1 md:translate-y-3">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-yellow-200 shadow-md bg-slate-100">
                <Image
                  src="/lagolistas/hero-saude.webp"
                  alt="Saúde & bem-estar"
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] font-semibold text-white drop-shadow">
                    Saúde & bem-estar
                  </p>
                  <p className="text-[9px] text-slate-100 drop-shadow">
                    Farmácias, clínicas, estética…
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA LAGOLISTAS */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* O que você procura */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: bazar, materiais de construção, farmácia, encanador..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                />
              </div>

              {/* Categoria */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Segmento
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {segmentosLagolistas.map((seg) => (
                    <option key={seg} value={seg}>
                      {seg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filtroCidade}
                  onChange={(e) => setFiltroCidade(e.target.value)}
                >
                  <option value="Toda a região">Toda a região</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão (visual) */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Essa busca já está ligada aos cadastros reais do LagoListas.
          </p>
        </div>
      </section>

      {/* BLOCO CHAMADA PARA ANÚNCIO */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Quer colocar sua empresa no LagoListas?
          </p>
          <p className="text-xs text-slate-700 mb-4">
            Cadastre gratuitamente seu comércio, serviço ou profissão e seja
            encontrado por milhares de pessoas em toda a Região dos Lagos.
          </p>

          <Link
            href="/anunciar/lagolistas"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no LagoListas
          </Link>
        </div>
      </section>

      {/* LISTÃO LAGOLISTAS */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Cadastros do LagoListas
          </h2>
          {!loading && (
            <p className="text-[11px] text-slate-500">
              {filtrados.length} encontrado(s)
            </p>
          )}
        </div>

        {loading && (
          <p className="text-[11px] text-slate-500">
            Carregando cadastros do LagoListas…
          </p>
        )}

        {!loading && filtrados.length === 0 && (
          <p className="text-[11px] text-slate-500">
            Ainda não há cadastros no LagoListas para os filtros selecionados.
          </p>
        )}

        <div className="mt-3 space-y-3">
          {filtrados.map((item) => (
            <CardLagoLista key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
