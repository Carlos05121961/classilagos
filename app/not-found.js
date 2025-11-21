export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        O conteúdo que você tentou acessar não existe ou foi movido.
      </p>
      <a
        href="/"
        className="px-4 py-2 rounded-full border text-sm font-medium hover:bg-gray-100"
      >
        Voltar para a página inicial
      </a>
    </main>
  );
}
