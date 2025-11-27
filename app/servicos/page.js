"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

export default function ServicosPage() {
  const [classimed, setClassimed] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca geral dos serviços no Supabase
  useEffect(() => {
    const fetchServicos = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, faixa_preco, atende_domicilio, subcategoria_servico, imagens"
        )
       .or("categoria.eq.servicos,categoria.eq.servico,categoria.eq.serviços")
,
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar serviços:", error);
        setLoading(false);
        return;
      }

      const lista = data || [];

      setClassimed(
        lista.filter((s) => s.subcategoria_servico === "classimed").slice(0, 6)
      );
      setEventos(
        lista.filter((s) => s.subcategoria_servico === "eventos").slice(0, 6)
      );
      setProfissionais(
        lista
          .filter((s) => s.subcategoria_servico === "profissionais")
          .slice(0, 6)
      );

      setLoading(false);
    };

    fetchServicos();
  }, []);

  // Componente de card reutilizável com miniatura opcional
  const CardServico = ({ item }) => {
    const thumb =
      Array.isArray(item.imagens) && item.imagens.length > 0
        ? item.imagens[0]
        : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group flex gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md px-4 py-3"
      >
        {/* Miniatura, se existir */}
        {thumb && (
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img
              src={thumb}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}

        {/* Conteúdo do card */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[13px] text-slate-900 truncate">
            {item.titulo}
          </p>
          <p className="text-[11px] text-slate-600">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
            {item.faixa_preco && (
              <span className="font-semibold text-emerald-700">
                {item.faixa_preco}
              </span>
            )}
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

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seus serviços no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            src="/servicos/hero-servicos.jpg"
            alt="Classilagos Serviços"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />

          {/* TEXTOS MAIS PARA CIMA */}
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre profissionais e empresas para tudo o que você precisar.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Serviços
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA (ainda ilustrativa) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista, diarista, dentista, buffet de festa..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo de serviço */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo de serviço
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos</option>
                  <option>Saúde (Classimed)</option>
                  <option>Festas &amp; Eventos</option>
                  <option>Profissionais &amp; Serviços</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Toda a região</option>
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              {/* Botão */}
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
            Em breve, essa busca estará ligada aos anúncios reais da plataforma.
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* 3 PILARES: CLASSIMED / FESTAS / PROFISSIONAIS */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <h2 className="text-center text-sm font-semibold text-slate-900 mb-4">
          Escolha o tipo de serviço que deseja encontrar ou divulgar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CLASSIMED */}
          <Link
            href="/anunciar/servicos/classimed"
            className="group block rounded-3xl border border-emerald-500 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🩺
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Saúde &amp; bem-estar
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Classimed
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-700">
              Clínicas, terapeutas, cuidadores, psicólogos, nutricionistas e
              muito mais.
            </p>
          </Link>

          {/* EVENTOS */}
          <Link
            href="/anunciar/servicos/eventos"
            className="group block rounded-3xl border border-pink-400 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                🎉
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-pink-600">
                  Festas &amp; eventos
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Eventos
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-700">
              Buffet, doces e salgados, fotografia, DJ, decoração, espaços para
              festas e muito mais.
            </p>
          </Link>

          {/* PROFISSIONAIS */}
          <Link
            href="/anunciar/servicos/profissionais"
            className="group block rounded-3xl border border-blue-400 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🛠️
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                  Profissionais &amp; serviços
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Profissionais
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-700">
              Eletricistas, diaristas, manutenção, reboque, arquitetos,
              engenheiros, piscineiros e muito mais.
            </p>
          </Link>
        </div>
      </section>

      {/* VITRINE DOS ANÚNCIOS REAIS */}
      <section className="max-w-5xl mx-auto px-4 pb-10 space-y-8">
        {/* CLASSIMED LISTA */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Serviços de saúde (Classimed)
            </h3>
            {!loading && (
              <p className="text-[11px] text-slate-500">
                {classimed.length} encontrado(s)
              </p>
            )}
          </div>

          {loading && classimed.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Carregando serviços de saúde…
            </p>
          )}

          {!loading && classimed.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Ainda não há serviços de saúde cadastrados.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classimed.map((item) => (
              <CardServico key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* EVENTOS LISTA */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Festas &amp; eventos
            </h3>
            {!loading && (
              <p className="text-[11px] text-slate-500">
                {eventos.length} encontrado(s)
              </p>
            )}
          </div>

          {loading && eventos.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Carregando serviços de eventos…
            </p>
          )}

          {!loading && eventos.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Ainda não há serviços de festas e eventos cadastrados.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventos.map((item) => (
              <CardServico key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* PROFISSIONAIS LISTA */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Profissionais &amp; serviços
            </h3>
            {!loading && (
              <p className="text-[11px] text-slate-500">
                {profissionais.length} encontrado(s)
              </p>
            )}
          </div>

          {loading && profissionais.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Carregando profissionais…
            </p>
          )}

          {!loading && profissionais.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Ainda não há profissionais cadastrados.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profissionais.map((item) => (
              <CardServico key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
