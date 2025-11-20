"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const mapaRotuloCategoria = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas (Guia Comercial)",
};

export default function FormularioAnuncioPage() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "imoveis";
  const categoriaLabel = mapaRotuloCategoria[tipo] || "Imóveis";

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [contato, setContato] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [valor, setValor] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // AQUI futuramente vamos salvar no banco (Supabase / PostgreSQL)
    console.log("Novo anúncio (DEMO):", {
      categoria: tipo,
      titulo,
      descricao,
      cidade,
      bairro,
      contato,
      whatsapp,
      valor,
    });

    alert(
      "Anúncio enviado em modo DEMO.\nNa próxima fase isso será salvo no banco de dados."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* VOLTAR */}
        <Link
          href="/anunciar"
          className="text-xs text-blue-600 hover:underline"
        >
          ← Voltar para escolher categoria
        </Link>

        {/* TÍTULO */}
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Novo anúncio – {categoriaLabel}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Preencha os dados do seu anúncio. Nesta fase tudo é DEMO, mas o fluxo
          já está pronto para futuramente salvar no banco de dados.
        </p>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm px-5 py-6 space-y-4"
        >
          {/* Título */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Título do anúncio
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Apartamento 2 quartos em Maricá, frente lagoa"
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Descrição
            </label>
            <textarea
              required
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva bem o seu anúncio: características, localização, condições, diferenciais..."
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cidade / Bairro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Cidade
              </label>
              <select
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
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

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Bairro / Região
              </label>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex.: Centro, Itaipuaçu, Jaconé..."
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contatos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Telefone / Contato
              </label>
              <input
                type="text"
                required
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                placeholder="Ex.: (21) 99999-9999"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                WhatsApp
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Se for o mesmo telefone, pode repetir."
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Valor (opcional) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Valor / Preço (opcional)
            </label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex.: R$ 1.200 / mês, a combinar, consulte..."
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BOTÕES */}
          <div className="flex justify-between items-center pt-2">
            <Link
              href="/painel"
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ← Voltar ao painel
            </Link>

            <button
              type="submit"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enviar anúncio (DEMO)
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

