export default function NauticaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <section className="text-center px-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Náutica
        </h1>
        <p className="text-gray-600 mb-6">
          Página em construção. Em breve você poderá divulgar embarcações, lanchas e serviços náuticos.
        </p>
        <a
          href="/anunciar"
          className="inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Anunciar embarcação
        </a>
      </section>
    </main>
  );
}
