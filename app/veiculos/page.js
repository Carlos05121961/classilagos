import Link from "next/link";

export default function VeiculosPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Veículos na Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Em breve você vai poder buscar carros, motos, caminhões e outros veículos
          anunciados na região. Enquanto isso, já deixamos pronto o fluxo para quem
          deseja anunciar um veículo.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/veiculos/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar um veículo
          </Link>

          <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver veículos (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar veículos com filtros por marca, modelo,
          ano, valor, tipo de combustível e muito mais. Por enquanto, use o botão{" "}
          <span className="font-semibold text-slate-800">“Anunciar um veículo”</span>{" "}
          para testar o fluxo de cadastro.
        </div>
      </div>
    </main>
  );
}

