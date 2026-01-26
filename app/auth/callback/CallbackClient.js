"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    async function run() {
      try {
        const code = searchParams.get("code");

        if (!code) {
          setMsg("Link inválido ou expirado. Indo para o login...");
          router.replace("/login");
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMsg("Não conseguimos confirmar automaticamente. Indo para o login...");
          router.replace("/login");
          return;
        }

        // ✅ Agora que a sessão existe, pegamos o usuário
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        // Sem user por algum motivo -> login
        if (!user) {
          setMsg("Sessão confirmada, mas não encontramos seu acesso. Indo para o login...");
          router.replace("/login");
          return;
        }

        // ✅ Checa se o perfil básico está completo (user_metadata)
        const meta = user.user_metadata || {};
        const nome = String(meta.nome || "").trim();
        const cidade = String(meta.cidade || "").trim();
        const whatsapp = String(meta.whatsapp || "").trim();

        const perfilCompleto = nome && cidade && whatsapp;

        if (!perfilCompleto) {
          setMsg("E-mail confirmado! Agora complete seu perfil rapidinho...");
          router.replace("/perfil");
          return;
        }

        setMsg("E-mail confirmado! Entrando no seu painel...");
        router.replace("/painel");
      } catch {
        setMsg("Erro inesperado. Indo para o login...");
        router.replace("/login");
      }
    }

    run();
  }, [router, searchParams]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Confirmação de e-mail
        </h1>
        <p className="text-sm text-slate-600">{msg}</p>
      </div>
    </main>
  );
}
