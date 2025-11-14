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

      {/* BANNER FIXO CENTRALIZADO NO TOPO */}
      <section className="bg-slate-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center">
          <div className="w-full md:w-[650px] h-16 md:h-20 lg:h-24 rounded-2xl overflow-hidden bg-black">
           <Image
  src="/banners/anuncio-05.png"
  alt="Anuncie no Classilagos"
  width={900}
  height={150}
  className="w-full h-full object-cover"
  priority
/>

          </div>
        </div>
      </section>

      {/* CARROSSEL COM LOGO + MENU */}
      <section>
        <HeroCarousel images={heroImages} interval={6000}>
          <div className="absolute inset-0 z-10 flex flex-col">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 pt-4">

              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo-classilagos.png"
                  alt="Classilagos"
                  width={170}
                  height={170}
                  priority
                />
              </Link>

              {/* MENU */}
              <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-900">
                <Link href="/imoveis" className="hover:text-blue-700">Imóveis</Link>
                <Link href="/veiculos" className="hover:text-blue-700">Veículos</Link>
                <Link href="/nautica" className="hover:text-blue-700">Náutica</Link>
                <Link href="/servicos" className="hover:text-blue-700">Serviços</Link>
                <Link href="/turismo" className="hover:text-blue-700">Turismo</Link>
                <Link href="/lagolistas" className="hover:text-blue-700">LagoListas</Link>
                <Link href="/login" className="hover:text-blue-700">Login</Link>
                <Link
                  href="/anunciar"
                  className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Anuncie
                </Link>
              </nav>

            </div>
            <div className="flex-1" />
          </div>
        </HeroCarousel>
      </section>

      {/* ANÚNCIOS EM DESTAQUE */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Anúncios em destaque</h2>
          <div className="rounded-2xl border border-slate-200 p-8 text-slate-600">
            Em breve, os destaques aparecerão aqui.
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Explore por categoria</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              ["Imóveis", "/imoveis"],
              ["Veículos", "/veiculos"],
              ["Náutica", "/nautica"],
              ["Pets", "/pets"],
              ["Empregos", "/empregos"],
              ["Serviços", "/servicos"],
              ["Turismo", "/turismo"],
              ["LagoListas", "/lagolistas"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-center hover:shadow-sm"
              >
                <div className="text-sm font-semibold text-slate-900">{label}</div>
                <div className="text-xs text-slate-500 mt-1">Abrir</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRÊS CHAMADAS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-4">

          <Link href="#" className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Classilagos TV</h3>
            <p className="text-sm text-slate-600">Vídeos, pautas locais e histórias da nossa região.</p>
          </Link>

          <Link href="/turismo" className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Turismo</h3>
            <p className="text-sm text-slate-600">Pousadas, passeios, bares e restaurantes.</p>
          </Link>

          <Link href="#" className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Notícias</h3>
            <p className="text-sm text-slate-600">Acompanhe novidades e oportunidades.</p>
          </Link>

        </div>
      </section>

    </main>
  );
}





