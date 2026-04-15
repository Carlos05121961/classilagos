"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();

  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const anuncio = useMemo(() => searchParams.get("anuncio") || "", [searchParams]);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function reenviarEmail() {
    setLoading(true);
    setMensagem("");
    setErro("");

    try {
      if (!email) {
        setErro("Não encontramos o e-mail para reenviar a confirmação.");
        return;
      }

      const redirectTo = `${window.location.origin}/auth/confirmar-anuncio?anuncio=${anuncio}`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        const msg = String(error.message || "").toLowerCase();

        if (msg.includes("security purposes") || msg.includes("only request this after")) {
          setErro("Aguarde cerca de 1 minuto antes de pedir um novo e-mail de confirmação.");
        } else {
          setErro("Não foi possível reenviar agora. Tente novamente em instantes.");
        }
        return;
      }

      setMensagem("E-mail reenviado com sucesso. Verifique sua caixa de entrada.");
    } catch (e) {
      console.error(e);
      setErro("Ocorreu um erro ao reenviar o e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-100">
            Classilagos • Região dos Lagos
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Quase lá! Confirme seu e-mail ✉️
          </h1>
        </div>

        <div className="px-6 py-7 space-y-4">
          <p className="text-sm text-slate-600">
            Seu anúncio foi enviado com sucesso para o{" "}
            <span className="font-semibold">Classilagos</span>.
            Agora só falta confirmar seu e-mail para ativar seu anúncio e vinculá-lo à sua conta.
          </p>

          {email ? (
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-900">
              <p className="font-semibold">E-mail cadastrado</p>
              <p className="mt-1 break-all">{email}</p>
            </div>
          ) : null}

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold mb-1">O que fazer agora?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abra a caixa de entrada do e-mail que você cadastrou.</li>
              <li>Procure por uma mensagem do <span className="font-semibold">Classilagos</span>.</li>
              <li>Clique no botão de confirmação do e-mail.</li>
              <li>
                Após confirmar, seu anúncio será ativado e você será redirecionado
                para <span className="font-semibold">Meus anúncios</span>.
              </li>
            </ol>
          </div>

          <p className="text-xs text-slate-500">
            Dica: se não encontrar o e-mail, verifique também as abas{" "}
            <span className="font-semibold">Promoções</span>,{" "}
            <span className="font-semibold">Atualizações</span> ou a pasta{" "}
            <span className="font-semibold">Spam</span>.
          </p>

          {mensagem ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
              {mensagem}
            </div>
          ) : null}

          {erro ? (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
            >
              Abrir meu e-mail
            </a>

            <button
              type="button"
              onClick={reenviarEmail}
              disabled={loading || !email}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition disabled:opacity-60"
            >
              {loading ? "Reenviando..." : "Reenviar e-mail de confirmação"}
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Voltar ao início
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
          <p className="text-[11px] text-slate-500 text-center">
            Classilagos • O seu guia de compras e serviços na Região dos Lagos.
          </p>
        </div>
      </div>
    </div>
  );
}
