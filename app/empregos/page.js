"use client";

import Link from "next/link";

export default function EmpregosPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* HERO TOPO */}
      <section className="relative">
        <div className="w-full h-52 md:h-64 lg:h-72 overflow-hidden">
          <img
            src="/images/empregos-hero.jpg"
            alt="Classilagos Empregos"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-[11px] md:text-xs text-slate-100/80 mb-1">
              Classilagos • Empregos
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white drop-shadow">
              Classilagos – Empregos
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-100 max-w-2xl mx-auto">
              Vagas de emprego, banco de currículos e oportunidades em toda a
              Região dos Lagos.
            </p>
          </div>
        </div>
      </section>

      {/* DOIS CARDS: CURRÍCULO / VAGA */}
      <section className="max-w-5xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD CURRÍCULO */}
        <div className="rounded-3xl border border-emerald-200 bg-white shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
              Para candidatos
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Quero cadastrar meu currículo
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Cadastre seu perfil no banco de talentos do Classilagos e seja
              encontrado por empresas das nove cidades da Região dos Lagos.
            </p>
          </div>

          <div className="mt-4">
            <Link
              href="/empregos/curriculos"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Começar agora →
            </Link>
          </div>
        </div>

        {/* CARD VAGAS */}
        <div className="rounded-3xl border border-sky-200 bg-white shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
              Para empresas e comércios
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Quero anunciar uma vaga
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
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
      </section>
    </main>
  );
}
