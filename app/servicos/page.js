"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

export default function ServicosPage() {
  const [termoBusca, setTermoBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [cidadeFiltro, setCidadeFiltro] = useState("toda_regiao");

  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  // cidades padrão Classilagos
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

  // Buscar serviços no Supabase (categoria = servico)
  useEffect(() => {
    const buscarServicos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, nome_negocio, cidade, bairro, subcategoria_servico, faixa_preco, atende_domicilio, status, created_at"
        )
        .eq("categoria", "servico")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(60);

      if (error) {
        console.error("Erro ao buscar serviços:", error);
        setServicos([]);
      } else {
        setServicos(data || []);
      }
      setLoading(false);
    };

    buscarServicos();
  }, []);

  // Filtragem em memória
  const servicosFiltradosBase = servicos.filter((s) => {
    // cidade
    if (cidadeFiltro !== "toda_regiao" && s.cidade !== cidadeFiltro) {
      return false;
    }

    // termo de busca (titulo + nome_negocio)
    if (termoBusca.trim()) {
      const t = termoBusca.toLowerCase();
      const titulo = (s.titulo || "").toLowerCase();
      const nomeNegocio = (s.nome_negocio || "").toLowerCase();

      if (!titulo.includes(t) && !nomeNegocio.includes(t)) {
        return false;
      }
    }

    // tipo filtro (classimed / eventos / profissionais)
    if (tipoFiltro === "classimed") {
      return s.subcategoria_servico === "classimed";
    }
    if (tipoFiltro === "eventos") {
      return s.subcategoria_servico === "eventos";
    }
    if (tipoFiltro === "profissionais") {
      return s.subcategoria_servico === "profissionais";
    }

    // "todos"
    return true;
  });

  // separa por pilar
  const classimedServicos = servicosFiltradosBase.filter(
    (s) => s.subcategoria_servico === "classimed"
  );
  const eventosServicos = servicosFiltradosBase.filter(
    (s) => s.subcategoria_servico === "eventos"
  );
  const profissionaisServicos = servicosFiltradosBase.filter(
    (s) => s.subcategoria_servico === "profissionais"
  );

  // função auxiliar para cards
  const renderCards = (lista) => {
    if (!lista || lista.length === 0) {
      return (
        <p className="text-[11px] text-slate-500">
          Ainda não temos serviços cadastrados aqui. Em breve essa vitrine estará
          cheia de anúncios da região.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {lista.slice(0, 6).map((servico) => {
          const titulo =
            servico.nome_negocio ||
            servico.titulo ||
            "Serviço anunciado no Classilagos";
          const faixa =
            servico.faixa_preco && servico.faixa_preco.trim().length > 0
              ? servico.faixa_preco
              : "Valor a combinar";

          return (
            <Link
              key={servico.id}
              href={`/anuncios/${servico.id}`}
              className="group rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-md transition flex flex-col p-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                  {titulo}
                </p>
                <p className="text-[11px] text-slate-600">
                  {servico.cidade}
                  {servico.bairro ? ` • ${servico.bairro}` : ""}
                </p>
                <p className="text-[11px] font-semibold text-emerald-700">
                  {faixa}
                </p>
                {servico.atende_domicilio && (
                  <span className="inline-flex mt-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Atende em domicílio
                  </span>
                )}
              </div>

              <span className="mt-3 text-[11px] text-blue-600 font-semibold group-hover:translate-x-0.5 transition">
                Ver detalhes do serviço →
              </span>
            </Link>
          );
        })}
      </div>
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

          {/* TEXTOS */}
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

      {/* CAIXA DE BUSCA */}
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
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              {/* Tipo de serviço */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo de serviço
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="classimed">Saúde (Classimed)</option>
                  <option value="eventos">Festas & Eventos</option>
                  <option value="profissionais">Profissionais & Serviços</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cidadeFiltro}
                  onChange={(e) => setCidadeFiltro(e.target.value)}
                >
                  <option value="toda_regiao">Toda a região</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão (apenas estético por enquanto, filtros já aplicam em tempo real) */}
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
            {loading
              ? "Carregando serviços cadastrados…"
              : `Exibindo resultados para ${
                  cidadeFiltro === "toda_regiao"
                    ? "toda a Região dos Lagos"
                    : cidadeFiltro
                } ${
                  tipoFiltro === "todos"
                    ? ""
                    : tipoFiltro === "classimed"
                    ? "· Saúde (Classimed)"
                    : tipoFiltro === "eventos"
                    ? "· Festas & Eventos"
                    : "· Profissionais & Serviços"
                }`}
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* 3 PILARES – links para anunciar */}
      <section className="max-w-5xl mx-auto px-4 pb-6">
        <h2 className="text-center text-sm font-semibold text-slate-900 mb-4">
          Quer anunciar o seu serviço? Escolha abaixo:
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
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Saúde & bem-estar
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Classimed
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Clínicas, terapeutas, cuidadores e mais.
            </p>
          </Link>

          {/* EVENTOS */}
          <Link
            href="/anunciar/servicos/eventos"
            className="group block rounded-3xl border border-pink-500 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                🎉
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-pink-700">
                  Festas & eventos
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Eventos
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Buffet, doces e salgados, DJ, fotografia e muito mais.
            </p>
          </Link>

          {/* PROFISSIONAIS */}
          <Link
            href="/anunciar/servicos/profissionais"
            className="group block rounded-3xl border border-blue-500 bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🛠️
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                  Profissionais & serviços
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Profissionais
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Eletricistas, diaristas, manutenção, reboque, arquitetos e muito mais.
            </p>
          </Link>
        </div>
      </section>

      {/* VITRINE DE SERVIÇOS */}
      <section className="max-w-5xl mx-auto px-4 pb-10 space-y-8">
        {/* CLASSIMED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Serviços de saúde (Classimed)
            </h2>
            <span className="text-[11px] text-slate-500">
              {classimedServicos.length} encontrado(s)
            </span>
          </div>
          {loading ? (
            <p className="text-[11px] text-slate-500">
              Carregando serviços de saúde…
            </p>
          ) : (
            renderCards(classimedServicos)
          )}
        </div>

        {/* FESTAS & EVENTOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Festas & Eventos
            </h2>
            <span className="text-[11px] text-slate-500">
              {eventosServicos.length} encontrado(s)
            </span>
          </div>
          {loading ? (
            <p className="text-[11px] text-slate-500">
              Carregando serviços de festas e eventos…
            </p>
          ) : (
            renderCards(eventosServicos)
          )}
        </div>

        {/* PROFISSIONAIS & SERVIÇOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Profissionais & Serviços
            </h2>
            <span className="text-[11px] text-slate-500">
              {profissionaisServicos.length} encontrado(s)
            </span>
          </div>
          {loading ? (
            <p className="text-[11px] text-slate-500">
              Carregando profissionais e serviços…
            </p>
          ) : (
            renderCards(profissionaisServicos)
          )}
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="rounded-3xl bg-slate-100 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Quer divulgar o seu serviço na Região dos Lagos?
          </p>
          <p className="text-xs text-slate-700 mb-4">
            Cadastre gratuitamente serviços de saúde, reformas, festas & eventos,
            aulas particulares, consultorias e muito mais.
          </p>

          <Link
            href="/anunciar/servicos"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Cadastrar meu serviço
          </Link>
        </div>
      </section>
    </main>
  );
}
