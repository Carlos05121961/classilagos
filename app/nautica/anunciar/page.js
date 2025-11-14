"use client";

import { useState } from "react";

export default function AnunciarNauticaPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    // depois integramos com backend / banco de dados
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Anunciar embarcação / item náutico
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Preencha os dados da sua lancha, barco, veleiro, jet ski ou outro item
          náutico para criar um anúncio no Classilagos. Por enquanto é uma
          simulação — estamos desenhando o modelo de formulário.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve vamos salvar esses dados de
            verdade e exibir na lista de Náutica e nos destaques.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-2xl border border-slate-200 px-4 py-6 md:px-6 md:py-7"
        >
          {/* TIPO DE ANÚNCIO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Tipo de anúncio
            </h2>
            <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoAnuncio"
                  value="venda"
                  defaultChecked
                />
                Venda
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoAnuncio" value="aluguel" />
                Charter / aluguel
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoAnuncio" value="vaga-marina" />
                Vaga em marina / píer
              </label>
            </div>
          </section>

          {/* DADOS PRINCIPAIS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Dados principais
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="tipoEmbarcacao"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Tipo de embarcação / item
                </option>
                <option>Lancha</option>
                <option>Veleiro</option>
                <option>Barco de pesca</option>
                <option>Jet ski</option>
                <option>Bote inflável</option>
                <option>Vaga em marina</option>
                <option>Equipamentos náuticos</option>
              </select>

              <input
                name="titulo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Título (ex: Lancha 32 pés em Marina de Búzios)"
              />

              <input
                name="valor"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Valor (ex: R$ 450.000 ou diária R$ ...)"
              />
            </div>
          </section>

          {/* DETALHES TÉCNICOS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Detalhes técnicos
            </h2>
            <div className="grid gap-3 md:grid-cols-4">
              <input
                name="marca"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Fabricante / marca"
              />
              <input
                name="modelo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Modelo"
              />
              <input
                name="ano"
                type="number"
                min="1900"
                max="2100"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Ano"
              />
              <input
                name="pes"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Tamanho (pés)"
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
                  Cidade / base
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
                name="marina"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Marina / píer / bairro"
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
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Descreva a embarcação, conservação, opcionais, número de pessoas, uso (passeio, pesca, charter) etc."
            />
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
                placeholder="Seu nome ou nome da empresa náutica"
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
