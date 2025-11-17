import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

export default function ImoveisPage() {
  // Banners do topo (categoria Imóveis)
  const imoveisBanners = [
    "/banners/anuncio-01.png",
    "/banners/anuncio-02.png",
    "/banners/anuncio-03.png",
  ];

  // Imagens do hero (Maricá, Búzios, Saquarema)
  const heroImages = [
    "/imoveis/maricaimoveis.jpg",
    "/imoveis/buziosimoveis.jpg",
    "/imoveis/saquaremaimoveis.jpg",
  ];

  // Filtros rápidos da categoria
  const filtrosRapidos = [
    "Comprar",
    "Alugar",
    "Temporada",
    "Lançamentos",
    "Casas",
    "Apartamentos",
    "Terrenos",
    "Comerciais",
  ];

  // Imóveis em destaque (mock / exemplo)
  const imoveisDestaque = [
    {
      id: 1,
      cidade: "Maricá",
      titulo: "Casa linear com quintal e área gourmet",
      bairro: "Itaipuaçu",
      preco: "R$ 480.000",
      tipo: "Venda",
      imagem: "/imoveis/destaque-marica-01.jpg",
      link: "#",
      tag: "Oportunidade",
    },
    {
      id: 2,
      cidade: "Cabo Frio",
      titulo: "Apartamento a 200m da Praia do Forte",
      bairro: "Centro",
      preco: "R$ 3.500 / mês",
      tipo: "Aluguel",
      imagem: "/imoveis/destaque-cabofrio-01.jpg",
      link: "#",
      tag: "Mobiliado",
    },
    {
      id: 3,
      cidade: "Búzios",
      titulo: "Pousada charmosa com vista para o mar",
      bairro: "João Fernandes",
      preco: "Sob consulta",
      tipo: "Venda",
      imagem: "/imoveis/destaque-buzios-01.jpg",
      link: "#",
      tag: "Destaque",
    },
    {
      id: 4,
      cidade: "Saquarema",
      titulo: "Terreno plano próximo à lagoa",
      bairro: "Barra Nova",
      preco: "R$ 180.000",
      tipo: "Venda",
      imagem: "/imoveis/destaque-saquarema-01.jpg",
      link: "#",
      tag: "Investimento",
    },
  ];

  return (
    <main className="bg-white">
      {/* BANNER ROTATIVO DA CATEGORIA IMÓVEIS */}
      <CategoryBannerCarousel images={imoveisBanners} />

      {/* HERO COM TÍTULO + FRASE + BUSCA SOBRE AS FOTOS */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Texto + chamada + busca */}
            <div className="text-white space-y-6">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Imóveis • Região dos Lagos & Maricá
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Encontre o imóvel perfeito
                <span className="block text-emerald-400">
                  em Maricá e na Região dos Lagos
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-xl">
                Casas, apartamentos, terrenos, sítios, imóveis comerciais,
                temporada, lançamentos e muito mais. Tudo em um só lugar,
                com anúncios <strong>100% gratuitos</strong> para você começar.
              </p>

              {/* Busca simples */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      O que você procura?
                    </label>
                    <select className="w-full rounded-full border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                      <option>Comprar</option>
                      <option>Alugar</option>
                      <option>Temporada</option>
                      <option>Lançamentos</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Cidade
                    </label>
                    <select className="w-full rounded-full border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                      <option>Maricá</option>
                      <option>Saquarema</option>
                      <option>Araruama</option>
                      <option>São Pedro da Aldeia</option>
                      <option>Arraial do Cabo</option>
                      <option>Cabo Frio</option>
                      <option>Búzios</option>
                      <option>Rio das Ostras</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-[2fr,1fr] gap-3">
                  <input
                    type="text"
                    placeholder="Bairro, referência ou código do imóvel"
                    className="w-full rounded-full border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md hover:bg-emerald-400 transition">
                    Buscar imóveis
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Em breve, essa busca estará integrada com os anúncios reais
                  da plataforma Classilagos.
                </p>
              </div>

              {/* Chamada para anunciar */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <p className="text-slate-300">
                  É corretor, imobiliária ou proprietário?
                  <span className="ml-1 text-emerald-400 font-semibold">
                    Anuncie seu imóvel grátis em poucos minutos.
                  </span>
                </p>
                <Link
                  href="/anuncie"
                  className="inline-flex items-center rounded-full border border-emerald-400 px-4 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-400 hover:text-slate-900 transition"
                >
                  Anuncie seu imóvel grátis
                </Link>
              </div>
            </div>

            {/* Carrossel de imagens */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-emerald-500/20 blur-xl" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                <HeroCarousel images={heroImages} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
                  • Maricá
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
                  • Cabo Frio
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
                  • Búzios
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
                  • Toda a Região dos Lagos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS RÁPIDOS */}
      <section className="py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Filtrar por tipo de imóvel
          </h2>
          <div className="flex flex-wrap gap-2">
            {filtrosRapidos.map((filtro) => (
              <button
                key={filtro}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                type="button"
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* IMÓVEIS EM DESTAQUE */}
      <section className="py-10 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Imóveis em destaque
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Veja alguns exemplos de como seus anúncios podem aparecer
                na vitrine da Classilagos. Em breve, aqui teremos imóveis
                reais da região.
              </p>
            </div>
            <Link
              href="/anuncie"
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Quero anunciar meu imóvel
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {imoveisDestaque.map((imo) => (
              <Link
                key={imo.id}
                href={imo.link}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={imo.imagem}
                    alt={imo.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-semibold text-slate-900 shadow">
                    {imo.tag}
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] text-white">
                    {imo.cidade} • {imo.bairro}
                  </div>
                </div>
                <div className="p-3.5 space-y-1.5">
                  <p className="text-[13px] font-semibold text-slate-900 line-clamp-2">
                    {imo.titulo}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600">
                    {imo.preco}{" "}
                    <span className="ml-1 text-[11px] text-slate-500">
                      • {imo.tipo}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Anúncio ilustrativo • Classilagos Imóveis
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL PARA ANUNCIAR */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-8 sm:px-10 sm:py-10 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Anuncie seus imóveis grátis na Classilagos
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto">
              Se você é <strong>corretor, imobiliária ou proprietário</strong>,
              pode anunciar seus imóveis sem custo neste lançamento da
              plataforma. Ganhe visibilidade em Maricá e em todas as cidades
              da Região dos Lagos.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/anuncie"
                className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow hover:bg-emerald-400 transition"
              >
                Quero anunciar meu imóvel grátis
              </Link>
              <Link
                href="/contato"
                className="inline-flex items-center rounded-full border border-emerald-400 px-6 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
              >
                Falar com a equipe Classilagos
              </Link>
            </div>
            <p className="text-[11px] text-slate-500">
              Este é um layout inicial. Assim que o painel de anúncios estiver
              pronto, os imóveis cadastrados aparecerão aqui automaticamente.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}







