"use client";

import Link from "next/link";

export default function AnunciarPage() {
  const secoes = [
    {
      id: "imoveis",
      titulo: "Imóveis",
      descricao:
        "Casas, apartamentos, terrenos e salas comerciais para venda e aluguel na Região dos Lagos.",
      href: "/anunciar/formulario?tipo=imoveis",
    },
    {
      id: "veiculos",
      titulo: "Veículos",
      descricao:
        "Carros, motos e outros veículos novos e usados.",
      href: "/anunciar/formulario?tipo=veiculos",
    },
    {
      id: "nautica",
      titulo: "Náutica",
      descricao:
        "Barcos, lanchas, jet skis, passeios e serviços náuticos.",
      href: "/anunciar/formulario?tipo=nautica",
    },
    {
      id: "pets",
      titulo: "Pets",
      descricao:
        "Adoção, venda, acessórios e serviços para seu melhor amigo.",
      href: "/anunciar/formulario?tipo=pets",
    },
    {
      id: "empregos",
      titulo: "Empregos",
      descricao:
        "Vagas de trabalho e banco de currículos em toda a região.",
      // mantém a página especial de empregos com os dois botões
      href: "/empregos",
    },
    {
      id: "servicos",
      titulo: "Serviços",
      descricao:
        "Profissionais liberais, autônomos e empresas de serviços em geral.",
      // mantém a página com os 3 pilares (Classimed / Eventos / Profissionais)
      href: "/anunciar/servicos",
    },
    {
      id: "turismo",
      titulo: "Turismo",
      descricao:
        "Pousadas, hotéis, bares, restaurantes, passeios e experiências turísticas na Região dos Lagos.",
      // vai direto para o formulário de turismo (quando já estiver tratado no /anunciar/formulario)
      href: "/anunciar/formulario?tipo=turismo",
    },
    {
      id: "lagolistas",
      titulo: "LagoListas",
      descricao:
        "Guia comercial: lojas, comércios e empresas para serem encontrados em toda a região.",
      // segue o mesmo padrão: formulário específico de LagoListas
      href: "/anunciar/formulario?tipo=lagolistas",
    },
  ];

  return (
    <main className="min-h-screen bg-white pb-10">
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <p className="text-[11px] text-slate-500 mb-1">
          Classilagos • Anúncios
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Anuncie grátis no Classilagos
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-600 max-w-2xl">
          Escolha abaixo em qual seção você deseja anunciar. Em poucos minutos
          o seu anúncio estará cadastrado e poderá ser encontrado em toda a
          Região dos Lagos.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {secoes.map((secao) => (
            <div
              key={secao.id}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between p-4"
            >
              <div className="space-y-2">
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  {secao.titulo}
                </h2>
                <p className="text-[11px] md:text-xs text-slate-600">
                  {secao.descricao}
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href={secao.href}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {secao.id === "empregos"
                    ? "Anunciar em Empregos"
                    : secao.id === "servicos"
                    ? "Anunciar em Serviços"
                    : secao.id === "turismo"
                    ? "Anunciar em Turismo"
                    : secao.id === "lagolistas"
                    ? "Anunciar em LagoListas"
                    : `Anunciar em ${secao.titulo}`}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
