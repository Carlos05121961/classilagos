// app/lands/cabo-frio/page.js

import Link from "next/link";

export default function CaboFrioPage() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-sky-500 text-white py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          Anuncie grátis em Cabo Frio
        </h1>

        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Divulgue seu negócio, imóvel, veículo ou serviço para Cabo Frio e toda a Região dos Lagos
        </p>

        <Link
          href="/anunciar/veiculos"
          className="mt-8 inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-slate-100 transition"
        >
          Quero anunciar grátis
        </Link>
      </section>

      {/* CATEGORIAS */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          O que você quer anunciar?
        </h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-5">

  <Link href="/anunciar/imoveis" className="card flex flex-col items-center">
    <span className="text-3xl">🏠</span>
    <span className="mt-2">Imóveis</span>
  </Link>

  <Link href="/anunciar/veiculos" className="card flex flex-col items-center">
    <span className="text-3xl">🚗</span>
    <span className="mt-2">Veículos</span>
  </Link>

  <Link href="/anunciar/servicos" className="card flex flex-col items-center">
    <span className="text-3xl">🧑‍🔧</span>
    <span className="mt-2">Serviços</span>
  </Link>

  <Link href="/anunciar/empregos" className="card flex flex-col items-center">
    <span className="text-3xl">💼</span>
    <span className="mt-2">Empregos</span>
  </Link>

  <Link href="/anunciar/pets" className="card flex flex-col items-center">
    <span className="text-3xl">🐶</span>
    <span className="mt-2">Pets</span>
  </Link>

  <Link href="/anunciar/turismo" className="card flex flex-col items-center">
    <span className="text-3xl">🌴</span>
    <span className="mt-2">Turismo</span>
  </Link>

</div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">
            Por que anunciar no Classilagos?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">

            <div>✔ Plataforma focada em Cabo Frio</div>
            <div>✔ 100% gratuito</div>
            <div>✔ Cadastro rápido e fácil</div>
            <div>✔ Seu anúncio no ar em minutos</div>
            <div>✔ Alcance toda a Região dos Lagos</div>
            <div>✔ Ideal para comércio local</div>

          </div>
        </div>
      </section>

      {/* BLOCO LOCAL */}
      <section className="py-14 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Cabo Frio está crescendo. Seu negócio também pode.
        </h2>

        <p className="max-w-xl mx-auto text-slate-600">
          O Classilagos é a nova plataforma da Região dos Lagos.
          Faça parte do lançamento e comece agora a divulgar seus produtos e serviços.
        </p>

        <Link
          href="/anunciar/veiculos"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Criar meu anúncio grátis
        </Link>
      </section>

    </div>
  );
}
