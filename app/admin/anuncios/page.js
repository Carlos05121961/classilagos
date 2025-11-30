"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

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
  const [processandoId, setProcessandoId] = useState(null);

  // 🔹 Buscar anúncios no Supabase
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

  // 🔹 Filtros em memória
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

      // busca texto: título ou descrição
      if (buscaTexto) {
        const texto = `${anuncio.titulo || ""} ${
          anuncio.descricao || ""
        }`.toLowerCase();
        if (!texto.includes(buscaTexto.trim().toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [anuncios, filtroCategoria, filtroCidade, buscaTexto]);

  // 🔹 Ações --------------------------------------------------------

  async function handleToggleDestaque(anuncio) {
    try {
      setProcessandoId(anuncio.id);
      const novoValor = !anuncio.destaque;

      const { error } = await supabase
        .from("anuncios")
        .update({ destaque: novoValor })
        .eq("id", anuncio.id);

      if (error) throw error;

      setAnuncios((prev) =>
        prev.map((a) =>
          a.id === anuncio.id ? { ...a, destaque: novoValor } : a
        )
      );
    } catch (e) {
      console.error("Erro ao alterar destaque:", e);
      alert("Erro ao alterar destaque do anúncio.");
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleToggleStatus(anuncio) {
    try {
      setProcessandoId(anuncio.id);
      const statusAtual = anuncio.status || "ativo";
      const novoStatus = statusAtual === "ativo" ? "pausado" : "ativo";

      const { error } = await supabase
        .from("anuncios")
        .update({ status: novoStatus })
        .eq("id", anuncio.id);

      if (error) throw error;

      setAnuncios((prev) =>
        prev.map((a) =>
          a.id === anuncio.id ? { ...a, status: novoStatus } : a
        )
      );
    } catch (e) {
      console.error("Erro ao alterar status:", e);
      alert("Erro ao alterar status do anúncio.");
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleExcluir(anuncio) {
    const ok = window.confirm(
      `Tem certeza que deseja excluir o anúncio:\n\n"${anuncio.titulo}"?`
    );
    if (!ok) return;

    try {
      setProcessandoId(anuncio.id);

      const { error } = await supabase
        .from("anuncios")
        .delete()
        .eq("id", anuncio.id);

      if (error) throw error;

      setAnuncios((prev) => prev.filter((a) => a.id !== anuncio.id));
    } catch (e) {
      console.error("Erro ao excluir anúncio:", e);
      alert("Erro ao excluir anúncio.");
    } finally {
      setProcessandoId(null);
    }
  }

  // ----------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Título / descrição */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Gerenciar anúncios
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Aqui você visualiza todos os anúncios publicados na plataforma, de
          todas as categorias. Você pode destacar, pausar ou excluir anúncios.
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
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/60"
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
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/60"
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            />
          </div>

          {/* Busca texto */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Buscar por título / descrição
            </label>
            <input
              type="text"
              placeholder="Ex.: casa com piscina, pousada, consultório..."
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/60"
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
            />
          </div>
        </div>

        {/* Contador */}
        <div className="text-right text-xs text-slate-500 mt-2 md:mt-0">
          {carregando ? (
            <span>Carregando anúncios…</span>
          ) : (
            <span>
              Mostrando{" "}
              <span className="font-semibold text-slate-800">
                {anunciosFiltrados.length}
              </span>{" "}
              de {anuncios.length} anúncios
            </span>
          )}
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Tabela (desktop) */}
      <div className="hidden md:block rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <table className="min-w-full text-sm">
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
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Carregando anúncios…
                </td>
              </tr>
            )}

            {!carregando && anunciosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Nenhum anúncio encontrado com os filtros atuais.
                </td>
              </tr>
            )}

            {anunciosFiltrados.map((anuncio) => {
              const primeiraImagem =
                anuncio.imagens && anuncio.imagens.length > 0
                  ? anuncio.imagens[0]
                  : null;

              const nomeOuNegocio =
                anuncio.nome_negocio ||
                anuncio.nome_contato ||
                anuncio.imobiliaria ||
                anuncio.corretor ||
                "—";

              const status = anuncio.status || "ativo";

              return (
                <tr
                  key={anuncio.id}
                  className="border-b border-slate-100 hover:bg-slate-50/80"
                >
                  {/* Anúncio */}
                  <td className="py-3 pl-4 pr-2 align-top">
                    <div className="flex items-center gap-3">
                      {primeiraImagem ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={primeiraImagem}
                          alt={anuncio.titulo || "Foto do anúncio"}
                          className="h-12 w-16 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                          sem foto
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">
                          {anuncio.titulo || "Sem título"}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {anuncio.descricao || "Sem descrição"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="px-2 py-3 align-top text-xs text-slate-700">
                    {anuncio.categoria || "—"}
                    {anuncio.destaque && (
                      <span className="ml-1 inline-flex items-center rounded-full bg-yellow-100 px-2 py-[2px] text-[10px] font-semibold text-yellow-800">
                        Destaque
                      </span>
                    )}
                  </td>

                  {/* Cidade */}
                  <td className="px-2 py-3 align-top text-xs text-slate-700">
                    {anuncio.cidade || "—"}
                  </td>

                  {/* Contato */}
                  <td className="px-2 py-3 align-top text-xs text-slate-700">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {nomeOuNegocio}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {anuncio.telefone || anuncio.whatsapp || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-2 py-3 align-top text-xs text-slate-700">
                    <span
                      className={`inline-flex rounded-full px-2 py-[2px] text-[10px] font-semibold ${
                        status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="px-2 py-3 align-top text-xs text-slate-700">
                    {formatarData(anuncio.created_at)}
                  </td>

                  {/* Ações */}
                  <td className="px-2 py-3 align-top text-xs text-slate-700">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/anuncios/${anuncio.id}`}
                        className="text-[11px] text-blue-600 hover:underline"
                        target="_blank"
                      >
                        Ver no site
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleToggleDestaque(anuncio)}
                        disabled={processandoId === anuncio.id}
                        className="text-[11px] text-yellow-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-left"
                      >
                        {anuncio.destaque
                          ? "Remover destaque"
                          : "Colocar em destaque"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(anuncio)}
                        disabled={processandoId === anuncio.id}
                        className="text-[11px] text-slate-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-left"
                      >
                        {status === "ativo" ? "Pausar anúncio" : "Ativar anúncio"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExcluir(anuncio)}
                        disabled={processandoId === anuncio.id}
                        className="text-[11px] text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-left"
                      >
                        Excluir anúncio
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lista em cards (mobile) */}
      <div className="md:hidden divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200 overflow-hidden">
        {carregando && (
          <div className="py-6 text-center text-sm text-slate-500">
            Carregando anúncios…
          </div>
        )}

        {!carregando && anunciosFiltrados.length === 0 && (
          <div className="py-6 text-center text-sm text-slate-500">
            Nenhum anúncio encontrado com os filtros atuais.
          </div>
        )}

        {anunciosFiltrados.map((anuncio) => {
          const primeiraImagem =
            anuncio.imagens && anuncio.imagens.length > 0
              ? anuncio.imagens[0]
              : null;

          const nomeOuNegocio =
            anuncio.nome_negocio ||
            anuncio.nome_contato ||
            anuncio.imobiliaria ||
            anuncio.corretor ||
            "—";

          const status = anuncio.status || "ativo";

          return (
            <div key={anuncio.id} className="p-3 flex gap-3">
              {primeiraImagem ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primeiraImagem}
                  alt={anuncio.titulo || "Foto do anúncio"}
                  className="h-16 w-20 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="h-16 w-20 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                  sem foto
                </div>
              )}

              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                  {anuncio.titulo || "Sem título"}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {anuncio.descricao || "Sem descrição"}
                </p>

                <div className="flex flex-wrap gap-1 items-center text-[10px] text-slate-500">
                  <span>{anuncio.categoria || "—"}</span>
                  <span>•</span>
                  <span>{anuncio.cidade || "—"}</span>
                  {anuncio.destaque && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-[1px] text-[9px] font-semibold text-yellow-800">
                        Destaque
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                  <span>
                    Criado em {formatarData(anuncio.created_at)} • {status}
                  </span>
                </div>

                {/* Ações mobile */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <Link
                    href={`/anuncios/${anuncio.id}`}
                    target="_blank"
                    className="text-[10px] text-blue-600 underline"
                  >
                    Ver no site
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleDestaque(anuncio)}
                    disabled={processandoId === anuncio.id}
                    className="text-[10px] text-yellow-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {anuncio.destaque
                      ? "Remover destaque"
                      : "Colocar em destaque"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(anuncio)}
                    disabled={processandoId === anuncio.id}
                    className="text-[10px] text-slate-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "ativo" ? "Pausar" : "Ativar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExcluir(anuncio)}
                    disabled={processandoId === anuncio.id}
                    className="text-[10px] text-red-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Excluir
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
