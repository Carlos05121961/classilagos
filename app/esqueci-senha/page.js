"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe o e-mail cadastrado.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetar-senha`,
    });

    setLoading(false);

    if (error) {
      console.error("Erro ao enviar recuperação de senha:", error);
      setErro(
        "Não foi possível enviar o link de redefinição. Tente novamente em instantes."
      );
      return;
    }

    setMensagem(
      "Se este e-mail estiver cadastrado, você receberá uma mensagem com o link para redefinir a senha."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Recuperar senha
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Digite o e-mail que você usa no Classilagos. Enviaremos um link para
          redefinir sua senha.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-4 rounded-md bg-emerald-100 border border-emerald-300 px-3 py-2 text-sm text-emerald-800">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center mt-4">
          Lembrou a senha?{" "}
          <Link href="/login" className="text-cyan-600 font-semibold">
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
