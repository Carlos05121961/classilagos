"use client";

export default function AnunciarPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Anuncie GRÁTIS no Classilagos
        </h1>

        <p className="mb-6 text-gray-700">
          Divulgue o seu produto, serviço ou negócio gratuitamente e
          alcance clientes de toda a Região dos Lagos. É rápido, fácil e
          sem custo!
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome / Nome da Empresa
            </label>
            <input
              type="text"
              placeholder="Ex: Maria da Silva / Pousada Sol Nascente"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                placeholder="(22) 99999-9999"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                placeholder="Ex: Maricá, Cabo Frio..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Selecione...</option>
              <option>Imóveis</option>
              <option>Veículos</option>
              <option>Serviços</option>
              <option>Profissionais Liberais</option>
              <option>Turismo</option>
              <option>Comércio</option>
              <option>Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição do Anúncio
            </label>
            <textarea
              rows={4}
              placeholder="Descreva seu produto ou serviço..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Enviar Anúncio (demo)
          </button>
        </form>
      </section>
    </main>
  );
}
