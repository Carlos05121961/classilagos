import Image from "next/image";
import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

const topoBanners = [
  "/banners/anuncio-01.png",
  "/banners/anuncio-02.png",
  "/banners/anuncio-03.png",
];

export default function ServicosPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* BANNER ROTATIVO DA CATEGORIA */}
      <CategoryBannerCarousel images={topoBanners} />

      {/* HERO SERVIÇOS – FUNDO ÚNICO + TÍTULO + BUSCA */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] overflow-hidden">
          <Image
            src="/servicos/hero-servicos.jpg"
            alt="Classilagos - Serviços"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-md mb-2">
            Classilagos - Serviços
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/95 text-center max-w-2xl drop-shadow mb-4">
            Encontre aqui o serviço que você precisa: reparos, saúde, beleza,
            eventos e muito mais.
          </p>

          {/* barra de busca */}
          <div className="pointer-events-auto w-full max-w-2xl bg-white/95 rounded-full shadow-lg border border-slate-200 px-4 py-2 flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* busca */}
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                Busca
              </label>
              <input
                type="text"
                placeholder="Ex.: eletricista, diarista, encanador..."
                className="w-full bg-transparent text-xs sm:text-sm outline-none"
              />
            </div>

            <div className="hidden sm:block h-8 w-px bg-slate-300" />

            {/* cidade */}
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">
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

            <button
              type="button"
              className="sm:ml-2 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 hover:bg-blue-700"
            >
              Buscar serviços
            </button>
          </div>

          <p className="mt-2 text-[11px] text-white/85 text-center drop-shadow">
            Em breve, essa busca estará ligada aos anúncios reais de serviços.
          </p>
        </div>
      </section>

      <div className="h-6 md:h-10" />

      {/* CATEGORIAS PRINCIPAIS DE SERVIÇOS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
          Busque por categoria
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Classimed (saúde)",
            "Festas & Eventos",
            "Profissionais liberais",
            "Serviços em geral",
          ].map((nome) => (
            <div
              key={nome}
              className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors p-4 flex items-center justify-center text-center"
            >
              <span className="text-xs sm:text-sm font-semibold text-slate-900">
                {nome}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVIÇOS EM DESTAQUE */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
          Serviços em destaque
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col"
            >
              <div className="h-20 rounded-xl bg-slate-200 mb-3" />
              <h3 className="text-sm font-semibold text-slate-900">
                Serviço destaque {i}
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Anúncio fictício para demonstrar a área de serviços em destaque.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Cidade . Categoria
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA / CHAMADAS */}
      <section className="max-w-6xl mx-auto px-4 pb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Para quem precisa de um serviço
          </h3>
          <p className="text-xs text-slate-700 mb-3">
            Encontre prestadores avaliados, veja contatos e combine direto com o
            profissional.
          </p>
          <ul className="text-xs text-slate-700 space-y-1 mb-4">
            <li>• Busque por categoria, cidade ou palavra-chave.</li>
            <li>• Veja telefone, WhatsApp e redes sociais.</li>
            <li>• Em breve: avaliação dos profissionais.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Para profissionais e empresas
          </h3>
          <p className="text-xs text-slate-700 mb-3">
            Divulgue seus serviços e seja encontrado pelos clientes da Região
            dos Lagos.
          </p>
          <ul className="text-xs text-slate-700 space-y-1 mb-4">
            <li>• Anúncios gratuitos na fase de lançamento.</li>
            <li>• Destaque para Classimed, eventos e profissionais liberais.</li>
            <li>• Espaço para fotos, descrição e links externos.</li>
          </ul>

          <Link
            href="/anunciar"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Quero anunciar meus serviços
          </Link>
        </div>
      </section>
    </main>
  );
}
