import Link from "next/link";

export default function RegulamentoPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias • Correspondentes</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Regulamento – Correspondentes Culturais
          </h1>
          <p className="text-sm text-slate-600">
            Diretrizes editoriais e modelo de atuação para manter padrão premium do Classilagos.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 text-sm text-slate-700">
          <div>
            <h2 className="font-bold text-slate-900">1) Propósito</h2>
            <p>
              O Correspondente Cultural Classilagos representa sua cidade valorizando cultura, turismo,
              história, comércio tradicional e pessoas que fazem a diferença.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900">2) Linha editorial</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conteúdo positivo e humano.</li>
              <li>Sem violência, policial e sensacionalismo.</li>
              <li>Sem política partidária.</li>
              <li>Quando houver fonte externa, usar crédito e link.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-slate-900">3) Monetização</h2>
            <p>
              Reportagens comemorativas (conteúdo patrocinado) podem ser realizadas com comissão padrão:
              <b> 70% correspondente / 30% Classilagos</b>.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900">4) Curadoria</h2>
            <p>
              Todo conteúdo pode passar por revisão editorial para manter o padrão premium do portal.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap pt-2">
            <Link className="text-sky-700 underline text-sm" href="/noticias/correspondentes">
              Voltar
            </Link>
            <span className="text-slate-300">•</span>
            <Link className="text-sky-700 underline text-sm" href="/noticias/correspondentes/tabela">
              Ver tabela de preços
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
