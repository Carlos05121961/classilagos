import Image from "next/image";
import Link from "next/link";

const images = [
  "/imoveis/casa-teste-01.jpg",
  "/imoveis/casa-teste-02.jpg",
  "/imoveis/casa-teste-03.jpg",
];

export default function CasaTestePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Voltar */}
        <div className="mb-4">
          <Link
            href="/imoveis"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Imóveis
          </Link>
        </div>

        {/* Cabeçalho do anúncio */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Casa em Maricá – 2 quartos, quintal e garagem
              </h1>
              <p className="text-sm text-slate-700 mb-3">
                Anúncio de teste para visualização do layout de imóveis no
                Classilagos. Em breve, este modelo será usado para anúncios
                reais.
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  🛏️ 2 quartos
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  🚿 1 banheiro
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  🚗 Garagem
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  📍 Maricá – Bairro de exemplo
                </span>
              </div>
            </div>

            {/* Preço fictício */}
            <div className="text-right">
              <div className="text-xs uppercase text-slate-500">
                Valor de exemplo
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                R$ 450.000
              </div>
              <div className="text-[11px] text-slate-500">
                (Somente para fins de teste)
              </div>
            </div>
          </div>

          {/* Barra de ações */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50">
              ⭐ Favoritar
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50">
              📩 Compartilhar
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50">
              🖨️ Imprimir
            </button>
          </div>
        </section>

        {/* Galeria de fotos */}
        <section className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <div className="relative w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={images[0]}
                alt="Foto principal da casa"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-3">
            {images.slice(1).map((src) => (
              <div
                key={src}
                className="relative w-full h-[120px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
              >
                <Image
                  src={src}
                  alt="Foto da casa"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Detalhes + contato + mapa + mensagem */}
        <section className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Detalhes do imóvel */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Detalhes do imóvel
              </h2>
              <p className="text-sm text-slate-700 mb-3">
                Aqui você poderá descrever o imóvel com calma: tamanho do
                terreno, metragem construída, como é a sala, os quartos,
                cozinha, se tem varanda, área gourmet, piscina, etc.
              </p>

              <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                <li>Terreno de exemplo: 360 m²</li>
                <li>Área construída de exemplo: 90 m²</li>
                <li>Sala, cozinha, 2 quartos e 1 banheiro social</li>
                <li>Quintal com espaço para área gourmet</li>
                <li>Garagem para 1 carro</li>
              </ul>
            </div>

            {/* Localização / mapa (placeholder) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Localização aproximada
              </h2>
              <p className="text-xs text-slate-600 mb-3">
                Neste espaço, futuramente, podemos embutir um mapa interativo
                com a localização aproximada do imóvel (Google Maps ou outro
                serviço).
              </p>
              <div className="relative w-full h-[220px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                Mapa da localização (em breve)
              </div>
            </div>
          </div>

          {/* Coluna direita: contato + mensagem */}
          <div className="space-y-6">
            {/* Bloco de contato */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Contato do anunciante
              </h2>

              <div className="space-y-2 text-sm text-slate-800 mb-4">
                <p>
                  <strong>Nome:</strong> Seu nome aqui
                </p>
                <p>
                  <strong>WhatsApp:</strong> (21) 99999-9999
                </p>
                <p>
                  <strong>E-mail:</strong> seuemail@exemplo.com
                </p>
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-blue-600 text-white text-sm font-semibold py-2 hover:bg-blue-700"
              >
                Falar com o anunciante (modelo)
              </button>

              <p className="text-[11px] text-slate-500 mt-3">
                No futuro, esses dados serão preenchidos automaticamente a
                partir do cadastro do anunciante.
              </p>
            </div>

            {/* Formulário de mensagem */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Enviar mensagem ao vendedor
              </h2>

              <form className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite seu nome"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(21) 9 9999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escreva sua mensagem para o anunciante..."
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-full bg-emerald-600 text-white text-sm font-semibold py-2 hover:bg-emerald-700"
                >
                  Enviar mensagem (modelo)
                </button>

                <p className="text-[11px] text-slate-500 mt-2">
                  Este formulário é apenas ilustrativo. Depois vamos conectá-lo
                  a um envio real (e-mail, WhatsApp ou painel interno).
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Ofertas similares (modelo) */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Ofertas similares (exemplo)
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            Quando houver mais anúncios cadastrados, poderemos mostrar imóveis
            semelhantes nesta área.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="h-24 rounded-xl bg-slate-200 mb-3" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Casa exemplo {i} em Maricá
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Imóvel fictício para demonstrar a área de ofertas similares.
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-2">
                  R$ {400 + i * 20}.000
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rodapé do anúncio */}
        <p className="text-[11px] text-slate-500 mb-4">
          Este anúncio é apenas um modelo para testes do layout de imóveis no
          Classilagos. Em breve, os dados serão preenchidos a partir dos
          anúncios reais cadastrados pelos usuários.
        </p>
      </div>
    </main>
  );
}

