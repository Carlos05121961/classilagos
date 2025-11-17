import Link from "next/link";
import Image from "next/image";

export default function ImoveisPage() {
  // Cards de categorias (primeira linha com foto, segunda linha placeholders)
  const categoriasComFoto = [
    {
      titulo: "Venda",
      imagem: "/imoveis/categoria-venda.jpg", // pode trocar pela foto que quiser
      href: "#",
    },
    {
      titulo: "Aluguel",
      imagem: "/imoveis/categoria-aluguel.jpg",
      href: "#",
    },
    {
      titulo: "Lançamentos",
      imagem: "/imoveis/categoria-lancamentos.jpg",
      href: "#",
    },
    {
      titulo: "Oportunidade",
      imagem: "/imoveis/categoria-oportunidade.jpg",
      href: "#",
    },
  ];

  const categoriasSimples = [
    "Temporada",
    "Terrenos",
    "Sítios",
    "Comercial",
  ];

  const destaquesVazios = [1, 2, 3, 4];

  const linksUteis = [
    {
      titulo: "Consulta IPTU",
      descricao: "Prefeitura de Maricá (em breve).",
      href: "#",
    },
    {
      titulo: "Plantas & Projetos",
      descricao: "Regularização e documentação.",
      href: "#",
    },
    {
      titulo: "Secretaria de Urbanismo",
      descricao: "Informações oficiais (em breve).",
      href: "#",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO (IMÓVEIS) */}
      <section className="w-full flex justify-center bg-slate-100 border-b">
        <div className="w-full max-w-6xl px-4 py-3">
          <div className="relative w-full h-[110px] sm:h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-02.png"
              alt="Anuncie seu imóvel rapidamente no Classilagos"
              fill
              sizes="1000px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO COM FOTO + TEXTO + BARRA DE BUSCA */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[380px]">
          <Image
            src="/imoveis/maricaimoveis.jpg"
            alt="Vista da Região dos Lagos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

          {/* Texto central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-xs sm:text-sm mb-2">
              Encontre casas, apartamentos, terrenos e oportunidades em toda a
              Região dos Lagos.
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 drop-shadow">
              Classilagos – Imóveis
            </h1>

            {/* Barra de busca */}
            <div className="w-full max-w-4xl">
              <form className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-2 bg-white/95 rounded-full px-3 py-2 text-xs sm:text-sm text-slate-800 shadow-lg">
                <input
                  type="text"
                  placeholder="Busca:"
                  className="w-full rounded-full border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="w-full rounded-full border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Imóvel:</option>
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Terreno</option>
                  <option>Sítio / Chácara</option>
                  <option>Comercial</option>
                </select>
                <select className="w-full rounded-full border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Cidade:</option>
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
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* CATEGORIAS COM FOTO */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoriasComFoto.map((cat) => (
            <Link
              key={cat.titulo}
              href={cat.href}
              className="group rounded-xl overflow-hidden bg-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-32 sm:h-36">
                <Image
                  src={cat.imagem}
                  alt={cat.titulo}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs sm:text-sm px-2 py-1.5">
                  {cat.titulo}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CATEGORIAS SIMPLES (QUADRADOS AZUIS) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoriasSimples.map((nome) => (
            <div
              key={nome}
              className="flex flex-col justify-end h-24 sm:h-28 rounded-xl bg-indigo-800 text-white overflow-hidden shadow-sm"
            >
              <div className="bg-black/60 px-2 py-1.5 text-xs sm:text-sm">
                {nome}
              </div>
            </div>
          ))}
        </div>

        {/* DESTAQUES (QUADRADOS AZUIS) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destaquesVazios.map((idx) => (
            <div
              key={idx}
              className="flex flex-col justify-end h-24 sm:h-28 rounded-xl bg-indigo-800 text-white overflow-hidden shadow-sm"
            >
              <div className="bg-black/60 px-2 py-1.5 text-xs sm:text-sm">
                Destaque
              </div>
            </div>
          ))}
        </div>

        {/* FAIXA NOTÍCIAS */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-center h-16 rounded-xl bg-yellow-400 text-slate-900 font-semibold text-lg"
            >
              Notícias
            </div>
          ))}
        </div>

        {/* LINKS ÚTEIS */}
        <section className="space-y-3">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">
            Links úteis
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {linksUteis.map((link) => (
              <div
                key={link.titulo}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                <p className="font-semibold text-slate-900 text-sm">
                  {link.titulo}
                </p>
                <p className="text-xs text-slate-600">{link.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CHAMADA FINAL - ANUNCIE SEU IMÓVEL */}
        <section className="rounded-3xl border border-blue-100 bg-blue-50 px-5 py-6 sm:px-8 sm:py-8 text-center space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Quer anunciar seu imóvel?
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto">
            Venda ou alugue seu imóvel rapidamente no Classilagos. Durante o
            lançamento, o anúncio é <strong>totalmente grátis</strong>.
          </p>
          <div className="flex justify-center">
            <Link
              href="/imoveis/anunciar"
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
            >
              Anuncie seu imóvel grátis
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}








