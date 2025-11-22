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

  // novo: arquivos de imagem selecionados
  const [imagens, setImagens] = useState([]);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // 1) Verifica usuário logado
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login?from=/anunciar/formulario");
        return;
      }

      setUser(session.user);
      setLoadingUser(false);
    };

    checkUser();
  }, [router]);

  // Enquanto verifica login
  if (loadingUser) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-lg">Verificando seu login…</p>
      </div>
    );
  }

  // 2) Função de upload das imagens para o bucket "anuncios"
  const uploadImagens = async () => {
    if (!imagens.length) return [];

    const urls = [];

    for (let i = 0; i < imagens.length; i++) {
      const file = imagens[i];
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}-${i}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("anuncios")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        throw new Error("Erro ao enviar imagem. Tente novamente.");
      }

      // pega URL pública
      const { data: publicData } = supabase.storage
        .from("anuncios")
        .getPublicUrl(uploadData.path);

      urls.push(publicData.publicUrl);
    }

    return urls;
  };

  // 3) Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!titulo || !descricao || !cidade || !contato) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!user) {
      setErro("Você precisa estar logado para publicar.");
      return;
    }

    setSalvando(true);

    try {
      // primeiro faz upload das imagens (se tiver)
      const imagensUrls = await uploadImagens();

      // depois salva o anúncio na tabela
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: tipo, // "imoveis", "veiculos", etc, vindo da URL
        titulo,
        descricao,
        cidade,
        contato,
        video_url: videoUrl || null,
        imagens: imagensUrls.length ? imagensUrls : null,
      });

      if (insertError) {
        console.error(insertError);
        throw new Error("Erro ao salvar o anúncio. Tente novamente.");
      }

      setSucesso("Anúncio publicado com sucesso!");
      // limpa campos
      setTitulo("");
      setDescricao("");
      setCidade("");
      setContato("");
      setVideoUrl("");
      setImagens([]);

      // manda para o painel de anúncios do usuário
      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1200);
    } catch (err) {
      setErro(err.message || "Erro inesperado ao salvar anúncio.");
    } finally {
      setSalvando(false);
    }
  };

  // 4) Render
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Anunciar em {tipo === "imoveis" ? "Imóveis" : tipo}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="w-full border rounded-xl px-3 py-2"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Casa 2 quartos com varanda em Maricá"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição detalhada *
          </label>
          <textarea
            className="w-full border rounded-xl px-3 py-2 min-h-[120px]"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o imóvel, bairro, estado de conservação, benefícios, etc."
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cidade / Região *
          </label>
          <input
            type="text"
            className="w-full border rounded-xl px-3 py-2"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex.: Maricá - Jacaroá"
          />
        </div>

        {/* Contato */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Telefone / WhatsApp *
          </label>
          <input
            type="text"
            className="w-full border rounded-xl px-3 py-2"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            placeholder="(21) 9xxxx-xxxx"
          />
        </div>

        {/* Imagens */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fotos do anúncio
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImagens(e.target.files ? Array.from(e.target.files) : [])
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Você pode selecionar várias imagens. Tamanho máximo por arquivo: ~5MB
            (recomendado).
          </p>
          {imagens.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {imagens.length} arquivo(s) selecionado(s).
            </p>
          )}
        </div>

        {/* Vídeo (YouTube) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Vídeo (link do YouTube) – opcional
          </label>
          <input
            type="url"
            className="w-full border rounded-xl px-3 py-2"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Ex.: cole aqui o link do vídeo do imóvel no YouTube, se tiver.
          </p>
        </div>

        {/* Mensagens */}
        {erro && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            {sucesso}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={salvando}
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {salvando ? "Publicando..." : "Publicar anúncio"}
        </button>
      </form>
    </div>
  );
}
