"use client";

import FormularioEmpregos from "../../components/forms/FormularioEmpregos";

export default function AnunciarVagaPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
            Anuncie gratuitamente
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar vaga de emprego
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Cadastre uma oportunidade de trabalho para sua empresa ou
            estabelecimento. Seu anúncio ficará visível para candidatos em
            toda a Região dos Lagos.
          </p>
        </div>

        {/* Card geral com Dicas + Formulário */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          {/* Dicas */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 md:p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Dicas para anunciar boas vagas
            </h2>
            <ul className="text-xs md:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>
                Seja claro no título da vaga (ex: Atendente de Loja, Garçom,
                Auxiliar...).
              </li>
              <li>
                Informe a carga horária e o tipo de contratação (CLT, estágio,
                temporário...).
              </li>
              <li>
                Se houver benefícios, destaque-os — isso atrai mais candidatos.
              </li>
              <li>
                Descreva bem o que o profissional fará no dia a dia.
              </li>
              <li>
                Mantenha um contato ativo (WhatsApp, telefone ou e-mail).
              </li>
            </ul>
          </div>

          {/* Formulário */}
          <div>
            <FormularioEmpregos />
          </div>
        </div>
      </section>
    </main>
  );
}
