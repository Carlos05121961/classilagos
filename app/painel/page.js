"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function PainelPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checarAdmin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Erro ao buscar usuário no painel:", error);
          setIsAdmin(false);
          return;
        }

        const user = data?.user;
        if (!user) {
          setIsAdmin(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profileError && profile?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error("Erro ao checar perfil admin:", e);
        setIsAdmin(false);
      }
    }

    checarAdmin();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Painel Classilagos
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Bem-vindo ao seu painel interno. Aqui você gerencia seus anúncios
          {isAdmin
            ? ", notícias e outras áreas administrativas do portal."
            : " no Classilagos."}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card Meus anúncios – TODOS OS USUÁRIOS */}
          <Link
            href="/painel/meus-anuncios"
            className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition p-4"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Meus anúncios
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Veja e gerencie todos os anúncios que você já publicou
              no Classilagos.
            </p>
            <span className="inline-flex text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
              Abrir painel de anúncios
            </span>
          </Link>

          {/* Cards de notícias – APENAS PARA ADMIN */}
          {isAdmin && (
            <>
              {/* Card Importar notícias */}
              <Link
                href="/painel/importar-noticias"
                className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition p-4"
              >
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Importar notícias
                </h2>
                <p className="text-xs text-slate-600 mb-3">
                  Busque automaticamente notícias do G1 Região dos Lagos e RC24h
                  para o banco de dados.
                </p>
                <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  Abrir importador de notícias
                </span>
              </Link>

              {/* Card Notícias importadas */}
              <Link
                href="/painel/noticias-importadas"
                className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition p-4"
              >
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Notícias importadas
                </h2>
                <p className="text-xs text-slate-600 mb-3">
                  Veja as notícias trazidas das fontes externas, publique, refine
                  ou exclua o que não for interessante.
                </p>
                <span className="inline-flex text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
                  Gerenciar notícias importadas
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

