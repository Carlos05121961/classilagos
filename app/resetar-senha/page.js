"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ResetarSenhaPage() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [temSessaoRecuperacao, setTemSessaoRecuperacao] = useState(false);

  useEffect(() => {
    async function checarSessao() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Erro ao verificar recuperação de senha:", error);
          setTemSessaoRecuperacao(false);
          return;
        }
        setTemSessaoRecuperacao(!!data?.user);
      } catch (e) {
        console.error("Erro inesperado ao checar sessão:", e);
        setTemSessaoRecuperacao(false);
      }
    }
    checarSessao();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!novaSenha || !confirmarSenha) {
      setErro("Preencha a nova senha e a confirmação.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("A confirmação de senha não confere.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    setLoading(false);

    if (error) {
      console.error("Erro ao redefinir senha:", error);
      setErro(
        "Não foi possível redefinir a senha. O link pode estar expirado. Peça uma nova recuperação."
      );
      return;
    }

    setMensagem(
      "Sua senha foi redefinida com sucesso! Você já pode fazer login novamente com a nova senha."
    );
    setNovaSenha("");
    setConfirmarSenha("");
  }

  if (!temSessaoRecuperacao) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Redefinir senha - Classilagos
          </h1>
          <p className="text-sm text-slate-600 mb-4">
            Este link de redefinição parece inválido ou expirado.
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Peça um novo link acessando{" "}
            <span className="font-semibold">Esqueci minha senha</span> na tela
            de login do Classilagos.
          </p>
          <Link
            href="/esqueci-senha"
            className="inline-flex justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2"
          >
            Ir para recuperar senha
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Redefinir senha - Classilagos
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Defina uma nova senha para acessar sua conta no Classilagos.
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
              htmlFor="novaSenha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nova senha
            </label>
            <input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirmar nova senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              autoComplete="new-password"
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
            {loading ? "Redefinindo..." : "Salvar nova senha"}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center mt-4">
          Após redefinir, você pode voltar à tela de{" "}
          <Link href="/login" className="text-cyan-600 font-semibold">
            login do Classilagos
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
