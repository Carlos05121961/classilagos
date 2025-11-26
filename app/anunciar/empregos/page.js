// app/anunciar/empregos/page.js
"use client";

import FormularioEmpregos from "../../components/forms/FormularioEmpregos";

export default function AnunciarEmpregosPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* CABEÇALHO */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie vagas gratuitamente
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Anunciar vaga de emprego
        </h1>

        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
          Cadastre uma oportunidade de trabalho para sua empresa ou
          estabelecimento. Seu anúncio ficará visível para milhares de
          candidatos em toda a Região dos Lagos.
        </p>
      </header>

      {/* BLOCO DE DICAS (SEM ILUSTRAÇÃO) */}
      <section className="bg-slate-50 border rounded-2xl shadow-sm p-5 md:p-7 mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Dicas para anunciar boas vagas
        </h2>

        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            • Seja claro no título da vaga (ex.: Atendente de Loja, Garçom,
            Auxiliar...).
          </li>
          <li>
            • Informe a carga horária e o tipo de contratação (CLT, estágio,
            temporário...).
          </li>
          <li>
            • Caso tenha benefícios, adicione — isso atrai mais candidatos.
          </li>
          <li>
            • Descreva bem o que o profissional vai fazer no dia a dia.
          </li>
          <li>
            • Mantenha um contato ativo (WhatsApp, telefone ou e-mail).
          </li>
        </ul>
      </section>

      {/* FORMULÁRIO */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioEmpregos />
      </section>
    </main>
  );
}
