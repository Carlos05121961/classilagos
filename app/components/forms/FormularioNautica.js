"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioNautica() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // Localização
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Tipo / finalidade
  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");

  // Preço
  const [preco, setPreco] = useState("");

  // Upload de arquivos (fotos)
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo (opcional)
  const [videoUrl, setVideoUrl] = useState("");

  // Contato
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Termos
  const [aceitoTermos, setAceitoTermos] = useState(false);

  // Mensagens
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

  const subcategoriasNautica = [
    "Lancha",
    "Veleiro",
    "Jetski",
    "Barco de pesca",
    "Stand-up / Caiaque",
    "Vaga em marina",
    "Serviços náuticos",
    "Outros",
  ];

  const finalidades = ["Venda", "Aluguel", "Passeio / turismo", "Serviço"];

  // Garante login (mesma lógica de Imóveis)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8)); // até 8 fotos
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

    // Pelo menos um contato
    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    // Subcategoria e finalidade
    if (!subcategoria || !finalidade) {
      setErro("Selecione o tipo de anúncio (subcategoria) e a finalidade.");
      return;
    }

    if (!aceitoTermos) {
      setErro(
        "Para publicar o anúncio, você precisa aceitar os termos de responsabilidade."
      );
      return;
    }

    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const bucketName = "anuncios";

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-nautica-${index}.${fileExt}`;

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

    const imagens = urlsUpload;

    const { error } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: "nautica",
      titulo,
      descricao,
      cidade,
      bairro,
      preco,
      imagens,
      video_url: videoUrl,
      telefone,
      whatsapp,
      email,
      contato: contatoPrincipal,
      subcategoria_nautica: subcategoria,
      finalidade_nautica: finalidade,
      status: "ativo",
      destaque: false,
      nome_contato: nomeContato,
    });

    if (error) {
      console.error(error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    // Sucesso
    setSucesso(
      "Anúncio de náutica enviado com sucesso! Ele aparecerá em breve na página Náutica."
    );

    // Limpa formulário
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setSubcategoria("");
    setFinalidade("");
    setPreco("");
    setArquivos([]);
    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);

    // Depois de 2 segundos, vai para Meus anúncios
    setTimeout(() => {
      router.push("/painel/meus-anuncios");
    }, 2000);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6 text-xs md:text-sm">
      {erro && (
        <p className="text-red-600 text-xs md:text-sm border border-red-100 rounded-md px-3 py-2 bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-emerald-600 text-xs md:text-sm border border-emerald-100 rounded-md px-3 py-2 bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* BLOCO: TIPO DO ANÚNCIO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Tipo de anúncio náutico
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Tipo / Subcategoria *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {subcategoriasNautica.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Finalidade *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {finalidades.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* BLOCO: INFORMAÇÕES DA EMBARCAÇÃO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações da embarcação / serviço
        </h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: Lancha 30 pés FS com motor 250hp – pronta para passeio"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Descrição detalhada *
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-28"
            placeholder="Descreva a embarcação, ano, motorização, equipamentos, capacidade, estado geral, regras de uso, etc."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Dica: quanto mais detalhes (reais), mais segurança para quem está
            buscando passeios e embarcações.
          </p>
        </div>
      </div>

      {/* BLOCO: LOCALIZAÇÃO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Local de saída</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
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
            <label className="block text-[11px] font-medium text-slate-700">
              Bairro / ponto de embarque
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex: Praia do Forte, Canal, Porto Veleiro..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BLOCO: VALOR */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Valor</h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Preço (R$)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: R$ 250.000,00 ou R$ 1.200,00 o passeio"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Se preferir, pode deixar &quot;a combinar&quot; na descrição.
          </p>
        </div>
      </div>

      {/* BLOCO: FOTOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Fotos da embarcação / serviço
        </h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Enviar fotos (upload) – até 8 imagens
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

      {/* BLOCO: VÍDEO (OPCIONAL) */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Vídeo da embarcação (opcional)
        </h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            URL do vídeo (YouTube)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Cole aqui o link do vídeo no YouTube (se tiver)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: CONTATO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados de contato</h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Nome para contato
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Seu nome ou nome da empresa"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
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
            <label className="block text-[11px] font-medium text-slate-700">
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
          <label className="block text-[11px] font-medium text-slate-700">
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

      {/* BLOCO: TERMOS */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Termos de responsabilidade
        </h2>
        <label className="flex items-start gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que
            assumo total responsabilidade pelo conteúdo publicado. Estou ciente
            e de acordo com os{" "}
            <a
              href="/termos-de-uso"
              className="text-cyan-700 underline hover:text-cyan-800"
              target="_blank"
              rel="noreferrer"
            >
              Termos de uso do Classilagos
            </a>
            .
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-sky-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Publicar anúncio em Náutica"}
      </button>
    </form>
  );
}
