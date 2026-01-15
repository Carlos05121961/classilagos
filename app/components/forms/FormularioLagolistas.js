"use client";

import { useEffect, useMemo, useState } from "react";
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

  // Imagens (Padrão Premium: logo + capa + galeria)
  const [logoFile, setLogoFile] = useState(null); // opcional
  const [capaFile, setCapaFile] = useState(null); // recomendado
  const [fotosFiles, setFotosFiles] = useState([]); // galeria (até 4) -> total fotos = capa + 4 = 5

  // Estados gerais
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Verificar login
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

  // ===== Previews =====
  const logoPreview = useMemo(() => {
    if (!logoFile) return null;
    return { name: logoFile.name, url: URL.createObjectURL(logoFile) };
  }, [logoFile]);

  const capaPreview = useMemo(() => {
    if (!capaFile) return null;
    return { name: capaFile.name, url: URL.createObjectURL(capaFile) };
  }, [capaFile]);

  const fotosPreviews = useMemo(() => {
    if (!fotosFiles?.length) return [];
    return fotosFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [fotosFiles]);

  useEffect(() => {
    return () => {
      if (logoPreview?.url) {
        try {
          URL.revokeObjectURL(logoPreview.url);
        } catch {}
      }
      if (capaPreview?.url) {
        try {
          URL.revokeObjectURL(capaPreview.url);
        } catch {}
      }
      fotosPreviews.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoFile, capaFile, fotosFiles]);

  // ===== Helpers de upload =====
  async function uploadToPublicUrl(bucket, userId, file, prefix) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `lagolistas/${userId}/${prefix}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file);
    if (upErr) throw upErr;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  function validarAntesDeEnviar() {
    if (!titulo || !cidade || !descricao) {
      return "Preencha pelo menos o título, a cidade e a descrição do seu comércio/serviço.";
    }
    if (!segmento) return "Selecione a categoria/segmento do seu negócio.";

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!aceitoTermos) {
      return "Para publicar no Lagolistas, marque a opção confirmando que as informações são verdadeiras.";
    }

    return "";
  }

  const handleFotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFotosFiles(files.slice(0, 4)); // galeria até 4 (total fotos = capa + 4 = 5)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const valid = validarAntesDeEnviar();
    if (valid) {
      setErro(valid);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    setUploading(true);

    let logoUrl = null;
    let capaUrl = null;
    let galeriaUrls = [];

    try {
      const bucket = "anuncios";

      // 1) Logo (opcional)
      if (logoFile) {
        logoUrl = await uploadToPublicUrl(bucket, user.id, logoFile, "lagolistas-logo");
      }

      // 2) Capa (recomendada)
      if (capaFile) {
        capaUrl = await uploadToPublicUrl(bucket, user.id, capaFile, "lagolistas-capa");
      }

      // 3) Galeria (até 4) - ordem garantida
      if (fotosFiles && fotosFiles.length > 0) {
        const uploads = await Promise.all(
          fotosFiles.map(async (file, index) => {
            const url = await uploadToPublicUrl(bucket, user.id, file, `lagolistas-foto-${index}`);
            return { index, url };
          })
        );
        uploads.sort((a, b) => a.index - b.index);
        galeriaUrls = uploads.map((u) => u.url);
      }

      // Montar imagens (compatível com seu banco):
      // logo primeiro, depois capa, depois galeria (máximo 6 itens)
      const imagens = [
        ...(logoUrl ? [logoUrl] : []),
        ...(capaUrl ? [capaUrl] : []),
        ...(galeriaUrls || []),
      ].slice(0, 6);

      const contatoPrincipal = whatsapp || telefone || email;

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

        // imagens (logo + capa + galeria)
        imagens: imagens.length ? imagens : null,

        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar anúncio Lagolistas:", insertError);
        setErro(`Erro ao salvar seu anúncio. Tente novamente: ${insertError.message || ""}`);
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
      setCapaFile(null);
      setFotosFiles([]);
      setAceitoTermos(false);

      setUploading(false);

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro(
        `Erro ao salvar seu anúncio. Tente novamente: ${err?.message || "Erro inesperado."}`
      );
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ALERTAS */}
      {erro && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xs md:text-sm font-semibold text-red-700">⚠️ Atenção</p>
          <p className="text-xs md:text-sm text-red-700 mt-1">{erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xs md:text-sm font-semibold text-emerald-700">✅ Tudo certo</p>
          <p className="text-xs md:text-sm text-emerald-700 mt-1">{sucesso}</p>
        </div>
      )}

      {/* CABEÇALHO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
              LagoListas • anúncio grátis
            </span>
            <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-slate-900">
              Cadastro do seu comércio / serviço
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-600 max-w-2xl">
              Coloque uma boa logo e uma foto bonita de capa. Isso valoriza seu anúncio e deixa o
              Classilagos mais elegante automaticamente.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Dicas rápidas</p>
            <ul className="mt-1 list-disc ml-4 space-y-1">
              <li>Use uma foto de capa bem bonita (fachada, vitrine ou ambiente).</li>
              <li>Depois coloque 2–4 fotos extras (produtos, interior, equipe).</li>
              <li>Preencha a descrição com horário e formas de atendimento.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ UPLOADS NO TOPO (PADRÃO PREMIUM) */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Fotos e logomarca (no topo)</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Recomendado: JPG/PNG até ~2MB. Você já tem esquema de reduzir/WEBP também 🔥
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* LOGO */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">
              Logomarca (opcional, mas recomendado)
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              Sua logo entra primeiro no anúncio e ajuda a valorizar a marca.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile((e.target.files && e.target.files[0]) || null)}
              className="mt-3 w-full text-xs"
            />

            {logoPreview && (
              <div className="mt-3 max-w-xs rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview.url}
                  alt={logoPreview.name}
                  className="w-full h-40 object-contain bg-white"
                />
                <div className="px-2 py-2">
                  <p className="text-[10px] text-slate-600 line-clamp-1">{logoPreview.name}</p>
                </div>
              </div>
            )}

            {logoFile && (
              <button
                type="button"
                onClick={() => setLogoFile(null)}
                className="mt-3 text-xs font-semibold text-slate-700 underline"
              >
                Remover logomarca
              </button>
            )}
          </div>

          {/* CAPA */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">
              Foto de capa (recomendada)
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              Essa deve ser a foto mais bonita (fachada / vitrine / ambiente).
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCapaFile((e.target.files && e.target.files[0]) || null)}
              className="mt-3 w-full text-xs"
            />

            {capaPreview && (
              <div className="mt-3 max-w-xs rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capaPreview.url}
                  alt={capaPreview.name}
                  className="w-full h-40 object-cover bg-white"
                />
                <div className="px-2 py-2">
                  <p className="text-[10px] text-slate-600 line-clamp-1">{capaPreview.name}</p>
                </div>
              </div>
            )}

            {capaFile && (
              <button
                type="button"
                onClick={() => setCapaFile(null)}
                className="mt-3 text-xs font-semibold text-slate-700 underline"
              >
                Remover capa
              </button>
            )}
          </div>
        </div>

        {/* GALERIA */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-700">
            Galeria (opcional) — até 4 fotos
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Fotos extras (interior, produtos, equipe, detalhes).
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFotosChange}
            className="mt-3 w-full text-xs"
          />

          {fotosFiles.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-slate-600">
                {fotosFiles.length} arquivo(s) selecionado(s).
              </p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {fotosPreviews.map((p) => (
                  <div
                    key={p.url}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="w-full h-28 object-cover" />
                    <div className="px-2 py-2">
                      <p className="text-[10px] text-slate-600 line-clamp-1">{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setFotosFiles([])}
                className="mt-3 text-xs font-semibold text-slate-700 underline"
              >
                Remover todas as fotos da galeria
              </button>
            </div>
          )}

          <p className="mt-2 text-[11px] text-slate-500">
            Se der erro no upload: tente fotos menores (até ~2MB) e em JPG.
          </p>
        </div>
      </div>

      {/* TÍTULO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[11px] font-semibold text-slate-700">
            Título do anúncio <span className="text-red-600">*</span>
          </label>

          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Ex.: <strong>“Clínica Veterinária São Tomé – Atendimento 24h em Saquarema”</strong>
            </div>
          </div>
        </div>

        <input
          type="text"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex.: Supermercado Lagoa Viva – Ofertas todos os dias"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* LOCALIZAÇÃO + SEGMENTO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Localização e segmento</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Cidade <span className="text-red-600">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            >
              <option value="">Selecione…</option>
              {cidades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Bairro / Região (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Ex.: Centro, Itaipuaçu, Braga..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1">
              <label className="block text-[11px] font-semibold text-slate-700">
                Categoria / segmento <span className="text-red-600">*</span>
              </label>
              <div className="relative group text-[11px] text-slate-500 cursor-help">
                <span>ℹ</span>
                <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
                  Escolha o tipo de negócio mais próximo do seu. Isso ajuda muito na busca do LagoListas.
                </div>
              </div>
            </div>

            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={segmento}
              onChange={(e) => setSegmento(e.target.value)}
              required
            >
              <option value="">Selecione…</option>
              {segmentosLagolistas.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">
            Endereço completo (opcional, mas recomendado)
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, número, sala, ponto de referência..."
          />
        </div>
      </div>

      {/* DADOS DA EMPRESA */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Dados da empresa / comércio</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Nome fantasia / nome do comércio
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
              placeholder="Ex.: Clínica Veterinária São Tomé"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Razão social (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Ex.: São Tomé Serviços Veterinários LTDA"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              CNPJ (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Inscrição municipal (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inscricaoMunicipal}
              onChange={(e) => setInscricaoMunicipal(e.target.value)}
              placeholder="Ex.: 123456-7"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Registro profissional (CRECI, CRM, OAB etc.) – opcional
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={registroProfissional}
              onChange={(e) => setRegistroProfissional(e.target.value)}
              placeholder="Ex.: CRECI 12345-RJ"
            />
          </div>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[11px] font-semibold text-slate-700">
            Descrição do seu comércio / serviços <span className="text-red-600">*</span>
          </label>

          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-80 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Fale o que você oferece, diferenciais, horário de funcionamento, formas de pagamento,
              delivery, estacionamento, convênios etc.
            </div>
          </div>
        </div>

        <textarea
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[130px]"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Atendimento 24h, consultas, exames, vacinas, banho & tosa..."
          required
        />
      </div>

      {/* LINKS */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Links (opcional)</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Site / página</label>
            <input
              type="url"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Instagram</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@seu_perfil"
            />
          </div>
        </div>
      </div>

      {/* CONTATOS */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Contatos</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Pelo menos um canal (telefone, WhatsApp ou e-mail) precisa estar preenchido.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TERMOS */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Termos e responsabilidade</h3>

        <div className="mt-3 text-xs text-slate-700">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={aceitoTermos}
              onChange={(e) => setAceitoTermos(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Declaro que as informações preenchidas são verdadeiras e autorizo que este anúncio
              seja exibido no Lagolistas / Classilagos para os consumidores da Região dos Lagos.
            </span>
          </label>
        </div>
      </div>

      {/* BOTÃO */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {uploading ? "Publicando anúncio..." : "Publicar meu comércio no Lagolistas"}
      </button>
    </form>
  );
}

