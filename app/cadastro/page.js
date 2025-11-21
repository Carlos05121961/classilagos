"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleCadastro(e) {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    // 1) Criar usuário no Auth do Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setMensagem("Erro ao criar conta: " + error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // 2) Criar registro na tabela profiles
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name: nome,
        });

      if (profileError) {
        setMensagem(
          "Conta criada, mas houve erro ao salvar o perfil. Você ainda pode tentar entrar com seu e-mail e senha."
        );
        setLoading(false);
        return;
      }
    }

    setMensagem("Conta criada com sucesso! Redirecionando para o login...");
    setLoading(false);

    // 3) Redirecionar para /login depois de 1,5s
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Criar conta</h1>
      <p className="text-sm text-gray-600 mb-6">
        Crie sua conta gratuita para anunciar seus imóveis, veículos,
        serviços, turismo e muito mais na Região dos Lagos.
      </p>

      <form onSubmit={handleCadastro} className="space-y-4 border rounded-lg p-4 bg-white shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Nome completo</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Ex: Carlos José Moreira"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
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
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-sm text-gray-800 whitespace-pre-line">
          {mensagem}
        </p>
      )}

      <p className="mt-4 text-sm">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
