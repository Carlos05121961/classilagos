import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";

export default function Home() {
  const heroImages = [
    "/banners/pontanegra.png",
    "/banners/itaipuacu.png",
    "/banners/barra.png",
  ];

  return (
    <main>
      {/* Carrossel topo */}
      <HeroCarousel images={heroImages} />

      {/* Banner principal (abaixo do carrossel) */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="relative w-full h-[120px] md:h-[160px] lg:h-[180px] rounded-2xl overflow-hidden border border-slate-200">
            <Image
              src="/banners/anuncio-01.png"
              alt="Banner principal"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Bloco de boas-vindas (mantive simples; depois trocamos pelos 8 botões) */}
      <section className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-10 rounded-2xl">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Bem-vindo ao novo Classilagos
          </h2>
          <p className="text-sm text-slate-700 mb-3">
            Em breve você poderá divulgar seu negócio e explorar anúncios de
            Imóveis, Veículos, Náutica, Serviços, Turismo, Empregos, Pets e LagoListas.
          </p>
          <div className="flex gap-3">
            <Link
              href="/anunciar"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Anunciar grátis
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

