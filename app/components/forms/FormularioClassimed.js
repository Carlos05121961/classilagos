"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioClassimed() {
  const router = useRouter();

  // Título do anúncio
  const [titulo, setTitulo] = useState("");

  // Localização
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Especialidade / área de atuação
  const [especialidade, setEspecialidade] = useState("");

  // Descrição geral
  const [descricao, setDescricao] = useState("");

  // Profissional / clínica
  const [nomeProfissional, setNomeProfissional] = useState("");
  const [nomeClinica, setNomeClinica] = useState("");
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [atendeDomicilio, setAtendeDomicilio] = useState(false);
  const [faixaPreco, setFaixaPreco] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Arquivo (logo / foto do espaço)
  const [logoFile, setLogoFile] = useState(null);

  // Estados gerais
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Verificar login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
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

  const especialidades = [
    "Psicologia",
    "Psiquiatria",
    "Clínica geral",
    "Pediatria",
    "Ginecologia",
    "Nutrição",
    "Fisioterapia",
    "Fonoaudiologia",
    "Odontologia",
    "Massoterapia / Terapias integrativas",
    "Pilates",
    "Educação física / Personal",
    "Veterinário",
    "Outras especialidades",
  ];

  const handleSubmit = async (e) => {
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

    // Validações principais
    if (!titulo || !cidade || !especialidade || !descricao) {
      setErro(
        "Preencha pelo menos o título, cidade, especialidade e a descrição do serviço."
      );
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
        "Para publicar no Classimed, marque a opção confirmando que as informações são verdadeiras."
      );
      return;
    }

    setUploading(true);

    let logoUrl = null;

    try {
      const bucket = "anuncios";

      // Upload da logo / foto do espaço (opcional)
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `servicos/${user.id}/classimed-logo-${Date.now()}.${ext}`;

        const { error: uploadErroLogo } = await supabase.storage
          .from(bucket)
          .upload(path, logoFile);

        if (uploadErroLogo) {
          console.error("Erro upload logo Classimed:", uploadErroLogo);
          throw uploadErroLogo;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        logoUrl = data.publicUrl;
      }

      // INSERT no Supabase
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "servico",
        subcategoria_servico: "classimed",
        titulo,
        descricao,
        cidade,
        bairro,
        // profissional / clínica
        nome_contato: nomeProfissional,
        nome_negocio: nomeClinica,
        area_profissional: especialidade,
        horario_atendimento: horarioAtendimento,
        atende_domicilio: atendeDomicilio,
        faixa_preco: faixaPreco,
        site_url: siteUrl,
        instagram,
        // contatos
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        // imagem principal
        imagens: logoUrl ? [logoUrl] : null,
        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar anúncio Classimed:", insertError);
        setErro(
          `Erro ao salvar seu anúncio. Tente novamente: ${
            insertError.message || ""
          }`
        );
        setUploading(false);
        return;
      }

      setSucesso("Anúncio Classimed publicado com sucesso!");

      // Limpar formulário
      setTitulo("");
      setCidade("");
      setBairro("");
      setEspecialidade("");
      setDescricao("");
      setNomeProfissional("");
      setNomeClinica("");
      setHorarioAtendimento("");
      setAtendeDomicilio(false);
      setFaixaPreco("");
      setSiteUrl("");
      setInstagram("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setLogoFile(null);
      setAceitoTermos(false);

      setUploading(false);

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro(
        `Erro ao salvar seu anúncio. Tente novamente: ${
          err.message || "Erro inesperado."
        }`
      );
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* TÍTULO DO ANÚNCIO */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">
            Título do anúncio *
          </label>

          {/* Tooltip */}
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Escreva um título claro, por exemplo:
              <br />
              <strong>
                “Psicóloga clínica – Terapia cognitivo-comportamental em
                Maricá”
              </strong>
              .
            </div>
          </div>
        </div>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ex.: Psicóloga clínica – Terapia cognitivo-comportamental em Maricá"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* LOCALIZAÇÃO */}
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
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Ex.: Centro, Itaipuaçu, Bacaxá..."
            />
          </div>
        </div>
      </div>

      {/* ESPECIALIDADE */}
      <div className="space-y-1 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">
            Especialidade / área de atuação *
          </label>

          {/* Tooltip */}
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Escolha a área principal do seu atendimento. Isso organiza o
              Classimed e facilita a busca dos usuários.
            </div>
          </div>
        </div>

        <select
          className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {especialidades.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {/* DESCRIÇÃO DO SERVIÇO */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">
            Descrição do serviço *
          </label>

          {/* Tooltip */}
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Explique sua forma de atendimento, público-alvo, convênios (se
              houver), cidades atendidas e diferenciais. Quanto mais claro,
              mais fácil para o paciente escolher.
            </div>
          </div>
        </div>

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-32"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Atendo adultos e adolescentes, presencial em Maricá e online para todo o Brasil. Trabalho com abordagem X, convênios Y..."
          required
        />
      </div>

      {/* PROFISSIONAL / CLÍNICA */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Profissional / clínica
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Nome do profissional / responsável
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={nomeProfissional}
              onChange={(e) => setNomeProfissional(e.target.value)}
              placeholder="Ex.: Dra. Maria Silva"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Clínica / consultório (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={nomeClinica}
              onChange={(e) => setNomeClinica(e.target.value)}
              placeholder="Ex.: Espaço Vida Plena"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700">
                Horário de atendimento
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={horarioAtendimento}
                onChange={(e) => setHorarioAtendimento(e.target.value)}
                placeholder="Ex.: Seg a sex, 9h às 18h / Sábados até 13h"
              />
            </div>

            <label className="mt-5 flex items-center gap-2 text-[11px] text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={atendeDomicilio}
                onChange={(e) => setAtendeDomicilio(e.target.checked)}
              />
              Atende em domicílio
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Faixa de preço (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={faixaPreco}
              onChange={(e) => setFaixaPreco(e.target.value)}
              placeholder="Ex.: Sessões a partir de R$ 150"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Site / página (opcional)
              </label>
              <input
                type="url"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Instagram (opcional)
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seu_perfil"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOGO / FOTO */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Logo / foto do espaço (opcional)
        </h2>
        <input
          type="file"
          accept="image/*"
          className="w-full text-xs"
          onChange={(e) => setLogoFile(e.target.files[0] || null)}
        />
        <p className="text-[11px] text-slate-500">
          Imagem quadrada ou horizontal funciona melhor na vitrine.
        </p>
      </div>

      {/* CONTATOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Contatos</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Telefone
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
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
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será
          exibido para contato dos pacientes.
        </p>
      </div>

      {/* CONFIRMAÇÃO */}
      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações preenchidas são verdadeiras e autorizo
            que este anúncio seja exibido no Classimed / Classilagos para
            pacientes da Região dos Lagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="mt-2 w-full bg-emerald-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {uploading ? "Publicando serviço..." : "Publicar meu serviço em saúde"}
      </button>
    </form>
  );
}
