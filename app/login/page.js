"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Informe o e-mail e a senha.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      console.error("Erro no login:", error);

      const msg = error.message.toLowerCase();

      if (msg.includes("invalid login credentials")) {
        setErro("E-mail ou senha incorretos. Confira os dados e tente novamente.");
      } else if (msg.includes("email not confirmed")) {
        setErro("E-mail ainda não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.");
      } else {
        setErro("Não foi possível fazer login agora. Tente novamente em instantes.");
      }

      return;
    }

    // Login OK → vai para o painel
    window.location.href = "/painel";
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Fazer login
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Acesse sua conta para gerenciar seus anúncios no Classilagos.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
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

          {/* Senha */}
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              autoComplete="current-password"
              required
            />
            <div className="mt-1 text-xs text-right">
              {/* Quando criar a página de redefinição, ajuste esse href */}
              <Link href="/esqueci-senha" className="text-cyan-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          {/* Botão */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          {/* Link para cadastro */}
          <p className="text-xs text-slate-600 text-center mt-2">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-cyan-600 font-semibold">
              Criar conta grátis
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
