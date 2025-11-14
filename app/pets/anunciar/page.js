"use client";

import { useState } from "react";

export default function AnunciarPetPage() {
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
          Anunciar pet / animal
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Preencha os dados do pet ou animal (cães, gatos, aves, roedores, coelhos,
          cavalos, cabras, ovelhas, gado bovino) para criar um anúncio no Classilagos.
          Por enquanto é uma simulação — estamos definindo o modelo do formulário.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve vamos salvar esses dados de
            verdade e exibir na lista de Pets e nos destaques.
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
            <div className="grid gap-3 md:grid-cols-4 text-xs text-slate-700">
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
                <input type="radio" name="tipoAnuncio" value="doacao" />
                Doação / adoção
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoAnuncio" value="achados-perdidos" />
                Achados &amp; Perdidos
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoAnuncio" value="servicos" />
                Serviços (banho, tosa, etc.)
              </label>
            </div>
          </section>

          {/* ESPÉCIE / CATEGORIA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Espécie / categoria
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="categoriaPet"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione a categoria
                </option>
                <option>Cães</option>
                <option>Gatos</option>
                <option>Aves domésticas</option>
                <option>Roedores (hamster, chinchila, porquinho-da-índia)</option>
                <option>Coelhos</option>
                <option>Cavalos / Equinos</option>
                <option>Cabras / Ovelhas</option>
                <option>Gado bovino</option>
              </select>

              <input
                name="raca"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Raça (ex: SRD, Poodle, Siamês, Holandês, Nelore...)"
              />

              <input
                name="titulo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Título do anúncio (ex: Filhotes de cão para adoção)"
              />
            </div>
          </section>

          {/* VALOR / IDADE / SEXO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Informações básicas
            </h2>
            <div className="grid gap-3 md:grid-cols-4">
              <input
                name="valor"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Valor (ou deixe em branco para doação)"
              />
              <input
                name="idade"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Idade (ex: 3 meses, 2 anos)"
              />
              <select
                name="sexo"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Sexo
                </option>
                <option>Macho</option>
                <option>Fêmea</option>
                <option>Não informado</option>
              </select>
              <select
                name="porte"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Porte (para cães/gatos)
                </option>
                <option>Mini / Toy</option>
                <option>Pequeno</option>
                <option>Médio</option>
                <option>Grande</option>
                <option>Gigante</option>
              </select>
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
              placeholder="Descreva temperamento, saúde, vacinas, vermifugação, histórico, motivo da venda/doação, condições especiais, etc."
            />
          </section>

          {/* MÍDIA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Fotos e vídeo
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Fotos do pet / animal
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full text-xs text-slate-700"
                />
                <p className="text-[11px] text-slate-500">
                  Envie fotos nítidas (apenas simulação por enquanto, ainda não
                  salvamos).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Link de vídeo (opcional)
                </label>
                <input
                  name="video"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="https://youtube.com/..."
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
                placeholder="Seu nome ou nome do criador / protetor"
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
