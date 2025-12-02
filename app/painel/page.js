"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import Link from "next/link";

export default function PainelPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // não logado → manda pro login
        if (!user) {
          router.push("/login");
          return;
        }

        // guarda nome pra exibir no painel
        const nomeMeta =
          user.user_metadata?.nome ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          null;
        setUserName(nomeMeta);

        // checa se é admin na tabela profiles
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && data?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário no painel:", e);
        setIsAdmin(false);
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [router]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Carregando painel...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
          Painel Classilagos
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Bem-vindo ao seu painel interno.
          {userName && (
            <>
              {" "}
              <span className="font-semibold">{userName}</span>,
            </>
          )}{" "}
          aqui você gerencia seus anúncios
          {isAdmin && " e as áreas administrativas do portal"}.
        </p>

        <div className="space-y-4">
          {/* CARD: MEUS ANÚNCIOS (todos os usuários) */}
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

          {/* ÁREA ADMIN – APENAS PARA ADMIN */}
          {isAdmin && (
            <>
              {/* Importar notícias */}
              <section className="rounded-2xl bg-white shadow-sm border border-emerald-100 px-4 py-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Importar notícias
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  Busque automaticamente notícias do G1 Região dos Lagos e
                  RC24h para o banco de dados.
                </p>
                <Link
                  href="/painel/importar-noticias"
                  className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 hover:bg-emerald-100"
                >
                  Abrir importador de notícias
                </Link>
              </section>

              {/* Notícias importadas */}
              <section className="rounded-2xl bg-white shadow-sm border border-amber-100 px-4 py-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Notícias importadas
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  Veja as notícias trazidas das fontes externas, publique,
                  refine ou exclua o que não for interessante.
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
