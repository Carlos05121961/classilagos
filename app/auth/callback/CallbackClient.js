"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  return v;
}

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    async function run() {
      try {
        const code = searchParams.get("code");
        const nextRaw = searchParams.get("next");
        const nextPath = sanitizeNext(nextRaw);

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

        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          setMsg("Sessão confirmada, mas não encontramos seu acesso. Indo para o login...");
          router.replace("/login");
          return;
        }

        const meta = user.user_metadata || {};
        const nome = String(meta.nome || "").trim();
        const cidade = String(meta.cidade || "").trim();
        const whatsapp = String(meta.whatsapp || "").trim();

        const perfilCompleto = nome && cidade && whatsapp;

        // ✅ Se faltou perfil, manda pro perfil MAS preserva o destino
        if (!perfilCompleto) {
          const url = nextPath ? `/perfil?next=${encodeURIComponent(nextPath)}` : "/perfil";
          setMsg("E-mail confirmado! Agora complete seu perfil rapidinho...");
          router.replace(url);
          return;
        }

        // ✅ Perfil OK: vai direto pro destino (currículo/vaga) ou painel
        if (nextPath) {
          setMsg("E-mail confirmado! Indo para continuar...");
          router.replace(nextPath);
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
