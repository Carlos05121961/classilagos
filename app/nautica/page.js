import Link from "next/link";
import HeroCarousel from "../components/HeroCarousel";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

export default function NauticaPage() {
  // Banners do topo (categoria Náutica)
  const nauticaBanners = [
    "/banners/anuncio-01.png",
    "/banners/anuncio-02.png",
    "/banners/anuncio-03.png",
  ];

  // Imagens do hero (lanchas / barcos) – precisam estar em public/nautica
  const heroImages = [
    "/nautica/lancha-01.jpg",
    "/nautica/lancha-02.jpg",
    "/nautica/lancha-03.jpg",
  ];

  return (
    <main className="bg-white">
      {/* BANNER ROTATIVO DA CATEGORIA NÁUTICA */}
      <CategoryBannerCarousel images={nauticaBanners} />

      {/* HERO NÁUTICA – FOTO CHEIA + FRASE + TÍTULO + BUSCA */}
      <section className="bg-slate-900">
        <HeroCarousel images={heroImages} interval={7000}>
          <div className="absolute inset-0 flex flex-col items-center">
            <div className="w-full max-w-5xl mx-auto px-4 pt-6 sm:pt-10 md:pt-12 flex flex-col items-center">
              {/* FRASE TOPO */}
              <p className="text-[10px] sm:text-xs md:text-sm text-white mb-4 text-center drop-shadow-md">
                Encontre lanchas, barcos, escunas e passeios náuticos em toda a
                Região dos Lagos.
              </p>

              {/* TÍTULO */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 drop-shadow-md">
                Classilagos – Náutica
              </h1>

              {/* BARRA DE BUSCA */}
              <div className="w-full max-w-3xl bg-white/95 rounded-xl shadow-lg border border-slate-200 px-4 py-2 flex flex-col sm:flex-row gap-3 sm:items-center">
                {/* BUSCA LIVRE */}
                <div className="flex-1">
                  <label className="block text-[9px] uppercase tracking-wide text-slate-500 mb-1">
                    Busca
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: lancha para passeio, barco de pesca"
                    className="w-full bg-transparent text-xs sm:text-sm outline-none"
                  />
                </div>

                <div className="hidden sm:block h-8 w-px bg-slate-300" />

                {/* TIPO DE EMBARCAÇÃO */}
                <div className="flex-1">
                  <label className="block text-[9px] uppercase tracking-wide text-slate-500 mb-1">
                    Embarcação
                  </label>
                  <select className="w-full bg-transparent text-xs sm:text-sm outline-none">
                    <option>Lancha</option>
                    <option>Barco de pesca</option>
                    <option>Escuna</option>
                    <option>Veleiro</option>
                    <option>Jet ski</option>
                  </select>
                </div>

                <div className="hidden sm:block h-8 w-px bg-slate-300" />

                {/* CIDADE / MARINA */}
                <div className="flex-1">
                  <label className="block text-[9px] uppercase tracking-wide text-slate-500 mb-1">
                    Cidade
                  </label>
                  <select className="w-full bg-transparent text-xs sm:text-sm outline-none">
                    <option>Maricá</option>
                    <option>Saquarema</option>
                    <option>Araruama</option>
                    <option>Iguaba Grande</option>
                    <option>São Pedro d&apos;Aldeia</option>
                    <option>Arraial do Cabo</option>
                    <option>Cabo Frio</option>
                    <option>Búzios</option>
                    <option>Rio das Ostras</option>
                  </select>
                </div>

                {/* BOTÃO */}
                <button
                  type="button"
                  className="sm:ml-2 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CATEGORIAS PRINCIPAIS – NÁUTICA */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Passeios de lancha", "#"],
            ["Passeios de barco / escuna", "#"],
            ["Aluguel de embarcações", "#"],
            ["Passeios exclusivos", "#"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="h-24 sm:h-28 bg-slate-200 group-hover:bg-slate-300" />
              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-slate-900">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIAS SECUNDÁRIAS */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Venda de embarcações", "#"],
            ["Marinas & guardarias", "#"],
            ["Manutenção náutica", "#"],
            ["Passeios de pesca", "#"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-5 flex items-end"
            >
              <span className="text-xs font-semibold text-slate-900">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES – NÁUTICA */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Destaques náuticos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow p-3 flex flex-col"
            >
              <div className="h-24 rounded-xl bg-slate-200 mb-3" />
              <h3 className="text-sm font-semibold text-slate-900">
                Embarcação destaque {i}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Anúncio fictício para demonstrar a área de passeios e
                embarcações em destaque.
              </p>
              <p className="mt-2 text-sm font-bold text-emerald-600">
                R$ {500 + i * 80},00
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NOTÍCIAS – NÁUTICA */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Notícias e informações
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-yellow-300 hover:bg-yellow-400 transition-colors px-4 py-3 flex flex-col justify-between"
            >
              <span className="text-xs font-bold uppercase text-slate-900">
                Notícias
              </span>
              <p className="mt-1 text-xs text-slate-900">
                Manchete de exemplo {i} sobre turismo náutico, marinas, eventos
                ou segurança no mar.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LINKS ÚTEIS – NÁUTICA */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Links úteis
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="#"
            className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-4"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Capitania dos Portos
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Normas de navegação e segurança.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-4"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Previsão do tempo &amp; maré
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Consulte o tempo e condições do mar.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-4"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Regras para passeios
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Informações sobre turismo náutico regularizado.
            </p>
          </Link>
        </div>
      </section>

      {/* CHAMADA PARA ANUNCIAR – NÁUTICA */}
      <section className="bg-blue-50 border-t border-blue-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Quer anunciar passeios ou embarcações?
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            Divulgue seus passeios de barco, lanchas, pesca ou serviços
            náuticos no Classilagos. Anúncios gratuitos na fase de lançamento.
          </p>

          <Link
            href="/anunciar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Anuncie na Náutica grátis
          </Link>
        </div>
      </section>
    </main>
  );
}
