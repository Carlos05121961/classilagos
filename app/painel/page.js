"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function PainelPage() {
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Erro ao buscar usuário:", error);
        }

        const userAtual = data?.user ?? null;
        setUser(userAtual);

        if (userAtual) {
          const nomeMeta =
            userAtual.user_metadata?.nome ||
            userAtual.user_metadata?.name ||
            (userAtual.email ? userAtual.email.split("@")[0] : null);

          setUserName(nomeMeta);

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userAtual.id)
            .single();

          if (!profileError && profile?.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
          setUserName(null);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário no painel:", e);
        setIsAdmin(false);
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, []);

  // Enquanto está carregando a info do usuário
  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Carregando painel...</p>
      </main>
    );
  }

  // Se NÃO estiver logado
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Você precisa fazer login
          </h1>
          <p className="text-sm text-slate-600 mb-4">
            Para acessar o painel do Classilagos, entre com sua conta ou crie
            um cadastro grátis.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/login"
              className="inline-flex justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2"
            >
              Fazer login
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex justify-center rounded-full border border-cyan-500 text-cyan-600 text-sm font-semibold px-5 py-2 hover:bg-cyan-50"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Se ESTIVER logado → mostra o painel normal
  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
          Painel Classilagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Bem-vindo ao seu painel interno
          {userName && (
            <>
              {", "}
              <span className="font-semibold">{userName}</span>
            </>
          )}
          . Aqui você gerencia seus anúncios
          {isAdmin && " e as áreas administrativas do portal."}
        </p>

        <div className="space-y-4">
          {/* TODOS OS USUÁRIOS */}
          <section className="rounded-2xl bg-white shadow-sm border border-slate-200 px-4 py-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Meus anúncios
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Veja e gerencie todos os anúncios que você já publicou no
              Classilagos.
            </p>
            <Link
              href="/painel/meus-anuncios"
              className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 hover:bg-blue-100"
            >
              Abrir painel de anúncios
            </Link>
          </section>

          {/* APENAS ADMIN */}
          {isAdmin && (
            <>
              <section className="rounded-2xl bg-white shadow-sm border border-emerald-100 px-4 py-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Importar notícias
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  Busque automaticamente notícias do G1 Região dos Lagos e RC24h
                  para o banco de dados interno.
                </p>
                <Link
                  href="/painel/importar-noticias"
                  className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 hover:bg-emerald-100"
                >
                  Abrir importador de notícias
                </Link>
              </section>

              <section className="rounded-2xl bg-white shadow-sm border border-amber-100 px-4 py-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Notícias importadas
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  Veja as notícias trazidas das fontes externas, publique, refine
                  ou exclua o que não for interessante para o portal.
                </p>
                <Link
                  href="/painel/noticias-importadas"
                  className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-2 hover:bg-amber-100"
                >
                  Gerenciar notícias importadas
                </Link>
              </section>
            </>
          )}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Dica: a parte pública do portal de notícias fica em{" "}
          <span className="font-mono text-slate-600">/noticias</span>.{" "}
          {isAdmin
            ? "Este painel é apenas para você gerenciar o conteúdo interno."
            : "Use este painel para cuidar dos seus anúncios no Classilagos."}
        </p>
      </div>
    </main>
  );
}


