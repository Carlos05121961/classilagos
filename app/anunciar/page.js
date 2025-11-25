"use client";

import Link from "next/link";

export default function AnunciarPage() {
  const secoes = [
    { slug: "imoveis", titulo: "Imóveis", descricao: "Casas, apartamentos, terrenos e mais." },
    { slug: "veiculos", titulo: "Veículos", descricao: "Carros, motos, utilitários." },
    { slug: "nautica", titulo: "Náutica", descricao: "Barcos, lanchas e jet skis." },
    { slug: "pets", titulo: "Pets", descricao: "Adoção, venda e serviços." },
    { slug: "empregos", titulo: "Empregos", descricao: "Vagas na região." },
    { slug: "servicos", titulo: "Serviços", descricao: "Profissionais e prestadores." },
    { slug: "turismo", titulo: "Turismo", descricao: "Hotéis, pousadas e passeios." },
    { slug: "lagolistas", titulo: "LagoListas", descricao: "Guia comercial completo." },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6 text-slate-900">
        Escolha a categoria do seu anúncio
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secoes.map((secao) => (
          <Link
            key={secao.slug}
            href={`/anunciar/${secao.slug}`}
            className="p-5 rounded-2xl border shadow-sm hover:shadow-md bg-white transition block"
          >
            <h2 className="text-lg font-bold text-slate-900">{secao.titulo}</h2>
            <p className="text-sm text-slate-600">{secao.descricao}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
