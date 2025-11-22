"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

// Componente que realmente usa useSearchParams e faz o formulário
function FormularioAnuncioInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "imoveis"; // imoveis, veiculos, etc.

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [contato, setContato] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [arquivos, setArquivos] = useState([]); // Files para upload
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Carrega usuário logado
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      }
      setUser(data?.user ?? null);
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setArquivos(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!user) {
      setErro("Você precisa estar logado para publicar um anúncio.");
      return;
    }

    if (!titulo || !descricao || !cidade || !contato) {
      setErro(
        "Preencha os campos obrigatórios: título, descrição, cidade e contato."
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1) Upload das imagens (se tiver)
      let imagensUrls = [];

      if (arquivos.length > 0) {
        const uploads = await Promise.all(
          arquivos.map(async (file) => {
            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}.${ext}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("anuncios")
              .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage
              .from("anuncios")
              .getPublicUrl(filePath);

            return publicData.publicUrl;
          })
        );

        imagensUrls = uploads;
      }

      // 2) Salvar registro na tabela anuncios
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: tipo,
        titulo,
        descricao,
        cidade,
        contato,
        video_url: videoUrl || null,
        imagens: imagensUrls, // text[]
        // bairro ainda não está na tabela, por isso não mando
      });

      if (insertError) throw insertError;

      setSucesso("Anúncio publicado com sucesso!");
      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setContato("");
      setVideoUrl("");
      setArquivos([]);

      // leva pro painel
      router.push("/painel/meus-anuncios");
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro ao salvar seu anúncio. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  // Estado de carregando usuário
  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg">Carregando dados do usuário...</p>
      </div>
    );
  }

  // Se não tiver usuário logado
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Você precisa estar logado</h1>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Ir para a página de login
        </button>
      </div>
    );
  }

  const tituloPagina =
    tipo === "imoveis" ? "Novo anúncio de imóvel" : "Novo anúncio";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{tituloPagina}</h1>
      <p className="text-gray-600 mb-6">
        Preencha os dados do seu anúncio. Em seguida ele aparecerá em{" "}
        <strong>Imóveis</strong> e também no seu painel em{" "}
        <strong>Meus anúncios</strong>.
      </p>

      {erro && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-700">
          {sucesso}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-6 shadow"
      >
        {/* Título */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Ex.: Casa 2 quartos com varanda em Maricá"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Descrição detalhada *
          </label>
          <textarea
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={4}
            placeholder="Descreva o imóvel, número de quartos, vagas, proximidades, etc."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        {/* Cidade e bairro (bairro ainda não vai pro banco) */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Cidade *</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Maricá, Cabo Frio, etc."
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Bairro</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Jacaroá, Itaipuaçu, Centro..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        {/* Contato */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Telefone / WhatsApp para contato *
          </label>
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="(21) 9xxxx-xxxx"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
          />
        </div>

        {/* Link de vídeo (YouTube) */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Vídeo do imóvel (YouTube – opcional)
          </label>
          <input
            type="url"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Cole aqui o link do vídeo no YouTube"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            O vídeo será aberto em uma nova aba, fora do site, para não pesar o
            servidor.
          </p>
        </div>

        {/* Upload de fotos */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Fotos do imóvel (até algumas imagens)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
          />
          <p className="mt-1 text-xs text-gray-500">
            As imagens serão enviadas para o Storage do Supabase no bucket{" "}
            <strong>anuncios</strong>.
          </p>

          {arquivos.length > 0 && (
            <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
              {arquivos.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/painel")}
            className="rounded-full border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Publicando..." : "Confirmar e publicar"}
          </button>
        </div>
      </form>
    </main>
  );
}

// Componente exportado da página, com Suspense envolvendo o formulário
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-lg">Carregando formulário...</p>
        </div>
      }
    >
      <FormularioAnuncioInner />
    </Suspense>
  );
}
