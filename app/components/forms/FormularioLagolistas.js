"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioLagolistas() {
  const router = useRouter();

  // CAMPOS PRINCIPAIS
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");

  const [segmento, setSegmento] = useState(""); // vai em area_profissional

  // DADOS DA EMPRESA / PROFISSIONAL
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [registroProfissional, setRegistroProfissional] = useState("");

  // CONTATOS
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  // IMAGEM / LOGO
  const [imagemFile, setImagemFile] = useState(null);

  // CONTROLE
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
    "Mercados & mercearias",
    "Farmácias & drogarias",
    "Bares, restaurantes & lanchonetes",
    "Pizzarias & delivery",
    "Padarias & confeitarias",
    "Lojas de roupas & calçados",
    "Lojas de materiais de construção",
    "Depósitos & home center",
    "Imobiliárias",
    "Concessionárias & revendas de veículos",
    "Lojas de autopeças & serviços automotivos",
    "Hotéis, pousadas & hospedagem",
    "Clínicas, consultórios & saúde",
    "Beleza & bem-estar",
    "Educação & cursos",
    "Serviços em geral",
    "Turismo & passeios",
    "Órgãos públicos & serviços da prefeitura",
    "Serviços de emergência & utilidade pública",
    "Profissionais liberais",
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
      setErro("Você precisa estar logado para fazer um cadastro no LagoListas.");
      router.push("/login");
      return;
    }

    if (!titulo || !cidade || !segmento) {
      setErro("Preencha título, cidade e categoria principal.");
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
          console.error("Erro upload imagem LagoListas:", uploadErro);
          throw uploadErro;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        imagemUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "lagolistas",

        titulo,
        descricao,
        cidade,
        bairro,
        endereco,

        area_profissional: segmento,

        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        site_url: siteUrl,
        instagram,

        cnpj,
        razao_social: razaoSocial,
        inscricao_municipal: inscricaoMunicipal,
        registro_profissional: registroProfissional,

        imagens: imagemUrl ? [imagemUrl] : null,
        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar cadastro LagoListas:", insertError);
        setErro(
          "Erro ao salvar o cadastro. Tente novamente em alguns instantes."
        );
        setUploading(false);
        return;
      }

      setSucesso("Cadastro no LagoListas realizado com sucesso!");

      // limpa tudo
      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setEndereco("");
      setSegmento("");

      setRazaoSocial("");
      setCnpj("");
      setInscricaoMunicipal("");
      setRegistroProfissional("");

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
        `Erro ao salvar seu cadastro no LagoListas: ${
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

      {/* DADOS DO CADASTRO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações do cadastro no LagoListas
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título do cadastro *
            <span
              className="ml-1 text-[11px] text-slate-400 cursor-help"
              title="Esse será o nome em destaque na lista. Ex.: Supermercado Mar Azul, Imobiliária Lagoa Viva, Clínica Vida Plena."
            >
              ⓘ
            </span>
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Supermercado Mar Azul, Imobiliária Lagoa Viva..."
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
              placeholder="Ex.: Centro, Itaipuaçu, Praia do Forte..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Endereço completo
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Av. Beira Mar, 123 - Loja 2"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Categoria principal *
            <span
              className="ml-1 text-[11px] text-slate-400 cursor-help"
              title="Escolha o tipo principal do seu negócio. Isso organiza o LagoListas e ajuda na busca."
            >
              ⓘ
            </span>
          </label>
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Descrição / observações *
            <span
              className="ml-1 text-[11px] text-slate-400 cursor-help"
              title="Resuma o que a empresa oferece: principais produtos/serviços, diferenciais, horário de atendimento, formas de pagamento etc."
            >
              ⓘ
            </span>
          </label>
          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-28 resize-none"
            placeholder="Fale rapidamente sobre o que sua empresa oferece e quais são os principais diferenciais."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* DADOS DA EMPRESA / REGISTROS */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Empresa / profissional (opcional)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Razão social (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Ex.: Lagoa Viva Comércio de Alimentos LTDA"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              CNPJ (opcional)
              <span
                className="ml-1 text-[11px] text-slate-400 cursor-help"
                title="Informar o CNPJ é opcional, mas aumenta a confiança de quem busca."
              >
                ⓘ
              </span>
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="Ex.: 12.345.678/0001-90"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inscrição municipal (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={inscricaoMunicipal}
              onChange={(e) => setInscricaoMunicipal(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registro profissional (CRECI, CRM, OAB, CREA etc.) (opcional)
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={registroProfissional}
              onChange={(e) => setRegistroProfissional(e.target.value)}
              placeholder="Ex.: CRECI 12345-RJ, OAB/RJ 0000..."
            />
          </div>
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
              placeholder="Ex.: https://minhaempresa.com.br"
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
              placeholder="@minhaempresa"
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

      {/* IMAGEM / LOGO */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Logo ou foto principal (opcional)
        </h2>
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => setImagemFile(e.target.files[0] || null)}
        />
        <p className="text-[11px] text-slate-500">
          Envie uma imagem em JPG ou PNG, até 1 MB. Ela aparecerá como destaque
          no cadastro.
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
            responsável por qualquer negociação realizada a partir deste
            anúncio. Estou de acordo com os termos de uso do Classilagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {uploading
          ? "Publicando cadastro no LagoListas..."
          : "Publicar cadastro no LagoListas"}
      </button>
    </form>
  );
}
