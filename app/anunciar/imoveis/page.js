"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

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

  // CAMPOS DO FORMULÁRIO
  const [titulo, setTitulo] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Casa");
  const [finalidade, setFinalidade] = useState("venda");
  const [preco, setPreco] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("Sim");
  const [descricao, setDescricao] = useState("");

  // CONTATO / IMOBILIÁRIA
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [imobiliaria, setImobiliaria] = useState("");
  const [corretor, setCorretor] = useState("");
  const [creci, setCreci] = useState("");

  // VÍDEO (YOUTUBE)
  const [videoUrl, setVideoUrl] = useState("");

  // FOTOS
  const [files, setFiles] = useState(null);

  // ESTADO DE TELA
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // 1) PEGAR USUÁRIO LOGADO
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErro("Você precisa estar logado para anunciar.");
        setLoading(false);
        return;
      }

      // 2) UPLOAD DAS FOTOS (SE TIVER)
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

      // 3) MONTAR OBJETO PARA SALVAR NO BANCO
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

        // Mídias
        imagens: imageUrls,
        video_url: videoUrl || null,
      };

      // 4) SALVAR NO SUPABASE
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

      // 5) REDIRECIONAR PARA A PÁGINA DO ANÚNCIO
      router.push(`/anuncios/${data.id}`);
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen py-8" style={{ background: "#F0FBFD" }}>

      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Anunciar imóvel
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Preencha as informações abaixo. Na fase de lançamento, todos os anúncios
          são{" "}
          <span className="font-semibold text-[#21D4FD]">
            totalmente grátis
          </span>
          .
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow border border-slate-200 px-4 sm:px-8 py-6 space-y-8"
        >
          {/* CAMPOS BÁSICOS */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Campos básicos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Título do anúncio
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Ex.: Casa linda em Cabo Frio com vista para o mar"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Tipo de imóvel
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
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

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Finalidade
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel_fixo">Aluguel fixo</option>
                  <option value="temporada">Aluguel por temporada</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Ex.: 450.000,00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* LOCALIZAÇÃO */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Localização
            </h2>
            <div className="grid md:grid-cols-[1fr,2fr] gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Cidade
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                >
                  {cidades.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Endereço / referência (para mapa)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  placeholder="Rua, número, bairro, ponto de referência..."
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Bairro
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* DETALHES DO IMÓVEL */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Detalhes do imóvel
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Área (m²)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Quartos
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Banheiros
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Vagas de garagem
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Valor do condomínio (R$)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Valor do IPTU (R$ / ano)
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Aceita financiamento?
                </label>
                <select
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={aceitaFinanciamento}
                  onChange={(e) => setAceitaFinanciamento(e.target.value)}
                >
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
            </div>
          </section>

          {/* DESCRIÇÃO */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Descrição do imóvel
            </h2>
            <div className="flex flex-col gap-1 mb-4">
              <textarea
                className="rounded-3xl border border-slate-200 px-3 py-3 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-[#21D4FD]"
                placeholder="Conte os detalhes do imóvel, pontos fortes, proximidades, vista, mobiliado, etc."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </section>

          {/* CONTATO / IMOBILIÁRIA */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Contato e imobiliária
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Telefone
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="(21) 2645-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  WhatsApp
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="(21) 99999-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  E-mail
                </label>
                <input
                  type="email"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="contato@imobiliaria.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Imobiliária
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Nome da imobiliária (opcional)"
                  value={imobiliaria}
                  onChange={(e) => setImobiliaria(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Corretor responsável
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Nome do corretor (opcional)"
                  value={corretor}
                  onChange={(e) => setCorretor(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  CRECI
                </label>
                <input
                  type="text"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="CRECI (opcional)"
                  value={creci}
                  onChange={(e) => setCreci(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* VÍDEO (YOUTUBE) */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Vídeo do imóvel (opcional)
            </h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">
                Cole o link do vídeo no YouTube
              </label>
              <input
                type="text"
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ex.: tour pelo imóvel, vista da varanda, área externa, etc.
              </p>
            </div>
          </section>

          {/* FOTOS */}
          <section>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
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
                Você pode selecionar várias fotos de uma vez. Dê preferência para
                imagens em modo paisagem (deitadas).
              </p>
            </div>
          </section>

          {/* ERRO */}
          {erro && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-3 py-2">
              {erro}
            </div>
          )}

          {/* BOTÃO */}
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
