// app/anunciar/empregos/page.js

import FormularioEmpregos from "../../components/forms/FormularioEmpregos";
import Image from "next/image";

export default function AnunciarEmpregosPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* FAIXA SUPERIOR */}
      <section className="border-b border-slate-200 bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
            Classilagos • Empregos
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Anunciar vaga de emprego
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                Cadastre oportunidades para sua empresa, comércio, pousada, hotel,
                restaurante ou escritório. Seu anúncio ficará visível para milhares
                de candidatos em toda a Região dos Lagos.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
              <span className="text-[11px] font-semibold text-emerald-700">
                Anúncios de vagas gratuitos na fase de lançamento
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DE DICAS + ILUSTRAÇÃO */}
      <section className="mt-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-5 md:gap-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-7">
            {/* Texto / dicas */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  Dicas para criar uma vaga atrativa
                </h2>
                <p className="text-xs md:text-sm text-slate-600 mb-3">
                  Vagas bem descritas recebem muito mais contatos. Use as dicas abaixo
                  para deixar seu anúncio claro e profissional:
                </p>

                <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                  <li>• Use um título simples e direto (ex.: Garçom, Atendente, Cozinheiro).</li>
                  <li>• Informe a carga horária e o tipo de contratação (CLT, estágio, temporário...).</li>
                  <li>• Destaque benefícios: vale-transporte, alimentação, comissão, premiações…</li>
                  <li>• Explique o que o profissional fará no dia a dia.</li>
                  <li>• Deixe um WhatsApp ou e-mail que você realmente acompanhe.</li>
                </ul>
              </div>

              <p className="mt-4 text-[11px] text-slate-500">
                Depois de publicar, você poderá acompanhar e gerenciar suas vagas pelo
                painel <span className="font-semibold">“Meus anúncios”</span>.
              </p>
            </div>

            {/* Ilustração */}
            <div className="relative rounded-2xl bg-gradient-to-br from-sky-50 via-sky-100 to-emerald-50 border border-sky-100 overflow-hidden flex items-center justify-center px-3 py-4">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sky-200/50" />
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-200/40" />

              <div className="relative text-center">
                <div className="mb-3 hidden md:block">
                  <Image
                    src="/ilustracoes/vagas.png"
                    alt="Ilustração de contratação de funcionários"
                    width={260}
                    height={220}
                    className="mx-auto object-contain"
                  />
                </div>
                <p className="text-xs md:text-sm font-medium text-slate-800">
                  Use o formulário abaixo para divulgar sua vaga
                  para candidatos de toda a Região dos Lagos.
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Comércio, turismo, serviços, construção civil, saúde, educação e muito mais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="mt-6 mb-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 md:p-6">
            <FormularioEmpregos />
          </div>

          <p className="mt-3 text-[11px] text-slate-500 text-center">
            O Classilagos é apenas a plataforma de divulgação. A responsabilidade
            pelas informações da vaga é exclusiva do anunciante.
          </p>
        </div>
      </section>
    </main>
  );
}
