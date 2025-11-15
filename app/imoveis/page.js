import Image from "next/image";
import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

export default function ImoveisPage() {
  
  // Banners rotativos desta categoria
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
          Casas, apartamentos, lançamentos, terrenos, oportunidades e muito mais.
        </p>
      </section>

      {/* LINKS INTERNOS DO PORTAL */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Explore por categoria</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

          <Link href="#" className="rounded-2xl border bg-slate-50 p-4 hover:shadow">
            <h3 className="text-sm font-semibold text-slate-900">Lançamentos</h3>
            <p className="text-xs text-slate-600 mt-1">Novos empreendimentos</p>
          </Link>

          <Link href="#" className="rounded-2xl border bg-slate-50 p-4 hover:shadow">
            <h3 className="text-sm font-semibold text-slate-900">Venda</h3>
            <p className="text-xs text-slate-600 mt-1">Casas e apartamentos</p>
          </Link>

          <Link href="#" className="rounded-2xl border bg-slate-50 p-4 hover:shadow">
            <h3 className="text-sm font-semibold text-slate-900">Aluguel</h3>
            <p className="text-xs text-slate-600 mt-1">Imóveis para alugar</p>
          </Link>

          <Link href="#" className="rounded-2xl border bg-slate-50 p-4 hover:shadow">
            <h3 className="text-sm font-semibold text-slate-900">Imobiliárias</h3>
            <p className="text-xs text-slate-600 mt-1">Profissionais da região</p>
          </Link>

          <Link href="#" className="rounded-2xl border bg-slate-50 p-4 hover:shadow">
            <h3 className="text-sm font-semibold text-slate-900">Terrenos</h3>



