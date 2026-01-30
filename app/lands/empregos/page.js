"use client";

import PremiumButton from "../../components/PremiumButton";

export default function LandEmpregos() {
  return (
    <main className="min-h-[70vh] px-4 py-10 bg-slate-50">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Empregos • 100% grátis
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Seu primeiro emprego
            <br />
            começa aqui.
          </h1>

          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-2xl">
            Cadastre seu currículo ou anuncie uma vaga na Região dos Lagos.
            <span className="font-semibold text-slate-800"> É gratuito.</span>
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Sem cobrança</p>
              <p className="mt-1 text-xs text-slate-600">Publicação 100% gratuita.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Contato direto</p>
              <p className="mt-1 text-xs text-slate-600">Fale com empresa/candidato.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Região dos Lagos</p>
              <p className="mt-1 text-xs text-slate-600">Vagas e currículos locais.</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {/* ✅ modo campanha: adiciona src=land no destino */}
            <PremiumButton
              href="/cadastro?next=/anunciar/curriculo?src=land"
              variant="primary"
            >
              Começar meu currículo →
            </PremiumButton>

            <PremiumButton
              href="/cadastro?next=/anunciar/empregos?src=land"
              variant="secondary"
            >
              Anunciar uma vaga
            </PremiumButton>

            <p className="pt-2 text-xs text-slate-500">
              Plataforma 100% gratuita para currículos e vagas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
