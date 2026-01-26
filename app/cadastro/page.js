"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function normalizeEmail(v) {
    return String(v || "").trim().toLowerCase();
  }

  async function enviarLink(emailLimpo) {
    // ✅ Magic Link (confirmação obrigatória pelo e-mail)
    // shouldCreateUser: cria usuário caso não exista
    const { error } = await supabase.auth.signInWithOtp({
      email: emailLimpo,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `https://www.classilagos.shop/auth/callback`,
      },
    });

    if (error) throw error;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setShowModal(false);

    const emailLimpo = normalizeEmail(email);
    if (!emailLimpo) return setErro("Informe o e-mail.");
    if (!maiorDeIdade) return setErro("Você precisa confirmar que tem 18 anos ou mais.");
    if (!aceitaTermos) return setErro("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");

    setLoading(true);

    try {
      await enviarLink(emailLimpo);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao enviar link:", error);
      setErro("Não foi possível enviar o link agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReenviar() {
    setErro("");
    const emailLimpo = normalizeEmail(email);
    if (!emailLimpo) return setErro("Informe o e-mail para reenviar.");
    setLoading(true);
    try {
      await enviarLink(emailLimpo);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao reenviar link:", error);
      setErro("Não foi possível reenviar agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 relative">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Entrar / Criar conta</h1>
        <p className="text-sm text-slate-600 mb-4">
          Comece pelo seu e-mail. Você confirma na caixa de entrada e depois completa seu perfil.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
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
                <Link href="/termos-de-uso" className="text-cyan-600 underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/politica-de-privacidade" className="text-cyan-600 underline">
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
              {loading ? "Enviando link..." : "Continuar"}
            </button>
          </div>

          {/* Link para login */}
          <p className="text-xs text-slate-600 text-center mt-2">
            Já confirmou antes e quer entrar?{" "}
            <Link href="/login" className="text-cyan-600 font-semibold">
              Ir para login
            </Link>
          </p>
        </form>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl px-5 py-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Quase lá! 📩
              </h2>

              <p className="text-xs text-slate-600 mb-3">
                Enviamos um link para <strong>{normalizeEmail(email)}</strong>.
                Abra seu e-mail e clique no botão para confirmar o acesso.
              </p>

              <p className="text-[11px] text-slate-500 mb-4">
                Dica: se não aparecer na caixa de entrada, confira também{" "}
                <strong>Spam</strong> e <strong>Promoções</strong>.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleReenviar}
                  disabled={loading}
                  className="w-full rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold py-2"
                >
                  {loading ? "Reenviando..." : "Reenviar link"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

