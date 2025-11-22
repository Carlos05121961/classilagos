"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";
import AuthGuard from "../components/AuthGuard";

export default function PainelPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erro ao buscar usuário:", error);
        return;
      }

      setUser(data.user);
    };

    loadUser();
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Meu painel</h1>

        {/* Bloco com dados básicos do usuário */}
        {user && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Usuário logado
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {user.email}
            </p>
          </div>
        )}

        {/* Cards de ações principais */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/anunciar"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition"
          >
            <h2 className="mb-1 text-base font-semibold">
              Criar novo anúncio
            </h2>
            <p className="text-sm text-slate-600">
              Publique um novo anúncio grátis em qualquer categoria do
              Classilagos.
            </p>
          </Link>

          <Link
            href="/painel/meus-anuncios"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition"
          >
            <h2 className="mb-1 text-base font-semibold">Meus anúncios</h2>
            <p className="text-sm text-slate-600">
              Veja e gerencie todos os anúncios cadastrados na sua conta.
            </p>
          </Link>
        </div>

        {/* Espaço futuro para mais módulos do painel */}
        <div className="mt-8 text-xs text-slate-500">
          Em breve aqui você verá estatísticas, favoritos, mensagens e outras
          funções do seu painel.
        </div>
      </div>
    </AuthGuard>
  );
}
