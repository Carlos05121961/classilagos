"use client";

import PremiumButton from "../../components/PremiumButton";

export default function LandEmpregos() {
  return (
    <main className="px-4 py-6 bg-slate-50">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Empregos • 100% grátis
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Seu primeiro emprego
            <br />
            começa aqui.
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
            Cadastre seu currículo ou anuncie uma vaga na Região dos Lagos.
            <span className="font-semibold text-slate-800"> É gratuito.</span>
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
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

          <div className="mt-6 space-y-3">
            {/* ✅ Currículo (principal) */}
            <div className="flex justify-center">
              <PremiumButton
                href="/cadastro?src=land&next=/anunciar/curriculo?src=land"
                variant="primary"
                className="
                  w-auto px-10 py-3 text-base
                  bg-gradient-to-r from-sky-500 to-emerald-500
                  shadow-md hover:shadow-lg
                  group
                "
              >
                <span className="flex items-center gap-2">
                  Começar meu currículo
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </PremiumButton>
            </div>

            {/* ✅ Vaga (secundário) */}
            <div className="flex justify-center">
              <PremiumButton
                href="/cadastro?src=land&next=/anunciar/empregos?src=land"
                variant="secondary"
                className="
                  w-auto px-10 py-3 text-base
                  border border-emerald-300
                  text-emerald-700
                  hover:bg-emerald-50
                "
              >
                <span className="flex items-center gap-2">
                  Anunciar uma vaga
                  <span className="opacity-70">→</span>
                </span>
              </PremiumButton>
            </div>

            <p className="pt-1 text-xs text-slate-500 text-center">
              Plataforma 100% gratuita para currículos e vagas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
