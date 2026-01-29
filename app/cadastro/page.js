"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);

  const [erro, setErro] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [nextPath, setNextPath] = useState("");
  const [cooldown, setCooldown] = useState(0);

  function normalizeEmail(v) {
    return String(v || "").trim().toLowerCase();
  }

  function sanitizeNext(raw) {
    const v = String(raw || "").trim();
    if (!v) return "";
    if (!v.startsWith("/")) return "";
    if (v.startsWith("//")) return "";
    if (v.includes("http:") || v.includes("https:")) return "";
    return v;
  }

  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      setNextPath(sanitizeNext(qs.get("next") || ""));
    } catch {
      setNextPath("");
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function parseCooldownSeconds(msg) {
    const m = String(msg || "").match(/after\s+(\d+)\s+seconds/i);
    return m ? Number(m[1]) : 0;
  }

  const redirectUrl = useMemo(() => {
    const base = "https://classilagos.shop/auth/callback"; // sem www
    return nextPath ? `${base}?next=${encodeURIComponent(nextPath)}` : base;
  }, [nextPath]);

  async function enviarLink(emailLimpo) {
    const { error } = await supabase.auth.signInWithOtp({
      email: emailLimpo,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl,
      },
    });
    if (error) throw error;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setInfo("");

    const emailLimpo = normalizeEmail(email);
    if (!emailLimpo) return setErro("Informe o e-mail.");
    if (!maiorDeIdade) return setErro("Você precisa confirmar que tem 18 anos ou mais.");
    if (!aceitaTermos) return setErro("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");

    if (cooldown > 0) return setErro(`Aguarde ${cooldown}s para solicitar um novo link.`);

    setLoading(true);
    try {
      await enviarLink(emailLimpo);
      setShowModal(true);
      setInfo("Link enviado! Confira sua caixa de entrada (e também Spam/Promoções).");
    } catch (err) {
      console.error("Erro ao enviar link:", err);
      const msg = err?.message || err?.error_description || "Erro desconhecido";

      const seconds = parseCooldownSeconds(msg);
      if (seconds > 0) {
        setCooldown(seconds);
        setErro(`Por segurança, aguarde ${seconds}s para solicitar um novo link.`);
      } else {
        // ✅ agora mostra o motivo real (pra gente enxergar)
        setErro(`Falha ao enviar link: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReenviar() {
    setErro("");
    setInfo("");

    const emailLimpo = normalizeEmail(email);
    if (!emailLimpo) return setErro("Informe o e-mail para reenviar.");
    if (cooldown > 0) return setErro(`Aguarde ${cooldown}s para reenviar.`);

    setLoading(true);
    try {
      await enviarLink(emailLimpo);
      setShowModal(true);
      setInfo("Link reenviado! Confira sua caixa de entrada (e também Spam/Promoções).");
    } catch (err) {
      console.error("Erro ao reenviar link:", err);
      const msg = err?.message || err?.error_description || "Erro desconhecido";

      const seconds = parseCooldownSeconds(msg);
      if (seconds > 0) {
        setCooldown(seconds);
        setErro(`Por segurança, aguarde ${seconds}s para solicitar um novo link.`);
      } else {
        setErro(`Falha ao reenviar link: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl px-6 py-6 relative">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Entrar / Criar conta</h1>

        <p className="text-sm text-slate-600 mb-4">
          Para publicar seu currículo/vaga (100% grátis), confirme seu e-mail.
        </p>

        {info && (
          <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
            {info}
          </div>
        )}

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
              disabled={loading || cooldown > 0}
              className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando link..." : cooldown > 0 ? `Aguarde ${cooldown}s...` : "Continuar"}
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
        Enviamos um link para <strong>{normalizeEmail(email)}</strong>. Abra seu e-mail e clique
        para confirmar.
      </p>

      <p className="text-[11px] text-slate-500 mb-4">
        Dica: se não aparecer na caixa de entrada, confira também <strong>Spam</strong> e{" "}
        <strong>Promoções</strong>.
      </p>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleReenviar}
          disabled={loading || cooldown > 0}
          className="w-full rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold py-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Reenviando..."
            : cooldown > 0
            ? `Aguarde ${cooldown}s...`
            : "Reenviar link"}
        </button>

        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2"
        >
          Fechar
        </button>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 text-center">
        Publicação 100% gratuita • Sem cobrança
      </p>
    </div>
  </div>
)}
