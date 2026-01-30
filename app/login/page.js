"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import Link from "next/link";

function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  if (v.includes("http:") || v.includes("https:")) return "";
  return v;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ destino pós-login: respeita ?next=
  const nextPath = useMemo(() => {
    const qs = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const nextRaw = qs.get("next") || "";
    return sanitizeNext(nextRaw) || "/painel";
  }, []);

  // ✅ Se já estiver logado, não mostra login: vai direto pro destino
  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (user) {
          router.replace(nextPath);
          return;
        }

        setChecking(false);
      } catch {
        if (active) setChecking(false);
      }
    }

    check();

    return () => {
      active = false;
    };
  }, [router, nextPath]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Informe o e-mail e a senha.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      const msg = (error.message || "").toLowerCase();

      if (msg.includes("invalid login credentials")) {
        setErro("E-mail ou senha incorretos. Confira os dados e tente novamente.");
      } else if (msg.includes("email not confirmed")) {
        setErro(
          "E-mail ainda não confirmado. Verifique sua caixa de entrada e clique no link de confirmação."
        );
      } else {
        setErro("Não foi possível fazer login agora. Tente novamente em instantes.");
      }
      return;
    }

    // ✅ Login OK → vai pro destino (se veio da LAND, cai no formulário)
    router.replace(nextPath);
  }

  if (checking) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Entrando…</h1>
          <p className="text-sm text-slate-600">Verificando sua sessão.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Fazer login</h1>
        <p className="text-sm text-slate-600 mb-4">
          Acesse sua conta para gerenciar seus anúncios no Classilagos.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>

            <div className="relative">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-slate-500 text-xs"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="mt-1 text-xs text-right">
              <Link href="/esqueci-senha" className="text-cyan-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
