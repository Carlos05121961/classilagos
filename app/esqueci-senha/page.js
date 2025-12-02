"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ResetarSenhaPage() {
  const router = useRouter();

  const [tokenStatus, setTokenStatus] = useState("checking"); // checking | ok | error
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // 1) Quando a pessoa cai aqui pelo link do e-mail,
  // o Supabase manda o token na URL (hash).
  // A gente troca esse token por uma sessão válida.
  useEffect(() => {
    async function prepararSessao() {
      if (typeof window === "undefined") return;

      const hash = window.location.hash || "";
      if (!hash.includes("access_token")) {
        setErro(
          "Link de redefinição inválido ou já utilizado. Peça um novo link em “Esqueci minha senha”."
        );
        setTokenStatus("error");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("Erro ao validar link de redefinição:", error);
        setErro(
          "Este link de redefinição é inválido ou já foi usado. Peça um novo link em “Esqueci minha senha”."
        );
        setTokenStatus("error");
        return;
      }

      // Tudo certo, podemos mostrar o formulário de nova senha
      setTokenStatus("ok");
    }

    prepararSessao();
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
        "Não foi possível atualizar sua senha. Peça um novo link em “Esqueci minha senha”."
      );
      return;
    }

    setMensagem(
      "Senha redefinida com sucesso! Você já pode fazer login com a nova senha."
    );
  }

  async function irParaLogin() {
    // garante que não fica nenhuma sessão antiga pendurada
    await supabase.auth.signOut();
    router.push("/login");
  }

  const carregandoToken = tokenStatus === "checking";

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Redefinir senha
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Escolha uma nova senha para acessar sua conta no Classilagos.
        </p>

        {carregandoToken && (
          <p className="text-sm text-slate-600">
            Validando link de redefinição. Aguarde um instante...
          </p>
        )}

        {!carregandoToken && erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        {!carregandoToken && mensagem && (
          <div className="mb-4 rounded-md bg-emerald-100 border border-emerald-300 px-3 py-2 text-sm text-emerald-800">
            {mensagem}
          </div>
        )}

        {/* Se o token é válido e ainda não mostramos mensagem final, exibe o formulário */}
        {!carregandoToken && tokenStatus === "ok" && !mensagem && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label
                htmlFor="nova-senha"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nova senha
              </label>
              <input
                id="nova-senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmar-senha"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Confirmar nova senha
              </label>
              <input
                id="confirmar-senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando nova senha..." : "Salvar nova senha"}
            </button>
          </form>
        )}

        {/* Depois que redefiniu a senha com sucesso, mostra só o botão para login */}
        {!carregandoToken && mensagem && (
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={irParaLogin}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md"
            >
              Ir para o login
            </button>
            <p className="text-xs text-slate-500 text-center">
              Se preferir, você também pode voltar para a{" "}
              <Link href="/" className="text-cyan-600 underline">
                página inicial
              </Link>
              .
            </p>
          </div>
        )}

        {/* Se o link é inválido, mostra um atalho para pedir outro */}
        {!carregandoToken && tokenStatus === "error" && (
          <p className="text-xs text-slate-600 text-center mt-4">
            Clique em{" "}
            <Link href="/esqueci-senha" className="text-cyan-600 underline">
              Esqueci minha senha
            </Link>{" "}
            para receber um novo link.
          </p>
        )}
      </div>
    </main>
  );
}


