import Link from "next/link";

export default function TurismoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Turismo na Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Espaço dedicado a pousadas, hotéis, hostels, casas de temporada, bares,
          restaurantes, quiosques de praia, passeios de barco, city tour, agências
          de turismo e experiências na Região dos Lagos.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/turismo/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no Turismo
          </Link>

          <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver guia de turismo (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar pousadas, hotéis, casas de temporada,
          bares, restaurantes, quiosques e passeios com filtros por cidade,
          categoria e faixa de preço. Por enquanto, use o botão{" "}
          <span className="font-semibold text-slate-800">
            “Anunciar no Turismo”
          </span>{" "}
          para testar o fluxo de cadastro.
        </div>
      </div>
    </main>
  );
}

