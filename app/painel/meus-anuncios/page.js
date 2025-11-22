"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

const CATEGORIA_LABELS = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas",
};

const CATEGORIA_ROTA = {
  imoveis: "/imoveis",
  veiculos: "/veiculos",
  nautica: "/nautica",
  pets: "/pets",
  empregos: "/empregos",
  servicos: "/servicos",
  turismo: "/turismo",
  lagolistas: "/lagolistas",
};

export default function MeusAnunciosPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);

  useEffect(() => {
    async function loadUserAndAds() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erro ao buscar usuário:", userError.message);
        setUser(null);
        setLoadingUser(false);
        setLoadingAnuncios(false);
        return;
      }

      const currentUser = userData?.user ?? null;
      setUser(currentUser);
      setLoadingUser(false);

      if (!currentUser) {
        setLoadingAnuncios(false);
        return;
      }

      const { data: adsData, error: adsError } = await supabase
        .from("anuncios")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (adsError) {
        console.error("Erro ao buscar anúncios do usuário:", adsError.message);
      }

      setAnuncios(adsData || []);
      setLoadingAnuncios(false);
    }

    loadUserAndAds();
  }, []);

  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-gray-600">
          Carregando informações do seu painel…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h1 className="mb-2 text-lg font-semibold text-gray-900">
            Você não está logado
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Para acessar seu painel e gerenciar seus anúncios, faça login com seu
            e-mail.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Meu painel</h1>
        <p className="text-sm text-gray-600">
          Usuário logado:{" "}
          <span className="font-semibold">{user.email}</span>
        </p>
      </header>

      {/* Blocos principais */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {/* Criar novo anúncio */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">
            Criar novo anúncio
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Publique um novo anúncio grátis em qualquer categoria do Classilagos.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/anunciar/formulario?tipo=imoveis"
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              + Imóveis
            </Link>
            <Link
              href="/anunciar/formulario?tipo=veiculos"
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              + Veículos
            </Link>
            <Link
              href="/anunciar/formulario?tipo=servicos"
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              + Serviços
            </Link>
          </div>
        </div>

        {/* Resumo dos anúncios */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">
            Meus anúncios
          </h2>
          <p className="text-sm text-gray-600">
            Veja e gerencie todos os anúncios cadastrados na sua conta.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Quantidade de anúncios cadastrados:{" "}
            <span className="font-semibold">{anuncios.length}</span>
          </p>
        </div>
      </div>

      {/* Lista dos anúncios do usuário */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Anúncios publicados por você
        </h2>

        {loadingAnuncios && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
            Carregando seus anúncios…
          </div>
        )}

        {!loadingAnuncios && anuncios.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
            Você ainda não publicou nenhum anúncio. Clique em{" "}
            <span className="font-semibold">“Criar novo anúncio”</span> para
            começar.
          </div>
        )}

        {!loadingAnuncios && anuncios.length > 0 && (
          <div className="space-y-3">
            {anuncios.map((anuncio) => {
              const categoria = anuncio.categoria || "imoveis";
              const categoriaLabel =
                CATEGORIA_LABELS[categoria] || "Anúncio";
              const rotaCategoria =
                CATEGORIA_ROTA[categoria] || "/";

              return (
                <article
                  key={anuncio.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {anuncio.titulo}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Categoria: {categoriaLabel} •{" "}
                        {anuncio.cidade || "Cidade não informada"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                        {anuncio.descricao}
                      </p>

                      <p className="mt-2 text-xs text-gray-600">
                        Contato:{" "}
                        <span className="font-semibold">
                          {anuncio.contato}
                        </span>
                      </p>

                      {anuncio.video_url && (
                        <a
                          href={anuncio.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          ▶ Ver vídeo no YouTube
                        </a>
                      )}

                      <p className="mt-1 text-[11px] text-gray-400">
                        Publicado em{" "}
                        {new Date(anuncio.created_at).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <Link
                        href={`/anuncio/${anuncio.id}`}
                        className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        🔎 Ver anúncio completo
                      </Link>

                      <Link
                        href={rotaCategoria}
                        className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Ver na página de {categoriaLabel}
                      </Link>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
                        Em breve: editar e remover anúncio
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
