"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

// ✅ segurança: só aceita caminhos internos
function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  return v;
}

// ✅ pega cooldown do erro do Supabase: "you can only request this after XX seconds"
function parseCooldownSeconds(err) {
  const msg = String(err?.message || err || "");
  const m = msg.match(/after\s+(\d+)\s+seconds/i);
  return m ? parseInt(m[1], 10) : 0;
}

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Destino pós-confirmação (vem da land: /cadastro?next=/anunciar/curriculo etc)
  const [nextPath, setNextPath] = useState("");

  // ✅ Cooldown para reenviar (evita rate limit virar "erro")
  const [cooldown, setCooldown] = useState(0);

  const emailLimpoMemo = useMemo(() => normalizeEmail(email), [email]);

  // ✅ pega next da URL sem usar useSearchParams
  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      const rawNext = qs.get("next") || "";
      const cleanNext = sanitizeNext(rawNext);
      setNextPath(cleanNext);
    } catch {
      setNextPath("");
    }
  }, []);

  // ✅ contador de cooldown (1s)
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function enviarLink(emailLimpo) {
    const base = "https://classilagos.shop/auth/callback";

    // ✅ repassa o next pro callback (se existir)
    const redirect = nextPath
      ? `${base}?next=${encodeURIComponent(nextPath)}`
      : base;

    const { error } = await supabase.auth.signInWithOtp({
      email: emailLimpo,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirect,
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

      const wait = parseCooldownSeconds(error);
      if (wait > 0) {
        setCooldown(wait);
        setShowModal(true);
        setErro("");
      } else {
        setErro("Não foi possível enviar o link agora. Tente novamente em instantes.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReenviar() {
    setErro("");

    const emailLimpo = normalizeEmail(email);
    if (!emailLimpo) return setErro("Informe o e-mail para reenviar.");

    // ✅ evita chamar API durante cooldown
    if (cooldown > 0) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      await enviarLink(emailLimpo);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao reenviar link:", error);

      const wait = parseCooldownSeconds(error);
      if (wait > 0) {
        setCooldown(wait);
        setShowModal(true);
        setErro("");
      } else {
        setErro("Não foi possível reenviar agora. Tente novamente em instantes.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 relative">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Entrar / Criar conta</h1>
        <p className="text-sm text-slate-600 mb-4">
          Comece pelo seu e-mail. Você confirma na caixa de entrada e depois continua exatamente de onde parou.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando link..." : "Continuar"}
            </button>
          </div>

          <p className="text-xs text-slate-600 text-center mt-2">
            Já confirmou antes e quer entrar?{" "}
            <Link href="/login" className="text-cyan-600 font-semibold">
              Ir para login
            </Link>
          </p>
        </form>

        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl px-5 py-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Quase lá! 📩</h2>

              <p className="text-xs text-slate-600 mb-3">
                Enviamos um link para <strong>{emailLimpoMemo}</strong>.
                Abra seu e-mail e clique no botão para confirmar o acesso.
              </p>

              <p className="text-[11px] text-slate-500 mb-4">
                Dica: se não aparecer na caixa de entrada, confira também{" "}
                <strong>Spam</strong> e <strong>Promoções</strong>.
              </p>

              {cooldown > 0 && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
                  Por segurança, aguarde <strong>{cooldown}s</strong> para reenviar.
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleReenviar}
                  disabled={loading || cooldown > 0}
                  className="w-full rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {cooldown > 0
                    ? `Aguarde ${cooldown}s para reenviar`
                    : loading
                      ? "Reenviando..."
                      : "Reenviar link"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2"
                >
                  Fechar
                </button>

                {nextPath ? (
                  <p className="pt-1 text-center text-[11px] text-slate-500">
                    Depois de confirmar, você será levado para continuar:{" "}
                    <span className="font-semibold">{nextPath}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
