"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioEventos() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [nomeProfissional, setNomeProfissional] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [areaProfissional, setAreaProfissional] = useState("");

  const [atendeDomicilio, setAtendeDomicilio] = useState(false);
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [faixaPreco, setFaixaPreco] = useState("");

  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  const [imagemFile, setImagemFile] = useState(null);

  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  const servicosEventos = [
    "Buffet completo",
    "Doces e Salgados (salgadinhos)",
    "Bolo & confeitaria",
    "Decoração de festas",
    "Balões / cenários instagramáveis",
    "DJ",
    "Som e iluminação",
    "Banda / música ao vivo",
    "Fotografia de eventos",
    "Filmagem de eventos",
    "Cerimonial / organização de eventos",
    "Recreação / animação infantil",
    "Aluguel de brinquedos",
    "Espaço para festas / salão",
    "Barracas / tendas / estruturas",
    "Bar de drinks / bartender",
    "Aluguel de mesas, cadeiras e louças",
    "Food truck / carrinhos (pipoca, churros, hot dog etc.)",
    "Outros serviços para eventos",
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

    if (!titulo || !cidade || !areaProfissional) {
      setErro("Preencha título, cidade e tipo de serviço para eventos.");
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
    let imagemUrl = null;

    try {
      const bucket = "anuncios";

      if (imagemFile) {
        const ext = imagemFile.name.split(".").pop();
        const path = `servicos/${user.id}/eventos-${Date.now()}.${ext}`;

        const { error: uploadErro } = await supabase.storage
          .from(bucket)
          .upload(path, imagemFile);

        if (uploadErro) {
          console.error("Erro upload imagem serviço:", uploadErro);
          throw uploadErro;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        imagemUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "servico",
        subcategoria_servico: "eventos",

        titulo,
        descricao,
        cidade,
        bairro,

        nome_contato: nomeProfissional,
        nome_negocio: nomeNegocio,
        area_profissional: areaProfissional,

        atende_domicilio: atendeDomicilio,
        horario_atendimento: horarioAtendimento,
        faixa_preco: faixaPreco,

        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        site_url: siteUrl,
        instagram,

        imagens: imagemUrl ? [imagemUrl] : null,
        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar serviço:", insertError);
        setErro("Erro ao salvar o anúncio. Tente novamente em alguns instantes.");
        setUploading(false);
        return;
      }

      setSucesso("Serviço para festas e eventos cadastrado com sucesso!");

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
      setImagemFile(null);
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

      {/* DADOS DO SERVIÇO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações do serviço para festas e eventos
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Buffet infantil em Maricá, DJ para casamentos, Decoração de festas..."
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tipo de serviço para eventos *
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
            value={areaProfissional}
            onChange={(e) => setAreaProfissional(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {servicosEventos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">
            Escolha o tipo principal. Isso ajuda as pessoas a encontrarem seu
            anúncio com mais facilidade.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Descrição do serviço *
          </label>
          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-28 resize-none"
            placeholder="Explique como funciona seu serviço, tipos de eventos que atende, tamanhos de festa, pacotes, diferenciais, cidades atendidas etc."
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
              Nome do responsável
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={nomeProfissional}
              onChange={(e) => setNomeProfissional(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da empresa / buffet / espaço (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Ex.: Segunda a sábado, 9h às 20h / Atendemos também domingos para eventos"
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
            Atendemos no local do evento
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Faixa de preço (opcional)
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: A partir de R$ 800, Pacotes a combinar"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Ex.: https://meuevento.com.br"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="@meuevento"
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

      {/* IMAGEM */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Foto do serviço / logo (opcional)
        </h2>
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => setImagemFile(e.target.files[0] || null)}
        />
        <p className="text-[11px] text-slate-500">
          Envie uma imagem em JPG ou PNG, até 1 MB. Ela aparecerá como destaque
          no anúncio.
        </p>
      </div>

      {/* RESPONSABILIDADE */}
      <div className="border-t border-slate-200 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
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

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {uploading ? "Publicando serviço..." : "Publicar serviço para eventos"}
      </button>
    </form>
  );
}
