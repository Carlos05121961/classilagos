"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import Link from "next/link";

const CATEGORIAS = [
  { value: "todas", label: "Todas as categorias" },
  { value: "imoveis", label: "Imóveis" },
  { value: "veiculos", label: "Veículos" },
  { value: "nautica", label: "Náutica" },
  { value: "pets", label: "Pets" },
  { value: "empregos", label: "Empregos" },
  { value: "servicos", label: "Serviços" },
  { value: "turismo", label: "Turismo" },
  { value: "lagolistas", label: "LagoListas" },
];

function formatarData(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminAnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [buscaTexto, setBuscaTexto] = useState("");

  // Carregar anúncios
  useEffect(() => {
    async function carregarAnuncios() {
      setCarregando(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar anúncios:", error);
        setErro("Erro ao carregar anúncios. Tente novamente mais tarde.");
      } else {
        setAnuncios(data || []);
      }

      setCarregando(false);
    }

    carregarAnuncios();
  }, []);

  // Filtros
  const anunciosFiltrados = useMemo(() => {
    return anuncios.filter((anuncio) => {
      if (
        filtroCategoria !== "todas" &&
        anuncio.categoria !== filtroCategoria
      ) {
        return false;
      }

      if (
        filtroCidade &&
        anuncio.cidade &&
        !anuncio.cidade
          .toLowerCase()
          .includes(filtroCidade.trim().toLowerCase())
      ) {
        return false;
      }

      if (buscaTexto) {
        const texto = `${anuncio.titulo || ""} ${anuncio.descricao || ""}`.toLowerCase();
        if (!texto.includes(buscaTexto.trim().toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [anuncios, filtroCategoria, filtroCidade, buscaTexto]);

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Gerenciar anúncios
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Aqui você visualiza todos os anúncios publicados na plataforma.
          Em breve vamos adicionar ações de edição, destaque e moderação.
        </p>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 grid gap-3 md:grid-cols-3">
          {/* Categoria */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Categoria
            </label>
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cidade */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Cidade
            </label>
            <input
              type="text"
              placeholder="Ex.: Maricá, Cabo Frio..."
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            />
          </div>

          {/* Texto */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Buscar por título / descrição
            </label>
            <input
              type="text"
              placeholder="Ex.: casa com piscina..."
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
            />
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 mt-2 md:mt-0">
          {carregando ? (
            <span>Carregando anúncios…</span>
          ) : (
            <span>
              Mostrando <b>{anunciosFiltrados.length}</b> de {anuncios.length}
            </span>
          )}
        </div>
      </div>

      {erro && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Tabela */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs text-slate-500">
              <th className="py-2 pl-4 pr-2 text-left">Anúncio</th>
              <th className="px-2 text-left">Categoria</th>
              <th className="px-2 text-left">Cidade</th>
              <th className="px-2 text-left">Contato</th>
              <th className="px-2 text-left">Status</th>
              <th className="px-2 text-left">Criado em</th>
              <th className="px-2 text-left">Ações</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  Carregando anúncios…
                </td>
              </tr>
            )}

            {!carregando && anunciosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  Nenhum anúncio encontrado.
                </td>
              </tr>
            )}

            {anunciosFiltrados.map((anuncio) => {
              const primeiraImagem =
                anuncio.imagens?.[0] || null;

              const nomeOuNegocio =
                anuncio.nome_negocio ||
                anuncio.nome_contato ||
                anuncio.imobiliaria ||
                anuncio.corretor ||
                "—";

              return (
                <tr
                  key={anuncio.id}
                  className="border-b border-slate-100 hover:bg-slate-50/80"
                >
                  {/* Anúncio */}
                  <td className="py-3 pl-4 pr-2">
                    <div className="flex items-center gap-3">
                      {primeiraImagem ? (
                        <img
                          src={primeiraImagem}
                          alt={anuncio.titulo}
                          className="h-12 w-16 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="h-12 w-16 flex items-center justify-center border border-dashed text-[10px] text-slate-400">
                          sem foto
                        </div>
                      )}
                      <div>
                        <p className="font-semibold line-clamp-1">
                          {anuncio.titulo}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {anuncio.descricao}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="px-2 py-3 text-xs">
                    {anuncio.categoria || "—"}
                  </td>

                  {/* Cidade */}
                  <td className="px-2 py-3 text-xs">
                    {anuncio.cidade || "—"}
                  </td>

                  {/* Contato */}
                  <td className="px-2 py-3 text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold">{nomeOuNegocio}</span>
                      <span className="text-[11px] text-slate-500">
                        {anuncio.telefone || anuncio.whatsapp || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-2 py-3 text-xs">
                    {anuncio.status || "—"}
                  </td>

                  {/* Data */}
                  <td className="px-2 py-3 text-xs">
                    {formatarData(anuncio.created_at)}
                  </td>

                  {/* Ações */}
                  <td className="px-2 py-3 text-xs">
                    <Link
                      href={`/anuncios/${anuncio.id}`}
                      target="_blank"
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium hover:bg-slate-100"
                    >
                      Ver anúncio
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden divide-y divide-slate-100">
        {carregando && (
          <div className="py-6 text-center text-sm text-slate-500">
            Carregando anúncios…
          </div>
        )}

        {!carregando && anunciosFiltrados.length === 0 && (
          <div className="py-6 text-center text-sm text-slate-500">
            Nenhum anúncio encontrado.
          </div>
        )}

        {anunciosFiltrados.map((anuncio) => {
          const primeiraImagem =
            anuncio.imagens?.[0] || null;

          return (
            <div key={anuncio.id} className="p-3 flex gap-3">
              {primeiraImagem ? (
                <img
                  src={primeiraImagem}
                  alt={anuncio.titulo}
                  className="h-16 w-20 rounded-lg object-cover border"
                />
              ) : (
                <div className="h-16 w-20 border border-dashed flex items-center justify-center text-[10px] text-slate-400">
                  sem foto
                </div>
              )}

              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold line-clamp-2">
                  {anuncio.titulo}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {anuncio.descricao}
                </p>

                <Link
                  href={`/anuncios/${anuncio.id}`}
                  className="inline-block mt-1 rounded-full border border-slate-300 px-2 py-[2px] text-[10px] font-medium text-slate-700"
                >
                  Ver anúncio
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
