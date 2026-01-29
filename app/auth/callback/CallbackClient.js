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
    let alive = true;

    async function run() {
      try {
        const nextRaw = searchParams.get("next");
        const nextPath = sanitizeNext(nextRaw);

        // ✅ 1) Primeiro: tenta pegar sessão do HASH (#access_token)
        const { data: fromUrl, error: fromUrlError } =
          await supabase.auth.getSessionFromUrl({ storeSession: true });

        // ✅ 2) Se não veio sessão pelo hash, tenta o fluxo por code (PKCE)
        if (!fromUrl?.session) {
          const code = searchParams.get("code");

          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              if (!alive) return;
              console.error("exchangeCodeForSession error:", error);
              setMsg("Não conseguimos confirmar automaticamente. Indo para o login...");
              router.replace("/login");
              return;
            }
          } else {
            // Nem hash nem code => link inválido
            if (!alive) return;
            if (fromUrlError) console.error("getSessionFromUrl error:", fromUrlError);
            setMsg("Link inválido ou expirado. Indo para o login...");
            router.replace("/login");
            return;
          }
        }

        // ✅ 3) Agora a sessão deve existir
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.error("getUser error:", userErr);

        const user = userData?.user;

        if (!user) {
          if (!alive) return;
          setMsg("Sessão confirmada, mas não encontramos seu acesso. Indo para o login...");
          router.replace("/login");
          return;
        }

        // ✅ PRIORIDADE TOTAL (Campanha Empregos):
        // Se veio com next (currículo/vaga), vai direto pro formulário escolhido.
        if (nextPath) {
          if (!alive) return;
          setMsg("E-mail confirmado! Indo para continuar...");
          router.replace(nextPath);
          return;
        }

        // ✅ Sem next: segue padrão do site
        if (!alive) return;
        setMsg("E-mail confirmado! Entrando no seu painel...");
        router.replace("/painel");
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setMsg("Erro inesperado. Indo para o login...");
        router.replace("/login");
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Confirmação de e-mail</h1>
        <p className="text-sm text-slate-600">{msg}</p>
      </div>
    </main>
  );
}
