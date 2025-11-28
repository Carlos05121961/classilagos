"use client";

import FormularioTurismo from "../../components/forms/FormularioTurismo";

export default function AnunciarTurismoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie gratuitamente
        </p>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Anunciar turismo no Classilagos
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl">
          Cadastre sua pousada, hotel, restaurante, quiosque, passeio ou outro
          serviço de turismo nas nove cidades da Região dos Lagos. Seu anúncio
          poderá aparecer nas buscas do portal de Turismo.
        </p>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioTurismo />
      </section>
    </main>
  );
}
