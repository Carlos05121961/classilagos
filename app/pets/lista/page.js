"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

// CIDADES DA REGIÃO
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

// OPÇÕES DE TIPO / SUBCATEGORIA (para filtro)
const tiposFiltro = [
  { label: "Todos os tipos", value: "" },
  { label: "Animais à venda", value: "animais" },
  { label: "Acessórios", value: "acess" },
  { label: "Serviços pet", value: "servico" },
  { label: "Banho & tosa", value: "banho" },
  { label: "Veterinário / Clínica", value: "veterin" },
  { label: "Hospedagem / Hotel", value: "hosped" },
  { label: "Adoção", value: "adoc" },
  { label: "Achados e perdidos", value: "achado" },
];

const norm = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function ListaPetsPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // filtros visíveis na tela
  const [filtros, setFiltros] = useState({
    tipo: "",
    cidade: "",
  });

  // Lê os parâmetros da URL (subcategoria, tipo, cidade) UMA VEZ e joga nos filtros
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const subFromUrl = params.get("subcategoria") || "";
    const tipoFromUrl = params.get("tipo") || "";
    const cidadeFromUrl = params.get("cidade") || "";

    // Dá preferência para subcategoria, depois tipo
    const tipoInicial = subFromUrl || tipoFromUrl;

    setFiltros({
      tipo: tipoInicial,
      cidade: cidadeFromUrl,
    });
  }, []);

  // Carrega anúncios de pets no Supabase (uma vez)
  useEffect(() => {
    async function carregarAnuncios() {
      try {
        setCarregando(true);
        setErro("");

        const { data, error } = await supabase
          .from("anuncios")
          .select(
            `
            id,
            titulo,
            cidade,
            bairro,
            preco,
            imagens,
            subcategoria_pet,
            tipo_pet,
            tipo_imovel,
            categoria,
            status,
            destaque,
            created_at
          `
          )
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao carregar anúncios de pets:", error);
          setErro("Não foi possível carregar os anúncios de pets agora.");
          setAnuncios([]);
          return;
        }

        const todos = data || [];

        // Filtra apenas categoria "pets" (tolerante)
        const soPets = todos.filter((a) => norm(a.categoria).includes("pets"));

        // Status ativo ou vazio
        const ativos = soPets.filter((a) => {
          const st = norm(a.status);
          return !st || st === "ativo";
        });

        setAnuncios(ativos);
      } catch (e) {
        console.error("Erro inesperado ao carregar anúncios de pets:", e);
        setErro("Não foi possível carregar os anúncios de pets agora.");
        setAnuncios([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarAnuncios();
  }, []);

  // Aplica os filtros em memória
  const anunciosFiltrados = anuncios.filter((a) => {
    // CIDADE
    if (filtros.cidade) {
      if ((a.cidade || "") !== filtros.cidade) return false;
    }

    // TIPO / SUBCATEGORIA
    if (filtros.tipo) {
      const alvo = norm(filtros.tipo);

      const campos = [
        a.subcategoria_pet,
        a.tipo_pet,
        a.tipo_imovel,
        a.titulo,
      ];

      const encontrou = campos.some((campo) =>
        norm(campo).includes(alvo)
      );

      if (!encontrou) return false;
    }

    return true;
  });

  // Descrição embaixo do título (igual ao padrão dos imóveis)
  const descricaoFiltro = (() => {
    const partes = [];

    if (filtros.tipo) {
      // Encontra label bonitinha, se existir
      const found = tiposFiltro.find((t) =>
        filtros.tipo &&
        filtros.tipo.toLowerCase().includes(t.value) &&
        t.value !== ""
      );
      if (found) {
        partes.push(found.label.toLowerCase());
      } else {
        partes.push(filtros.tipo.toLowerCase());
      }
    }

    if (filtros.cidade) {
      partes.push(`em ${filtros.cidade}`);
    }

    if (partes.length === 0) return "Todos os anúncios de pets cadastrados";
    return "Filtrando: " + partes.join(" ") + ".";
  })();

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  // Título dinâmico (se vier subcategoria/tipo da URL)
  const tituloPagina = filtros.tipo
    ? `Pets – ${filtros.tipo}`
    : "Pets – Lista";

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* TOPO */}
      <section className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Classilagos &gt; Pets
            </p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {tituloPagina}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Animais, acessórios, serviços pet e muito mais na Região dos
              Lagos.
            </p>
            <p className="text-[11px] md:text-xs text-slate-500 mt-1">
              {descricaoFiltro}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <Link href="/pets" className="text-xs text-slate-600 underline">
              &larr; Voltar para Pets
            </Link>
            <Link
              href="/anunciar?tipo=pets"
              className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Anunciar para pets
            </Link>
          </div>
        </div>
      </section>

      {/* FILTROS RÁPIDOS (padrão dos imóveis) */}
      <section className="max-w-6xl mx-auto px-4 pt-4">
        <div className="mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-3 items-end">
            {/* Tipo */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Tipo / subcategoria
              </label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.tipo}
                onChange={(e) => atualizarFiltro("tipo", e.target.value)}
              >
                {tiposFiltro.map((t) => (
                  <option key={t.value || "all"} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Cidade
              </label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.cidade}
                onChange={(e) => atualizarFiltro("cidade", e.target.value)}
              >
                <option value="">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão limpar */}
            <div className="flex justify-end">
              <button
                type="button"
                className="w-full md:w-auto rounded-full bg-slate-900 text-white px-4 py-2 text-xs md:text-sm font-semibold hover:bg-slate-800"
                onClick={() => setFiltros({ tipo: "", cidade: "" })}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA DE ANÚNCIOS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        {erro && (
          <p className="text-xs text-red-600 mb-3 border border-red-100 rounded-md px-3 py-2 bg-red-50">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="text-xs text-slate-500">Carregando anúncios...</p>
        ) : anunciosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum anúncio encontrado com esses filtros.
            <div className="mt-4 flex flex-col items-center gap-2">
              <Link className="text-blue-600 underline" href="/pets">
                Voltar para Pets
              </Link>
              <Link
                href="/anunciar?tipo=pets"
                className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Anunciar para pets
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {anunciosFiltrados.map((item) => {
              const imagens = Array.isArray(item.imagens) ? item.imagens : [];
              const capa =
                imagens.length > 0 ? imagens[0] : null;

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition flex flex-col"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    {capa ? (
                      <img
                        src={capa}
                        alt={item.titulo || "Anúncio de pet"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-white bg-gradient-to-br from-amber-500 to-rose-500">
                        Sem foto
                      </div>
                    )}
                    {item.destaque && (
                      <span className="absolute top-2 left-2 rounded-full bg-amber-500 text-[10px] font-semibold text-white px-2 py-1 shadow">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">
                      {item.titulo}
                    </p>

                    <p className="text-[10px] text-slate-300">
                      {item.subcategoria_pet ||
                        item.tipo_pet ||
                        item.tipo_imovel ||
                        "Pets"}
                      {" • "}
                      {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>

                    {item.preco && (
                      <p className="text-[11px] font-bold text-emerald-300">
                        {item.preco}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
