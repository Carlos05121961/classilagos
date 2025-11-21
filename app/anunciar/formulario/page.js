import Link from "next/link";

const mapTipos = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas",
};

export default function AnunciarFormularioPage({ searchParams }) {
  const tipo = searchParams?.tipo || "imoveis";
  const nomeCategoria = mapTipos[tipo] || "Anúncio";

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Título dinâmico */}
      <header className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Passo 2 de 3 · Preencha os dados do seu anúncio
        </p>
        <h1 className="text-2xl font-bold">
          Novo anúncio – {nomeCategoria}
        </h1>
        <p className="text-gray-600 mt-2">
          Preencha as informações abaixo. Em breve, estes dados serão
          salvos no banco de dados e aparecerão na busca do Classilagos.
        </p>
      </header>

      {/* Formulário DEMO (sem lógica ainda) */}
      <form className="space-y-4 border rounded-lg p-4 bg-white shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">
            Título do anúncio
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder={`Ex: Casa 2 quartos em ${
              nomeCategoria === "Imóveis" ? "Maricá" : "Cabo Frio"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm min-h-[120px]"
            placeholder="Descreva seu imóvel, veículo, serviço ou oportunidade..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Cidade
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Ex: Maricá, Cabo Frio, Búzios..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bairro / Região
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Ex: Centro, Itaipuaçu, Jacaroá..."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Telefone / Contato
            </label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="(21) 0000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="(21) 9 0000-0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Valor / Preço (opcional)
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Ex: 450.000,00 · 150,00 a diária · A combinar..."
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          <strong>Modo DEMO:</strong> neste momento o formulário ainda
          não salva os dados em nenhum banco. Na próxima fase vamos
          conectar este formulário a um backend (Supabase ou similar) e
          enviar você para uma tela de resumo com os dados reais.
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href="/anunciar"
            className="text-sm text-gray-600 hover:underline"
          >
            ← Voltar para escolher outra categoria
          </Link>

          <button
            type="button"
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold opacity-60 cursor-not-allowed"
            disabled
          >
            Avançar para resumo (em breve)
          </button>
        </div>
      </form>
    </main>
  );
}
