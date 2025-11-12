import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Classilagos</h1>
            <p className="text-sm text-slate-600">
              O seu guia de compras e serviços na Região dos Lagos.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/anunciar"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Anuncie grátis
            </Link>

            <Link
              href="/cadastro"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Cadastrar
            </Link>

            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Entrar
            </Link>
          </div>
        </header>

        {/* Corpo da página */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Bem-vindo ao novo Classilagos
          </h2>
          <p className="text-sm text-slate-700 mb-3">
            Aqui você poderá divulgar o seu negócio, procurar serviços,
            empregos, imóveis, veículos e muito mais em todas as cidades
            da Região dos Lagos.
          </p>
          <p className="text-xs text-slate-500">
            Estamos construindo a nova versão do portal — em breve com
            cadastro, anúncios e buscas completas!
          </p>
        </section>
      </div>
    </main>
  );
}
