"use client";

import Link from "next/link";

export default function CampanhaServicosPage() {
  return (
    <main className="px-4 py-6 bg-slate-50 min-h-screen">
      <section className="mx-auto max-w-3xl">
        {/* Card principal */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          
          {/* Selo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Serviços • 100% grátis
          </div>

          {/* Título */}
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Anuncie seus serviços
            <br />
            na Região dos Lagos.
          </h1>

          {/* Subtítulo */}
          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
            Divulgue seu trabalho gratuitamente, fale direto com clientes
            e apareça para toda a Região dos Lagos.
          </p>

          {/* Benefícios */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 p-3 text-sm">
              💸 <strong>Sem cobrança</strong>
              <p className="text-slate-600 text-xs mt-1">
                Publicação 100% gratuita
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 text-sm">
              📞 <strong>Contato direto</strong>
              <p className="text-slate-600 text-xs mt-1">
                WhatsApp ou telefone
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 text-sm">
              📍 <strong>Regional</strong>
              <p className="text-slate-600 text-xs mt-1">
                Região dos Lagos
              </p>
            </div>
          </div>

          {/* Opções */}
          <div className="mt-8 space-y-4">
            {/* Classimed */}
            <Link
              href="/anunciar/servicos/classimed"
              className="block w-full rounded-2xl border border-emerald-500 bg-emerald-50 px-5 py-4 text-center font-semibold text-emerald-700 hover:bg-emerald-100 transition"
            >
              🩺 Anunciar serviço de saúde (Classimed)
            </Link>

            {/* Eventos */}
            <Link
              href="/anunciar/servicos/eventos"
              className="block w-full rounded-2xl border border-fuchsia-500 bg-fuchsia-50 px-5 py-4 text-center font-semibold text-fuchsia-700 hover:bg-fuchsia-100 transition"
            >
              🎉 Anunciar festas & eventos
            </Link>

            {/* Profissionais */}
            <Link
              href="/anunciar/servicos/profissionais"
              className="block w-full rounded-2xl border border-sky-500 bg-sky-50 px-5 py-4 text-center font-semibold text-sky-700 hover:bg-sky-100 transition"
            >
              🛠️ Anunciar serviços profissionais
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
