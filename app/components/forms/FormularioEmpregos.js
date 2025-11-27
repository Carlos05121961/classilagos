"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioEmpregos() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [areaProfissional, setAreaProfissional] = useState("");
  const [tipoVaga, setTipoVaga] = useState("");
  const [modeloTrabalho, setModeloTrabalho] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [faixaSalarial, setFaixaSalarial] = useState("");
  const [beneficios, setBeneficios] = useState("");

  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);

  // Verifica login
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

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado.");
      router.push("/login");
      return;
    }

    if (!titulo || !cidade || !areaProfissional || !tipoVaga) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    if (!aceitoResponsabilidade) {
      setErro(
        "Para publicar a vaga, marque a declaração de responsabilidade pelas informações."
      );
      return;
    }

    let logoUrl = null;

    try {
      setUploading(true);

      if (logo) {
        const ext = logo.name.split(".").pop();
        const path = `${user.id}/empresa-logo-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(path, logo);

        if (uploadError) {
          console.error("Erro ao fazer upload da logo:", uploadError);
        } else {
          const { data } = supabase.storage
            .from("anuncios")
            .getPublicUrl(path);
          logoUrl = data.publicUrl;
        }
      }

      const { error } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "emprego",
        titulo,
        descricao,
        cidade,
        bairro,
        nome_contato: nomeContato,
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        area_profissional: areaProfissional,
        tipo_vaga: tipoVaga,
        modelo_trabalho: modeloTrabalho,
        carga_horaria: cargaHoraria,
        faixa_salarial: faixaSalarial,
        beneficios,
        imagens: logoUrl ? [logoUrl] : null,
        status: "ativo",
      });

      if (error) {
        console.error(error);
        setErro("Erro ao salvar a vaga. Tente novamente.");
        return;
      }

      setSucesso("Vaga publicada com sucesso!");

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado. Tente de novo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={enviarFormulario} className="space-y-6">
      {/* mensagens */}
      {erro && (
        <p className="text-red-700 text-sm border border-red-200 p-3 rounded-2xl bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-emerald-700 text-sm border border-emerald-200 p-3 rounded-2xl bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* INFORMAÇÕES DA VAGA */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações da vaga
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título da vaga *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Ex: Atendente de loja, Auxiliar administrativo..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Área profissional *
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            value={areaProfissional}
            onChange={(e) => setAreaProfissional(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option>Administração</option>
            <option>Atendimento / Caixa</option>
            <option>Comércio / Vendas</option>
            <option>Construção civil</option>
            <option>Serviços gerais</option>
            <option>Educação</option>
            <option>Saúde</option>
            <option>Hotelaria / Turismo</option>
            <option>Motorista / Entregador</option>
            <option>TI / Informática</option>
            <option>Outros</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tipo de vaga *
            </label>
            <select
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={tipoVaga}
              onChange={(e) => setTipoVaga(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              <option>CLT</option>
              <option>Temporário</option>
              <option>Estágio</option>
              <option>Freelancer</option>
              <option>Prestador / PJ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Modelo
            </label>
            <select
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={modeloTrabalho}
              onChange={(e) => setModeloTrabalho(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option>Presencial</option>
              <option>Híbrido</option>
              <option>Home-office</option>
            </select>
          </div
