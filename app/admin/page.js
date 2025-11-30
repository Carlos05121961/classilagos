"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [anuncios, setAnuncios] = useState([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalNoticias, setTotalNoticias] = useState(0);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro("");

      try {
        // 🔹 Anúncios
        const { data: anunciosData, error: anunciosError } = await supabase
          .from("anuncios")
          .select(
            "id, categoria, status, destaque, created_at, cidade, titulo"
          )
          .order("created_at", { ascending: false });

        if (anunciosError) throw anunciosError;
        setAnuncios(anunciosData || []);

        // 🔹 Usuários (profiles)
        const { count: usuariosCount, error: usuariosError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (usuariosError) throw usuariosError;
        setTotalUsuarios(usuariosCount || 0);

        // 🔹 Notícias
        const { count: noticiasCount, error: noticiasError } = await supabase
          .from("noticias")
          .select("*", { count: "exact", head: true });

        if (noticiasError) throw noticiasError;
        setTotalNoticias(noticiasCount || 0);
      } catch (e) {
        console.error("Erro no dashboard:", e);
        setErro("Erro ao carregar dados do painel. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const totalAnuncios = anuncios.length;

  const qtdDestaques = useMemo(
    () => anuncios.filter((a) => a.destaque === true).length,
    [anuncios]
  );

  const anunciosRecentes = useMemo(() => anuncios.slice(0, 5), [anuncios]);

  const porCategoria = useMemo(() => {
    const mapa = {};
    for (const a of anuncios) {
      const cat = a.categoria || "sem_categoria";
      mapa[cat] = (mapa[cat] || 0) + 1;
    }
    return mapa;
  }, [anuncios]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Dashboard do administrador
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Visão geral rápida de tudo que está acontecendo na plataforma:
          anúncios, usuários, notícias e destaques.
        </p>
      </div>

      {erro && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-[11px] font-semibold text-slate-500">
            Anúncios ativos
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {carregando ? "…" : totalAnuncios}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Em todas as categorias.
          </p>
          <Link
            href="/admin/anuncios"
            className="mt-3 inline-flex text-[11px] font-semibold text-blue-600"
          >
            Ver anúncios
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-[11px] font-semibold text-slate-500">
            Anúncios em destaque
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {carregando ? "…" : qtdDestaques}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Aparecem prioritariamente nos pilares.
          </p>
          <span className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-[2px] text-[10px] font-semibold text-yellow-800">
            Plano comercial
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-[11px] font-semibold text-slate-500">
            Usuários cadastrados
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {carregando ? "…" : totalUsuarios}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Pessoas que podem criar anúncios.
          </p>
          <Link
            href="/admin/usuarios"
            className="mt-3 inline-flex text-[11px] font-semibold text-blue-600"
          >
            Ver usuários
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-[11px] font-semibold text-slate-500">
            Notícias cadastradas
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {carregando ? "…" : totalNoticias}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Importadas ou criadas pelo portal.
          </p>
          <Link
            href="/admin/noticias"
            className="mt-3 inline-flex text-[11px] font-semibold text-blue-600"
          >
            Gerenciar notícias
          </Link>
        </div>
      </div>

      {/* Distribuição por categoria + ações rápidas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-slate-200 p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">
            Anúncios por categoria
          </h2>
          {carregando ? (
            <p className="text-sm text-slate-500">Carregando…</p>
          ) : totalAnuncios === 0 ? (
            <p className="text-sm text-slate-500">
              Ainda não há anúncios cadastrados.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100 text-sm">
              {Object.entries(porCategoria).map(([cat, qtd]) => (
                <li
                  key={cat}
                  className="flex items-center justify-between py-2"
                >
                  <span className="capitalize text-slate-700">
                    {cat === "sem_categoria" ? "Sem categoria" : cat}
                  </span>
                  <span className="font-semibold text-slate-900">{qtd}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Ações rápidas
          </h2>
          <p className="text-[11px] text-slate-500 mb-2">
            Atalhos para o que você mais vai usar no dia a dia.
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              href="/admin/anuncios"
              className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              • Ver e moderar anúncios
            </Link>
            <Link
              href="/admin/noticias"
              className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              • Gerenciar notícias do portal
            </Link>
            <Link
              href="/admin/banners"
              className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              • Cadastrar / trocar banners
            </Link>
            <Link
              href="/admin/usuarios"
              className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              • Ver cadastro de usuários
            </Link>
          </div>
        </div>
      </div>

      {/* Últimos anúncios */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Últimos anúncios publicados
          </h2>
          <Link
            href="/admin/anuncios"
            className="text-[11px] font-semibold text-blue-600"
          >
            Ver todos
          </Link>
        </div>

        {carregando ? (
          <p className="text-sm text-slate-500">Carregando…</p>
        ) : anunciosRecentes.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ainda não há anúncios cadastrados.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {anunciosRecentes.map((a) => (
              <li
                key={a.id}
                className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-1"
              >
                <div>
                  <p className="font-semibold text-slate-900 line-clamp-1">
                    {a.titulo || "Sem título"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {a.categoria || "Sem categoria"} •{" "}
                    {a.cidade || "Cidade não informada"}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  {a.status || "sem status"}
                  {a.destaque && (
                    <span className="ml-2 inline-flex rounded-full bg-yellow-100 px-2 py-[1px] text-[10px] font-semibold text-yellow-800">
                      Destaque
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
