// app/lands/cabo-frio/page.js

import Link from "next/link";

const categorias = [
  {
    nome: "Imóveis",
    img: "/icons/imoveis.webp",
    link: "/anunciar/imoveis",
    descricao: "Casas, apartamentos, terrenos e temporada.",
  },
  {
    nome: "Veículos",
    img: "/icons/veiculos.webp",
    link: "/anunciar/veiculos",
    descricao: "Carros, motos, utilitários e oportunidades.",
  },
  {
    nome: "Náutica",
    img: "/icons/nautica.webp",
    link: "/anunciar/nautica",
    descricao: "Barcos, lanchas, peças e serviços náuticos.",
  },
  {
    nome: "Pets",
    img: "/icons/pets.webp",
    link: "/anunciar/pets",
    descricao: "Animais, acessórios, serviços e cuidados.",
  },
  {
    nome: "Empregos",
    img: "/icons/empregos.webp",
    link: "/empregos",
    descricao: "Anuncie vagas ou cadastre seu currículo.",
  },
  {
    nome: "Serviços",
    img: "/icons/servicos.webp",
    link: "/servicos",
    descricao: "Profissionais, saúde, eventos e muito mais.",
  },
];

export default function CaboFrioPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/cabo-frio-hero.jpg"
          alt="Praia do Forte em Cabo Frio"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/25 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/20" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <div className="mx-auto max-w-4xl text-center text-white">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-medium backdrop-blur-sm">
              Praia do Forte • Cabo Frio
            </span>

            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Cabo Frio merece
              <br className="hidden md:block" />
              <span className="text-yellow-300">mais movimento, mais negócios e mais oportunidades.</span>
            </h1>

            <p className="mt-5 text-base md:text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed">
              Se você tem algo para vender, alugar, divulgar ou oferecer em Cabo Frio,
              este é o momento de colocar sua oportunidade na vitrine certa.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="#categorias"
                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-yellow-400 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg transition hover:bg-yellow-300"
              >
                Anunciar grátis agora
              </Link>

              <Link
                href="/home"
                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Ver a plataforma
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[11px] md:text-sm text-slate-100">
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                100% gratuito
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                Publicação simples
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                Foco em Cabo Frio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="py-14 md:py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex rounded-full bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              Escolha por onde começar
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              O que você quer anunciar em Cabo Frio?
            </h2>

            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
              Imóveis, veículos, empregos, serviços, pets, náutica e muito mais.
              Escolha sua categoria e publique de forma rápida e gratuita.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {categorias.map((item, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex justify-center">
                  <div className="flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-2xl bg-slate-50 transition group-hover:scale-105">
                    <img
                      src={item.img}
                      alt={item.nome}
                      className="h-16 w-16 md:h-20 md:w-20 object-contain"
                    />
                  </div>
                </div>

                <h3 className="mt-4 text-center text-base md:text-lg font-bold text-slate-900">
                  {item.nome}
                </h3>

                <p className="mt-2 min-h-[42px] text-center text-xs md:text-sm leading-relaxed text-slate-600">
                  {item.descricao}
                </p>

                <div className="mt-4 text-center">
                  <Link
                    href={item.link}
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300"
                  >
                    Anunciar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCO DE VALOR */}
      <section className="px-4 pb-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Cabo Frio em evidência
              </span>

              <h2 className="mt-4 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Uma cidade forte merece oportunidades bem apresentadas
              </h2>

              <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
                Cabo Frio tem turismo, comércio, serviços, imóveis, temporada,
                circulação de pessoas e negócios o ano inteiro. Quando sua oferta aparece
                do jeito certo, a chance de contato cresce.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Mais visibilidade local</p>
                <p className="mt-1 text-sm text-slate-600">
                  Sua oportunidade aparece com foco na cidade.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Entrada sem custo</p>
                <p className="mt-1 text-sm text-slate-600">
                  Comece anunciando grátis.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Fluxo direto</p>
                <p className="mt-1 text-sm text-slate-600">
                  Escolha a categoria e vá direto ao formulário.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Momento de crescimento</p>
                <p className="mt-1 text-sm text-slate-600">
                  Aproveite o começo para ganhar espaço primeiro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-900 px-6 py-10 md:px-10 md:py-14 text-center text-white shadow-xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Cabo Frio em movimento
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            Coloque sua oportunidade para aparecer
          </h2>

          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-slate-300 leading-relaxed">
            Se a cidade está viva, seu anúncio também precisa estar.
            Escolha uma categoria e publique agora, de forma simples e gratuita.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="#categorias"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-yellow-400 px-6 py-3.5 text-base font-bold text-slate-950 transition hover:bg-yellow-300"
            >
              Criar meu anúncio grátis
            </Link>

            <Link
              href="/home"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
            >
              Conhecer a plataforma
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
