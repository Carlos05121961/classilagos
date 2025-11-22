"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";
import AuthGuard from "../../components/AuthGuard";

export default function FormularioAnuncioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaFromUrl = searchParams.get("tipo") || "geral";

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [contato, setContato] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    // Garante que o usuário está logado
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const user = session.user;

    // Tenta salvar no Supabase (quando o serviço estiver online)
    const { error: insertError } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: categoriaFromUrl,
      titulo,
      descricao,
      cidade,
      contato,
    });

    if (insertError) {
      console.error(insertError);
      setErro(
        "Não foi possível salvar seu anúncio agora. Tente novamente em alguns minutos."
      );
      setLoading(false);
      return;
    }

    // Se deu tudo certo: limpa o formulário e manda para a página de resumo
    setTitulo("");
    setDescricao("");
    setCidade("");
    setContato("");
    setLoading(false);

    router.push("/anunciar/resumo");
  }

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Criar anúncio</h1>
        <p className="text-sm text-slate-600 mb-6">
          Você está criando um anúncio na categoria{" "}
          <span className="font-semibold">{categoriaFromUrl}</span>. Preencha os
          dados abaixo e publique seu anúncio grátis no Classilagos.
        </p>

        {erro && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Casa 2 quartos em Ponta Negra"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={5}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva os detalhes do imóvel, veículo, serviço ou produto..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Maricá, Cabo Frio..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contato (WhatsApp/Telefone)
              </label>
              <input
                type="text"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(21) 9 9999-9999"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Enviando anúncio..." : "Publicar anúncio grátis"}
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}
