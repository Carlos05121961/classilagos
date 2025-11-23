"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function AnunciarPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [categoria, setCategoria] = useState("imoveis");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [contato, setContato] = useState("");
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [okMsg, setOkMsg] = useState("");

  // Carrega usuário logado
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    loadUser();
  }, []);

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setOkMsg("");
    setLoading(true);

    try {
      if (!user) {
        setErro("Você precisa estar logado para anunciar.");
        setLoading(false);
        return;
      }

      // 1) Upload das imagens para o bucket "anuncios"
      const imageUrls = [];

      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(path, file);

        if (uploadError) {
          console.error(uploadError);
          throw new Error("Erro ao enviar imagens. Tente novamente.");
        }

        const { data: publicData } = supabase.storage
          .from("anuncios")
          .getPublicUrl(path);

        if (publicData?.publicUrl) {
          imageUrls.push(publicData.publicUrl);
        }
      }

      // 2) Salvar o anúncio na tabela "anuncios"
      const { data, error } = await supabase
        .from("anuncios")
        .insert({
          user_id: user.id,
          categoria,
          titulo,
          descricao,
          cidade,
          contato,
          imagens: imageUrls,
        })
        .select("id")
        .single();

      if (error) {
        console.error(error);
        throw new Error("Erro ao salvar o anúncio.");
      }

      setOkMsg("Anúncio criado com sucesso!");
      // 3) Redireciona para a página do anúncio recém-criado
      router.push(`/anuncios/${data.id}`);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      {/* Cabeçalho simples */}
      <section className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">
            Anuncie seu produto ou serviço
          </h1>
          <p className="text-xs text-slate-600">
            Preencha os dados abaixo para publicar seu anúncio gratuitamente na
            Classilagos.
          </p>
        </div>
      </section>

      {/* Área principal do formulário */}
      <section className="max-w-3xl mx-auto px-4 pt-6">
        {!user && (
          <p className="mb-4 text-xs text-red-600">
            Você precisa estar logado para publicar anúncios.
          </p>
        )}

        {erro && (
          <p className="mb-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
            {erro}
          </p>
        )}

        {okMsg && (
          <p className="mb-3 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
            {okMsg}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded-3xl border border-slate-200 px-5 py-5 shadow-sm"
        >
          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="imoveis">Imóveis</option>
              <option value="veiculos">Veículos</option>
              <option value="nautica">Náutica</option>
              <option value="pets">Pets</option>
              <option value="empregos">Empregos</option>
              <option value="servicos">Serviços & Profissionais</option>
              <option value="turismo">Turismo</option>
              <option value="lagolistas">Comércio / LagoListas</option>
            </select>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título do anúncio
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ex.: Casa 2 quartos com vista para a lagoa"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm h-32"
              placeholder="Descreva o imóvel, veículo, serviço ou produto com detalhes."
              required
            />
          </div>

          {/* Cidade + Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cidade
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contato (telefone ou WhatsApp)
              </label>
              <input
                type="text"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="(21) 99999-9999"
                required
              />
            </div>
          </div>

          {/* Upload de fotos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fotos (imagens)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="block text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Você pode enviar várias fotos. A primeira será usada como capa do
              anúncio.
            </p>
            {files.length > 0 && (
              <p className="mt-1 text-[11px] text-slate-600">
                {files.length} arquivo(s) selecionado(s).
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !user}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
          >
            {loading ? "Publicando anúncio..." : "Publicar anúncio"}
          </button>
        </form>
      </section>
    </main>
  );
}
