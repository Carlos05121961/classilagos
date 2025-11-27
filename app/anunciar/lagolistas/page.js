"use client";

import FormularioLagolistas from "../../components/forms/FormularioLagolistas";

export default function AnunciarLagolistasPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="w-full border-b bg-yellow-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Anunciar no LagoListas
          </h1>
          <p className="mt-2 text-sm text-slate-700 max-w-2xl">
            Cadastre gratuitamente o seu comércio, serviço, empresa ou órgão
            público no maior guia comercial da Região dos Lagos. Telefones,
            WhatsApp, endereço, site e redes sociais em um só lugar.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <FormularioLagolistas />
        </div>
      </section>
    </main>
  );
}
