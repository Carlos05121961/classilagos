"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import AuthGuard from "../../components/AuthGuard";

export default function MeusAnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function carregarAnuncios() {
      setLoading(true);
      setErro("");

      // 1) Pega o usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setErro("Erro ao carregar usuário. Tente novamente.");
        setLoading(false);
        return;
      }

      if (!user) {
        setErro("Você precisa estar logado para ver seus anúncios.");
        setLoading(false);
        return;
      }

      setUserEmail(user.email || "");

      // 2) Busca os anúncios desse usuário
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setErro("Erro ao carregar seus anúncios.");
      } else {
        setAnuncios(data || []);
      }

      setLoading(false);
    }

    carregarAnuncios();
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Meus anúncios</h1>

        {userEmail && (
          <p className="text-sm text-slate-600 mb-6">
            Usuário logado: <span className="font-medium">{userEmail}</span>
          </p>
        )}

        <div className="mb-6">
          <Link
            href="/anunciar"
            className="inline-flex items-center rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
          >
            + Criar novo anúncio
          </Link>
        </div>

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-slate-700">Carregando seus anúncios...</p>
          </div>
        )}

        {!loading && erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4">
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        {!loading && !erro && anuncios.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            <p className="text-slate-700 mb-2">
              Você ainda não tem nenhum anúncio cadastrado.
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Clique no botão acima para criar seu primeiro anúncio grátis.
            </p>
            <Link
              href="/anunciar"
              className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Criar anúncio agora
            </Link>
          </div>
        )}

        {!loading && !erro && anuncios.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {anuncios.map((anuncio) => (
              <div
                key={anuncio.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                    {anuncio.categoria || "Sem categoria"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <h2 className="text-lg font-semibold mb-1">
                  {anuncio.titulo}
                </h2>

                <p className="text-sm text-slate-600 line-clamp-3 mb-2">
                  {anuncio.descricao}
                </p>

                <p className="text-sm text-slate-500 mb-1">
                  <span className="font-medium">Cidade:</span>{" "}
                  {anuncio.cidade}
                </p>

                <p className="text-sm text-slate-500 mb-4">
                  <span className="font-medium">Contato:</span>{" "}
                  {anuncio.contato}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    disabled
                  >
                    Editar (em breve)
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    disabled
                  >
                    Excluir (em breve)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
