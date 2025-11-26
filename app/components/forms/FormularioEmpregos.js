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

    let logoUrl = null;

    try {
      setUploading(true);

      if (logo) {
        const ext = logo.name.split(".").pop();
        const path = `${user.id}/empresa-logo-${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("anuncios")
          .upload(path, logo);

        if (!error) {
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

      {erro && (
        <p className="text-red-600 text-sm border p-2 rounded bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-green-700 text-sm border p-2 rounded bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* INFORMAÇÕES BÁSICAS */}
      <h2 className="text-lg font-semibold text-slate-900">
        Informações da vaga
      </h2>

      <div>
        <label className="text-xs font-medium">Título da vaga *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Ex: Atendente de loja, Auxiliar administrativo..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* ÁREA */}
      <div>
        <label className="text-xs font-medium">Área profissional *</label>
        <select
          className="w-full border rounded px-3 py-2 text-sm"
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

      {/* DETALHES DA VAGA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium">Tipo de vaga *</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
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
          <label className="text-xs font-medium">Modelo</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={modeloTrabalho}
            onChange={(e) => setModeloTrabalho(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option>Presencial</option>
            <option>Híbrido</option>
            <option>Home-office</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium">Carga horária</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Ex: 44h semanais"
            value={cargaHoraria}
            onChange={(e) => setCargaHoraria(e.target.value)}
          />
        </div>
      </div>

      {/* SALÁRIO & BENEFÍCIOS */}
      <div>
        <label className="text-xs font-medium">Faixa salarial</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Ex: R$ 1.600 a R$ 1.900"
          value={faixaSalarial}
          onChange={(e) => setFaixaSalarial(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-medium">Benefícios</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-20"
          placeholder="Vale-transporte, alimentação, plano de saúde..."
          value={beneficios}
          onChange={(e) => setBeneficios(e.target.value)}
        ></textarea>
      </div>

      {/* LOCAL */}
      <h2 className="text-lg font-semibold text-slate-900 pt-4 border-t">
        Local da vaga
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Cidade *</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {cidades.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium">Bairro</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="pt-4 border-t">
        <label className="text-xs font-medium">Descrição da vaga *</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-28"
          placeholder="Explique a função, atividades, requisitos e detalhes importantes."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        ></textarea>
      </div>

      {/* LOGO (opcional) */}
      <div className="pt-4 border-t">
        <label className="text-xs font-medium">Logo da empresa (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="text-sm"
        />
      </div>

      {/* CONTATO */}
      <h2 className="text-lg font-semibold text-slate-900 pt-4 border-t">
        Dados de contato
      </h2>

      <div>
        <label className="text-xs font-medium">Nome do responsável</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          value={nomeContato}
          onChange={(e) => setNomeContato(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Telefone</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium">WhatsApp</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">E-mail</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <p className="text-[11px] text-slate-500">
        Pelo menos um meio de contato será exibido.
      </p>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700"
      >
        {uploading ? "Publicando vaga..." : "Publicar vaga"}
      </button>
    </form>
  );
}
