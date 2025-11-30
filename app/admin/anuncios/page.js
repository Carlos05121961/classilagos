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

const STATUS_OPCOES = [
  { value: "todos", label: "Todos os status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "pendente", label: "Pendente" },
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
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [alterandoId, setAlterandoId] = useState(null); // para mostrar loading no botão

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

  // Trocar status (ativo <-> inativo)
  async function handleToggleStatus(anuncio) {
    const statusAtual = (anuncio.status || "").toLowerCase();
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";

    const ok = window.confirm(
      `Tem certeza que deseja marcar este anúncio como "${novoStatus}"?`
    );
    if (!ok) return;

    setAlterandoId(anuncio.id);

    const { error } = await supabase
      .from("anuncios")
      .update({ status: novoStatus })
      .eq("id", anuncio.id);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do anúncio. Tente novamente.");
    } else {
      // Atualiza no estado local
      setAnuncios((prev) =>
        prev.map((item) =>
          item.id === anuncio.id ? { ...item, status: novoStatus } : item
        )
      );
    }

    setAlterandoId(null);
  }

  // Filtros
  const anunciosFiltrados = useMemo(() => {
    return anuncios.filter((anuncio) => {
      // categoria
      if (
        filtroCategoria !== "todas" &&
        anuncio.categoria !== filtroCategoria
      ) {
        return false;
      }

      // cidade
      if (
        filtroCidade &&
        anuncio.cidade &&
        !anuncio.cidade
          .toLowerCase()
          .includes(filtroCidade.trim().toLowerCase())
      ) {
        return false;
      }

      // status
      if (
        filtroStatus !== "todos" &&
        (anuncio.status || "").toLowerCase() !== filtroStatus
      ) {
        return false;
      }

      // texto livre
      if (buscaTexto) {
        const texto = `${anuncio.titulo || ""} ${anuncio.descricao || ""}`.toLowerCase();
        if (!texto.includes(buscaTexto.trim().toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [anuncios, filtroCategoria, filtroCidade, filtroStatus, buscaTexto]);

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
          Visualize e administre todos os anúncios da plataforma. Use os filtros
          para encontrar rapidamente o que precisa. Você pode ativar ou
          desativar anúncios a qualquer momento.
        </p>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 grid gap-3 md:grid-cols-4">
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

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Status
            </label>
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              {STATUS_OPCOES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
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

      {/* Tabela desktop */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
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
              const primeiraImagem = anuncio.imagens?.[0] || null;
              const nomeOuNegocio =
                anuncio.nome_negocio ||
                anuncio.nome_contato ||
                anuncio.imobiliaria ||
                anuncio.corretor ||
                "—";
              const statusLower = (anuncio.status || "").toLowerCase();

              const statusClasse =
                statusLower === "ativo"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : statusLower === "pendente"
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : statusLower === "inativo"
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-slate-100 text-slate-700 border-slate-200";

              const statusLabel = anuncio.status || "—";

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
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] font-medium ${statusClasse}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="px-2 py-3 text-xs">
                    {formatarData(anuncio.created_at)}
                  </td>

                  {/* Ações */}
                  <td className="px-2 py-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/anuncios/${anuncio.id}`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium hover:bg-slate-100"
                      >
                        Ver anúncio
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(anuncio)}
                        disabled={alterandoId === anuncio.id}
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium ${
                          statusLower === "ativo"
                            ? "bg-slate-800 text-white hover:bg-slate-900"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {alterandoId === anuncio.id
                          ? "Atualizando..."
                          : statusLower === "ativo"
                          ? "Desativar"
                          : "Ativar"}
                      </button>
                    </div>
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
          const primeiraImagem = anuncio.imagens?.[0] || null;
          const statusLower = (anuncio.status || "").toLowerCase();
          const statusLabel = anuncio.status || "—";

          const statusClasse =
            statusLower === "ativo"
              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
              : statusLower === "pendente"
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : statusLower === "inativo"
              ? "bg-slate-100 text-slate-700 border-slate-200"
              : "bg-slate-100 text-slate-700 border-slate-200";

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

                <div className="flex items-center gap-2 text-[10px] mt-1">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-[1px] font-medium ${statusClasse}`}
                  >
                    {statusLabel}
                  </span>
                  <span className="text-slate-400">
                    {formatarData(anuncio.created_at)}
                  </span>
                </div>

                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/anuncios/${anuncio.id}`}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-300 px-2 py-[4px] text-[11px] font-medium text-slate-700"
                  >
                    Ver
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(anuncio)}
                    disabled={alterandoId === anuncio.id}
                    className={`flex-1 inline-flex items-center justify-center rounded-full px-2 py-[4px] text-[11px] font-medium ${
                      statusLower === "ativo"
                        ? "bg-slate-800 text-white"
                        : "bg-emerald-600 text-white"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {alterandoId === anuncio.id
                      ? "Atualizando..."
                      : statusLower === "ativo"
                      ? "Desativar"
                      : "Ativar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
