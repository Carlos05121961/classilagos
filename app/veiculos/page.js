export default function VeiculosPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <section className="text-center px-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Veículos
        </h1>
        <p className="text-gray-600 mb-6">
          Em breve você poderá anunciar e procurar carros, motos e outros veículos em toda a Região dos Lagos.
        </p>
        <a
          href="/anunciar"
          className="inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Anunciar veículo
        </a>
      </section>
    </main>
  );
}
