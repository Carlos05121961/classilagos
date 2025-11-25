"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import AuthGuard from "../../components/AuthGuard";

export default function MeusAnunciosPage() {
  const [user, setUser] = useState(null);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Carrega usuário + anúncios do usuário
  useEffect(() => {
    async function carregar() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setErro("Erro ao carregar dados do usuário.");
        setLoading(false);
        return;
      }

      if (!user) {
        setErro("Você precisa estar logado para ver seus anúncios.");
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error: anunciosError } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, preco, categoria, tipo_imovel, created_at, imagens"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (anunciosError) {
        console.error(anunciosError);
        setErro("Erro ao buscar seus anúncios.");
      } else {
        setAnuncios(data || []);
      }

      setLoading(false);
    }

    carregar();
  }, []);

  async function handleDelete(id) {
    if (!user) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este anúncio? Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("anuncios")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // segurança: só apaga se for do usuário

    if (error) {
      console.error(error);
      alert("Erro ao excluir anúncio: " + error.message);
    } else {
      setAnuncios((prev) => prev.filter((a) => a.id !== id));
    }

    setDeletingId(null);
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F5FBFF] px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Meus anúncios
              </h1>
              <p className="text-sm text-slate-600">
                Veja, edite ou exclua os anúncios que você publicou no
                Classilagos.
              </p>
            </div>

            <Link
              href="/anunciar"
              className="rounded-full bg-[#21D4FD] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
            >
              + Criar novo anúncio
            </Link>
          </header>

          {loading && (
            <p className="text-sm text-slate-600">Carregando seus anúncios…</p>
          )}

          {erro && !loading && (
            <p className="text-sm text-red-600">{erro}</p>
          )}

          {!loading && !erro && anuncios.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
              Você ainda não publicou nenhum anúncio.
              <br />
              <Link
                href="/anunciar"
                className="text-[#21D4FD] font-semibold hover:underline"
              >
                Clique aqui para criar o primeiro anúncio.
              </Link>
            </div>
          )}

          {!loading && anuncios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anuncios.map((anuncio) => {
                const img =
                  Array.isArray(anuncio.imagens) &&
                  anuncio.imagens.length > 0
                    ? anuncio.imagens[0]
                    : null;

                return (
                  <div
                    key={anuncio.id}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                  >
                    {/* Imagem */}
                    {img && (
                      <div className="w-full h-40 overflow-hidden bg-slate-100">
                        <img
                          src={img}
                          alt={anuncio.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div className="flex-1 px-4 py-3 space-y-1 text-sm text-slate-700">
                      <h2 className="font-semibold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h2>

                      <p className="text-[12px] text-slate-500">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>

                      {anuncio.preco && (
                        <p className="text-[13px] font-semibold text-emerald-700">
                          R$ {anuncio.preco}
                        </p>
                      )}

                      {anuncio.tipo_imovel && (
                        <p className="text-[12px] text-slate-500">
                          {anuncio.tipo_imovel}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400">
                        Publicado em{" "}
                        {new Date(
                          anuncio.created_at
                        ).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/anuncios/${anuncio.id}`}
                          className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100"
                        >
                          Ver anúncio
                        </Link>

                        {/* Em breve vamos ligar esse botão ao formulário de edição */}
                        <button
                          type="button"
                          disabled
                          className="rounded-full border border-slate-300 px-3 py-1 text-slate-400 cursor-not-allowed"
                          title="Em breve: edição do anúncio pelo formulário"
                        >
                          Editar (em breve)
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(anuncio.id)}
                        disabled={deletingId === anuncio.id}
                        className="rounded-full bg-red-500/90 px-3 py-1 text-white hover:bg-red-600 text-[11px] disabled:opacity-60"
                      >
                        {deletingId === anuncio.id ? "Excluindo…" : "Excluir"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
