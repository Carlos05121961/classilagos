"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  if (v.includes("http:") || v.includes("https:")) return "";
  return v;
}

function getSavedRedirect() {
  try {
    return sanitizeNext(localStorage.getItem("postAuthRedirect") || "");
  } catch {
    return "";
  }
}

function clearSavedRedirect() {
  try {
    localStorage.removeItem("postAuthRedirect");
  } catch {}
}

export default function CallbackClient() {
  const router = useRouter();
  const [msg, setMsg] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    let alive = true;

    async function run() {
      const qs = new URLSearchParams(window.location.search);

      const source = (qs.get("source") || "").trim(); // ex: "empregos"
      const nextRaw = qs.get("next") || "";
      const nextFromQuery = sanitizeNext(nextRaw);
      const nextFromStorage = getSavedRedirect();

      // ✅ prioridade total: query > storage > fallback por source > /painel
      const fallbackBySource =
        source === "empregos" ? "/empregos" : "";

      const nextPath =
        nextFromQuery || nextFromStorage || fallbackBySource || "/painel";

      try {
        // ✅ Fluxo PKCE: se vier "code", troca por sessão
        const code = qs.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // Alguns links podem não vir com code (ou já foi consumido)
          // Tentamos pegar sessão existente
          const { data } = await supabase.auth.getSession();
          if (!data?.session) {
            if (!alive) return;
            setMsg("Link inválido ou expirado. Voltando...");
            router.replace(`/cadastro?next=${encodeURIComponent(nextPath)}`);
            return;
          }
        }

        if (!alive) return;

        // ✅ se chegou aqui, login OK — pode limpar o storage
        clearSavedRedirect();

        setMsg("E-mail confirmado! Redirecionando...");
        router.replace(nextPath);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setMsg("Não foi possível confirmar seu e-mail. Voltando...");
        router.replace(`/cadastro?next=${encodeURIComponent(nextPath)}`);
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
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Confirmação de e-mail
        </h1>
        <p className="text-sm text-slate-600">{msg}</p>
        <p className="mt-2 text-[11px] text-slate-500">
          Classilagos Empregos • 100% gratuito
        </p>
      </div>
    </main>
  );
}

