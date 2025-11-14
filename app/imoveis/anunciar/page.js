"use client";

import { useState } from "react";

export default function AnunciarImovelPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    // depois aqui a gente integra com backend / banco de dados
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Anunciar um imóvel
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Preencha os dados do seu imóvel para criar um anúncio no Classilagos. 
          Por enquanto é uma simulação de cadastro (sem salvar em banco de dados),
          apenas para definirmos o modelo do formulário e do anúncio.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve vamos salvar esses dados de verdade
            e exibir o anúncio nas listas e nos destaques da página inicial.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl border border-slate-200 px-4 py-6 md:px-6 md:py-7">

          {/* TIPO DE ANÚNCIO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Tipo de anúncio
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input type="radio" name="tipoAnuncio" value="venda" defaultChecked />
                Venda
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input type="radio" name="tipoAnuncio" value="aluguel" />
                Aluguel fixo
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input type="radio" name="tipoAnuncio" value="temporada" />
                Temporada
              </label>
            </div>
          </section>

          {/* TIPO DE IMÓVEL */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Tipo de imóvel
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="tipoImovel"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione o tipo
                </option>
                <option>Casa</option>
                <option>Apartamento</option>
                <option>Kitnet / Studio</option>
                <option>Terreno</option>
                <option>Sítio / Chácara</option>
                <option>Imóvel comercial</option>
              </select>

              <input
                name="titulo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Título do anúncio (ex: Casa 3 quartos próxima à praia)"
              />

              <input
                name="valor"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Valor (ex: R$ 850.000 ou R$ 2.500/mês)"
              />
            </div>
          </section>

          {/* LOCALIZAÇÃO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Localização
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                name="cidade"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Cidade
                </option>
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

              <input
                name="bairro"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Bairro / região (ex: Itaipuaçu, Ponta Negra...)"
              />
            </div>

            <input
              name="endereco"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Endereço (opcional - pode ser aproximado)"
            />
          </section>

          {/* DETALHES DO IMÓVEL */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Detalhes do imóvel
            </h2>
            <div className="grid gap-3 md:grid-cols-4">
              <input
                name="quartos"
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Quartos"
              />
              <input
                name="banheiros"
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Banheiros"
              />
              <input
                name="vagas"
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Vagas de garagem"
              />
              <input
                name="area"
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Área (m²)"
              />
            </div>
          </section>

          {/* DESCRIÇÃO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Descrição do anúncio
            </h2>
            <textarea
              name="descricao"
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Descreva os principais pontos do imóvel, pontos fortes, distância da praia, comércio, etc."
            />
          </section>

          {/* MÍDIA: FOTOS / VÍDEO / MAPA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Fotos, vídeo e mapa
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Fotos do imóvel
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full text-xs text-slate-700"
                />
                <p className="text-[11px] text-slate-500">
                  Envie de 3 a 10 fotos em boa resolução (apenas simulação, ainda não salvamos).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Link de vídeo (YouTube, etc.)
                </label>
                <input
                  name="video"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="https://youtube.com/..."
                />

                <label className="text-xs font-medium text-slate-700 mt-3">
                  Link do mapa (Google Maps)
                </label>
                <input
                  name="mapa"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </section>

          {/* CONTATO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Dados de contato
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="nomeAnunciante"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Seu nome ou nome da imobiliária"
              />
              <input
                name="telefone"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Telefone / WhatsApp"
              />
              <input
                name="email"
                type="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="E-mail para contato"
              />
            </div>
          </section>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enviar anúncio (simulação)
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

