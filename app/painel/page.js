import Link from "next/link";

export default function PainelPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Cabeçalho do painel */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Meu Painel Classilagos
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Aqui você vai controlar seus anúncios, atualizar seus dados e
            acompanhar resultados. Nesta primeira fase tudo é{" "}
            <span className="font-semibold">DEMO</span>, mas o fluxo já está
            pronto.
          </p>
        </section>

        {/* Cards principais */}
        <section className="grid gap-4 md:grid-cols-3 mb-10">
          <Link
            href="/anunciar"
            className="rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow px-5 py-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Criar novo anúncio
              </h2>
              <p className="text-xs text-slate-600">
                Imóveis, veículos, serviços, turismo, empregos e muito mais.
              </p>
            </div>
            <span className="mt-3 inline-flex text-xs font-semibold text-blue-600">
              Começar agora →
            </span>
          </Link>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-5 py-6 flex flex-col justify-between opacity-70">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Meus anúncios
              </h2>
              <p className="text-xs text-slate-600">
                Em breve você verá aqui a lista dos anúncios que cadastrou,
                com status, visualizações e destaques.
              </p>
            </div>
            <span className="mt-3 inline-flex text-xs font-semibold text-slate-400">
              Em breve
            </span>
          </div>

          <Link
            href="/cadastro"
            className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow px-5 py-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Dados da conta
              </h2>
              <p className="text-xs text-slate-600">
                Atualizar nome, e-mail, senha e informações básicas.
              </p>
            </div>
            <span className="mt-3 inline-flex text-xs font-semibold text-blue-600">
              Revisar cadastro →
            </span>
          </Link>
        </section>

        {/* Bloco informativo */}
        <section className="rounded-3xl bg-white border border-slate-200 px-6 py-7">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            Próximos passos do projeto
          </h2>
          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
            <li>
              Conectar o cadastro e login a um banco de dados (ex.: Supabase ou
              PostgreSQL).
            </li>
            <li>
              Criar o cadastro real de anúncios em cada seção (Imóveis, Veículos,
              Serviços, Turismo, Empregos, LagoListas).
            </li>
            <li>
              Exibir os anúncios deste usuário aqui no painel, com opção de
              editar, pausar e destacar.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
