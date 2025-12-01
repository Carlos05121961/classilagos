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
  const [cep, setCep] = useState("");

  // Tipo de anúncio / imóvel
  const [finalidade, setFinalidade] = useState(""); // venda / aluguel / temporada
  const [tipoImovel, setTipoImovel] = useState("");

  // Detalhes numéricos
  const [quartos, setQuartos] = useState("");
  const [suites, setSuites] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [areaConstruida, setAreaConstruida] = useState("");
  const [areaTerreno, setAreaTerreno] = useState("");

  // Valores
  const [preco, setPreco] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [mobiliado, setMobiliado] = useState("nao"); // sim / nao
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("nao"); // sim / nao

  // Upload de arquivos (fotos)
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo (URL – apenas YouTube)
  const [videoUrl, setVideoUrl] = useState("");

  // Contatos
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Termos
  const [aceitoTermos, setAceitoTermos] = useState(false);

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

  const tiposImovel = [
    "Casa",
    "Apartamento",
    "Cobertura",
    "Kitnet / Studio",
    "Terreno / Lote",
    "Comercial",
    "Loja / Sala",
    "Galpão",
    "Sítio / Chácara",
    "Outros",
  ];

  const finalidades = ["Venda", "Aluguel", "Temporada"];

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
    // máximo 8 fotos
    setArquivos(files.slice(0, 8));
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

    // Pelo menos um meio de contato
    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    // Finalidade e tipo
    if (!finalidade || !tipoImovel) {
      setErro("Selecione a finalidade e o tipo de imóvel.");
      return;
    }

    // Termos de responsabilidade
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
      tipo_imovel: tipoImovel,
      finalidade: finalidade,
      area: areaConstruida || areaTerreno,
      quartos,
      banheiros,
      vagas,
      mobiliado,
      condominio,
      iptu,
      aceita_financiamento: aceitaFinanciamento,
      status: "ativo",
      destaque: false,
      cep,
      suites,
      area_construida: areaConstruida,
      area_terreno: areaTerreno,
      nome_contato: nomeContato,
    });

    if (error) {
      console.error(error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    // Sucesso
    setSucesso("Anúncio enviado com sucesso! Seu imóvel aparecerá em breve.");

    // Limpa formulário
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setEndereco("");
    setCep("");
    setFinalidade("");
    setTipoImovel("");
    setQuartos("");
    setSuites("");
    setBanheiros("");
    setVagas("");
    setAreaConstruida("");
    setAreaTerreno("");
    setPreco("");
    setCondominio("");
    setIptu("");
    setMobiliado("nao");
    setAceitaFinanciamento("nao");
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

      {/* BLOCO: TIPO DO ANÚNCIO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Tipo de anúncio
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Finalidade *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {finalidades.map((f) => (
                <option key={f} value={f.toLowerCase()}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Tipo de imóvel *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              value={tipoImovel}
              onChange={(e) => setTipoImovel(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {tiposImovel.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* BLOCO: INFORMAÇÕES DO IMÓVEL */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
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
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
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

        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
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
              CEP (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BLOCO: DETALHES DO IMÓVEL */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Detalhes do imóvel
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Dormitórios
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Suítes
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={suites}
              onChange={(e) => setSuites(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Banheiros
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Vagas de garagem
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={vagas}
              onChange={(e) => setVagas(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Área construída (m²)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={areaConstruida}
              onChange={(e) => setAreaConstruida(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Área total / terreno (m²)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={areaTerreno}
              onChange={(e) => setAreaTerreno(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Imóvel mobiliado?
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              value={mobiliado}
              onChange={(e) => setMobiliado(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
        </div>
      </div>

      {/* BLOCO: VALORES */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Valores</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Preço (R$) *
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder={
                finalidade === "aluguel"
                  ? "Ex: R$ 2.500 / mês"
                  : finalidade === "temporada"
                  ? "Ex: R$ 500 / diária"
                  : "Ex: R$ 450.000"
              }
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Condomínio (R$)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={condominio}
              onChange={(e) => setCondominio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              IPTU (R$)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={iptu}
              onChange={(e) => setIptu(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Aceita financiamento?
          </label>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm max-w-xs bg-white text-slate-900"
            value={aceitaFinanciamento}
            onChange={(e) => setAceitaFinanciamento(e.target.value)}
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </select>
        </div>
      </div>

      {/* BLOCO: FOTOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos do imóvel</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
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

      {/* BLOCO: VÍDEO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Vídeo do imóvel (opcional)
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
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
          <label className="block text-xs font-medium text-slate-700">
            Nome de contato
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Nome do proprietário, corretor ou imobiliária"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

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
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Enviar anúncio"}
      </button>
    </form>
  );
}
