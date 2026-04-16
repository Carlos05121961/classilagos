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
      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/cabo-frio-hero.jpg"
          alt="Praia em Cabo Frio"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/30 to-slate-950/70" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <div className="mx-auto max-w-4xl text-center text-white">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-medium backdrop-blur-sm">
              Cabo Frio • anúncios grátis para moradores, turistas e negócios locais
            </span>

            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
              Cabo Frio está cheio de oportunidades.
              <br className="hidden md:block" />
              <span className="text-yellow-300">Seu anúncio também precisa aparecer.</span>
            </h1>

            <p className="mt-5 text-base md:text-xl text-slate-100 max-w-3xl mx-auto">
              Divulgue imóveis, veículos, serviços, vagas, currículos, pets e muito mais
              em uma plataforma pensada para a Região dos Lagos.
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
                Ver o Classilagos
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">100% gratuito</p>
                <p className="mt-1 text-xs text-slate-200">Cadastre seu anúncio sem custo.</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Foco local</p>
                <p className="mt-1 text-xs text-slate-200">Cabo Frio e toda a Região dos Lagos.</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Rápido de publicar</p>
                <p className="mt-1 text-xs text-slate-200">Escolha a categoria e anuncie em minutos.</p>
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
              Escolha o seu caminho
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
              O que você quer anunciar em Cabo Frio?
            </h2>

            <p className="mt-3 text-sm md:text-base text-slate-600">
              Selecione a categoria ideal e publique seu anúncio de forma simples,
              rápida e gratuita.
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
                Mais visibilidade para sua cidade
              </span>

              <h2 className="mt-4 text-2xl md:text-3xl font-extrabold text-slate-900">
                Tem algo para vender, divulgar ou oferecer em Cabo Frio?
              </h2>

              <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
                O Classilagos nasceu para aproximar negócios, profissionais, moradores
                e visitantes da Região dos Lagos. Seu anúncio precisa estar onde as pessoas procuram.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Anúncio grátis</p>
                <p className="mt-1 text-sm text-slate-600">
                  Publique sem custo e comece a aparecer.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Cidade em foco</p>
                <p className="mt-1 text-sm text-slate-600">
                  Mensagem local, mais conexão com o público.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Fluxo simples</p>
                <p className="mt-1 text-sm text-slate-600">
                  Escolha a categoria e vá direto ao anúncio.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-bold text-slate-900">Pensado para converter</p>
                <p className="mt-1 text-sm text-slate-600">
                  Menos barreira, mais chances de publicar.
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
            Lançamento Classilagos
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold">
            Faça parte do começo em Cabo Frio
          </h2>

          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-slate-300">
            Seja um dos primeiros a anunciar gratuitamente e aproveite o momento
            de crescimento da nova plataforma da Região dos Lagos.
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
