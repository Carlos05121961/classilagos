"use client";

import { useState } from "react";

export default function AnunciarLagoListas() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Anunciar no LagoListas
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Cadastre sua loja, comércio, empresa, serviço ou profissional liberal.
          Este formulário ainda é uma simulação — serve para definirmos o modelo 
          ideal de cadastro antes de integrar ao banco de dados real.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Anúncio enviado (simulação). Em breve será exibido no LagoListas e nos destaques do portal.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-2xl border border-slate-200 px-4 py-6 md:px-6 md:py-7"
        >

          {/* TIPO DE NEGÓCIO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Tipo de negócio
            </h2>

            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="categoria"
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
              >
                <option value="" disabled>Categorias</option>
                <option>Mercados / Hortifruti</option>
                <option>Petshop</option>
                <option>Oficina / Auto Center</option>
                <option>Beleza (salão, estética, barbearia)</option>
                <option>Moda / Lojas de roupas</option>
                <option>Restaurantes / Lanchonetes</option>
                <option>Farmácia / Laboratório</option>
                <option>Construção / Material / Marcenaria</option>
                <option>Eletricista / Encanador / Serviços</option>
                <option>Clínicas (geral)</option>
                <option>Advogados / Contadores</option>
                <option>Educação / Cursos</option>
                <option>Informática / Tecnologia</option>
                <option>Móveis / Decoração</option>
                <option>Transporte / Fretes</option>
                <option>Outros negócios</option>
              </select>

              <input
                name="nome"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Nome da empresa / profissional"
              />

              <input
                name="slogan"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Frase de destaque (opcional)"
              />
            </div>
          </section>

          {/* CIDADES */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Localização
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <select
                name="cidade"
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
              >
                <option value="" disabled>Cidade</option>
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
                placeholder="Bairro"
              />
            </div>

            <input
              name="endereco"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Endereço completo"
            />
          </section>

          {/* DESCRIÇÃO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Descrição</h2>
            <textarea
              name="descricao"
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Fale sobre sua empresa, serviços, diferenciais, experiências, histórico, horários, etc."
            />
          </section>

          {/* MÍDIA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Fotos, redes sociais e links
            </h2>

            <div className="grid gap-3 md:grid-cols-2">

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Fotos (máx. 10)
                </label>
                <input type="file" multiple className="w-full text-xs text-slate-700" />
              </div>

              <div className="space-y-2">
                <input
                  name="instagram"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="Instagram / Facebook / Site"
                />
                <input
                  name="mapa"
                  type="text"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  placeholder="Link Google Maps"
                />
              </div>

            </div>
          </section>

          {/* CONTATO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Contato</h2>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="responsavel"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Responsável"
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
                placeholder="E-mail"
              />
            </div>
          </section>

          {/* BOTÃO */}
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
