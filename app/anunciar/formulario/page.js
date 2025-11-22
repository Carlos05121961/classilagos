"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function AnunciarFormularioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // categoria vem da URL: ?tipo=imoveis / veiculos / nautica...
  const tipoDaUrl = searchParams.get("tipo") || "imoveis";
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [contato, setContato] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // pega usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErro("Você precisa estar logado para anunciar.");
        setCarregando(false);
        return;
      }

      // grava no Supabase
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: tipoDaUrl, // exemplo: "imoveis"
        titulo,
        descricao,
        cidade,
        contato,
      });

      if (insertError) {
        console.error(insertError);
        setErro("Não foi possível salvar o anúncio. Tente novamente.");
        setCarregando(false);
        return;
      }

      // deu tudo certo: manda para o painel
      router.push("/painel/meus-anuncios");
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro inesperado.");
      setCarregando(false);
    }
  }

  // Texto bonitinho da categoria para mostrar no título
  const nomeCategoria =
    tipoDaUrl === "imoveis"
      ? "Imóveis"
      : tipoDaUrl === "veiculos"
      ? "Veículos"
      : tipoDaUrl === "nautica"
      ? "Náutica"
      : tipoDaUrl === "pets"
      ? "Pets"
      : "Classilagos";

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">
        Criar anúncio – {nomeCategoria}
      </h1>
      <p className="text-slate-600 mb-8">
        Preencha os dados do seu anúncio. Em poucos minutos ele estará visível
        no Classilagos.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 space-y-6 border border-slate-100"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Título do anúncio
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Casa 2 qts com varanda em Maricá"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 h-32 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o imóvel, bairro, características, valor, condições..."
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Maricá"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: (21) 9 9999-9999"
              required
            />
          </div>
        </div>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {erro}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={carregando}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {carregando ? "Publicando..." : "Confirmar e publicar"}
          </button>
        </div>
      </form>

      <p className="text-xs text-slate-400 mt-4">
        Em breve vamos adicionar envio de fotos e mais detalhes específicos para
        cada tipo de anúncio (imóveis, veículos, náutica, etc.).
      </p>
    </main>
  );
}
