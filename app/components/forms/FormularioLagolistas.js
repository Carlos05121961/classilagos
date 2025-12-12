"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioLagolistas() {
  const router = useRouter();

  // Campos principais
  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");

  // Segmento / categoria do negócio (vai para area_profissional)
  const [segmento, setSegmento] = useState("");

  // Dados da empresa / comércio
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [registroProfissional, setRegistroProfissional] = useState("");

  // Descrição
  const [descricao, setDescricao] = useState("");

  // Links
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Imagens
  const [logoFile, setLogoFile] = useState(null);
  const [fotosFiles, setFotosFiles] = useState([]);

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

    // Mesma lista de segmentos usada na página /lagolistas (ordem alfabética)
  const segmentosLagolistas = [
    "Academias, pilates & estúdios de treino",
    "Advogados & serviços jurídicos",
    "Agências de publicidade & marketing digital",
    "Agências de viagens & turismo",
    "Assistência técnica (celular, informática, eletro)",
    "Autoescolas",
    "Autopeças & acessórios",
    "Bares & pubs",
    "Barbearias",
    "Bazar, utilidades & presentes",
    "Buffets, salgados & bolos",
    "Chaveiros",
    "Clínicas de estética & depilação",
    "Clínicas médicas & consultórios",
    "Clínicas odontológicas / dentistas",
    "Clínicas veterinárias & pet shops",
    "Comércio geral & lojas de rua",
    "Concessionárias & lojas de veículos",
    "Consultoria empresarial & administrativa",
    "Contabilidade & serviços contábeis",
    "Cursos de idiomas",
    "Dedetização & controle de pragas",
    "Delivery de marmita & refeições",
    "Depósitos de gás e água mineral",
    "Eletrodomésticos & eletrônicos",
    "Escolas, cursos & reforço escolar",
    "Faculdades & ensino superior",
    "Farmácias & drogarias",
    "Fisioterapia & terapias integradas",
    "Fotografia & filmagem de eventos",
    "Funilaria & pintura automotiva",
    "Gráficas & comunicação visual",
    "Hospitais & prontos-socorros",
    "Hotéis, pousadas & hospedagem",
    "Imobiliárias & corretores",
    "Internet, provedores & tecnologia",
    "Jardinagem, paisagismo & piscinas",
    "Joalherias & semijoias",
    "Lava-rápido & estética automotiva",
    "Lavanderias & tinturarias",
    "Locação de brinquedos, som & estrutura",
    "Lojas de roupas & calçados",
    "Materiais de construção & home center",
    "Motoboy & entregas rápidas",
    "Móveis & decoração",
    "Oficinas mecânicas & auto centers",
    "Organização de festas & eventos",
    "Outros serviços & negócios",
    "Padarias & confeitarias",
    "Papelarias, livrarias & copiadoras",
    "Pizzarias, lanchonetes & fast food",
    "Pneus, rodas & alinhamento",
    "Psicólogos, terapeutas & coaching",
    "Restaurantes & churrascarias",
    "Salões de beleza, manicure & cabeleireiros",
    "Seguradoras & corretores de seguros",
    "Serviços de limpeza & diaristas",
    "Serviços funerários",
    "Supermercados, hortifrutis & mercearias",
    "Transportes, fretes & mudanças",
    "Óticas & relojoarias",
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
    if (!titulo || !cidade || !descricao) {
      setErro(
        "Preencha pelo menos o título, a cidade e a descrição do seu comércio/serviço."
      );
      return;
    }

    if (!segmento) {
      setErro("Selecione a categoria/segmento do seu negócio.");
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
        "Para publicar no Lagolistas, marque a opção confirmando que as informações são verdadeiras."
      );
      return;
    }

    setUploading(true);

    let logoUrl = null;
    const fotosUrls = [];

    try {
      const bucket = "anuncios";

      // Upload da LOGO (opcional)
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `lagolistas/${user.id}/lagolistas-logo-${Date.now()}.${ext}`;

        const { error: uploadErroLogo } = await supabase.storage
          .from(bucket)
          .upload(path, logoFile);

        if (uploadErroLogo) {
          console.error("Erro upload logo Lagolistas:", uploadErroLogo);
          throw uploadErroLogo;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        logoUrl = data.publicUrl;
      }

      // Upload de FOTOS (até 5)
      if (fotosFiles && fotosFiles.length > 0) {
        const arquivos = Array.from(fotosFiles).slice(0, 5);

        for (let i = 0; i < arquivos.length; i++) {
          const file = arquivos[i];
          const ext = file.name.split(".").pop();
          const path = `lagolistas/${user.id}/lagolistas-foto-${Date.now()}-${i}.${ext}`;

          const { error: uploadErroFoto } = await supabase.storage
            .from(bucket)
            .upload(path, file);

          if (uploadErroFoto) {
            console.error("Erro upload foto Lagolistas:", uploadErroFoto);
            throw uploadErroFoto;
          }

          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          fotosUrls.push(data.publicUrl);
        }
      }

      // Montar array final de imagens:
      // se tiver logo, ela entra primeiro; depois as fotos
      let imagens = null;
      if (logoUrl && fotosUrls.length > 0) {
        imagens = [logoUrl, ...fotosUrls];
      } else if (logoUrl && fotosUrls.length === 0) {
        imagens = [logoUrl];
      } else if (!logoUrl && fotosUrls.length > 0) {
        imagens = fotosUrls;
      } else {
        imagens = null;
      }

      // INSERT no Supabase
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,

        // Categoria fixada para o Lagolistas
        categoria: "lagolistas",

        titulo,
        descricao,
        cidade,
        bairro,
        endereco,

        // segmento do negócio → area_profissional
        area_profissional: segmento,

        // dados da empresa
        nome_negocio: nomeNegocio || null,
        razao_social: razaoSocial || null,
        cnpj: cnpj || null,
        inscricao_municipal: inscricaoMunicipal || null,
        registro_profissional: registroProfissional || null,

        // links
        site_url: siteUrl || null,
        instagram: instagram || null,

        // contatos
        telefone: telefone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        contato: contatoPrincipal,

        // imagens
        imagens,

        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar anúncio Lagolistas:", insertError);
        setErro(
          `Erro ao salvar seu anúncio. Tente novamente: ${
            insertError.message || ""
          }`
        );
        setUploading(false);
        return;
      }

      setSucesso("Anúncio publicado com sucesso no Lagolistas! 🎉");

      // Limpar formulário
      setTitulo("");
      setCidade("");
      setBairro("");
      setEndereco("");
      setSegmento("");
      setNomeNegocio("");
      setRazaoSocial("");
      setCnpj("");
      setInscricaoMunicipal("");
      setRegistroProfissional("");
      setDescricao("");
      setSiteUrl("");
      setInstagram("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setLogoFile(null);
      setFotosFiles([]);
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

          {/* nuvenzinha */}
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Ex.:{" "}
              <strong>
                “Clínica Veterinária São Tomé – Atendimento 24h em Saquarema”
              </strong>{" "}
              ou{" "}
              <strong>
                “Loja de Materiais de Construção Central – Entrega em toda a
                região”
              </strong>
              .
            </div>
          </div>
        </div>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ex.: Supermercado Lagoa Viva – Ofertas todos os dias"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* CIDADE + BAIRRO + SEGMENTO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Localização e segmento
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
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
              Bairro / Região (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Ex.: Centro, Itaipuaçu, Braga..."
            />
          </div>

          {/* SEGMENTO */}
          <div>
            <div className="flex items-center justify-between gap-1">
              <label className="block text-xs font-medium text-slate-700">
                Categoria / segmento *
              </label>
              {/* nuvenzinha */}
              <div className="relative group text-[11px] text-slate-500 cursor-help">
                <span>ℹ</span>
                <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
                  Escolha o tipo de negócio mais próximo do seu. Isso ajuda
                  muito na busca do LagoListas.
                </div>
              </div>
            </div>

            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={segmento}
              onChange={(e) => setSegmento(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {segmentosLagolistas.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Endereço completo (opcional, mas recomendado)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, número, sala, ponto de referência..."
          />
        </div>
      </div>

      {/* DADOS DA EMPRESA */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Dados da empresa / comércio
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Nome fantasia / nome do comércio
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
              placeholder="Ex.: Clínica Veterinária São Tomé"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Razão social (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Ex.: São Tomé Serviços Veterinários LTDA"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              CNPJ (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Inscrição municipal (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={inscricaoMunicipal}
              onChange={(e) => setInscricaoMunicipal(e.target.value)}
              placeholder="Ex.: 123456-7"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Registro profissional (CRECI, CRM, OAB etc.) – opcional
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={registroProfissional}
              onChange={(e) => setRegistroProfissional(e.target.value)}
              placeholder="Ex.: CRECI 12345-RJ"
            />
          </div>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-1 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">
            Descrição do seu comércio / serviços *
          </label>

          {/* nuvenzinha */}
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Fale o que você oferece, diferenciais, horário de funcionamento,
              formas de pagamento, delivery, estacionamento, convênios etc.
            </div>
          </div>
        </div>

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-32"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Clínica veterinária com atendimento 24h, exames, cirurgias, vacinas, pet shop e banho & tosa..."
          required
        />
      </div>

      {/* LINKS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Links (opcional)</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Site / página
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
              Instagram
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

      {/* LOGO + FOTOS */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Logo e fotos do comércio
        </h2>

        {/* LOGO */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-800">
              Logo da empresa (opcional, mas recomendado)
            </label>
            {/* nuvenzinha */}
            <div className="relative group text-[11px] text-slate-500 cursor-help">
              <span>ℹ</span>
              <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
                Se tiver logomarca, envie aqui. Ela aparece em destaque no
                LagoListas junto com as fotos.
              </div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            className="w-full text-xs"
            onChange={(e) => setLogoFile(e.target.files[0] || null)}
          />
        </div>

        {/* FOTOS */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-800">
              Fotos do seu comércio (até 5)
            </label>
            {/* nuvenzinha */}
            <div className="relative group text-[11px] text-slate-500 cursor-help">
              <span>ℹ</span>
              <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
                Priorize fachada, interior, produtos, vitrines ou equipe. Isso
                deixa seu anúncio muito mais atrativo.
              </div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full text-xs"
            onChange={(e) => setFotosFiles(e.target.files || [])}
          />

          <p className="text-[11px] text-slate-500">
            Você pode selecionar várias imagens de uma vez (máximo de 5).
          </p>
        </div>
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
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será exibido
          para contato dos clientes.
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
            Declaro que as informações preenchidas são verdadeiras e autorizo que
            este anúncio seja exibido no Lagolistas / Classilagos para os
            consumidores da Região dos Lagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {uploading
          ? "Publicando anúncio..."
          : "Publicar meu comércio no Lagolistas"}
      </button>
    </form>
  );
}
