import Image from "next/image";
import Link from "next/link";

export default function ImoveisMaricaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* BANNER DA CATEGORIA IMÓVEIS MARICÁ */}
      <section className="bg-slate-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow bg-white">
            <Image
              src="/banners/anuncio-07.png" // se quiser outro, é só trocar o nome aqui
              alt="Imóveis em Maricá"
              width={1200}
              height={250}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* TÍTULO + TEXTO GERAL */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Imóveis em Maricá
          </h1>
          <p className="text-sm md:text-base text-slate-700 max-w-3xl">
            Este é o mini-portal de imóveis de Maricá no Classilagos. Aqui você
            vai encontrar lançamentos, oportunidades de compra e aluguel,
            imóveis de imobiliárias e anúncios diretos com proprietários.
            Em breve, esta página será o ponto de partida para quem busca
            morar ou investir em Maricá.
          </p>

          <div className="mt-5">
            <Link
              href="/imoveis/anunciar"
              className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anuncie seu imóvel em Maricá grátis
            </Link>
          </div>
        </div>
      </section>

      {/* NAVEGAÇÃO POR TIPO DE OFERTA */}
      <section className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Navegue por tipo de oferta
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Lançamentos imobiliários
                </h3>
                <p className="text-xs text-slate-600">
                  Novos empreendimentos, condomínios e projetos em destaque.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-blue-600 font-medium">
                Ver lançamentos (em breve)
              </span>
            </Link>

            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Aluguéis
                </h3>
                <p className="text-xs text-slate-600">
                  Casas, apartamentos e kitnets para alugar em Maricá.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-blue-600 font-medium">
                Ver ofertas de aluguel (em breve)
              </span>
            </Link>

            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Imobiliárias em Maricá
                </h3>
                <p className="text-xs text-slate-600">
                  Corretores e imobiliárias parceiras da região.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-blue-600 font-medium">
                Ver imobiliárias (em breve)
              </span>
            </Link>

            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Oportunidades
                </h3>
                <p className="text-xs text-slate-600">
                  Imóveis com preço diferenciado, urgência de venda e mais.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-blue-600 font-medium">
                Ver oportunidades (em breve)
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* LINKS ÚTEIS DE MARICÁ */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Links úteis de Maricá
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Serviços e informações importantes para quem tem imóvel ou deseja
              investir em Maricá.
            </p>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>
                <a href="#" className="hover:underline">
                  🔗 IPTU Maricá (em breve)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  🔗 Prefeitura de Maricá (em breve)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  🔗 Secretaria de Urbanismo / Obras (em breve)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  🔗 Planta online / Regularização (em breve)
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 p-6 bg-slate-50 text-sm text-slate-600">
            <h3 className="font-semibold text-slate-900 mb-2">
              Espaço para parceiros
            </h3>
            <p>
              Aqui podemos destacar imobiliárias, construtoras, corretores e
              empresas de documentação imobiliária que queiram anunciar com
              maior visibilidade em Maricá.
            </p>
            <p className="mt-3 text-[11px] text-slate-500">
              Em breve, este espaço poderá ser um banner ou um carrossel de
              destaques para parceiros da categoria Imóveis.
            </p>
          </div>
        </div>
      </section>

      {/* FUTURA LISTAGEM DE ANÚNCIOS */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Imóveis em Maricá – em breve
          </h2>
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
            Assim que o sistema de cadastro estiver ativo, os imóveis anunciados
            para Maricá aparecerão listados aqui com filtros por bairro, tipo e valor.
          </div>
        </div>
      </section>
    </main>
  );
}


