import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

export default function ImoveisPage() {
  const imoveisBanners = [
    "/banners/anuncio-01.png",
    "/banners/anuncio-02.png",
    "/banners/anuncio-03.png",
  ];

  return (
    <main className="bg-white">

      {/* BANNERS ROTATIVOS 1200x200 */}
      <CategoryBannerCarousel images={imoveisBanners} />

      {/* TÍTULO */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Imóveis em Maricá
        </h1>
        <p className="text-slate-600 text-sm">
          Casas, apartamentos, lançamentos, terrenos, oportunidades e muito mais
          em Maricá e Região dos Lagos.
        </p>
      </section>

      {/* LINKS INTERNOS DO PORTAL */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Explore por categoria
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Lançamentos
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Novos empreendimentos (em breve).
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">Venda</h3>
            <p className="text-xs text-slate-600 mt-1">
              Casas e apartamentos à venda.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">Aluguel</h3>
            <p className="text-xs text-slate-600 mt-1">
              Imóveis para alugar em Maricá.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Imobiliárias
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Corretores e imobiliárias parceiras.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">Terrenos</h3>
            <p className="text-xs text-slate-600 mt-1">
              Lotes e áreas para construir.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:shadow"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Oportunidades
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Imóveis com preços especiais.
            </p>
          </Link>
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Links úteis
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:bg-slate-100"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Consulta IPTU
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Prefeitura de Maricá (em breve).
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:bg-slate-100"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Plantas & Projetos
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Regularização e documentação.
            </p>
          </Link>

          <Link
            href="#"
            className="rounded-2xl border bg-slate-50 p-4 hover:bg-slate-100"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Secretaria de Urbanismo
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Informações oficiais (em breve).
            </p>
          </Link>
        </div>
      </section>

      {/* CHAMADA PARA ANUNCIAR */}
      <section className="bg-blue-50 border-t py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Quer anunciar seu imóvel?
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            Venda ou alugue seu imóvel rapidamente no Classilagos.
          </p>

          <Link
            href="/imoveis/anunciar"
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Anuncie seu imóvel grátis
          </Link>
        </div>
      </section>
    </main>
  );
}




