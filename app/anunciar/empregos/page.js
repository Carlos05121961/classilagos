"use client";

import Link from "next/link";

export default function AnunciarEmpregosPage() {
  return (
    <main className="min-h-screen bg-white pb-10">
      {/* Faixa topo suave, tipo serviços */}
      <section className="bg-[#FFF9E5] border-b border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
          <p className="text-[11px] text-slate-500 mb-1">
            Classilagos • Empregos
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Anunciar em Empregos
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-700 max-w-2xl">
            Escolha se você quer cadastrar o seu currículo para ser encontrado
            por empresas ou anunciar uma vaga de trabalho para receber
            candidatos da Região dos Lagos.
          </p>
        </div>
      </section>

      {/* Cards com as duas opções */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-10">
        <div className="grid gap-4 md:grid-cols-2">
          {/* CARD – CANDIDATO */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 shadow-sm hover:shadow-md transition flex flex-col justify-between p-5">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                Para candidatos
              </p>
              <h2 className="text-base md:text-lg font-semibold text-slate-900">
                Quero cadastrar meu currículo
              </h2>
              <p className="text-[11px] md:text-xs text-slate-700">
                Preencha seu perfil com experiência, formação e contatos.
                Seu currículo ficará disponível para empresas de todas as
                nove cidades da Região dos Lagos.
              </p>
            </div>

            <div className="mt-4">
              <Link
                href="/empregos/curriculo"
                // Se o seu formulário estiver em outro caminho,
                // é só trocar o href acima.
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Cadastrar meu currículo →
              </Link>
            </div>
          </div>

          {/* CARD – EMPRESA / VAGA */}
          <div className="rounded-3xl border border-sky-200 bg-sky-50/70 shadow-sm hover:shadow-md transition flex flex-col justify-between p-5">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                Para empresas e comércios
              </p>
              <h2 className="text-base md:text-lg font-semibold text-slate-900">
                Quero anunciar uma vaga
              </h2>
              <p className="text-[11px] md:text-xs text-slate-700">
                Divulgue vagas de emprego, estágio ou temporárias e receba
                currículos de candidatos qualificados de toda a região.
              </p>
            </div>

            <div className="mt-4">
              <Link
                href="/empregos/vaga"
                // Troque o href se o formulário de vaga estiver em outro caminho.
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Publicar vaga de emprego →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-slate-400 text-center">
          Na fase de lançamento do Classilagos, o cadastro de currículos e
          anúncios de vagas é totalmente gratuito.
        </p>
      </section>
    </main>
  );
}
