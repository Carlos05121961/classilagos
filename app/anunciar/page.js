import Link from "next/link";

const categorias = [
  {
    slug: "/imoveis",
    titulo: "Imóveis",
    descricao: "Casas, apartamentos, terrenos e muito mais.",
  },
  {
    slug: "/veiculos",
    titulo: "Veículos",
    descricao: "Carros, motos e outros veículos.",
  },
  {
    slug: "/nautica",
    titulo: "Náutica",
    descricao: "Lanchas, barcos, passeios e serviços náuticos.",
  },
  {
    slug: "/pets",
    titulo: "Pets",
    descricao: "Animais, adoção, venda e serviços.",
  },
  {
    slug: "/empregos",
    titulo: "Empregos",
    descricao: "Anuncie vagas ou procure trabalho.",
  },
  {
    slug: "/servicos",
    titulo: "Serviços e Profissionais",
    descricao: "Autônomos, liberais e prestadores de serviço.",
  },
  {
    slug: "/turismo",
    titulo: "Turismo",
    descricao: "Pousadas, hotéis, passeios e lazer.",
  },
  {
    slug: "/lagolistas",
    titulo: "Lagolistas",
    descricao: "Guia comercial da Região dos Lagos.",
  },
];

export default function AnunciarPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-8 bg-slate-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Anuncie grátis no Classilagos
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Escolha a seção abaixo para cadastrar o seu anúncio gratuito.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug}
              className="flex flex-col justify-between rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-slate-400 hover:bg-slate-50 transition"
            >
              <span className="font-semibold text-slate-900">
                {cat.titulo}
              </span>
              <span className="mt-1 text-xs leading-snug text-slate-500">
                {cat.descricao}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-center text-slate-500">
          Classilagos – anúncios grátis para toda a Região dos Lagos.
        </p>
      </div>
    </main>
  );
}


