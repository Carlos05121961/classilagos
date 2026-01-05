"use client";

import Link from "next/link";

function Card({ children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      {children}
    </div>
  );
}

function Exemplo({ cidade, titulo, descricao, credito }) {
  return (
    <Card>
      <div className="space-y-2">
        <p className="text-xs font-extrabold text-sky-700 uppercase tracking-wide">
          {cidade}
        </p>

        <h2 className="text-base md:text-lg font-extrabold text-slate-900">
          {titulo}
        </h2>

        <p className="text-sm text-slate-600">{descricao}</p>

        <div className="pt-3 border-t border-slate-200">
          <p className="text-[11px] text-slate-500">
            Por <strong>{credito}</strong> • Correspondente Classilagos
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function ExemplosCorrespondentesPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-2">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Exemplos de matérias publicadas
          </h1>

          <p className="text-sm text-slate-600 max-w-3xl">
            Aqui você visualiza como suas matérias podem aparecer no Classilagos,
            com créditos, cidade e padrão editorial.
          </p>

          <div className="pt-2">
            <Link
              href="/noticias/correspondentes"
              className="text-sky-700 text-sm underline"
            >
              ← Voltar para Correspondentes
            </Link>
          </div>
        </div>
      </section>

      {/* EXEMPLOS */}
      <section className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        <Exemplo
          cidade="Saquarema"
          titulo="Festival de Surf movimenta a Capital Nacional do Surf"
          descricao="O evento reuniu atletas, moradores e turistas em uma grande celebração do esporte, fortalecendo a identidade de Saquarema como referência nacional no surf."
          credito="Correspondente Saquarema"
        />

        <Exemplo
          cidade="Búzios"
          titulo="Festival Gastronômico movimenta a Rua das Pedras"
          descricao="Restaurantes e chefs locais celebraram a gastronomia buziana em um festival que atraiu visitantes e aqueceu o comércio da cidade."
          credito="Correspondente Búzios"
        />

        <Exemplo
          cidade="Arraial do Cabo"
          titulo="Loja de Tintas do Serjão comemora 40 anos de história"
          descricao="Com quatro décadas de bons serviços, a tradicional loja é referência em Arraial do Cabo e símbolo do comércio local."
          credito="Correspondente Arraial do Cabo"
        />
      </section>
    </main>
  );
}
