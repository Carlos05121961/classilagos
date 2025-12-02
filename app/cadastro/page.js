"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // validações básicas
    const partesNome = nome.trim().split(" ").filter(Boolean);
    if (partesNome.length < 2) {
      setErro("Por favor, informe nome e sobrenome.");
      return;
    }

    if (!cidade.trim()) {
      setErro("Informe a cidade.");
      return;
    }

    if (!whatsapp.trim()) {
      setErro("Informe o WhatsApp.");
      return;
    }

    if (!email.trim()) {
      setErro("Informe o e-mail.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("A confirmação de senha não confere.");
      return;
    }

    if (!maiorDeIdade) {
      setErro("Você precisa confirmar que tem 18 anos ou mais.");
      return;
    }

    if (!aceitaTermos) {
      setErro("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,      // 👈 vai para .Data.nome no e-mail
          cidade,
          whatsapp,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      console.error("Erro ao criar conta:", error);

      if (error.message?.toLowerCase().includes("already registered")) {
        setErro("Este e-mail já está cadastrado. Tente fazer login.");
      } else {
        setErro("Erro ao criar conta. Tente novamente em alguns instantes.");
      }
      return;
    }

    // deu certo: mostra mensagem amigável
    setSucesso(
      "Conta criada com sucesso! Verifique seu e-mail e clique no link de confirmação para ativar sua conta."
    );

    // limpa os campos principais
    setSenha("");
    setConfirmarSenha("");
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Criar conta
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Preencha seus dados para começar a anunciar no Classilagos.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 rounded-md bg-emerald-100 border border-emerald-300 px-3 py-2 text-sm text-emerald-800">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nome completo *
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo (nome e sobrenome)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          {/* Cidade */}
          <div>
            <label
              htmlFor="cidade"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Cidade *
            </label>
            <input
              id="cidade"
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Maricá, Cabo Frio..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              WhatsApp *
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="DDD + número (somente números)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          {/* Senha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Senha *
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
                Confirmar senha *
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
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 text-xs text-slate-700">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={maiorDeIdade}
                onChange={(e) => setMaiorDeIdade(e.target.checked)}
                className="mt-[3px]"
              />
              <span>Confirmo que tenho 18 anos ou mais.</span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceitaTermos}
                onChange={(e) => setAceitaTermos(e.target.checked)}
                className="mt-[3px]"
              />
              <span>
                Li e aceito os{" "}
                <Link href="/termos" className="text-cyan-600 underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="text-cyan-600 underline">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Botão */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </div>

          {/* Link para login */}
          <p className="text-xs text-slate-600 text-center mt-2">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-cyan-600 font-semibold">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
