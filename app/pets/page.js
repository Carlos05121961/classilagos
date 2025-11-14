import Link from "next/link";

export default function PetsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Pets na Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Aqui você vai concentrar anúncios de cães, gatos, aves domésticas, roedores,
          coelhos e animais de fazenda (cabras, ovelhas, gado bovino), tanto para
          venda quanto doação, serviços e achados &amp; perdidos.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/pets/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar pet
          </Link>

        <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver anúncios de pets (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar anúncios de pets e animais de fazenda,
          com filtros por espécie, raça, idade, cidade e tipo de anúncio (venda,
          doação, serviços e achados &amp; perdidos). Por enquanto, use o botão{" "}
          <span className="font-semibold text-slate-800">“Anunciar pet”</span>{" "}
          para testar o fluxo de cadastro.
        </div>
      </div>
    </main>
  );
}
