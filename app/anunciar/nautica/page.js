"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

export default function AnunciarNauticaPage() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [preco, setPreco] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [bairro, setBairro] = useState("");
  const [imagensInput, setImagensInput] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);
    setErro(null);

    // Transforma o campo de URLs em array
    const imagensArray = imagensInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const { error } = await supabase.from("anuncios").insert([
      {
        titulo,
        descricao,
        categoria: "nautica",
        subcategoria_nautica: subcategoria || null,
        finalidade_nautica: finalidade || null,
        preco: preco || null,
        cidade,
        bairro: bairro || null,
        imagens: imagensArray.length > 0 ? imagensArray : null,
        nome_contato: nomeContato || null,
        whatsapp: whatsapp || null,
        status: "ativo",
      },
    ]);

    if (error) {
      console.error("Erro ao salvar anúncio de náutica:", error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
    } else {
      setMensagem("Anúncio de náutica cadastrado com sucesso!");
      // Limpa o formulário
      setTitulo("");
      setDescricao("");
      setSubcategoria("");
      setFinalidade("");
      setPreco("");
      setCidade("Maricá");
      setBairro("");
      setImagensInput("");
      setNomeContato("");
      setWhatsapp("");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-slate-100">
      {/* Faixa topo / breadcrumb simples */}
      <section className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
          <div className="text-slate-600">
            <span className="text-slate-400">Você está em:</span>{" "}
            <Link href="/" className="text-sky-700 hover:underline">
              Classilagos
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <Link href="/nautica" className="text-sky-700 hover:underline">
              Náutica
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-800">
              Anunciar na Náutica
            </span>
          </div>
          <div className="text-slate-500">
            Anúncios de náutica em toda a Região dos Lagos.
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-[3fr,2fr] items-start">
          {/* Card do formulário */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-5 md:p-6">
            <header className="mb-5">
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                Anunciar em <span className="text-sky-700">Náutica</span>
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-600">
                Cadastre sua embarcação, vaga em marina, jetski ou serviço
                náutico. Durante a fase de lançamento, os anúncios são{" "}
                <span className="font-semibold text-emerald-700">
                  totalmente gratuitos
                </span>
                .
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
              {/* Título */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">
                  Título do anúncio *
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Lancha 30 pés FS - motor 250hp - pronta para passeio"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">
                  Descrição detalhada *
                </label>
                <textarea
                  required
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva a embarcação, ano, marca, motorização, equipamentos, estado geral, condições de uso, etc."
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-500">
                  Quanto mais detalhes você informar, mais confiança o anúncio
                  passa para quem está procurando.
                </p>
              </div>

              {/* Linha: subcategoria + finalidade */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">
                    Tipo / subcategoria
                  </label>
                  <select
                    value={subcategoria}
                    onChange={(e) => setSubcategoria(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Selecione</option>
                    <option value="Lancha">Lancha</option>
                    <option value="Veleiro">Veleiro</option>
                    <option value="Jetski">Jetski</option>
                    <option value="Barco de pesca">Barco de pesca</option>
                    <option value="Stand-up / caiaque">Stand-up / Caiaque</option>
                    <option value="Vaga em marina">Vaga em marina</option>
                    <option value="Serviços náuticos">Serviços náuticos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">
                    Finalidade
                  </label>
                  <select
                    value={finalidade}
                    onChange={(e) => setFinalidade(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Selecione</option>
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Passeio / turismo">Passeio / turismo</option>
                    <option value="Serviço">Serviço</option>
                  </select>
                </div>
              </div>

              {/* Preço */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">Preço</label>
                <input
                  type="text"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="Ex.: R$ 250.000,00 ou a combinar"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-500">
                  Se preferir, pode informar “a combinar” na descrição.
                </p>
              </div>

              {/* Cidade / Bairro */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">
                    Cidade *
                  </label>
                  <select
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
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

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">
                    Bairro / local de saída
                  </label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex.: Centro, Ponta da Areia, Marina, Porto Veleiro..."
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Imagens */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700">
                  Fotos da embarcação (URLs)
                </label>
                <textarea
                  rows={3}
                  value={imagensInput}
                  onChange={(e) => setImagensInput(e.target.value)}
                  placeholder={
                    "Cole aqui links de fotos (uma por linha).\nEx.: https://meusite.com/foto1.jpg"
                  }
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-500">
                  Em breve você poderá enviar as fotos diretamente pelo
                  Classilagos. Por enquanto, use links (URLs) das imagens.
                </p>
              </div>

              {/* Contato */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">
                    Nome para contato
                  </label>
                  <input
                    type="text"
                    value={nomeContato}
                    onChange={(e) => setNomeContato(e.target.value)}
                    placeholder="Seu nome ou nome da empresa"
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(21) 99999-9999"
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Mensagens de status */}
              {erro && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {erro}
                </p>
              )}
              {mensagem && (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  {mensagem}
                </p>
              )}

              {/* Botão */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando anúncio..." : "Publicar anúncio em Náutica"}
                </button>
              </div>
            </form>
          </div>

          {/* Coluna lateral com informação / banner */}
          <aside className="space-y-4">
            <div className="bg-sky-900 text-sky-50 rounded-3xl shadow-md border border-sky-800 p-4 text-xs md:text-sm">
              <h2 className="text-sm md:text-base font-semibold mb-2">
                Dicas para um bom anúncio
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Use um título claro com modelo, tamanho e destaque.</li>
                <li>Informe ano, motorização, horas de uso e equipamentos.</li>
                <li>Explique se é venda, aluguel, passeio ou serviço.</li>
                <li>Coloque fotos nítidas da embarcação, por dentro e por fora.</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow border border-slate-200 p-4 flex flex-col gap-3">
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src="/nautica/lancha-01.jpg"
                  alt="Náutica na Classilagos"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-slate-700">
                Seu anúncio de náutica aparecerá na página{" "}
                <Link href="/nautica" className="text-sky-700 font-semibold hover:underline">
                  Classilagos – Náutica
                </Link>
                , junto com outros destaques da região.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
