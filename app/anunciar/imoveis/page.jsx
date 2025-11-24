// app/anunciar/imoveis/page.jsx

import FormularioImoveis from "@/components/forms/FormularioImoveis";

export default function AnunciarImoveisPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie grátis
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Anunciar Imóvel na Região dos Lagos
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Preencha os dados do seu imóvel. Seu anúncio ficará disponível para
          milhares de pessoas em toda a Região dos Lagos.
        </p>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioImoveis />
      </section>
    </main>
  );
}
