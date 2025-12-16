import Link from "next/link";

export default function TabelaPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias • Correspondentes</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Tabela sugerida – Reportagens comemorativas
          </h1>
          <p className="text-sm text-slate-600">
            Valores iniciais (lançamento). Ajuste livre conforme cidade e complexidade.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 text-sm text-slate-700">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Plano 1 — Simples</h2>
            <p>Texto + até 8 fotos • 1 publicação no site</p>
            <p className="mt-2"><b>R$ 250</b> (70% = R$ 175 / 30% = R$ 75)</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Plano 2 — Completo</h2>
            <p>Texto + até 12 fotos • destaque por X dias • 1 chamada nas redes</p>
            <p className="mt-2"><b>R$ 400</b> (70% = R$ 280 / 30% = R$ 120)</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Plano 3 — Especial</h2>
            <p>Texto + fotos + vídeo (opcional) + cobertura de evento</p>
            <p className="mt-2"><b>Sob consulta</b></p>
          </div>

          <div className="flex gap-2 flex-wrap pt-2">
            <Link className="text-sky-700 underline text-sm" href="/noticias/correspondentes">
              Voltar
            </Link>
            <span className="text-slate-300">•</span>
            <Link className="text-sky-700 underline text-sm" href="/noticias/correspondentes/apresentacao">
              Ver texto de apresentação
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
