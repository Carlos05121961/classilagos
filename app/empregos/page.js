import Image from "next/image";
import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

export default function EmpregosPage() {
  // banners do topo (pode trocar pelos específicos de empregos depois)
  const empregosBanners = [
    "/banners/anuncio-01.png",
    "/banners/anuncio-02.png",
    "/banners/anuncio-03.png",
  ];

  const principaisAreas = [
    "Administração",
    "Comércio & Vendas",
    "Turismo & Hotelaria",
    "Construção Civil",
    "Serviços Gerais",
    "Saúde",
    "Educação",
    "Tecnologia",
  ];

  const vagasFicticias = [
    {
      titulo: "Atendente de Loja",
      empresa: "Comércio Local",
      cidade: "Maricá",
      salario: "R$ 1.800",
    },
    {
      titulo: "Auxiliar de Serviços Gerais",
      empresa: "Condomínio Residencial",
      cidade: "Saquarema",
      salario: "R$ 1.700",
    },
    {
      titulo: "Recepcionista",
      empresa: "Pousada Charmosa",
      cidade: "Búzios",
      salario: "R$ 2.000",
    },
    {
      titulo: "Auxiliar Administrativo",
      empresa: "Escritório Contábil",
      cidade: "Cabo Frio",
      salario: "R$ 2.200",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER ROTATIVO DO TOPO */}
      <CategoryBannerCarousel images={empregosBanners} />

      {/* HERO EMPREGOS – IMAGEM ÚNICA + TÍTULO + BUSCA */}
      <section className="relative w-full bg-slate-900">
        {/* fundo com a sua arte de empregos */}
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden">
          <Image
            src="/empregos/hero-empregos.jpg"
            alt="Classilagos - Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* leve escurecida pra destacar os textos */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* textos + busca sobrepostos */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="max-w-3xl w-full flex flex-col items-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-md">
              Classilagos – Empregos
            </h1>

            <p className="text-sm sm:text-base text-white text-center drop-shadow">
              É aqui que você será encontrado!
            </p>

            {/* BARRA DE BUSCA (mais baixa e leve, pra não tampar toda a foto) */}
            <div className="mt-2 w-full flex justify-center">
              <div className="w-full max-w-xl bg-white/95 rounded-2xl shadow-lg border border-slate-200 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* BUSCA */}
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                    Busca
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: vendedor, motorista, recepcionista"
                    className="w-full bg-transparent text-xs sm:text-sm outline-none"
                  />
                </div>

                {/* separador vertical no desktop */}
                <div className="hidden sm:block h-8 w-px bg-slate-300" />

                {/* CIDADE */}
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

                {/* BOTÃO */}
                <button
                  type="button"
                  className="sm:ml-2 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>

            <p className="mt-1 text-[11px] text-center text-slate-100 drop-shadow">
              Em breve, essa busca estará ligada às vagas reais publicadas na
              plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* ESPAÇO DE RESPIRO DEPOIS DO HERO */}
      <div className="h-6 md:h-10" />

      {/* PRINCIPAIS ÁREAS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Principais áreas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {principaisAreas.map((area) => (
            <div
              key={area}
              className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800"
            >
              {area}
            </div>
          ))}
        </div>
      </section>

      {/* VAGAS EM DESTAQUE – FICTÍCIAS POR ENQUANTO */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Vagas em destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vagasFicticias.map((vaga, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow px-4 py-3 text-xs sm:text-sm"
            >
              <p className="font-semibold text-slate-900">{vaga.titulo}</p>
              <p className="text-slate-700 mt-1">{vaga.empresa}</p>
              <p className="text-slate-500 text-[11px] mt-1">
                {vaga.cidade} • {vaga.salario}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Vaga fictícia apenas para ilustrar a área de destaques.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DICAS PARA CANDIDATOS */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Dicas rápidas para candidatos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="font-semibold text-slate-900 mb-1">
              Atualize sempre seu currículo
            </p>
            <p className="text-xs text-slate-600">
              Mantenha experiências recentes, contatos e cursos em dia. Isso
              aumenta suas chances de ser chamado.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="font-semibold text-slate-900 mb-1">
              Seja claro na área de interesse
            </p>
            <p className="text-xs text-slate-600">
              Informe a área em que deseja atuar e a cidade de preferência para
              facilitar o contato das empresas.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="font-semibold text-slate-900 mb-1">
              Atenção a golpes e promessas fáceis
            </p>
            <p className="text-xs text-slate-600">
              Nunca pague para participar de processos seletivos. Em caso de
              suspeita, denuncie o anúncio.
            </p>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL – ANUNCIE SUA VAGA */}
      <section className="bg-blue-50 border-t border-blue-100 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Quer anunciar uma vaga?
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            Divulgue oportunidades de trabalho para toda a Região dos Lagos.
            Em breve: área exclusiva para empresas e RH.
          </p>
          <Link
            href="/empregos/anunciar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Anunciar vaga gratuitamente
          </Link>
        </div>
      </section>
    </main>
  );
}
