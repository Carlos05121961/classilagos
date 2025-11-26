// app/anunciar/nautica/page.jsx

import FormularioNautica from "../../components/forms/FormularioNautica";

export default function AnunciarNauticaPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie grátis
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Anunciar em Náutica na Região dos Lagos
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Cadastre sua embarcação, passeio, vaga em marina ou serviço náutico.
          Seu anúncio ficará visível em toda a Região dos Lagos na página
          Classilagos – Náutica.
        </p>
      </header>

      {/* Card branco igual ao de Imóveis */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioNautica />
      </section>
    </main>
  );
}
