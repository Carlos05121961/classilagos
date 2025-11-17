"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AnunciarImovelPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* BANNER FIXO NO TOPO (MESMO PADRÃO DAS OUTRAS PÁGINAS) */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-5xl px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu imóvel totalmente GRÁTIS - classilagos.shop"
              fill
              sizes="1000px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* VOLTAR PARA IMÓVEIS */}
        <div className="mb-4">
          <Link
            href="/imoveis"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Imóveis
          </Link>
        </div>

        {/* AVISO DE SUCESSO (SIMULAÇÃO) */}
        {enviado && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio recebido (simulação). Em breve, essa página estará ligada
            ao sistema real do Classilagos e o seu imóvel aparecerá nas listas,
            vitrines e destaques da plataforma.
          </div>
        )}

        {/* INTRODUÇÃO */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Anuncie seu imóvel em Maricá e Região dos Lagos
          </h1>
          <p className="text-sm text-slate-700 mb-2">
            Preencha os dados abaixo para cadastrar seu imóvel para{" "}
            <strong>venda, aluguel fixo ou temporada</strong>. Este formulário
            foi pensado para uso profissional por corretores, imobiliárias e
            proprietários.
          </p>
          <p className="text-[11px] text-slate-500">
            Neste momento, este formulário é apenas um{" "}
            <strong>modelo de layout</strong>. Os dados preenchidos não são
            salvos em banco de dados ainda. Quando o painel de controle estiver
            pronto, ele será ligado ao sistema real de anúncios do Classilagos.
          </p>
        </section>

        {/* FORMULÁRIO PRINCIPAL */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-6"
        >
          {/* TIPO DE ANÚNCIO / TIPO DE IMÓVEL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo de anúncio
              </label>
              <select
                name="tipoAnuncio"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="venda"
              >
                <option value="venda">Venda</option>
                <option value="aluguel-fixo">Aluguel fixo</option>
                <option value="temporada">Aluguel por temporada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo de imóvel
              </label>
              <select
                name="tipoImovel"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="casa"
              >
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="kitnet">Kitnet / Studio</option>
                <option value="terreno">Terreno / Lote</option>
                <option value="sitio">Sítio / Chácara</option>
                <option value="comercial">Imóvel comercial / Sala</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          {/* CIDADE / BAIRRO */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Cidade
              </label>
              <select
                name="cidade"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="Maricá"
              >
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
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Bairro / região
              </label>
              <input
                name="bairro"
                type="text"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: Itaipuaçu, Centro, Ponta Negra..."
              />
            </div>
          </div>

          {/* TÍTULO / VALOR PRINCIPAL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Título do anúncio
              </label>
              <input
                name="titulo"
                type="text"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: Casa 2 quartos com quintal e garagem"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Valor principal (venda ou aluguel)
              </label>
              <input
                name="valor"
                type="text"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: R$ 450.000,00 ou R$ 2.500,00/mês"
              />
            </div>
          </div>

          {/* CONDOMÍNIO / OUTRAS TAXAS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Condomínio (se houver)
              </label>
              <input
                name="condominio"
                type="text"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: R$ 750,00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Outras taxas / observações
              </label>
              <input
                name="outrasTaxas"
                type="text"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IPTU, seguro, caução, taxa de serviço, etc."
              />
            </div>
          </div>

          {/* DETALHES DO IMÓVEL */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Detalhes do imóvel
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Quartos
                </label>
                <input
                  name="quartos"
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Banheiros
                </label>
                <input
                  name="banheiros"
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Vagas de garagem
                </label>
                <input
                  name="vagas"
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Área construída (m²)
                </label>
                <input
                  name="area"
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="90"
                />
              </div>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Descrição detalhada
            </h2>
            <textarea
              name="descricao"
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva cômodos, acabamento, reformas, sol da manhã/tarde, distância da praia, comércio, escolas, transporte, etc."
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Uma boa descrição aumenta muito o interesse no anúncio. Escreva
              como se estivesse apresentando o imóvel para um cliente pessoalmente.
            </p>
          </div>

          {/* MÍDIA / LINKS */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Fotos, vídeo e mapa
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Fotos do imóvel (orientação)
                </label>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-[11px] text-slate-500">
                  Em breve você poderá enviar as fotos diretamente pelo site.
                  Por enquanto, este campo é apenas informativo. Sugestão:
                  frente, sala, cozinha, quartos, banheiros, área externa,
                  garagem e vista.
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Link de vídeo (YouTube, etc.) – opcional
                  </label>
                  <input
                    name="video"
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Link do mapa (Google Maps) – opcional
                  </label>
                  <input
                    name="mapa"
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DADOS DO ANUNCIANTE */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Dados do anunciante
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Seu nome ou nome da imobiliária
                </label>
                <input
                  name="nomeAnunciante"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex.: João da Silva ou Imobiliária Exemplo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Tipo de anunciante
                </label>
                <select
                  name="tipoAnunciante"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="proprietario"
                >
                  <option value="proprietario">Proprietário</option>
                  <option value="corretor">Corretor / Imobiliária</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  WhatsApp
                </label>
                <input
                  name="whatsapp"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(21) 9 9999-9999"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Preferência de contato
                </label>
                <select
                  name="preferenciaContato"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="whatsapp"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telefone">Telefone</option>
                  <option value="email">E-mail</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Ao enviar seus dados, você declara que as informações do imóvel
              são verdadeiras e que está autorizado a anunciá-lo. O Classilagos
              atua como plataforma de classificados, aproximando anunciantes e
              interessados.
            </p>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Enviar anúncio (simulação)
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}


