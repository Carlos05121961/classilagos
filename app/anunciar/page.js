"use client";

import Link from "next/link";

const categorias = [
  {
    slug: "imoveis",
    label: "Imóveis",
    descricao: "Casas, apartamentos, terrenos, salas comerciais...",
  },
  {
    slug: "veiculos",
    label: "Veículos",
    descricao: "Carros, motos, caminhões, utilitários...",
  },
  {
    slug: "nautica",
    label: "Náutica",
    descricao: "Lanchas, barcos, jet ski, passeios náuticos...",
  },
  {
    slug: "pets",
    label: "Pets",
    descricao: "Pet shops, veterinários, banho & tosa, adoção...",
  },
  {
    slug: "empregos",
    label: "Empregos",
    descricao: "Vagas de trabalho, estágios, freelas...",
  },
  {
    slug: "servicos",
    label: "Serviços",
    descricao: "Eletricista, diarista, reformas, autônomos...",
  },
  {
    slug: "turismo",
    label: "Turismo",
    descricao: "Pousadas, hotéis, passeios, bares e restaurantes...",
  },
  {
    slug: "lagolistas",
    label: "LagoListas",
    descricao: "Guia comercial completo da Região dos Lagos.",
  },
];

export default function AnunciarEscolherPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Criar novo anúncio
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Escolha abaixo a categoria do seu anúncio.
        </p>

        {/* GRID DAS CATEGORIAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/anunciar/formulario?tipo=${cat.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {cat.label}
              </h3>
              <p className="text-xs text-slate-600 mt-1">{cat.descricao}</p>

              <span className="text-blue-600 text-sm font-medium mt-3 inline-block">
                Começar →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

