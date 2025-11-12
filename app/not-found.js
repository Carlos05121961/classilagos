export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Página não encontrada
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          O endereço que você tentou acessar não existe no momento.
        </p>
        <a
          href="/"
          className="inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Voltar para a página inicial
        </a>
      </div>
    </main>
  );
}
