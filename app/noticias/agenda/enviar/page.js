"use client";

import Link from "next/link";

export default function EnviarEventoPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-5">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Agenda
          </p>

          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
            Divulgar evento na Agenda
          </h1>

          <p className="mt-1 text-xs md:text-sm text-slate-600">
            Para manter a Agenda organizada e com qualidade, os eventos são
            publicados <b>somente através dos Correspondentes Culturais</b> do
            Classilagos.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/noticias/correspondentes"
              className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-xs md:text-sm font-extrabold text-amber-800 hover:bg-amber-100"
            >
              🔥 Falar com um Correspondente
            </Link>

            <Link
              href="/noticias/agenda"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar para Agenda
            </Link>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-3xl mx-auto px-4 mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-400 to-rose-500 p-[1px]">
            <div className="rounded-3xl bg-white/95 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Agenda Premium • Classilagos
              </p>

              <h2 className="mt-1 text-lg md:text-xl font-extrabold text-slate-900">
                Como funciona agora (LETRA A)
              </h2>

              <ul className="mt-3 text-[12px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  Você entra em contato com um <b>Correspondente</b> da sua cidade.
                </li>
                <li>
                  O Correspondente confirma dados (data, local, horário, link e contato).
                </li>
                <li>
                  O evento é publicado na Agenda com <b>padrão editorial</b> e divulgação correta.
                </li>
                <li>
                  Evita spam, evita evento repetido e mantém a Agenda bonita e confiável.
                </li>
              </ul>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold text-slate-900">
                  O que mandar para o correspondente (copiar e colar):
                </p>
                <p className="mt-2 text-[11px] text-slate-700 whitespace-pre-line">
                  • Cidade:
                  {"\n"}• Título do evento:
                  {"\n"}• Data:
                  {"\n"}• Horário:
                  {"\n"}• Local / Endereço:
                  {"\n"}• Link (ingresso/instagram/site):
                  {"\n"}• Contato (WhatsApp/telefone/e-mail):
                  {"\n"}• Descrição curta (opcional):
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/noticias/correspondentes"
                  className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-2 text-sm font-extrabold text-white hover:bg-amber-700"
                >
                  Ver Correspondentes por cidade
                </Link>

                <Link
                  href="/noticias"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Voltar para Notícias
                </Link>
              </div>

              <p className="mt-3 text-[10px] text-slate-400">
                Obs.: futuramente a gente pode reabrir envio direto com regras/limites,
                mas por enquanto fica centralizado nos Correspondentes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
