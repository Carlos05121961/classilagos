"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

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

export default function AnunciarPage() {
  const router = useRouter();

  // CAMPOS DO FORMULÁRIO
  const [titulo, setTitulo] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Casa");
  const [finalidade, setFinalidade] = useState("venda");
  const [preco, setPreco] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [endereco, setEndereco] = useState("");
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("Sim");
  const [descricao, setDescricao] = useState("");
  const [contato, setContato] = useState("");

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

      // 2) UPLOAD DAS FOTOS (SE HOUVER)
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
        titulo,
        descricao,
        cidade,
        contato,
        tipo_imovel: tipoImovel,
        finalidade, // "venda" | "aluguel_fixo" | "temporada"
        preco,
        area,
        quartos,
        banheiros,
        vagas,
        condominio,
        iptu,
        aceita_financiamento: aceitaFinanciamento,
        endereco,
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
    <main className="min-h-screen py-8 bg-[#F5FBFF]">
      <div className="max-w-5xl mx-auto px-4">
        {/* TÍTULO */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2933] mb-2">
          Anunciar imóvel
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Preencha as informações abaixo. Na fase de lançamento, todos os anúncios
          são{" "}
          <span className="font-semibold text-[#21D4FD]">
            totalmente grátis
          </span>.
        </p>

        {/* CARD PRINCIPAL */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 px-4 sm:px-8 py-6 space-y-8"
        >
          {/* CAMPOS BÁSICOS */}
          <section>
            <h2 className="text-sm font-semibold text-[#1F2933] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#21D4FD]" />
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
                  onChange={(e) => setTipoImovel(e.target.value
