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

        {/* Título */}
        <h1 className="text-2xl font-bold mb-4">Meu painel</h1>

        {/* Box com dados básicos */}
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

        {/* Cards principais */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">

          {/* Criar anúncio */}
          <Link
            href="/anunciar"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition"
          >
            <h2 className="mb-1 text-base font-semibold">Criar novo anúncio</h2>
            <p className="text-sm text-slate-600">
              Publique um novo anúncio grátis em qualquer categoria.
            </p>
          </Link>

          {/* Meus anúncios */}
          <Link
            href="/painel/meus-anuncios"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition"
          >
            <h2 className="mb-1 text-base font-semibold">Meus anúncios</h2>
            <p className="text-sm text-slate-600">
              Veja e gerencie todos os anúncios cadastrados na sua conta.
            </p>
          </Link>

          {/* Editar cadastro */}
          <Link
            href="/editar-perfil"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition"
          >
            <h2 className="mb-1 text-base font-semibold">Editar cadastro</h2>
            <p className="text-sm text-slate-600">
              Atualize nome, cidade, telefone e outras informações pessoais.
            </p>
          </Link>

        </div>

        {/* Rodapé / futuras funções */}
        <div className="mt-8 text-xs text-slate-500">
          Em breve: favoritos, estatísticas, mensagens, histórico e muito mais.
        </div>
      </div>
    </AuthGuard>
  );
}
