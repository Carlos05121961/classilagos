"use client";

import AuthGuard from "../../components/AuthGuard";

const FAKE_ADS = [
  {
    id: 1,
    titulo: "Casa 2 quartos em Ponta Negra",
    categoria: "imoveis",
    cidade: "Maricá",
    contato: "(21) 9 9999-9999",
  },
  {
    id: 2,
    titulo: "Serviços de eletricista 24h",
    categoria: "servicos",
    cidade: "Cabo Frio",
    contato: "(22) 9 8888-8888",
  },
];

export default function MeusAnunciosPage() {
  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Meus anúncios</h1>

        <p className="mb-6 text-sm text-slate-600">
          Aqui você verá todos os anúncios cadastrados com a sua conta.
          Por enquanto estamos usando dados de exemplo; assim que o Supabase
          voltar, essa listagem será real.
        </p>

        {FAKE_ADS.length === 0 ? (
          <p className="text-sm text-slate-600">
            Você ainda não tem anúncios cadastrados.
          </p>
        ) : (
          <div className="space-y-4">
            {FAKE_ADS.map((anuncio) => (
              <div
                key={anuncio.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h2 className="text-base font-semibold text-slate-900">
                  {anuncio.titulo}
                </h2>

                <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">
                  {anuncio.categoria} • {anuncio.cidade}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Contato: {anuncio.contato}
                </p>

                <div className="mt-3 flex gap-2">
                  <button className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Editar
                  </button>
                  <button className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
