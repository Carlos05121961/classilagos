"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Futuro: aqui vamos chamar a API para criar de verdade a conta.
    // Por enquanto é só um fluxo de teste:
    console.log("Cadastro DEMO:", { nome, email, senha });

    // Leva para o painel (simulação de login feito com sucesso)
    router.push("/painel");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 px-6 py-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Criar Conta
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Crie sua conta para anunciar grátis no Classilagos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Seu nome
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: Carlos Soares"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Seu e-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="voce@exemplo.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Crie uma senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Criar Conta
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
