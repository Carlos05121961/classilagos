"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("loading"); 
  // "loading" | "no-session" | "forbidden" | "ok"

  useEffect(() => {
    async function checkAdmin() {
      // 1) Pega sessão atual
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setStatus("no-session");
        return;
      }

      const user = session.user;

      // 2) Busca perfil com o role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao carregar perfil:", error);
        setStatus("forbidden");
        return;
      }

      if (profile?.role === "admin") {
        setStatus("ok");
      } else {
        setStatus("forbidden");
      }
    }

    checkAdmin();
  }, []);

  // ESTADOS

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Verificando permissão…</p>
      </main>
    );
  }

  if (status === "no-session") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-sm rounded-2xl bg-white border border-slate-200 p-6 text-center">
          <h1 className="text-lg font-bold text-slate-900 mb-2">
            Acesso restrito
          </h1>
          <p className="text-sm text-slate-600 mb-4">
            Você precisa estar logado para acessar o painel administrativo.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Fazer login
          </Link>
        </div>
      </main>
    );
  }

  if (status === "forbidden") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-sm rounded-2xl bg-white border border-slate-200 p-6 text-center">
          <h1 className="text-lg font-bold text-slate-900 mb-2">
            Permissão negada
          </h1>
          <p className="text-sm text-slate-600 mb-4">
            Sua conta não possui permissão para acessar o painel administrativo
            do Classilagos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Voltar para o site
          </Link>
        </div>
      </main>
    );
  }

  // Se chegou aqui, é admin
  return <>{children}</>;
}
