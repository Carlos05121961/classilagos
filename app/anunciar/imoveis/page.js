"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

// Lista fixa de cidades atendidas pelo Classilagos
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

export default function AnunciarImovelPage() {
  const router = useRouter();

  // ==========================
  // ESTADO DO FORMULÁRIO
  // ==========================

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Casa");
  const [finalidade, setFinalidade] = useState("venda");
  const [preco, setPreco] = useState("");

  // Localização
  const [cidade, setCidade] = useState("Maricá");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");

  // Detalhes do imóvel
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("Sim");

  // Descrição
  const [descricao, setDescricao] = useState("");

  // Contato / Imobiliária
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [imobiliaria, setImobiliaria] = useState("");
  const [corretor, setCorretor] = useState("");
  const [creci, setCreci] = useState("");

  // Mídia
  const [videoUrl, setVideoUrl] = useState(""); // link do YouTube
  const [files, setFiles] = useState(null); // FileList | null

  // Estado geral da tela
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // 1) Verificar usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErro("Você precisa estar logado para anunciar.");
        setLoading(false);
        return;
      }

      // 2) Upload das fotos (se houver arquivos selecionados)
      let imageUrls = [];

      if (files && files.length > 0) {
        const uploads = Array.from(files).map(async (file) => {
          const path = `${user.id}/${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase
            .storage
            .from("anuncios")
            .upload(path, file);

          if (uploadError) throw uploadError;

          const { data: publicData } = supabase
            .storage
            .from("anuncios")
            .getPublicUrl(path);

          return publicData.publicUrl;
        });

        imageUrls = await Promise.all(uploads);
      }

      // 3) Montar payload para salvar na tabela "anuncios"
         const payload = {
        user_id: user.id,
        categoria: "imoveis",

        // Básico
        titulo,
        descricao,
        cidade,
        endereco,
        bairro,
        preco,
        tipo_imovel: tipoImovel,
        finalidade, // "venda" | "aluguel_fixo" | "temporada"

        // Detalhes
        area,
        quartos,
        banheiros,
        vagas,
        condominio,
        iptu,
        aceita_financiamento: aceitaFinanciamento,

        // Contato / imobiliária
        telefone,
        whatsapp,
        email,
        imobiliaria,
        corretor,
        creci,

        // Campo legado para compatibilidade com a tabela antiga
        // (usa primeiro o WhatsApp, depois telefone, depois e-mail)
        contato: whatsapp || telefone || email || "",

        // Mídias
        imagens: imageUrls,
        video_url: videoUrl || null,
      };


      // 4) Inserir no Supabase
      const { data, error: insertError } = await supabase
        .from("anuncios")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) {
        console.error(insertError);
        setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
        setLoading(false);
        return;
      }

      // 5) Redirecionar para a página do anúncio recém-criado
      router.push(`/anuncios/${data.id}`);
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // JSX
  // ==========================

  // Classe reutilizável para cada bloco (card) do formulário
  const cardClass =
    "bg-white rounded-3xl border border-[#D6F7FA] " +
    "shadow-[0_4px_14px_rgba(0,0,0,0.08),0_2px_8px_rgba(33,212,253,0.10)] " +
    "px-4 sm:px-6 py-4 sm:py-5 space-y-4";

  return (
    <main
      className="min-h-screen py-8"
      style={{ backgroundColor: "#F2F9FC" }} // azul-gelo profissional
    >
      {/* Container central fixo em ~820px, estilo QuintoAndar */}
      <div className="max-w-[820px] mx-auto px-4">
        {/* Cabeçalho da página */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2933] mb-1">
            Anunciar imóvel
          </h1>
          <p className="text-sm text-slate-600">
            Preencha as informações abaixo. Na fase de lançamento, todos os
            anúncios são{" "}
            <span className="font-semibold text-[#21D4FD]">
              totalmente grátis
            </span>
            .
          </p>
        </header>

        {/* FORMULÁRIO PRINCIPAL */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ==========================
              CAMPOS BÁSICOS
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Campos básicos
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Título do anúncio */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Título do anúncio
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Ex.: Casa linda em Cabo Frio com vista para o mar"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              {/* Tipo de imóvel */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Tipo de imóvel
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                >
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Terreno</option>
                  <option>Sítio / Chácara</option>
                  <option>Cobertura</option>
                  <option>Kitnet / Studio</option>
                  <option>Sala / Loja comercial</option>
                  <option>Galpão / Depósito</option>
                  <option>Fazenda</option>
                  <option>Outro</option>
                </select>
              </div>

              {/* Finalidade */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Finalidade
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel_fixo">Aluguel fixo</option>
                  <option value="temporada">Aluguel por temporada</option>
                </select>
              </div>

              {/* Valor */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Ex.: 450.000,00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ==========================
              LOCALIZAÇÃO
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Localização
            </h2>

            <div className="grid md:grid-cols-[1fr,2fr] gap-4">
              {/* Cidade */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Cidade
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                >
                  {cidades.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Endereço / referência */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Endereço / referência (para mapa)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Rua, número, bairro, ponto de referência..."
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-2">
              {/* Bairro */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Bairro
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ==========================
              DETALHES DO IMÓVEL
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Detalhes do imóvel
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {/* Área */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Área (m²)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>

              {/* Quartos */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Quartos
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                />
              </div>

              {/* Banheiros */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Banheiros
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value)}
                />
              </div>

              {/* Vagas */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Vagas de garagem
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-3">
              {/* Condomínio */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Valor do condomínio (R$)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value)}
                />
              </div>

              {/* IPTU */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Valor do IPTU (R$ / ano)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value)}
                />
              </div>

              {/* Aceita financiamento */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Aceita financiamento?
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={aceitaFinanciamento}
                  onChange={(e) => setAceitaFinanciamento(e.target.value)}
                >
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
            </div>
          </section>

          {/* ==========================
              DESCRIÇÃO
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Descrição do imóvel
            </h2>
            <div className="flex flex-col gap-1">
              <textarea
                className="rounded-3xl border border-slate-200 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                placeholder="Conte os detalhes do imóvel, pontos fortes, proximidades, vista, mobiliado, etc."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </section>

          {/* ==========================
              CONTATO / IMOBILIÁRIA
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Contato e imobiliária
            </h2>

            {/* Linha 1: telefone / whatsapp / email */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Telefone */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Telefone
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="(21) 2645-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  WhatsApp
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="(21) 99999-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              {/* E-mail */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  E-mail
                </label>
                <input
                  type="email"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="contato@imobiliaria.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Linha 2: imobiliária / corretor / CRECI */}
            <div className="grid md:grid-cols-3 gap-4 mt-3">
              {/* Imobiliária */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Imobiliária
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Nome da imobiliária (opcional)"
                  value={imobiliaria}
                  onChange={(e) => setImobiliaria(e.target.value)}
                />
              </div>

              {/* Corretor */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Corretor responsável
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Nome do corretor (opcional)"
                  value={corretor}
                  onChange={(e) => setCorretor(e.target.value)}
                />
              </div>

              {/* CRECI */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  CRECI
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="CRECI (opcional)"
                  value={creci}
                  onChange={(e) => setCreci(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ==========================
              VÍDEO (YOUTUBE)
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Vídeo do imóvel (opcional)
            </h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">
                Cole o link do vídeo no YouTube
              </label>
              <input
                type="text"
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ex.: tour pelo imóvel, vista da varanda, área externa, etc.
              </p>
            </div>
          </section>

          {/* ==========================
              FOTOS
          =========================== */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-[#1F2933]">
              Fotos do imóvel
            </h2>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
              <p className="text-[11px] text-slate-500">
                Você pode selecionar várias fotos de uma vez. Dê preferência
                para imagens em modo paisagem (deitadas).
              </p>
            </div>
          </section>

          {/* ==========================
              ERRO (se houver)
          =========================== */}
          {erro && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-3 py-2">
              {erro}
            </div>
          )}

          {/* BOTÃO DE ENVIO */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#21D4FD] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3EC9C3] disabled:opacity-60"
            >
              {loading ? "Publicando anúncio..." : "Publicar anúncio"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
