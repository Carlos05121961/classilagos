"use client";

import Link from "next/link";

const categorias = [
  {
    slug: "imoveis",
    titulo: "Imóveis",
    texto: "Casas, apartamentos, terrenos e salas comerciais para venda e aluguel na Região dos Lagos.",
  },
  {
    slug: "veiculos",
    titulo: "Veículos",
    texto: "Carros, motos e outros veículos novos e usados.",
  },
  {
    slug: "nautica",
    titulo: "Náutica",
    texto: "Barcos, lanchas, jet skis e serviços náuticos.",
  },
  {
    slug: "pets",
    titulo: "Pets",
    texto: "Adoção, venda, acessórios e serviços para seu melhor amigo.",
  },
  {
    slug: "empregos",
    titulo: "Empregos",
    texto: "Vagas e oportunidades de trabalho em toda a região.",
  },
  {
    slug: "servicos",
    titulo: "Serviços",
    texto: "Profissionais liberais, autônomos e empresas de serviços em geral.",
  },
];

function CategoriaCard({ categoria }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {categoria.titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{categoria.texto}</p>
      </div>
      <div className="mt-4">
        <Link
          href={`/anunciar/${categoria.slug}`}
          className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Anunciar em {categoria.titulo}
        </Link>
      </div>
    </div>
  );
}

export default function AnunciarPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Anuncie grátis no Classilagos
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Escolha abaixo em qual seção você deseja anunciar. Em poucos minutos o seu anúncio estará cadastrado.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((cat) => (
          <CategoriaCard key={cat.slug} categoria={cat} />
        ))}
      </section>
    </main>
  );
}
