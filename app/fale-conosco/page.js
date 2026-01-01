"use client";

import { useState } from "react";

export default function FaleConoscoPage() {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      assunto: formData.get("assunto"),
      mensagem: formData.get("mensagem"),
      empresa: formData.get("empresa"), // honeypot
    };

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data?.error || "Não foi possível enviar sua mensagem."
        );
      }

      setEnviado(true);
      form.reset();
    } catch (err) {
      setErro(
        err.message ||
          "Ocorreu um erro ao enviar. Tente novamente em instantes."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-slate-950 min-h-screen text-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
            Contato
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Fale conosco
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
            Dúvidas, sugestões, pautas, parcerias ou contato institucional?
            Envie sua mensagem para a equipe Classilagos.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
          {/* FORMULÁRIO */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.7)]">
            <h2 className="text-lg font-semibold text-slate-50 mb-4">
              Envie sua mensagem
            </h2>

            {enviado && (
              <div className="rounded-2xl border border-emerald-500/70 bg-emerald-500/10 p-4 text-sm text-emerald-200 mb-4">
                Sua mensagem foi enviada com sucesso. Em breve entraremos em
                contato. Obrigado!
              </div>
            )}

            {erro && (
              <div className="rounded-2xl border border-red-500/60 bg-red-500/10 p-4 text-sm text-red-200 mb-4">
                {erro}
              </div>
            )}

            {!enviado && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-sm"
                noValidate
              >
                {/* Honeypot (campo invisível para bots) */}
                <input
                  type="text"
                  name="empresa"
                  tabIndex="-1"
                  autoComplete="off"
                  className="hidden"
                />

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    minLength={2}
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    name="assunto"
                    required
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Mensagem
                  </label>
                  <textarea
                    name="mensagem"
                    rows={5}
                    required
                    minLength={10}
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,120,220,0.9)] hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? "Enviando..." : "Enviar mensagem"}
                </button>

                <p className="text-[11px] text-slate-400 pt-2">
                  Dica: para assuntos específicos, você também pode falar direto
                  com nossa equipe pelos e-mails oficiais ao lado.
                </p>
              </form>
            )}
          </div>

          {/* CONTATO DIRETO */}
          {/* 👉 esta parte permanece exatamente como você já tinha */}
          {/* (não alterei nada aqui) */}
          <div className="space-y-4">
            {/* ... seu código original intacto ... */}
          </div>
        </div>
      </section>
    </main>
  );
}
