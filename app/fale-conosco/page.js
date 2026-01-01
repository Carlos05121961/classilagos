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

              <p className="text-[11px] text-slate-400 pt-2">
                Dica: para assuntos específicos, você também pode falar direto com nossa equipe
                pelos e-mails oficiais ao lado.
              </p>
            </form>
          </div>

          {/* CONTATO DIRETO */}
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Contato direto (e-mails oficiais)
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  ✉️ <strong>Geral / Dúvidas:</strong>{" "}
                  <a
                    className="underline text-slate-100 hover:text-white"
                    href="mailto:fale-conosco@classilagos.shop"
                  >
                    fale-conosco@classilagos.shop
                  </a>
                </p>

                <p>
                  💼 <strong>Parcerias / Anúncios:</strong>{" "}
                  <a
                    className="underline text-slate-100 hover:text-white"
                    href="mailto:comercial@classilagos.shop"
                  >
                    comercial@classilagos.shop
                  </a>
                </p>

                <p>
                  📰 <strong>Pautas / Notícias:</strong>{" "}
                  <a
                    className="underline text-slate-100 hover:text-white"
                    href="mailto:noticias@classilagos.shop"
                  >
                    noticias@classilagos.shop
                  </a>
                </p>

                <p>
                  🏛️ <strong>Imprensa / Institucional:</strong>{" "}
                  <a
                    className="underline text-slate-100 hover:text-white"
                    href="mailto:imprensa@classilagos.shop"
                  >
                    imprensa@classilagos.shop
                  </a>
                </p>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                Atendimento de segunda a sexta, das 9h às 18h.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Parcerias e publicidade
              </h3>
              <p className="text-xs text-slate-300">
                Quer anunciar sua marca em destaque, banners ou ações especiais?
                Fale com o nosso time comercial e montamos um plano sob medida para a sua empresa
                na Região dos Lagos.
              </p>

              <div className="mt-3">
                <a
                  href="mailto:comercial@classilagos.shop"
                  className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold text-white border border-white/10 hover:bg-white/15"
                >
                  Falar com o comercial →
                </a>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Observação
              </h3>
              <p className="text-xs text-slate-300">
                Por enquanto, o atendimento é feito via e-mail. Em breve, quando definirmos um canal oficial,
                podemos adicionar WhatsApp e outros contatos aqui sem bagunçar o padrão do site.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
