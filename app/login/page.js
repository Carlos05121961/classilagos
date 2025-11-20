"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    alert("Login temporário — salvamento real será ativado após criarmos o banco.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Entrar</h1>
        <p className="text-sm text-slate-600 mb-6">
          Acesse sua conta para anunciar no Classilagos.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            className="w-full border rounded-full px-4 py-2 text-sm"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded-full px-4 py-2 text-sm"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
