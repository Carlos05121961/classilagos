"use client";

import Link from "next/link";

export default function AnunciarEmpregosEscolhaPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <p className="text-[11px] text-slate-500 mb-1">
          Classilagos • Anuncie em Empregos
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Escolha como você quer anunciar em Empregos
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-600 max-w-2xl">
          Selecione abaixo se você quer cadastrar o seu currículo no banco de
          talentos ou anunciar uma vaga de emprego para a Região dos Lagos.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* CARD CURRÍCULO */}
          <div className="rounded-3xl border border-emerald-200 bg-white shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                Para candidatos
              </p>
              <h2 className="text-sm md:text-base font-semibold text-slate-900">
                Quero cadastrar meu currículo
              </h2>
              <p className="text-[11px] md:text-xs text-slate-600">
                Cadastre seu perfil no banco de talentos do Classilagos e seja
                encontrado por empresas das nove cidades da Região dos Lagos.
              </p>
            </div>

            <div className="mt-4">
              <Link
                href="/anunciar/curriculo"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Começar agora →
              </Link>
            </div>
          </div>

          {/* CARD VAGA */}
          <div className="rounded-3xl border border-sky-200 bg-white shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                Para empresas e comércios
              </p>
              <h2 className="text-sm md:text-base font-semibold text-slate-900">
                Quero anunciar uma vaga
              </h2>
              <p className="text-[11px] md:text-xs text-slate-600">
                Divulgue gratuitamente oportunidades de trabalho e receba
                candidatos qualificados de toda a Região dos Lagos.
              </p>
            </div>

            <div className="mt-4">
              <Link
                href="/empregos/anunciar"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Publicar vaga →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
