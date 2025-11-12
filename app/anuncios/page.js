export default function AnunciosPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Anúncios recentes
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Estado vazio (por enquanto) */}
          <div className="col-span-full">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-700 mb-3">
                Ainda não há anúncios publicados.
              </p>
              <a
                href="/anunciar"
                className="inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Anunciar agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
