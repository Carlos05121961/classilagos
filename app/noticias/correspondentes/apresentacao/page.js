import Link from "next/link";

export default function ApresentacaoPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias • Correspondentes</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Texto oficial – Apresentação do projeto
          </h1>
          <p className="text-sm text-slate-600">
            Copie e cole para WhatsApp, direct, e-mail ou proposta.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 text-sm text-slate-700">
          <p><b>O Classilagos</b> está formando uma rede de <b>Correspondentes Culturais</b> na Região dos Lagos.</p>

          <p>
            O objetivo é valorizar a identidade de cada cidade por meio de histórias,
            comércios tradicionais, cultura, turismo, festas e personagens locais — com foco positivo.
          </p>

          <p>
            O correspondente pode produzir matérias culturais e também reportagens comemorativas para
            comércios (conteúdo patrocinado), ficando com <b>70% do valor</b> de cada trabalho.
          </p>

          <p>
            Se você ama sua cidade e quer representá-la de forma respeitosa e profissional,
            o Classilagos é o seu espaço.
          </p>

          <div className="flex gap-2 flex-wrap pt-2">
            <Link className="text-sky-700 underline text-sm" href="/noticias/correspondentes">
              Voltar
            </Link>
            <span className="text-slate-300">•</span>
            <Link className="text-sky-700 underline text-sm" href="/noticias/correspondentes/candidatar">
              Ir para candidatura
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
