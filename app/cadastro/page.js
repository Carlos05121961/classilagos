"use client";

import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleCadastro(e) {
    e.preventDefault();
    alert("Cadastro temporário criado — banco de dados será conectado depois.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Criar Conta</h1>
        <p className="text-sm text-slate-600 mb-6">
          Crie sua conta para anunciar grátis no Classilagos.
        </p>

        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          <input
            type="text"
            className="w-full border rounded-full px-4 py-2 text-sm"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

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
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700"
          >
            Criar Conta
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Já tem conta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
