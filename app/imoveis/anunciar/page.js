"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AnunciarImovelPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* BANNER FIXO NO TOPO */}
      <div className="w-full flex justify-center bg-slate-100 border-b">
        <div className="w-full max-w-4xl px-4 py-3">
          <div className="relative w-full h-[110px] sm:h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-02.png"
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

        {/* Título e introdução */}
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
            breve, os dados poderão ser enviados e publicados automaticamente no
            site.
          </p>
        </section>

        {/* Mensagem de envio (simulação) */}
        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve, os dados serão salvos e o
            imóvel aparecerá nas listas e nos destaques do Classilagos.
          </div>
        )}

        {/* FORMULÁRIO */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-8">
          <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
            {/* Tipo de anúncio + tipo de imóvel */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Tipo de anúncio
                </label>
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Venda</option>
                  <option>Aluguel fixo</option>
                  <option>Temporada</option>
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
                  <option>Sítio / Chácara</option>
                  <option>Imóvel comercial</option>
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
                  placeholder="Ex.: Itaipuaçu, Centro, Ponta Negra..."
                />
              </div>
            </div>

            {/* Título e descrição curta */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Título do anúncio
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex.: Casa 2 quartos com quintal em Maricá"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Descrição detalhada
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva cômodos, estado do imóvel, reformas, pontos fortes, proximidade de praia/comércio, etc."
                />
              </div>
            </div>

            {/* Detalhes do imóvel */}
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Detalhes do imóvel
              </h2>
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
            </div>

            {/* Valores */}
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Valores
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Valor principal (venda ou aluguel)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex.: 450.000,00 ou 1.800,00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Condomínio (se houver)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex.: 550,00"
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
                    Outras taxas
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Taxa de serviço, caução, seguro, etc."
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Observações sobre valores
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex.: aceita financiamento, estuda proposta..."
                  />
                </div>
              </div>
            </div>

            {/* Mídia (informativo) */}
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Fotos, vídeo e mapa
              </h2>
              <p className="text-[11px] text-slate-500 mb-2">
                Em breve você poderá enviar fotos, vídeo e localização
                diretamente pelo site. Por enquanto, considere estes campos como
                orientações:
              </p>
              <ul className="list-disc pl-5 text-[11px] text-slate-500 space-y-1">
                <li>
                  Prepare de 6 a 10 fotos em boa qualidade (frente, sala,
                  quartos, cozinha, banheiro, quintal).
                </li>
                <li>
                  Se tiver um vídeo curto (tour do imóvel), você poderá informar
                  o link (YouTube, etc.) quando o sistema estiver ativo.
                </li>
                <li>
                  Use o Google Maps para gerar um link aproximado da localização
                  (sem expor o endereço exato, se não quiser).
                </li>
              </ul>
            </div>

            {/* Dados de contato */}
            <div className="border-t border-slate-200 pt-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Dados do anunciante
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-3">
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

              <div className="grid md:grid-cols-3 gap-4 mb-3">
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

              <p className="text-[11px] text-slate-500 mb-3">
                Ao enviar seus dados, você declara que as informações do imóvel
                são verdadeiras e que está autorizado a anunciá-lo. O
                Classilagos atua apenas como plataforma de classificados.
              </p>
            </div>

            {/* Botão enviar (simulação) */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Enviar anúncio (simulação)
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}


