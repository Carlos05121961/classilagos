"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    // 1) Criar usuário no Supabase Auth
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

    if (!user) {
      setMensagem("Conta criada, mas não foi possível obter o usuário.");
      setLoading(false);
      return;
    }

    // 2) Criar perfil na tabela profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id, // precisa ser igual ao UID do Supabase
      name: nome,
      phone: telefone || null,
      city: cidade || null,
    });

    if (profileError) {
      console.error(profileError);
      setMensagem(
        "Conta criada, mas houve erro ao salvar o perfil. " +
          "Você ainda pode confirmar o e-mail e depois entrar normalmente."
      );
      setLoading(false);
      return;
    }

    setMensagem(
      "Conta criada! Verifique seu e-mail para confirmar antes de entrar."
    );
    setLoading(false);

    // Opcional: depois de alguns segundos, mandar pro login
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Criar conta</h1>
      <p className="text-sm text-gray-600 mb-6">
        Cadastre-se gratuitamente para anunciar no Classilagos.
      </p>

      <form
        onSubmit={handleCadastro}
        className="space-y-4 border rounded-lg p-4 bg-white shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade onde você atua"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(DDD) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-sm"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-green-600 text-white text-sm font-semibold disabled:opacity-60"
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
