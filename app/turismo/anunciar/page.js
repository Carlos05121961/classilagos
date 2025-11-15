"use client";

import { useState } from "react";

export default function AnunciarTurismoPage() {
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
          Anunciar no Turismo
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Divulgue sua pousada, hotel, hostel, casa de temporada, bar, restaurante,
          quiosque, passeio de barco ou agência de turismo no Classilagos. Esta
          página ainda é uma simulação de formulário, para definirmos o modelo
          final de cadastro.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve vamos salvar esses dados de
            verdade e exibir sua empresa/serviço na área de Turismo e nos destaques.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-2xl border border-slate-200 px-4 py-6 md:px-6 md:py-7"
        >
          {/* TIPO DE NEGÓCIO / CATEGORIA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Categoria de turismo
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="categoriaTurismo"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione a categoria
                </option>
                <option>Pousada</option>
                <option>Hotel</option>
                <option>Hostel</option>
                <option>Bar</option>
                <option>Restaurante</option>
                <option>Quiosque de praia</option>
                <option>Passeio de barco</option>
                <option>Passeio terrestre / city tour</option>
                <option>Agência de turismo</option>
                <option>Experiências / turismo de aventura</option>
                <option>Outros serviços de turismo</option>
              </select>

              <input
                name="nomeLocal"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Nome do local ou serviço"
              />

              <input
                name="slogan"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Frase de destaque (opcional)"
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
                placeholder="Bairro / praia / região"
              />
            </div>

            <input
              name="endereco"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Endereço (rua, número, complemento)"
            />
          </section>

          {/* INFORMAÇÕES DO LOCAL / SERVIÇO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Informações principais
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="capacidade"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Capacidade (ex: 20 quartos, 80 lugares, 10 mesas)"
              />
              <input
                name="faixaPreco"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Faixa de preço (ex: diária a partir de R$..., prato médio R$...)"
              />
              <select
                name="funcionamento"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Funcionamento
                </option>
                <option>Alta e baixa temporada</option>
                <option>O ano inteiro</option>
                <option>Somente finais de semana</option>
                <option>Somente temporada</option>
              </select>
            </div>
          </section>

          {/* DESCRIÇÃO DO LOCAL / SERVIÇO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Descrição do local / serviço
            </h2>
            <textarea
              name="descricao"
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Descreva o ambiente, estrutura (quartos, salão, área externa, piscina, deck, vista), tipo de cozinha ou passeio, diferenciais, público-alvo, etc."
            />
          </section>

          {/* MÍDIA, SITE E REDES SOCIAIS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Fotos, vídeo e links
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Fotos do local ou passeio
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full text-xs text-slate-700"
                />
                <p className="text-[11px] text-slate-500">
                  Envie fotos em boa resolução (apenas simulação por enquanto).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Site, redes sociais ou link de reservas
                </label>
                <input
                  name="links"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="Instagram, Facebook, site próprio, Booking, Airbnb, Google Maps..."
                />
                <input
                  name="video"
                  type="text"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="Link de vídeo (YouTube, Reels, etc.) – opcional"
                />
              </div>
            </div>
          </section>

          {/* CONTATO / RESERVAS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Contato e reservas
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="responsavel"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Nome do responsável"
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
                placeholder="E-mail para contato / reservas"
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
