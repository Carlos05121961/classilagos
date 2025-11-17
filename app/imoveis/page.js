import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";

const heroImages = [
  "/imoveis/maricaimoveis.jpg",
  "/imoveis/saquaremaimoveis.jpg",
  "/imoveis/buziosimoveis.jpg",
];

const categorias = [
  {
    slug: "#",
    nome: "Venda",
    imagem: "/imoveis/cat-venda.jpg",
  },
  {
    slug: "#",
    nome: "Aluguel",
    imagem: "/imoveis/cat-aluguel.jpg",
  },
  {
    slug: "#",
    nome: "Lançamentos",
    imagem: "/imoveis/cat-lancamentos.jpg",
  },
  {
    slug: "#",
    nome: "Oportunidade",
    imagem: "/imoveis/cat-oportunidade.jpg",
  },
  {
    slug: "#",
    nome: "Temporada",
  },
  {
    slug: "#",
    nome: "Terrenos",
  },
  {
    slug: "#",
    nome: "Sítios",
  },
  {
    slug: "#",
    nome: "Comercial",
  },
];

export default function ImoveisPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO – IMÓVEIS (ANÚNCIO) */}
      <section className="w-full flex justify-center bg-slate-50 border-b">
        <div className="w-full max-w-6xl px-4 py-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            {/* use aqui a imagem do banner que você já usa */}
            <Image
              src="/banners/anuncio-imoveis-topo.png"
              alt="Anuncie sua casa por temporada - Classilagos.shop"
              fill
              sizes="1024px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO – 3 FOTOS INTERCALANDO + TEXTOS + BUSCA */}
      <section className="relative">
        {/* fundo com carrossel */}
        <div className="h-[260px] sm:h-[320px] lg:h-[380px]">
          <HeroCarousel images={heroImages} />
        </div>

        {/* degradê para melhorar leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/5" />

        {/* textos mais para cima, não tão centralizados */}
        <div className="absolute inset-x-0 top-8 sm:top-10 flex flex-col items-center px-4">
          <p className="text-xs sm:text-sm text-slate-100 mb-1 text-center max-w-xl">
            Encontre casas, apartamentos, terrenos e oportunidades em toda a
            Região dos Lagos.
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center drop-shadow">
            Classilagos – Imóveis
          </h1>
        </div>

        {/* barra de busca – mais fininha */}
        <div className="absolute inset-x-0 bottom-6 px-4">
          <div className="max-w-4xl mx-auto bg-white/95 rounded-full shadow-xl border border-slate-200 px-4 py-2">
            <form className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 text-xs sm:text-sm">
              {/* Busca livre */}
              <div className="flex-1">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Busca:
                </label>
                <input
                  type="text"
                  placeholder="Ex.: casa 2 quartos com quintal"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo de imóvel */}
              <div className="w-full sm:w-40">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Imóvel:
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Terreno</option>
                  <option>Sítio / Chácara</option>
                  <option>Comercial</option>
                  <option>Outro</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="w-full sm:w-48">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Cidade:
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CATEGORIAS – 8 BLOCOS DO MESMO TAMANHO */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Explore por categoria
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                href={cat.slug}
                key={cat.nome}
                className="group rounded-2xl overflow-hidden bg-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex flex-col h-[170px]">
                  {/* Parte de cima: com foto ou bloco de cor */}
                  {cat.imagem ? (
                    <div className="relative flex-1">
                      <Image
                        src={cat.imagem}
                        alt={cat.nome}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 bg-indigo-700 group-hover:bg-indigo-600 transition-colors" />
                  )}

                  {/* faixa com o nome */}
                  <div className="bg-black/80 px-3 py-2">
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {cat.nome}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOTÍCIAS – FAIXAS AMARELAS */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-16 flex items-center justify-center bg-yellow-400 text-slate-900 font-semibold text-base rounded-md"
              >
                Notícias
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Links úteis
          </h2>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <p className="font-semibold text-slate-900">Consulta IPTU</p>
              <p className="text-xs text-slate-600">
                Prefeitura de Maricá (em breve).
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <p className="font-semibold text-slate-900">
                Plantas &amp; Projetos
              </p>
              <p className="text-xs text-slate-600">
                Regularização e documentação.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <p className="font-semibold text-slate-900">
                Secretaria de Urbanismo
              </p>
              <p className="text-xs text-slate-600">
                Informações oficiais (em breve).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL – ANUNCIAR IMÓVEL */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Quer anunciar seu imóvel?
            </h2>
            <p className="text-sm text-slate-700 mb-4 max-w-xl mx-auto">
              Venda ou alugue seu imóvel rapidamente no Classilagos. Durante o
              período de lançamento, os anúncios são <strong>totalmente
              gratuitos</strong>.
            </p>
            <Link
              href="/imoveis/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Anuncie seu imóvel grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}








