// app/lands/cabo-frio/page.js

import Link from "next/link";

export default function CaboFrioPage() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* HERO */}
      <section className="relative h-[75vh] flex items-center justify-center text-center text-white overflow-hidden">

        <img
          src="/images/cabo-frio-hero.jpg"
          alt="Cabo Frio"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            Cabo Frio está cheio.
            <br />
            Seu negócio também precisa aparecer.
          </h1>

          <p className="mt-4 text-lg text-slate-200">
            Anuncie grátis no Classilagos e alcance moradores e turistas todos os dias.
          </p>

          <div className="mt-8">
            <Link
              href="/anunciar"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-yellow-300 transition"
            >
              Anunciar Grátis Agora
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-12 px-4 max-w-5xl mx-auto">

        <h2 className="text-2xl font-bold text-center mb-8">
          O que você quer anunciar em Cabo Frio?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {[
            { nome: "Imóveis", img: "/icons/imoveis.webp", link: "/anunciar/imoveis" },
            { nome: "Veículos", img: "/icons/veiculos.webp", link: "/anunciar/veiculos" },
            { nome: "Náutica", img: "/icons/nautica.webp", link: "/anunciar/nautica" },
            { nome: "Pets", img: "/icons/pets.webp", link: "/anunciar/pets" },
            { nome: "Empregos", img: "/icons/empregos.webp", link: "/anunciar/empregos" },
            { nome: "Serviços", img: "/icons/servicos.webp", link: "/anunciar/servicos" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 text-center"
            >
              <img
                src={item.img}
                alt={item.nome}
                className="w-20 h-20 object-contain mx-auto"
              />

              <h3 className="mt-3 font-semibold">{item.nome}</h3>

              <Link
                href={item.link}
                className="mt-3 inline-block bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-300"
              >
                Anunciar
              </Link>
            </div>
          ))}

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-12 bg-white">

        <h2 className="text-2xl font-bold">
          Faça parte do lançamento do Classilagos
        </h2>

        <p className="mt-2 text-gray-600">
          Seja um dos primeiros a anunciar na sua cidade
        </p>

        <div className="mt-6">
          <Link
            href="/anunciar"
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold shadow hover:bg-yellow-300"
          >
            Criar meu anúncio grátis
          </Link>
        </div>

      </section>

    </div>
  );
}
