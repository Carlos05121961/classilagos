"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioServicos() {
  const router = useRouter();

  // Campos principais
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Tipo de serviço (vamos usar area_profissional)
  const [tipoServico, setTipoServico] = useState("");

  // Contato
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Logo opcional
  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Caixinha de responsabilidade
  const [aceitoTermos, setAceitoTermos] = useState(false);

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

    if (!titulo || !descricao || !cidade || !tipoServico) {
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

    if (!aceitoTermos) {
      setErro(
        "Para publicar o anúncio, marque a caixa confirmando que as informações são verdadeiras."
      );
      return;
    }

    let logoUrl = null;

    try {
      setUploading(true);

      if (logo) {
        const ext = logo.name.split(".").pop();
        const path = `${user.id}/servico-logo-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(path, logo);

        if (!uploadError) {
          const { data } = supabase.storage
            .from("anuncios")
            .getPublicUrl(path);
          logoUrl = data.publicUrl;
        } else {
          console.error("Erro ao fazer upload da logo:", uploadError);
        }
      }

      const { error } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "servicos",
        titulo,
        descricao,
        cidade,
        bairro,
        nome_contato: nomeContato,
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        area_profissional: tipoServico, // usamos como tipo de serviço
        imagens: logoUrl ? [logoUrl] : null,
        status: "ativo",
      });

      if (error) {
        console.error(error);
        setErro("Erro ao salvar o serviço. Tente novamente.");
        return;
      }

      setSucesso("Serviço cadastrado com sucesso!");

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

      <h2 className="text-lg font-semibold text-slate-900">
        Informações do serviço
      </h2>

      {/* Título */}
      <div>
        <label className="text-xs font-medium">Título do serviço *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Ex: Eletricista residencial, Buffet para festas, Clínica odontológica..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* Tipo de serviço (area_profissional) */}
      <div>
        <label className="text-xs font-medium">Tipo de serviço *</label>
        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={tipoServico}
          onChange={(e) => setTipoServico(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          <option>Saúde (Classimed)</option>
          <option>Festas &amp; Eventos</option>
          <option>Profissionais liberais</option>
          <option>Serviços gerais</option>
        </select>
      </div>

      {/* Local */}
      <h2 className="text-lg font-semibold text-slate-900 pt-4 border-t">
        Atuação
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
          <label className="text-xs font-medium">Bairro / Região</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="pt-4 border-t">
        <label className="text-xs font-medium">Descrição do serviço *</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-28"
          placeholder="Explique o que você faz, como funciona o atendimento, diferenciais, formas de pagamento..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>

      {/* Logo opcional */}
      <div className="pt-4 border-t">
        <label className="text-xs font-medium">
          Logo ou foto do serviço (opcional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0] || null)}
          className="text-sm"
        />
      </div>

      {/* Contato */}
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

      <p className="text-[11px] text-slate-500 mb-2">
        Pelo menos um meio de contato será exibido no anúncio.
      </p>

      {/* Caixinha de responsabilidade */}
      <label className="flex items-start gap-2 text-[11px] text-slate-600 mb-2">
        <input
          type="checkbox"
          className="mt-[2px]"
          checked={aceitoTermos}
          onChange={(e) => setAceitoTermos(e.target.checked)}
        />
        <span>
          Confirmo que as informações deste anúncio são verdadeiras e que sou o
          responsável pelo serviço divulgado.
        </span>
      </label>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700"
      >
        {uploading ? "Publicando serviço..." : "Publicar serviço"}
      </button>
    </form>
  );
}
