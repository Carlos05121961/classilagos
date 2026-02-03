"use client";

import PremiumButton from "../../../components/PremiumButton";

export default function LandServicos() {
  return (
    <main className="px-4 py-6 bg-slate-50">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Serviços • 100% grátis
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Anuncie seus serviços
            <br />
            em toda a Região dos Lagos.
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
            Profissionais liberais, saúde e bem-estar, festas e eventos.
            <span className="font-semibold text-slate-800"> É gratuito.</span>
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Sem cobrança</p>
              <p className="mt-1 text-xs text-slate-600">Publicação 100% gratuita.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Contato direto</p>
              <p className="mt-1 text-xs text-slate-600">WhatsApp/telefone/e-mail.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Mais clientes</p>
              <p className="mt-1 text-xs text-slate-600">Apareça nas buscas do portal.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-center">
              <PremiumButton
                href="/cadastro?src=land&next=/anunciar/servicos/profissionais?src=land"
                variant="primary"
                className="
                  w-auto px-10 py-3 text-base
                  bg-gradient-to-r from-sky-500 to-emerald-500
                  shadow-md hover:shadow-lg
                  group
                "
              >
                <span className="flex items-center gap-2">
                  Anunciar Profissionais
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </PremiumButton>
            </div>

            <div className="flex justify-center">
              <PremiumButton
                href="/cadastro?src=land&next=/anunciar/servicos/classimed?src=land"
                variant="secondary"
                className="
                  w-auto px-10 py-3 text-base
                  border border-emerald-300
                  text-emerald-700
                  hover:bg-emerald-50
                "
              >
                <span className="flex items-center gap-2">
                  Anunciar Classimed (Saúde)
                  <span className="opacity-70">→</span>
                </span>
              </PremiumButton>
            </div>

            <div className="flex justify-center">
              <PremiumButton
                href="/cadastro?src=land&next=/anunciar/servicos/eventos?src=land"
                variant="secondary"
                className="
                  w-auto px-10 py-3 text-base
                  border border-fuchsia-200
                  text-fuchsia-700
                  hover:bg-fuchsia-50
                "
              >
                <span className="flex items-center gap-2">
                  Anunciar Festas & Eventos
                  <span className="opacity-70">→</span>
                </span>
              </PremiumButton>
            </div>

            <p className="pt-1 text-xs text-slate-500 text-center">
              Plataforma 100% gratuita para anúncios de serviços.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
