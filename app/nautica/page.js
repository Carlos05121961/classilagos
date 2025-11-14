import Link from "next/link";

export default function NauticaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Náutica na Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Aqui você vai concentrar anúncios de lanchas, veleiros, barcos de pesca,
          jet skis e toda a área náutica da região. Estamos montando a estrutura;
          por enquanto já deixamos pronto o fluxo de anúncio.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/nautica/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar embarcação
          </Link>

          <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver embarcações (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar embarcações com filtros por tipo,
          tamanho, marina, cidade, faixa de preço e outras opções. Por enquanto,
          use o botão{" "}
          <span className="font-semibold text-slate-800">
            “Anunciar embarcação”
          </span>{" "}
          para testar o fluxo de cadastro.
        </div>
      </div>
    </main>
  );
}
