"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioServicos() {
  const router = useRouter();

  // Tipo de serviço (subcategoria)
  const [tipoServico, setTipoServico] = useState(""); // classimed | eventos | profissionais

  // Dados básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Dados do profissional / negócio
  const [nomeProfissional, setNomeProfissional] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [areaProfissional, setAreaProfissional] = useState("");

  const [atendeDomicilio, setAtendeDomicilio] = useState(false);
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [faixaPreco, setFaixaPreco] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  // Imagens (AGORA: múltiplas fotos)
  const [imagensFiles, setImagensFiles] = useState([]); // array de File

  // Controle
  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar um serviço.");
      router.push("/login");
      return;
    }

    if (!tipoServico) {
      setErro("Escolha o tipo de serviço que deseja anunciar.");
      return;
    }

    if (!titulo || !cidade || !areaProfissional) {
      setErro("Preencha pelo menos título, cidade e área/tipo de serviço.");
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
        "Para publicar o anúncio, marque a declaração de responsabilidade pelas informações."
      );
      return;
    }

    setUploading(true);

    try {
      const bucket = "anuncios";

      // 🔹 Upload de TODAS as imagens selecionadas
      const imagensUrls = [];

      if (imagensFiles.length > 0) {
        for (const file of imagensFiles) {
          const ext = file.name.split(".").pop();
          const path = `servicos/${user.id}/foto-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${ext}`;

          const { error: uploadErro } = await supabase.storage
            .from(bucket)
            .upload(path, file);

          if (uploadErro) {
            console.error("Erro upload imagem serviço:", uploadErro);
            throw uploadErro;
          }

          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          if (data?.publicUrl) {
            imagensUrls.push(data.publicUrl);
          }
        }
      }

      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "servico",
        subcategoria_servico: tipoServico, // classimed | eventos | profissionais

        titulo,
        descricao,
        cidade,
        bairro,

        // Dados do profissional / negócio
        nome_contato: nomeProfissional,
        nome_negocio: nomeNegocio,
        area_profissional: areaProfissional,

        atende_domicilio: atendeDomicilio,
        horario_atendimento: horarioAtendimento,
        faixa_preco: faixaPreco,

        // Contatos
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        site_url: siteUrl,
        instagram,

        // Imagens (AGORA: array com todas as fotos)
        imagens: imagensUrls.length > 0 ? imagensUrls : null,

        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar serviço:", insertError);
        setErro(
          `Erro ao salvar seu anúncio de serviço. Tente novamente em alguns instantes.`
        );
        setUploading(false);
        return;
      }

      setSucesso("Serviço cadastrado com sucesso!");

      // Limpa campos
      setTipoServico("");
      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setNomeProfissional("");
      setNomeNegocio("");
      setAreaProfissional("");
      setAtendeDomicilio(false);
      setHorarioAtendimento("");
      setFaixaPreco("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setSiteUrl("");
      setInstagram("");
      setImagensFiles([]);
      setAceitoResponsabilidade(false);

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro(
        `Erro ao salvar seu anúncio de serviço: ${
          err.message || "tente novamente."
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* TIPO DE SERVIÇO */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">
          Tipo de serviço
        </h2>
        <p className="text-[11px] text-slate-600 mb-1">
          Escolha em qual área o seu anúncio se encaixa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] md:text-xs">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 cursor-pointer hover:border-emerald-500">
            <input
              type="radio"
              name="tipo-servico"
              value="classimed"
              checked={tipoServico === "classimed"}
              onChange={(e) => setTipoServico(e.target.value)}
              className="h-3 w-3"
            />
            <span>
              <span className="font-semibold">Classimed</span> – Saúde e
              bem-estar
            </span>
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 cursor-pointer hover:border-fuchsia-500">
            <input
              type="radio"
              name="tipo-servico"
              value="eventos"
              checked={tipoServico === "eventos"}
              onChange={(e) => setTipoServico(e.target.value)}
              className="h-3 w-3"
            />
            <span>
              <span className="font-semibold">Festas e Eventos</span>
            </span>
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 cursor-pointer hover:border-sky-500">
            <input
              type="radio"
              name="tipo-servico"
              value="profissionais"
              checked={tipoServico === "profissionais"}
              onChange={(e) => setTipoServico(e.target.value)}
              className="h-3 w-3"
            />
            <span>
              <span className="font-semibold">Profissionais Liberais</span> e
              serviços em geral
            </span>
          </label>
        </div>
      </div>

      {/* DADOS BÁSICOS */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações do serviço
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Ex.: Eletricista residencial em Maricá, Psicóloga clínica, Buffet infantil..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cidade *
            </label>
            <select
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bairro / Região
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Área / tipo de serviço *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Ex.: Psicólogo, Nutricionista, Diarista, Eletricista, Buffet, DJ..."
            value={areaProfissional}
            onChange={(e) => setAreaProfissional(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Descrição do serviço *
          </label>
          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Explique o que você faz, em quais cidades atende, formas de atendimento, diferenciais, etc."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* PROFISSIONAL / NEGÓCIO */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Profissional / empresa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do profissional / responsável
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={nomeProfissional}
              onChange={(e) => setNomeProfissional(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do negócio (clínica, salão, empresa…) (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Horário de atendimento
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              placeholder="Ex.: Seg a sex, 9h às 18h / Sábados até 13h"
              value={horarioAtendimento}
              onChange={(e) => setHorarioAtendimento(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-[11px] text-slate-700">
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Faixa de preço (opcional)
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Ex.: A partir de R$ 100, A combinar"
            value={faixaPreco}
            onChange={(e) => setFaixaPreco(e.target.value)}
          />
        </div>
      </div>

      {/* CONTATOS */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Contatos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Site / página (opcional)
            </label>
            <input
              type="url"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              placeholder="Ex.: https://meuservico.com.br"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instagram ou rede social (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              placeholder="@meuservico"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será
          exibido para contato.
        </p>
      </div>

      {/* IMAGENS */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Fotos do serviço / logo (opcional)
        </h2>
        <input
          type="file"
          accept="image/*"
          multiple
          className="text-sm"
          onChange={(e) =>
            setImagensFiles(Array.from(e.target.files || []))
          }
        />
        <p className="text-[11px] text-slate-500">
          Você pode enviar várias imagens (JPG ou PNG, até 1 MB cada). Elas
          aparecerão na galeria do anúncio.
        </p>
      </div>

      {/* RESPONSABILIDADE */}
      <div className="border-t border-slate-200 pt-4">
        <label className="flex items-start gap-2 text-[11px] md:text-xs text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={aceitoResponsabilidade}
            onChange={(e) => setAceitoResponsabilidade(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que sou
            responsável por qualquer negociação realizada a partir deste
            serviço. Estou de acordo com os termos de uso do Classilagos.
          </span>
        </label>
      </div>

      {/* BOTÃO */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {uploading ? "Publicando serviço..." : "Publicar serviço"}
      </button>
    </form>
  );
}

