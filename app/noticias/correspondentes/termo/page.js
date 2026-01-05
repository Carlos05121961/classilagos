"use client";

import Link from "next/link";

export default function TermoCorrespondentePage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-2">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Termo de Adesão – Correspondentes Culturais Classilagos
          </h1>

          <p className="text-sm text-slate-600 max-w-3xl">
            Este termo estabelece as condições de participação no programa de
            Correspondentes Culturais Classilagos.
          </p>

          <div className="pt-2">
            <Link
              href="/noticias/correspondentes"
              className="text-sky-700 text-sm underline"
            >
              ← Voltar para Correspondentes
            </Link>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
          <p className="text-sm text-slate-700">
            Ao participar como Correspondente Cultural Classilagos, o(a)
            correspondente declara estar ciente e de acordo com as condições
            abaixo:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li>
              A participação não gera vínculo empregatício, societário ou
              trabalhista com o Classilagos.
            </li>
            <li>
              As matérias enviadas passam por curadoria editorial e podem ser
              aprovadas, ajustadas ou recusadas.
            </li>
            <li>
              Conteúdos devem seguir a linha editorial: cultura, turismo,
              comércio tradicional e histórias locais.
            </li>
            <li>
              Não são aceitos conteúdos com violência, discurso de ódio ou
              política partidária.
            </li>
            <li>
              Quando houver remuneração, aplica-se o modelo de comissão{" "}
              <strong>70% para o correspondente e 30% para o Classilagos</strong>,
              conforme tabela vigente.
            </li>
            <li>
              O correspondente autoriza a publicação do conteúdo no site,
              redes sociais e materiais institucionais do Classilagos.
            </li>
            <li>
              O Classilagos não se responsabiliza por informações falsas ou
              imprecisas fornecidas pelo correspondente.
            </li>
          </ul>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">
              Ao continuar no processo e enviar conteúdos, o correspondente
              declara que leu, compreendeu e aceita integralmente este termo.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Este termo poderá ser atualizado a qualquer momento, sendo sempre
            válida a versão publicada nesta página.
          </p>
        </div>
      </section>
    </main>
  );
}
