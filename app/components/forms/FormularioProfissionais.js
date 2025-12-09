"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioProfissionais() {
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

  // AGORA: várias imagens (array)
  const [imagensFiles, setImagensFiles] = useState([]);

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

  const servicosProfissionais = [
    "Eletricista",
    "Encanador",
    "Marido de aluguel",
    "Pedreiro / Reformas",
    "Pintor",
    "Gesseiro",
    "Azulejista",
    "Marceneiro / Carpinteiro",
    "Serralheiro",
    "Vidraceiro",
    "Piscineiro (Cuidador de piscinas)",
    "Jardineiro / Paisagismo",
    "Diarista / Faxineira",
    "Passadeira",
    "Reboque / Guincho",
    "Cuidador(a) de idosos",
    "Babá / Cuidador(a) infantil",
    "Churrasqueiro",
    "Cozinheiro(a) / Marmitex / Quentinha",
    "Técnico em informática",
    "Manutenção de celulares",
    "Manutenção de eletrônicos e eletrodomésticos",
    "Manutenção de ar-condicionado / refrigeração",
    "Chaveiro",
    "Motorista particular / Transporte executivo",
    "Transporte / Frete / Carreto",
    "Van escolar",
    "Arquiteto",
    "Engenheiro civil",
    "Engenheiro elétrico",
    "Engenheiro mecânico",
    "Designer de interiores",
    "Aulas particulares",
    "Aulas de música / canto / instrumentos",
    "Aulas de idiomas",
    "Designer gráfico",
    "Social media / Marketing digital",
    "Consultor(a) / Mentor(a)",
    "Outros serviços profissionais",
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
      setErro("Preencha título, cidade e tipo de serviço profissional.");
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

      // -----------------------------
      // UPLOAD DE VÁRIAS IMAGENS
      // -----------------------------
      let imagensUrls = [];

      if (imagensFiles && imagensFiles.length > 0) {
        let index = 0;
        for (const file of imagensFiles) {
          if (!file) continue;

          const ext = file.name.split(".").pop();
          const path = `servicos/${user.id}/profissionais-${Date.now()}-${index}.${ext}`;
          index++;

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
        subcategoria_servico: "profissionais",

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

        // agora é um ARRAY de imagens
        imagens: imagensUrls.length > 0 ? imagensUrls : null,
        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar serviço:", insertError);
        setErro("Erro ao salvar o anúncio. Tente novamente em alguns instantes.");
        setUploading(false);
        return;
      }

      setSucesso("Serviço profissional cadastrado com sucesso!");

      // limpa formulário
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
          Informações do serviço profissional
        </h2>

        {/* TÍTULO DO ANÚNCIO */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Título do anúncio *
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Esse será o título em destaque no card do seu serviço profissional."
            >
              i
            </span>
          </div>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Eletricista residencial, Diarista de confiança, Aulas de violão..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        {/* CIDADE / BAIRRO */}
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

        {/* TIPO DE SERVIÇO */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Tipo de serviço profissional *
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Escolha o serviço principal. Isso organiza o portal e facilita a busca pelos clientes."
            >
              i
            </span>
          </div>
          <select
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
            value={areaProfissional}
            onChange={(e) => setAreaProfissional(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {servicosProfissionais.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">
            Escolha o serviço principal. Essa seleção já organiza o portal e
            melhora a busca.
          </p>
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Descrição do serviço *
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Descreva o que você faz, sua experiência, diferenciais, cidades atendidas e formas de atendimento."
            >
              i
            </span>
          </div>
          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-28 resize-none"
            placeholder="Descreva o que você faz, tipos de serviços, cidades em que atende, experiência, diferenciais, formas de pagamento etc."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* PROFISSIONAL / NEGÓCIO */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Profissional / empresa (se houver)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do profissional / responsável
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
              Nome da empresa (se tiver)
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
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Horário de atendimento
              </label>
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
                title="Informe os dias e horários em que você costuma atender ou responder clientes."
              >
                i
              </span>
            </div>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Ex.: Seg a sáb, 8h às 18h / Atendo emergências"
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
            Atendo em domicílio
          </label>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Faixa de preço (opcional)
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Você pode informar valores iniciais ou uma faixa, sem precisar definir um preço fechado."
            >
              i
            </span>
          </div>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Diárias a partir de R$ 120, Serviços a combinar"
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
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
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
        <div className="flex items-center gap-1 mb-1">
          <h2 className="text-sm font-semibold text-slate-900">
            Fotos do serviço / logo (opcional)
          </h2>
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
            title="Envie fotos do seu serviço ou sua logo. A primeira imagem será usada em destaque no card."
          >
            i
          </span>
        </div>
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
          Você pode enviar várias imagens em JPG ou PNG, até 1 MB cada. A
          primeira será usada como destaque no anúncio.
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
        {uploading ? "Publicando serviço..." : "Publicar serviço profissional"}
      </button>
    </form>
  );
}
