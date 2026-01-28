"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient"; // <- ajuste se precisar

function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  return v;
}

export default function CallbackClient() {
  const router = useRouter();
  const [status, setStatus] = useState("Confirmando seu e-mail...");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const qs = new URLSearchParams(window.location.search);

        // ✅ destino final (veio do cadastro -> emailRedirectTo -> callback?next=...)
        const nextRaw = qs.get("next") || "";
        const next = sanitizeNext(nextRaw) || "/";

        // ✅ Supabase (magic link / code)
        // Em projetos Next, o supabase-js costuma finalizar a sessão sozinho no client
        // mas manter isso aqui ajuda a garantir.
        // Se tiver "code", tenta trocar por sessão.
        const code = qs.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        if (!alive) return;

        setStatus("Tudo certo! Redirecionando...");

        // ✅ manda pro destino final
        router.replace(next);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setErro("Não foi possível confirmar seu acesso. Tente novamente.");
        setStatus("");
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

        {erro ? (
          <>
            <p className="text-sm text-red-600 mb-4">{erro}</p>
            <button
              onClick={() => router.replace("/cadastro")}
              className="rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2 px-4"
            >
              Voltar para cadastro
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-600">{status}</p>
        )}
      </div>
    </main>
  );
}
