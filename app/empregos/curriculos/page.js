"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

export default function BancoCurriculosPage() {
  const [curriculos, setCurriculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [areaFiltro, setAreaFiltro] = useState("todas");

  useEffect(() => {
    const fetchCurriculos = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, nome_contato, cidade, bairro, area_profissional, descricao, created_at"
        )
        .eq("categoria", "curriculo")
        .eq("status", "ativo")
        .order("created_at", { ascending: false })
        .limit(80);

      if (error) {
        console.error("Erro ao carregar currículos:", error);
        setCurriculos([]);
      } else {
        setCurriculos(data || []);
      }

      setLoading(false);
    };

    fetchCurriculos();
  }, []);

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

  const areas = [
    "Administração",
    "Atendimento / Caixa",
    "Comércio / Vendas",
    "Construção civil",
    "Serviços gerais",
    "Educação",
    "Saúde",
    "Hotelaria / Turismo",
    "Motorista / Entregador",
    "TI / Informática",
    "Outros",
  ];

  const listaFiltrada = curriculos.filter((cv) => {
    const termo = busca.trim().toLowerCase();

    const matchBusca =
      !termo ||
      (cv.nome_contato && cv.nome_contato.toLowerCase().includes(termo)) ||
      (cv.area_profissional &&
        cv.area_profissional.toLowerCase().includes(termo)) ||
      (cv.descricao && cv.descricao.toLowerCase().includes(termo));

    const matchCidade =
      cidadeFiltro === "todas" || cv.cidade === cidadeFiltro;

    const matchArea =
      areaFiltro === "todas" || cv.area_profissional === areaFiltro;

    return matchBusca && matchCidade && matchArea;
  });

  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        {/* Cabeçalho */}
        <header className="mb-6 md:mb-8">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Empregos • Banco de Currículos
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Banco de Currículos da Região dos Lagos
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Consulte candidatos que cadastraram seus currículos no Classilagos.
            Use os filtros para buscar por cidade, área profissional e palavras-chave.
          </p>
        </header>

        {/* Ações principais */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-xs md:text-sm text-slate-600">
            Empresas podem usar esta página para localizar profissionais da região.
          </p>

          <Link
            href="/anunciar/curriculo"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Cadastrar meu currículo
          </Link>
        </div>

        {/* Filtros */}
        <section className="mb-8 bg-white border border-slate-200 rounded-3xl shadow-sm px-4 py-4 md:px-6 md:py-5">
          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-3 md:gap-4 items-end text-xs md:text-sm">
            {/* Busca */}
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">
                Busca
              </label>
              <input
                type="text"
                placeholder="Ex.: vendedor, auxiliar, construção, cozinha..."
                className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* Cidade */}
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">
                Cidade
              </label>
              <select
                className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={cidadeFiltro}
                onChange={(e) => setCidadeFiltro(e.target.value)}
              >
                <option value="todas">Toda a região</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Área profissional */}
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">
                Área profissional
              </label>
              <select
                className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={areaFiltro}
                onChange={(e) => setAreaFiltro(e.target.value)}
              >
                <option value="todas">Todas as áreas</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Os filtros são aplicados automaticamente conforme você digita ou seleciona
            uma opção.
          </p>
        </section>

        {/* Lista de currículos */}
        <section className="pb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-900">
              Resultados
            </h2>
            <span className="text-[11px] text-slate-500">
              {loading
                ? "Carregando currículos..."
                : `${listaFiltrada.length} currículo(s) encontrado(s)`}
            </span>
          </div>

          {loading && (
            <p className="text-[12px] text-slate-500">
              Buscando currículos cadastrados…
            </p>
          )}

          {!loading && listaFiltrada.length === 0 && (
            <div className="border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-xs text-slate-500 text-center">
              Nenhum currículo encontrado com os filtros atuais.
              <br />
              Tente remover algum filtro ou aguarde novos cadastros.
            </div>
          )}

          {!loading && listaFiltrada.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {listaFiltrada.map((cv) => (
                <Link
                  key={cv.id}
                  href={`/anuncios/${cv.id}`}
                  className="group rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition overflow-hidden flex flex-col p-3"
                >
                  <p className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
                    {cv.nome_contato || "Candidato"}
                  </p>
                  <p className="text-[11px] text-slate-600 mb-1">
                    {cv.area_profissional || "Área não informada"}
                  </p>
                  <p className="text-[11px] text-slate-600 mb-1">
                    {cv.cidade}
                    {cv.bairro ? ` • ${cv.bairro}` : ""}
                  </p>
                  {cv.descricao && (
                    <p className="text-[11px] text-slate-500 line-clamp-3 mt-1">
                      {cv.descricao}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-emerald-700 font-semibold group-hover:underline">
                    Ver currículo completo
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
