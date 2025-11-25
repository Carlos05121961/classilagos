"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [maiorDeIdade, setMaiorDeIdade] = useState(false);
  const [aceitaTermos, setAceitaTermos] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function cadastrar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // VALIDAÇÕES BÁSICAS
    if (!nome.trim()) {
      setErro("Por favor, informe seu nome completo.");
      return;
    }

    if (!cidade.trim()) {
      setErro("Informe a sua cidade para prosseguir.");
      return;
    }

    if (!whatsapp.trim()) {
      setErro("Informe um número de WhatsApp válido.");
      return;
    }

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!maiorDeIdade) {
      setErro("Para se cadastrar, você precisa confirmar que tem 18 anos ou mais.");
      return;
    }

    if (!aceitaTermos) {
      setErro("Você precisa aceitar os Termos de Uso para continuar.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          cidade,
          whatsapp,
          maior_de_idade: true,
          aceitou_termos: true,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setErro("Erro ao criar conta. Verifique os dados informados.");
      return;
    }

    setMensagem(
      "Conta criada com sucesso! Confirme seu e-mail e depois faça login."
    );

    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <main className="min-h-screen bg-[#F5FBFF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 px-6 py-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Criar conta</h1>
        <p className="text-xs text-slate-600 mb-5">
          Preencha seus dados para começar a anunciar no Classilagos.
        </p>

        {erro && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-[11px] text-red-700">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-[11px] text-emerald-700">
            {mensagem}
          </div>
        )}

        <form onSubmit={cadastrar} className="space-y-3 text-xs">
          {/* NOME */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              Nome completo *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2"
              required
            />
          </div>

          {/* CIDADE */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              Cidade *
            </label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2"
              required
            />
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              WhatsApp *
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2"
              placeholder="(21) 99999-9999"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              E-mail *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2"
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              Senha *
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2"
              required
            />
          </div>

          {/* CONFIRMAR SENHA */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              Confirmar senha *
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2"
              required
            />
          </div>

          {/* CHECKS: MAIOR DE IDADE + TERMOS */}
          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2 text-[11px] text-slate-700">
              <input
                type="checkbox"
                checked={maiorDeIdade}
                onChange={(e) => setMaiorDeIdade(e.target.checked)}
                className="mt-[2px]"
              />
              <span>
                Confirmo que tenho{" "}
                <span className="font-semibold">18 anos ou mais</span>.
              </span>
            </label>

            <label className="flex items-start gap-2 text-[11px] text-slate-700">
              <input
                type="checkbox"
                checked={aceitaTermos}
                onChange={(e) => setAceitaTermos(e.target.checked)}
                className="mt-[2px]"
              />
              <span>
                Li e aceito os{" "}
                <a
                  href="/termos-de-uso"
                  className="text-cyan-700 font-semibold hover:underline"
                  target="_blank"
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a
                  href="/politica-de-privacidade"
                  className="text-cyan-700 font-semibold hover:underline"
                  target="_blank"
                >
                  Política de Privacidade
                </a>
                .
              </span>
            </label>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-500 text-white py-2 text-sm font-semibold hover:bg-cyan-600 disabled:opacity-60 mt-2"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
    </main>
  );
}
