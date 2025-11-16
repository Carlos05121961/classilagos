import Link from "next/link";
import Image from "next/image";

export default function AnunciarImovelPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* BANNER FIXO NO TOPO (IMÓVEIS) */}
      <div className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[900px] px-4">
          <div className="relative w-full h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-02.png" // se quiser outro, trocamos depois
              alt="Anuncie seu imóvel no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Voltar */}
        <div className="mb-4">
          <Link
            href="/imoveis"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Imóveis
          </Link>
        </div>

        {/* Título e intro */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Anuncie seu imóvel em Maricá e Região dos Lagos
          </h1>
          <p className="text-sm text-slate-700 mb-2">
            Preencha os dados abaixo para cadastrar seu imóvel para venda ou
            aluguel. Em breve, este formulário estará ligado ao sistema real de
            anúncios do Classilagos.
          </p>
          <p className="text-[11px] text-slate-500">
            Neste momento, este formulário é apenas um modelo de layout. Em
            breve, os dados poderão ser enviados e publicados automaticamente
            no site.
          </p>
        </section>

        {/* FORMULÁRIO DE ANÚNCIO (LAYOUT) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-8">
          <form className="space-y-6 text-sm">
            {/* Tipo de anúncio + tipo de imóvel */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Tipo de anúncio
                </label>
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Aluguel</option>
                  <option>Venda</option>
                  <option>Aluguel por temporada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Tipo de imóvel
                </label>
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Kitnet / Studio</option>
                  <option>Terreno / Lote</option>
                  <option>Sala comercial</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>

            {/* Localização */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o bairro"
                />
              </div>
            </div>

            {/* Título e descrição */}
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Título do anúncio
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: Casa 2 quartos com quintal e garagem em Maricá"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Descrição detalhada
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o imóvel: cômodos, metragem, reformas, pontos fortes, proximidades, etc."
              />
            </div>

            {/* Dados principais do imóvel */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Quartos
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Banheiros
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Vagas de garagem
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Área (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="90"
                />
              </div>
            </div>

            {/* Valores */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Valor principal (aluguel ou venda)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex.: 1.500,00 ou 450.000,00"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Condomínio (se houver)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex.: 1.100,00"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  IPTU (mensal aprox.)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex.: 50,00"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Seguro incêndio (mensal)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex.: 18,00"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Outras taxas / observações
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Taxa de serviço, caução, etc."
                />
              </div>
            </div>

            {/* Fotos e vídeo - informativo por enquanto */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Fotos do imóvel
                </label>
                <p className="text-[11px] text-slate-500 mb-1">
                  Em breve você poderá enviar fotos diretamente pelo site. Por
                  enquanto, este campo é apenas ilustrativo.
                </p>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-[11px] text-slate-500">
                  Sugestão: até 8 fotos em boa qualidade, mostrando frente,
                  sala, quartos, cozinha, banheiro e quintal.
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Vídeo curto (opcional)
                </label>
                <p className="text-[11px] text-slate-500 mb-1">
                  No futuro será possível enviar um vídeo curto, gravado pelo
                  celular (por exemplo, até 15–30 segundos), com um tour pelo
                  imóvel.
                </p>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-[11px] text-slate-500">
                  Por enquanto, você pode mencionar no texto do anúncio que
                  possui vídeo e combinar o envio diretamente com o interessado.
                </div>
              </div>
            </div>

            {/* Dados do anunciante */}
            <div className="border-t border-slate-200 pt-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Dados do anunciante
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Seu nome ou nome da imobiliária
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex.: João da Silva ou Imobiliária Exemplo"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Tipo de anunciante
                  </label>
                  <select className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Proprietário</option>
                    <option>Imobiliária / Corretor</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(21) 9 9999-9999"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Preferência de contato
                  </label>
                  <select className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>WhatsApp</option>
                    <option>Telefone</option>
                    <option>E-mail</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Aviso + botão (modelo) */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] text-slate-500">
                Ao enviar seus dados, você declara que as informações do imóvel
                são verdadeiras e que está autorizado a anunciá-lo. O
                Classilagos atua apenas como plataforma de classificados.
              </p>

              <button
                type="button"
                className="w-full rounded-full bg-blue-600 text-white text-sm font-semibold py-2 hover:bg-blue-700"
              >
                Enviar anúncio (modelo)
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}


