"use client";

import Link from "next/link";

const secoes = [
  {
    slug: "imoveis",
    titulo: "Imóveis",
    descricao: "Casas, apartamentos, terrenos, coberturas, sítios e mais.",
    pronto: true, // único formulário pronto por enquanto
  },
  {
    slug: "veiculos",
    titulo: "Veículos",
    descricao: "Carros, motos, caminhões e utilitários.",
    pronto: false,
  },
  {
    slug: "nautica",
    titulo: "Náutica",
    descricao: "Lanchas, barcos de passeio, veleiros, jet skis.",
    pronto: false,
  },
  {
    slug: "pets",
    titulo: "Pets",
    descricao: "Adoção, venda e serviços para animais.",
    pronto: false,
  },
  {
    slug: "empregos",
    titulo: "Empregos",
    descricao: "Vagas de emprego em toda a região.",
    pronto: false,
  },
  {
    slug: "servicos",
    titulo: "Serviços",
    descricao: "Profissionais liberais, festas, eventos, reparos em geral.",
    pronto: false,
  },
  {
    slug: "turismo",
    titulo: "Turismo",
    descricao: "Pousadas, hotéis, passeios e experiências.",
    pronto: false,
  },
  {
    slug: "lagolistas",
    titulo: "LagoListas",
    descricao: "Guia comercial e lojas da região.",
    pronto: false,
  },
];

export default function AnunciarHubPage() {
  return (
    <main className="bg-[#F5FBFF] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Cabeçalho da página */}
        <header className="mb-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#1F2933] bg-[#F9D342]/20 px-3 py-1 rounded-full">
            Anuncie grátis na Classilagos
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-[#1F2933]">
            Em que seção você quer anunciar?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Escolha a categoria ideal para o seu anúncio. Durante a fase de
            lançamento, todos os anúncios são{" "}
            <span className="font-semibold text-[#21D4FD]">
              totalmente gratuitos
            </span>
            .
          </p>
        </header>

        {/* Grade de seções */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {secoes.map((secao) => {
            const conteudo = (
              <div className="flex flex-col h-full justify-between rounded-3xl border border-slate-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow px-4 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#1F2933] mb-1">
                    {secao.titulo}
                  </h2>
                  <p className="text-xs text-slate-600 mb-3">
                    {secao.descricao}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  {secao.pronto ? (
                    <span className="inline-flex items-center rounded-full bg-[#21D4FD]/10 px-3 py-1 text-[11px] font-semibold text-[#0F172A]">
                      Disponível
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                      Em breve
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-[#21D4FD]">
                    {secao.pronto
                      ? "Continuar"
                      : "Planejando layout..."}
                  </span>
                </div>
              </div>
            );

            // Seção pronta vira Link; as outras, só bloco informativo
            if (secao.pronto) {
              return (
                <Link
                  key={secao.slug}
                  href={`/anunciar/${secao.slug}`}
                  className="block"
                >
                  {conteudo}
                </Link>
              );
            }

            return (
              <div key={secao.slug} className="opacity-80 cursor-not-allowed">
                {conteudo}
              </div>
            );
          })}
        </section>

        {/* Rodapé explicativo */}
        <section className="mt-8 text-xs text-slate-500">
          <p>
            Em imóveis você já pode criar seus anúncios completos com fotos,
            mapa, descrição detalhada e contato. As demais seções serão
            liberadas na sequência, seguindo o mesmo padrão visual da nova
            Classilagos.
          </p>
        </section>
      </div>
    </main>
  );
}
