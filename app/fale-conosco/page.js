"use client";

import { useState } from "react";

export default function FaleConoscoPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
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
            Dúvidas, sugestões, parcerias ou suporte? Envie sua mensagem
            para a equipe Classilagos.
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

            {enviado ? (
              <div className="rounded-2xl border border-emerald-500/70 bg-emerald-500/10 p-4 text-sm text-emerald-200 mb-4">
                Sua mensagem foi enviada (simulação). Em breve entraremos em
                contato. Obrigado!
              </div>
            ) : (
              <p className="text-xs text-slate-300 mb-4">
                Preencha os campos abaixo. Este formulário é demonstrativo e
                poderá ser integrado a um sistema de envio de e-mail.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Mensagem
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70 resize-y"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,120,220,0.9)] hover:scale-105 transition"
              >
                Enviar mensagem
              </button>
            </form>
          </div>

          {/* CONTATO DIRETO */}
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Contato direto
              </h3>
              <p className="text-xs text-slate-300 mb-1">
                📩 <strong>E-mail:</strong> contato@classilagos.tv
              </p>
              <p className="text-xs text-slate-300 mb-1">
                📱 <strong>WhatsApp Comercial:</strong> em breve
              </p>
              <p className="text-xs text-slate-400 mt-3">
                Atendimento de segunda a sexta, das 9h às 18h.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Parcerias e publicidade
              </h3>
              <p className="text-xs text-slate-300">
                Quer anunciar sua marca em destaque, banners ou ações especiais?
                Fale conosco para montar um plano sob medida para a sua empresa
                na Região dos Lagos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
