"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioLagolistas() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState(""); // aqui será o Endereço / observações
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [segmento, setSegmento] = useState(""); // usa area_profissional no banco

  const [nomeContato, setNomeContato] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");

  const [horarioFuncionamento, setHorarioFuncionamento] = useState("");

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

  const segmentosLagolistas = [
    "Comércio & lojas",
    "Mercados & mercearias",
    "Farmácias & drogarias",
    "Bares, restaurantes & lanchonetes",
    "Pizzarias & delivery",
    "Hotéis, pousadas & hospedagem",
    "Serviços em geral",
    "Saúde, beleza & bem-estar",
    "Educação & escolas",
    "Órgãos públicos & serviços da prefeitura",
    "Serviços de emergência & utilidade pública",
    "Turismo & passeios",
    "Outros",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para cadastrar no LagoListas.");
      router.push("/login");
      return;
    }

    if (!titulo || !cidade || !segmento || !descricao) {
      setErro("Preencha título, cidade, segmento e endereço/observações.");
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
        "Para publicar o cadastro, marque a declaração de responsabilidade pelas informações."
      );
      return;
    }

    setUploading(true);
    let imagemUrl = null;

    try {
      const bucket = "anuncios";

      if (imagemFile) {
        const ext = imagemFile.name.split(".").pop();
        const path = `lagolistas/${user.id}/logo-${Date.now()}.${ext}`;

        const { error: uploadErro } = await supabase.storage
          .from(bucket)
          .upload(path, imagemFile);

        if (uploadErro) {
          console.error("Erro upload imagem lagoListas:", uploadErro);
          throw uploadErro;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        imagemUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "lagolistas",

        titulo,
        descricao, // aqui guardamos Endereço / observações
        cidade,
        bairro,

        nome_contato: nomeContato,
        nome_negocio: nomeNegocio,
        area_profissional: segmento, // usamos como segmento

        horario_atendimento: horarioFuncionamento,

        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        site_url: siteUrl,
        instagram,

        imagens: imagemUrl ? [imagemUrl] : null,
        status: "ativo",
        destaque: false,
      });

      if (insertError) {
        console.error("Erro ao salvar cadastro do LagoListas:", insertError);
        setErro(
          "Erro ao salvar o cadastro. Tente novamente em alguns instantes."
        );
        setUploading(false);
        return;
      }

      setSucesso("Cadastro no LagoListas realizado com sucesso!");

      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setSegmento("");
      setNomeContato("");
      setNomeNegocio("");
      setHorarioFuncionamento("");
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
        `Erro ao salvar seu cadastro: ${err.message || "tente novamente."}`
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

      {/* DADOS BÁSICOS */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Dados do comércio / serviço / órgão público
        </h2>

        {/* TÍTULO */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Nome / título do anúncio *
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Esse será o nome em destaque no LagoListas. Ex.: Farmácia Central, Pizzaria da Orla, Prefeitura de Maricá."
            >
              i
            </span>
          </div>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Farmácia Central, Pizzaria da Orla, Clínica Lagoas..."
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
              placeholder="Ex.: Centro, Itaipuaçu, Bacaxá..."
            />
          </div>
        </div>

        {/* SEGMENTO */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Segmento principal *
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Escolha a categoria que melhor representa este comércio, serviço ou órgão público."
            >
              i
            </span>
          </div>
          <select
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {segmentosLagolistas.map((seg) => (
              <option key={seg} value={seg}>
                {seg}
              </option>
            ))}
          </select>
        </div>

        {/* ENDEREÇO / OBSERVAÇÕES */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Endereço / observações *
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Informe o endereço completo e, se quiser, um ponto de referência ou observação curta."
            >
              i
            </span>
          </div>
          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-20 resize-none"
            placeholder="Ex.: Rua das Lagoas, 123 - Em frente à praça principal. Estacionamento próprio."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* CONTATO / RESPONSÁVEL */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Contato e responsável
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do responsável (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={nomeContato}
              onChange={(e) => setNomeContato(e.target.value)}
              placeholder="Ex.: João da Silva"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome fantasia / razão social (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
              placeholder="Ex.: Supermercado Lago Azul"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Horário de funcionamento
            </label>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
              title="Informe os dias e horários em que o local funciona ou atende o público."
            >
              i
            </span>
          </div>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Seg a sáb, 8h às 20h / Domingos das 9h às 14h"
            value={horarioFuncionamento}
            onChange={(e) => setHorarioFuncionamento(e.target.value)}
          />
        </div>
      </div>

      {/* CONTATOS */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Canais de contato</h2>

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
              placeholder="(21) 0000-0000"
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
              placeholder="(21) 9 0000-0000"
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
              placeholder="contato@exemplo.com"
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
              placeholder="Ex.: https://minhaloja.com.br"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instagram, Facebook ou rede social (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="@minhaloja ou facebook.com/minhaloja"
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
        <div className="flex items-center gap-1 mb-1">
          <h2 className="text-sm font-semibold text-slate-900">
            Logo ou foto da fachada (opcional)
          </h2>
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white cursor-help"
            title="Envie a logo ou uma foto da fachada. Essa imagem aparece junto ao seu cadastro no LagoListas."
          >
            i
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => setImagemFile(e.target.files[0] || null)}
        />
        <p className="text-[11px] text-slate-500">
          Envie uma imagem em JPG ou PNG, até 1 MB.
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
            Declaro que as informações deste cadastro são verdadeiras e que sou
            responsável por qualquer contato ou atendimento realizado a partir
            do LagoListas. Estou de acordo com os termos de uso do Classilagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {uploading ? "Publicando cadastro..." : "Publicar no LagoListas"}
      </button>
    </form>
  );
}
