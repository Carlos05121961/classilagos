"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function PublicarNoticiaPage() {
  const router = useRouter();

  // CAMPOS DO FORMULÁRIO
  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resumo, setResumo] = useState("");
  const [texto, setTexto] = useState("");
  const [fotoFile, setFotoFile] = useState(null);

  // ESTADOS GERAIS
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [uploading, setUploading] = useState(false);
  const [refinando, setRefinando] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  const cidades = [
    "Maricá",
    "Saquarema",
    "Araruama",
    "Iguaba Grande",
    "São Pedro da Aldeia",
    "Arraial do Cabo",
    "Cabo Frio",
    "Búzios",
    "Rio das Ostras",
  ];

  const categorias = [
    "Geral",
    "Turismo",
    "Segurança",
    "Eventos",
    "Saúde",
    "Educação",
    "Economia",
    "Trânsito",
    "Política",
    "Cultura",
    "Esporte",
  ];

  // ⚡ IA – REFINAR TEXTO
  const handleRefinarTexto = async () => {
    if (!texto.trim()) {
      setErro("Cole um texto antes de refinar.");
      return;
    }

    try {
      setRefinando(true);
      setErro("");

      const response = await fetch("/api/refinar-noticia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });

      const data = await response.json();

      if (data?.refinado) {
        setTexto(data.refinado);
      } else {
        setErro("Não foi possível refinar o texto.");
      }
    } catch (e) {
      console.error("Erro IA:", e);
      setErro("Erro ao refinar texto.");
    }

    setRefinando(false);
  };

  // PUBLICAR NOTÍCIA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!titulo || !cidade || !categoria || !resumo || !texto) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!fotoFile) {
      setErro("Envie uma imagem de capa.");
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Upload da imagem
      const ext = fotoFile.name.split(".").pop();
      const filePath = `noticias/${user.id}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("anuncios")
        .upload(filePath, fotoFile);

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("anuncios")
        .getPublicUrl(filePath);

      const fotoUrl = urlData.publicUrl;

      // SALVAR NO SUPABASE
      const { error: insertErr } = await supabase.from("noticias").insert({
        titulo,
        cidade,
        categoria,
        resumo,
        texto,
        imagem_capa: fotoUrl,
        user_id: user.id,
        status: "publicado",
      });

      if (insertErr) throw insertErr;

      setSucesso("Notícia publicada com sucesso!");

      setTitulo("");
      setCidade("");
      setCategoria("");
      setResumo("");
      setTexto("");
      setFotoFile(null);

      setTimeout(() => router.push("/noticias"), 1500);
    } catch (e) {
      console.error(e);
      setErro("Erro ao publicar notícia.");
    }

    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5FBFF] px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6">
        
        <h1 className="text-2xl font-bold text-slate-900">
          Publicar nova notícia
        </h1>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TÍTULO */}
          <div>
            <label className="text-sm font-medium">Título *</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* CIDADE + CATEGORIA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Cidade *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              >
                <option value="">Selecione...</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Categoria *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RESUMO */}
          <div>
            <label className="text-sm font-medium">Resumo curto *</label>
            <input
              type="text"
              maxLength="200"
              placeholder="Em até 160 caracteres..."
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
            />
          </div>

          {/* FOTO */}
          <div>
            <label className="text-sm font-medium">Imagem de capa *</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm mt-1"
              onChange={(e) => setFotoFile(e.target.files[0])}
            />
          </div>

          {/* TEXTO COMPLETO */}
          <div>
            <label className="text-sm font-medium">Texto completo *</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm h-40"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>

          {/* BOTÃO IA */}
          <button
            type="button"
            disabled={refinando}
            onClick={handleRefinarTexto}
            className="w-full bg-blue-500 text-white rounded-full py-2 text-sm hover:bg-blue-600 disabled:opacity-60"
          >
            {refinando ? "Refinando..." : "Refinar com IA"}
          </button>

          {/* PUBLICAR */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-emerald-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
          >
            {uploading ? "Publicando..." : "Publicar notícia"}
          </button>

        </form>
      </div>
    </main>
  );
}
