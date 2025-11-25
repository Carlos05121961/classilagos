"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioImoveis() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [preco, setPreco] = useState("");

  // Upload de arquivos (fotos)
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo (URL)
  const [videoUrl, setVideoUrl] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  // Garante login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 4)); // máximo 4 fotos
  };

  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;

    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        // 👉 NOME DO BUCKET: IGUAL AO SEU PRINT ("anuncios")
        const bucketName = "anuncios";

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-${index}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from(bucketName)
              .upload(filePath, file);

            if (uploadError) {
              console.error("Erro ao subir imagem:", uploadError);
              throw uploadError;
            }

            const { data: publicData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath);

            return publicData.publicUrl;
          })
        );

        urlsUpload = uploads;
      }
    } catch (err) {
      console.error(err);
      setErro(
        "Ocorreu um erro ao enviar as imagens. Tente novamente em alguns instantes."
      );
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    // Só as fotos enviadas pelo upload
    const imagens = urlsUpload;

    const { error } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: "imoveis",
      titulo,
      descricao,
      cidade,
      bairro,
      endereco,
      preco,
      imagens,
      video_url: videoUrl,
      telefone,
      whatsapp,
      email,
      contato: contatoPrincipal,
      tipo_imovel: "não informado",
      status: "ativo",
      destaque: false,
    });

    if (error) {
      console.error(error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    setSucesso("Anúncio enviado com sucesso! Seu imóvel aparecerá em breve.");

    // limpa formulário
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setEndereco("");
    setPreco("");
    setArquivos([]);
    setVideoUrl("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6">
      {erro && (
        <p className="text-red-600 text-xs md:text-sm border border-red-100 rounded-md px-3 py-2 bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-green-600 text-xs md:text-sm border border-emerald-100 rounded-md px-3 py-2 bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* BLOCO: INFORMAÇÕES DO IMÓVEL */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações do imóvel
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: Casa com 3 quartos em Itaipuaçu"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Descrição detalhada *
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-28"
            placeholder="Descreva os principais detalhes do imóvel, vista, estado de conservação, proximidade da praia, lagoa, comércio, escolas etc."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Dica: um bom texto com detalhes honestos aumenta muito as chances de
            contato.
          </p>
        </div>
      </div>

      {/* BLOCO: LOCALIZAÇÃO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Cidade *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
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
            <label className="block text-xs font-medium text-slate-700">
              Bairro / Região
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex: Centro, Itaipuaçu, Ponta Negra..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Endereço (opcional)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Rua, número, complemento..."
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Preço (opcional)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: R$ 350.000 ou R$ 2.500/mês"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: FOTOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos do imóvel</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Enviar fotos (upload) – até 4 imagens
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleArquivosChange}
            className="mt-1 w-full text-xs"
          />
          {arquivos.length > 0 && (
            <p className="mt-1 text-[11px] text-slate-500">
              {arquivos.length} arquivo(s) selecionado(s).
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            Formatos recomendados: JPG ou PNG, até 2MB cada.
          </p>
        </div>
      </div>

      {/* BLOCO: VÍDEO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Vídeo do imóvel (opcional)
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            URL do vídeo (YouTube, Vimeo, etc.)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Cole aqui o link do vídeo, se tiver"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: CONTATO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados de contato</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Telefone
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Telefone para contato"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              WhatsApp
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="DDD + número"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será
          exibido para as pessoas entrarem em contato com você.
        </p>
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Enviar anúncio"}
      </button>
    </form>
  );
}
