"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ResetarSenhaPage() {
  const [status, setStatus] = useState("checking"); // checking | invalid | ready | success
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1) Verifica se o Supabase mandou algum erro no hash da URL
    const hash = window.location.hash || "";
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const errorCode = params.get("error_code");

    if (errorCode) {
      setStatus("invalid");
      setErro(
        "Este link de redefinição parece inválido ou expirado. Peça um novo link em 'Esqueci minha senha'."
      );
      return;
    }

    // 2) Checa se existe usuário autenticado pela recuperação
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error("Erro ao validar link de recuperação:", error);
        setStatus("invalid");
        setErro(
          "Não foi possível validar este link de redefinição. Peça um novo link em 'Esqueci minha senha'."
        );
        return;
      }

      setStatus("ready");
    }

    checkUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (senha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("A confirmação de senha não confere.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: senha,
    });

    setLoading(false);

    if (error) {
      console.error("Erro ao atualizar senha:", error);
      setErro(
        "Não foi possível atualizar sua senha. Tente novamente em instantes."
      );
      return;
    }

    setStatus("success");
    setMensagem("Senha redefinida com sucesso! Agora você já pode fazer login.");
    setSenha("");
    setConfirmarSenha("");
  }

  // --- TELAS POR ESTADO ---

  // Enquanto valida o link
  if (status === "checking") {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Redefinir senha - Classilagos
          </h1>
          <p className="text-sm text-slate-600">
            Validando seu link de redefinição. Aguarde um instante...
          </p>
        </div>
      </main>
    );
  }

  // Link inválido / expirado
  if (status === "invalid") {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Redefinir senha - Classilagos
          </h1>
          <p className="text-sm text-red-700 mb-4">{erro}</p>
          <Link
            href="/esqueci-senha"
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 shadow-md"
          >
            Ir para recuperar senha
          </Link>
        </div>
      </main>
    );
  }

  // Senha redefinida com sucesso
  if (status === "success") {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Senha redefinida
          </h1>
          {mensagem && (
            <p className="text-sm text-emerald-700 mb-4">{mensagem}</p>
          )}
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 shadow-md"
          >
            Ir para o login
          </Link>
        </div>
      </main>
    );
  }

  // status === "ready"  → formulário para nova senha
  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Redefinir senha - Classilagos
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Crie uma nova senha para acessar sua conta.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nova senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}

