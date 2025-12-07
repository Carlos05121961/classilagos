"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

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

const subcategoriasPets = [
  { label: "Todos", value: "" },
  { label: "Animais", value: "Animais" },
  { label: "Acessórios", value: "Acessórios" },
  { label: "Serviços pet", value: "Serviços pet" },
];

export default function ListaPetsPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtros, setFiltros] = useState({
    subcategoria: "",
    cidade: "",
  });

  // Lê os parâmetros da URL uma vez (ex.: ?subcategoria=Animais)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const subcategoria = params.get("subcategoria") || "";
    const cidade = params.get("cidade") || "";

    setFiltros({
      subcategoria,
      cidade,
    });
  }, []);

  // Carrega anúncios sempre que filtros mudarem
  useEffect(() => {
    async function carregarPets() {
      try {
        setCarregando(true);
        setErro("");

        let query = supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "pets")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false });

        if (filtros.subcategoria) {
          // bate direto com o campo subcategoria_pet salvo pelo FormularioPets
          query = query.eq("subcategoria_pet", filtros.subcategoria);
        }

        if (filtros.cidade) {
          query = query.eq("cidade", filtros.cidade);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Erro ao carregar anúncios de pets:", error);
          setErro("Não foi possível carregar os anúncios de pets agora.");
          setAnuncios([]);
        } else {
          setAnuncios(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao carregar anúncios de pets:", e);
        setErro("Erro inesperado ao carregar os anúncios.");
        setAnuncios([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarPets();
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  const descricaoFiltro = (() => {
    const partes = [];
    if (filtros.subcategoria) partes.push(filtros.subcategoria.toLowerCase());
    if (filtros.cidade) partes.push(`em ${filtros.cidade}`);
    if (partes.length === 0) return "Todos os anúncios de pets cadastrados.";
    return "Filtrando: " + partes.join(" ") + ".";
  })();

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* TOPO */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Classilagos &gt; Pets
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Pets – Lista
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              {descricaoFiltro}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-1">
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

        {/* FILTROS RÁPIDOS */}
        <div className="mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Categoria
              </label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.subcategoria}
                onChange={(e) =>
                  atualizarFiltro("subcategoria", e.target.value)
                }
              >
                {subcategoriasPets.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="flex justify-end">
              <button
                type="button"
                className="w-full md:w-auto rounded-full bg-slate-900 text-white px-4 py-2 text-xs md:text-sm font-semibold hover:bg-slate-800"
                onClick={() => setFiltros({ subcategoria: "", cidade: "" })}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {/* AVISOS / ERROS */}
        {erro && (
          <p className="text-xs text-red-600 mb-3 border border-red-100 rounded-md px-3 py-2 bg-red-50">
            {erro}
          </p>
        )}

        {/* LISTA DE ANÚNCIOS */}
        {carregando ? (
          <p className="text-xs text-slate-500">Carregando anúncios de pets...</p>
        ) : anuncios.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum anúncio de pets encontrado com esses filtros.
            <div className="mt-4">
              <Link className="text-blue-600 underline" href="/pets">
                Voltar para Pets
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anuncios.map((item) => {
              const imagens = Array.isArray(item.imagens)
                ? item.imagens
                : [];
              const capa =
                imagens.length > 0 ? imagens[0] : "/pets/sem-foto.jpg";

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    <img
                      src={capa}
                      alt={item.titulo || "Pet"}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">
                      {item.titulo}
                    </p>

                    <p className="text-[10px] text-slate-300">
                      {item.subcategoria_pet
                        ? `${item.subcategoria_pet} • `
                        : ""}
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
      </div>
    </main>
  );
}

