"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

const CATEGORIAS_LABELS = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas",
};

export default function FormularioAnuncio() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // tipo de anúncio vindo da URL (?tipo=imoveis, veiculos, etc.)
  const tipo = searchParams.get("tipo") || "imoveis";
  const categoriaLabel = CATEGORIAS_LABELS[tipo] || "Anúncio";

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // campos essenciais (batendo com os NOT NULL da tabela)
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [contato, setContato] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // carrega usuário logado
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao buscar usuário:", error.message);
      }
      setUser(data?.user ?? null);
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Você precisa estar logado para publicar um anúncio.");
      return;
    }

    // valida os campos que são NOT NULL na tabela
    if (!titulo || !descricao || !cidade || !contato) {
      setErrorMsg(
        "Preencha Título, Descrição, Cidade e Contato. Esses campos são obrigatórios."
      );
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("anuncios").insert({
        // nome da coluna de usuário conforme o SQL que você mostrou:
        user_id_uuid: user.id,

        categoria: tipo, // imoveis, veiculos, etc.
        titulo,
        descricao,
        cidade,
        contato,
        video_url: videoUrl || null,

        // se essas colunas existirem, beleza. Se não existirem, o Postgres ignora.
        status: "ativo",
        destaque: false,
      });

      if (error) {
        console.error("ERRO SUPABASE:", error);
        // Mostra o erro real pra gente ver o que está pegando
        setErrorMsg(
          error.message ||
            error.details ||
            error.hint ||
            "Não foi possível salvar seu anúncio. Tente novamente."
        );
        setSaving(false);
        return;
      }

      // deu certo: manda para "meus anúncios" (depois podemos mudar esse destino)
      router.push("/painel/meus-anuncios");
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
      setSaving(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 text-sm">
          Carregando informações do usuário…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-lg font-semibold text-gray-900">
            Você precisa estar logado
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Para criar um anúncio no Classilagos, faça login ou crie sua conta
            gratuitamente.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ir para login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Criar anúncio em {categoriaLabel}
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Preencha os dados do seu anúncio. Depois você poderá gerenciar tudo no
        seu painel.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Título */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Casa 2 quartos com varanda em Maricá"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Descrição do anúncio *
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={5}
            placeholder="Descreva o imóvel, localização, características, condições de pagamento etc."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Cidade */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Cidade / Região *
          </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: Maricá, Cabo Frio, Búzios…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Contato */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Contato (telefone / WhatsApp / e-mail) *
          </label>
          <input
            type="text"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            placeholder="Ex: (21) 9XXXX-XXXX / seuemail@dominio.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            Esse texto será exibido no anúncio como forma de contato.
          </p>
        </div>

        {/* Link do vídeo no YouTube (opcional) */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Link do vídeo no YouTube (opcional)
          </label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Mensagem de erro */}
        {errorMsg && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push("/painel")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Voltar para o painel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Publicando anúncio..." : "Confirmar e publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}
