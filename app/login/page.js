"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMensagem("Erro ao entrar: " + error.message);
      setLoading(false);
      return;
    }

    // Login OK
    setMensagem("Login realizado com sucesso! Redirecionando para o painel...");
    setLoading(false);

    setTimeout(() => {
      router.push("/painel");
    }, 1200);
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Entrar</h1>
      <p className="text-sm text-gray-600 mb-6">
        Acesse sua conta para gerenciar seus anúncios no Classilagos.
      </p>

      <form
        onSubmit={handleLogin}
        className="space-y-4 border rounded-lg p-4 bg-white shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-sm text-gray-800 whitespace-pre-line">
          {mensagem}
        </p>
      )}

      <p className="mt-4 text-sm">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-blue-600 hover:underline">
          Criar conta
        </Link>
      </p>
    </main>
  );
}

