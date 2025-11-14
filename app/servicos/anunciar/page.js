"use client";

import { useState } from "react";

export default function AnunciarServicoPage() {
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
          Anunciar serviço / profissional
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Divulgue seu serviço ou sua profissão no Classilagos. Esta é uma
          simulação para definirmos o modelo de formulário que, em breve, será
          salvo em banco de dados e exibido nas listas e destaques.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Serviço enviado (simulação). Em breve vamos salvar esses dados de
            verdade e exibir sua oferta na área de Serviços.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-2xl border border-slate-200 px-4 py-6 md:px-6 md:py-7"
        >
          {/* TIPO DE SERVIÇO / ÁREA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Área de atuação
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="area"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione a área
                </option>
                <option>Marido de aluguel</option>
                <option>Eletricista</option>
                <option>Encanador / Desentupimento</option>
                <option>Pintor / Pedreiro / Reformas</option>
                <option>Diarista / Faxina</option>
                <option>Beleza (cabelereiro, manicure, estética)</option>
                <option>Saúde (dentista, fisio, psicólogo, etc.)</option>
                <option>Aulas particulares / Personal trainer</option>
                <option>Turismo / Passeios / Guias</option>
                <option>Tecnologia / Informática</option>
                <option>Consultorias / Profissionais liberais</option>
                <option>Outros serviços</option>
              </select>

              <input
                name="titulo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Título (ex: Marido de aluguel em Maricá)"
              />

              <input
                name="preco"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Valor (diária, hora ou sob consulta)"
              />
            </div>
          </section>

          {/* MODELO DE ATENDIMENTO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Modelo de atendimento
            </h2>
            <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="atendimentoDomicilio"
                  value="domicilio"
                />
                Atendo a domicílio
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="atendimentoLoja" value="loja" />
                Loja / consultório / escritório
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="atendimentoOnline" value="online" />
                Atendo também online
              </label>
            </div>
          </section>

          {/* LOCALIZAÇÃO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Localização principal
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                name="cidade"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Cidade onde atua
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
              Descrição do serviço
            </h2>
            <textarea
              name="descricao"
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Explique o que você faz, sua experiência, diferenciais, formas de atendimento, garantia, formas de pagamento, etc."
            />
          </section>

          {/* MÍDIA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Fotos, logo e redes sociais
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Fotos do serviço, local ou portfólio
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full text-xs text-slate-700"
                />
                <p className="text-[11px] text-slate-500">
                  Envie imagens ilustrativas (apenas simulação por enquanto).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Site ou redes sociais (opcional)
                </label>
                <input
                  name="linkDivulgacao"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="Instagram, Facebook, site, Google Maps..."
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
                name="nomeProfissional"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Seu nome ou nome da empresa"
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

            <label className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
              <input type="checkbox" name="atendeRegiao" />
              Atendo mais de uma cidade na Região dos Lagos.
            </label>
          </section>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enviar serviço (simulação)
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
