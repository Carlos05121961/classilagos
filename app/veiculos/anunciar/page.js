"use client";

import { useState } from "react";

export default function AnunciarVeiculoPage() {
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
          Anunciar um veículo
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Preencha os dados do seu veículo para criar um anúncio no Classilagos.
          Por enquanto é uma simulação — estamos definindo o modelo de
          formulário; depois vamos salvar tudo em banco de dados e exibir na
          lista de Veículos e nos destaques.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve vamos salvar esses dados de
            verdade e mostrar o anúncio para os usuários.
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
                Aluguel
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoAnuncio" value="troca" />
                Troca / Negocia
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
                name="tipoVeiculo"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Tipo de veículo
                </option>
                <option>Carro</option>
                <option>Moto</option>
                <option>Caminhão</option>
                <option>Utilitário / Pick-up</option>
                <option>Van / Micro-ônibus</option>
                <option>Outros</option>
              </select>

              <input
                name="titulo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Título (ex: Onix LT 1.0 2019 completo)"
              />

              <input
                name="valor"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Valor (ex: R$ 75.000)"
              />
            </div>
          </section>

          {/* DETALHES */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Detalhes do veículo
            </h2>
            <div className="grid gap-3 md:grid-cols-4">
              <input
                name="marca"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Marca (ex: Chevrolet)"
              />
              <input
                name="modelo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Modelo (ex: Onix LT)"
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
                name="km"
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="KM (ex: 65.000)"
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
                placeholder="Bairro / região"
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
              placeholder="Descreva o estado do veículo, opcionais e condições de negócio."
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
                placeholder="Seu nome ou nome da loja"
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
