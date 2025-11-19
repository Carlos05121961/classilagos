import Image from "next/image";
import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";

export default function ServicosPage() {
  // banners do topo (pode trocar pelos específicos de serviços depois)
  const servicosBanners = [
    "/banners/anuncio-01.png",
    "/banners/anuncio-02.png",
    "/banners/anuncio-03.png",
  ];

  const categoriasServicos = [
    "Marido de aluguel",
    "Reformas & Manutenção",
    "Elétrica & Hidráulica",
    "Limpeza & Diaristas",
    "Informática & Tecnologia",
    "Saúde & Bem-estar",
    "Aulas & Reforço",
    "Eventos & Festas",
  ];

  const profissionaisFicticios = [
    {
      nome: "Carlos – Marido de Aluguel",
      cidade: "Maricá",
      resumo: "Pequenos reparos, instalação de suporte, cortinas e prateleiras.",
    },
    {
      nome: "Ana – Diarista",
      cidade: "Saquarema",
      resumo: "Limpeza residencial e escritório, serviço caprichado.",
    },
    {
      nome: "João – Eletricista",
      cidade: "Cabo Frio",
      resumo: "Instalações, troca de fiação e reparos em geral.",
    },
    {
      nome: "Marina – Designer de Festas",
      cidade: "Búzios",
      resumo: "Decoração de aniversários, casamentos e eventos corporativos.",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER ROTATIVO DO TOPO */}
      <CategoryBannerCarousel images={servicosBanners} />

      {/* HERO SERVIÇOS – IMAGEM ÚNICA + TÍTULO + BUSCA */}
      <section className="relative w-full bg-slate-900">
        {/* fundo com a sua arte de serviços */}
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden">
          <Image
            src="/servicos/hero-servicos.jpg"
            alt="Classilagos - Serviços"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* textos + busca sobrepostos */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="max-w-3xl w-full flex flex-col items-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-md">
              Classilagos – Serviços
            </h1>

            <p className="text-sm sm:text-base text-white text-center drop-shadow">
              Encontre aqui o serviço que você precisa!
            </p>

            {/* BARRA DE BUSCA */}
            <div className="mt-2 w-full flex justify-center">
              <div className="w-full max-w-xl bg-white/95 rounded-2xl shadow-lg border border-slate-200 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* BUSCA */}
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                    Busca
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: eletricista, diarista, encanador"
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
              Em breve, essa busca estará ligada aos anúncios reais de serviços
              na plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* ESPAÇO DE RESPIRO */}
      <div className="h-6 md:h-10" />

      {/* CATEGORIAS DE SERVIÇOS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Categorias de serviços
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categoriasServicos.map((cat) => (
            <div
              key={cat}
              className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800"
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* PROFISSIONAIS EM DESTAQUE – FICTÍCIOS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Profissionais em destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profissionaisFicticios.map((prof, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow px-4 py-3 text-xs sm:text-sm"
            >
              <p className="font-semibold text-slate-900">{prof.nome}</p>
              <p className="text-slate-700 mt-1">{prof.cidade}</p>
              <p className="text-[11px] text-slate-600 mt-1">{prof.resumo}</p>
              <p className="mt-2 text-[11px] text-slate-500">
                Anúncio fictício apenas para ilustrar como os serviços em
                destaque irão aparecer.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DICAS DE CONTRATAÇÃO SEGURA */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Dicas para contratar com segurança
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="font-semibold text-slate-900 mb-1">
              Combine tudo por escrito
            </p>
            <p className="text-xs text-slate-600">
              Sempre registre valores, prazos e forma de pagamento em mensagem
              ou contrato simples.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="font-semibold text-slate-900 mb-1">
              Desconfie de adiantamentos
            </p>
            <p className="text-xs text-slate-600">
              Evite pagar 100% antecipado. Prefira sinal + restante após o
              serviço concluído.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4">
            <p className="font-semibold text-slate-900 mb-1">
              Avalie histórico e referências
            </p>
            <p className="text-xs text-slate-600">
              Peça indicações, veja avaliações e, se possível, converse com
              outros clientes antes de fechar.
            </p>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL – DIVULGAR SERVIÇOS */}
      <section className="bg-blue-50 border-t border-blue-100 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Quer divulgar seus serviços?
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            Alcance novos clientes em toda a Região dos Lagos anunciando no
            Classilagos.
          </p>
          <Link
            href="/servicos/anunciar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Anunciar meu serviço grátis
          </Link>
        </div>
      </section>
    </main>
  );
}
