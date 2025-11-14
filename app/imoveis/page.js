import Link from "next/link";

export default function ImoveisPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Imóveis na Região dos Lagos
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Em breve você vai poder buscar e filtrar imóveis para venda, aluguel fixo e temporada
          em todas as cidades da região. Enquanto isso, já vamos deixar pronto o fluxo de anúncio
          para quem quer cadastrar seu imóvel.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/imoveis/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar um imóvel
          </Link>
          <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver imóveis (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar os imóveis com filtros por cidade, tipo de imóvel,
          valor, quartos, vaga de garagem e muito mais. Por enquanto, use o botão{" "}
          <span className="font-semibold text-slate-800">“Anunciar um imóvel”</span> para testar
          o fluxo de cadastro.
        </div>
      </div>
    </main>
  );
}

