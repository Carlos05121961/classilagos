import Image from "next/image";
import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

const topoBanners = [
  "/banners/anuncio-01.png",
  "/banners/anuncio-02.png",
  "/banners/anuncio-03.png",
];

export default function EmpregosPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* BANNER ROTATIVO DA CATEGORIA */}
      <CategoryBannerCarousel images={topoBanners} />

      {/* HERO EMPREGOS – FUNDO ÚNICO + TÍTULO + BUSCA */}
      <section className="relative w-full">
        {/* fundo com a sua imagem */}
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] overflow-hidden">
          <Image
            src="/empregos/hero-empregos.jpg"
            alt="Classilagos - Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* textos + busca sobrepostos */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-md mb-2">
            Classilagos - Empregos
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/95 text-center max-w-2xl drop-shadow mb-4">
            É aqui que você será encontrado! Vagas e oportunidades em toda a
            Região dos Lagos.
          </p>

          {/* barra de busca mais compacta */}
          <div className="pointer-events-auto w-full max-w-2xl bg-white/95 rounded-full shadow-lg border border-slate-200 px-4 py-2 flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* busca livre */}
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                Busca
              </label>
              <input
                type="text"
                placeholder="Ex.: vendedor, recepcionista, garçom..."
                className="w-full bg-transparent text-xs sm:text-sm outline-none"
              />
            </div>

            {/* separador vertical somente no desktop */}
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
              Buscar vagas
            </button>
          </div>

          <p className="mt-2 text-[11px] text-white/85 text-center drop-shadow">
            Em breve, essa busca estará ligada às vagas reais da plataforma.
          </p>
        </div>
      </section>

      {/* espaçamento depois do hero */}
      <div className="h-6 md:h-10" />

      {/* VAGAS EM DESTAQUE */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
          Vagas em destaque
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col"
            >
              <div className="text-xs font-semibold text-blue-600 mb-1">
                Vaga exemplo {i}
              </div>
              <p className="text-xs text-slate-700">
                Descrição resumida da vaga (cargo, área e principais
                responsabilidades).
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Cidade . Empresa . Salário a combinar
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCOS PARA CANDIDATOS E EMPRESAS */}
      <section className="max-w-6xl mx-auto px-4 pb-10 grid gap-4 md:grid-cols-2">
        {/* candidatos */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Para quem procura emprego
          </h3>
          <p className="text-xs text-slate-700 mb-3">
            Crie seu perfil e deixe seu currículo visível para empresas de toda
            a região.
          </p>
          <ul className="text-xs text-slate-700 space-y-1 mb-4">
            <li>• Cadastre seus dados e experiências.</li>
            <li>• Salve vagas favoritas.</li>
            <li>• Em breve: alerta de vagas por e-mail.</li>
          </ul>

          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Cadastrar meu currículo (em breve)
          </Link>
        </div>

        {/* empresas */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Para empresas e lojistas
          </h3>
          <p className="text-xs text-slate-700 mb-3">
            Anuncie suas vagas e encontre profissionais da Região dos Lagos.
          </p>
          <ul className="text-xs text-slate-700 space-y-1 mb-4">
            <li>• Divulgação gratuita na fase de lançamento.</li>
            <li>• Banco de currículos por área e cidade.</li>
            <li>• Canal direto com candidatos.</li>
          </ul>

          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Quero anunciar vagas
          </Link>
        </div>
      </section>

      {/* LINKS ÚTEIS (SINE, prefeituras etc.) */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
            Links úteis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">
                SINE / Agência de Trabalho
              </p>
              <p className="mt-1 text-slate-600">
                Vagas oficiais e programas de emprego (em breve).
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">
                Prefeituras e concursos
              </p>
              <p className="mt-1 text-slate-600">
                Editais e oportunidades no setor público local.
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">
                Dicas para entrevistas
              </p>
              <p className="mt-1 text-slate-600">
                Conteúdo educativo para mandar bem nos processos seletivos.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
