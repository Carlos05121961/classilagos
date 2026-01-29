"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  return v;
}

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const qs = new URLSearchParams(window.location.search);
        const nextRaw = qs.get("next") || "";
        const next = sanitizeNext(nextRaw) || "/painel";

        // troca code por sessão (PKCE) se existir
        const code = qs.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        if (!alive) return;
        setStatus("Tudo certo! Redirecionando...");

        router.replace(next);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setStatus("Não foi possível confirmar. Indo para o cadastro...");
        router.replace("/cadastro");
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Confirmação de e-mail</h1>
        <p className="text-sm text-slate-600">{status}</p>
      </div>
    </main>
  );
}
