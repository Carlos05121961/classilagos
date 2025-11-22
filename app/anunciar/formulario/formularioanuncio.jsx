"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioAnuncio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "imoveis";

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [contato, setContato] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [imagens, setImagens] = useState([]); // arquivos selecionados
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1) Buscar usuário logado
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImagens(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Você precisa estar logado para publicar um anúncio.");
      return;
    }

    if (!titulo || !descricao || !cidade || !contato) {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);

    try {
      // 2) Upload das imagens para o bucket "anuncios"
      const uploadedUrls = [];

      for (const file of imagens) {
        const fileExt = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(path, file);

        if (uploadError) {
          console.error(uploadError);
          throw new Error("Erro ao enviar uma das fotos.");
        }

        const { data: publicData } = supabase.storage
          .from("anuncios")
          .getPublicUrl(uploadData.path);

        if (publicData?.publicUrl) {
          uploadedUrls.push(publicData.publicUrl);
        }
      }

      // 3) Inserir anúncio na tabela
      const { data, error: insertError } = await supabase
        .from("anuncios")
        .insert({
          user_id: user.id,
          categoria: tipo,
          titulo,
          descricao,
          cidade,
          contato,
          imagens: uploadedUrls.length > 0 ? uploadedUrls : null,
          video_url: videoUrl || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error(insertError);
        throw new Error("Erro ao salvar o anúncio.");
      }

      // 4) Redirecionar para Meus anúncios
      router.push("/painel/meus-anuncios");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message || "Ocorreu um erro ao enviar o anúncio. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Faça login para anunciar</h1>
        <p className="mb-4">
          Você precisa estar logado para criar um anúncio no Classilagos.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Ir para login
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Criar anúncio</h1>
      <p className="text-slate-600 mb-6">
        Categoria: <span className="font-semibold uppercase">{tipo}</span>
      </p>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Título do anúncio *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Casa 2 quartos com varanda em Maricá"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descrição detalhada *
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o imóvel, localização, condições, etc."
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cidade / Região *
          </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Maricá, Cabo Frio, Búzios..."
          />
        </div>

        {/* Contato */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Telefone / WhatsApp *
          </label>
          <input
            type="text"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(21) 99999-9999"
          />
        </div>

        {/* Upload de fotos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fotos do imóvel
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="block w-full text-sm text-slate-700"
          />
          <p className="mt-1 text-xs text-slate-500">
            Você pode selecionar várias fotos (JPEG, PNG...). Tamanho máximo
            recomendado por foto: ~5 MB.
          </p>
          {imagens.length > 0 && (
            <p className="mt-1 text-xs text-slate-600">
              {imagens.length} foto(s) selecionada(s).
            </p>
          )}
        </div>

        {/* Link de vídeo (YouTube) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Link de vídeo (YouTube, opcional)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="mt-1 text-xs text-slate-500">
            Por enquanto usaremos apenas link do YouTube. Depois podemos ativar
            upload direto de vídeos do celular (10–20 MB).
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Publicando..." : "Confirmar e publicar anúncio"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/painel")}
            className="text-sm text-slate-600 hover:underline"
          >
            Cancelar e voltar para o painel
          </button>
        </div>
      </form>
    </main>
  );
}
