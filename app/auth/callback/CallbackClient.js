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

function getHashParams() {
  // pega #access_token=...&refresh_token=...
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const clean = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(clean);
}

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    async function run() {
      try {
        // ✅ next vem antes do # (query normal)
        const nextRaw = searchParams.get("next");
        const nextPath = sanitizeNext(nextRaw);

        // 1) tenta fluxo PKCE (?code=)
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setMsg("Não conseguimos confirmar automaticamente. Indo para o login...");
            router.replace("/login");
            return;
          }
        } else {
          // 2) tenta fluxo HASH (#access_token=)
          const hp = getHashParams();
          const access_token = hp.get("access_token");
          const refresh_token = hp.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              setMsg("Sessão inválida/expirada. Indo para o login...");
              router.replace("/login");
              return;
            }
          } else {
            setMsg("Link inválido ou expirado. Indo para o login...");
            router.replace("/login");
            return;
          }
        }

        // ✅ sessão deve existir agora
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          setMsg("Não encontramos seu acesso. Indo para o login...");
          router.replace("/login");
          return;
        }

        // ✅ checa perfil básico (user_metadata)
        const meta = user.user_metadata || {};
        const nome = String(meta.nome || "").trim();
        const cidade = String(meta.cidade || "").trim();
        const whatsapp = String(meta.whatsapp || "").trim();
        const perfilCompleto = nome && cidade && whatsapp;

        // ✅ Se faltou perfil, vai pro /perfil preservando o destino
        if (!perfilCompleto) {
          const url = nextPath ? `/perfil?next=${encodeURIComponent(nextPath)}` : "/perfil";
          setMsg("E-mail confirmado! Agora complete seu perfil rapidinho...");
          router.replace(url);
          return;
        }

        // ✅ Perfil OK: vai pro destino ou painel
        if (nextPath) {
          setMsg("E-mail confirmado! Indo continuar...");
          router.replace(nextPath);
          return;
        }

        setMsg("E-mail confirmado! Entrando no seu painel...");
        router.replace("/painel");
      } catch (e) {
        console.error(e);
        setMsg("Erro inesperado. Indo para o login...");
        router.replace("/login");
      }
    }

    run();
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
