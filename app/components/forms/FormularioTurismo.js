"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

// lista padrão de cidades da Região dos Lagos
const CIDADES = [
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

// pilares do turismo (GUIA ONDE)
const PILARES_TURISMO = [
  { value: "onde_ficar", label: "Onde ficar" },
  { value: "onde_comer", label: "Onde comer" },
  { value: "onde_se_divertir", label: "Onde se divertir" },
  { value: "onde_passear", label: "Onde passear" },
  { value: "servicos_turismo", label: "Serviços de turismo" },
  { value: "produtos_turisticos", label: "Produtos turísticos" },
  { value: "outros", label: "Outros / geral" },
];

// subcategorias por pilar (usadas em subcategoria_turismo)
const SUBCATEGORIAS_POR_PILAR = {
  onde_ficar: [
    { value: "pousada_hotel_hostel", label: "Pousada / Hotel / Hostel" },
    { value: "casa_apartamento_temporada", label: "Casa / apartamento de temporada" },
    { value: "camping_motorhome", label: "Camping / motorhome" },
    { value: "hostel_quarto_compartilhado", label: "Hostel / quarto compartilhado" },
    { value: "outros_hospedagem", label: "Outros tipos de hospedagem" },
  ],
  onde_comer: [
    { value: "restaurante", label: "Restaurante" },
    { value: "bar_quiosque", label: "Bar / quiosque de praia" },
    { value: "pizzaria", label: "Pizzaria" },
    { value: "hamburgueria", label: "Hamburgueria / sanduíches" },
    { value: "cafeteria_sorveteria", label: "Cafeteria / sorveteria / doceria" },
    { value: "comida_por_kilo_delivery", label: "Comida a quilo / delivery" },
    { value: "outros_gastronomia", label: "Outros tipos de gastronomia" },
  ],

  // ✅ ATUALIZADO (inclui Teatro/Cinema, Cultura, Museus)
  onde_se_divertir: [
    { value: "casa_show_musica_ao_vivo", label: "Casa de show / música ao vivo" },
    { value: "pub_balada", label: "Pub / balada" },
    { value: "evento_festival", label: "Eventos / festivais" },
    { value: "parque_lazer", label: "Parques e espaços de lazer" },
    { value: "teatro_cinema", label: "Teatros e cinemas" },
    { value: "ponto_de_cultura", label: "Pontos de cultura" },
    { value: "museu", label: "Museus" },
    { value: "outros_diversao", label: "Outros locais para se divertir" },
  ],

  // ✅ ATUALIZADO (inclui Teatro/Cinema, Cultura, Museus)
  onde_passear: [
    { value: "passeio_escuna_barco", label: "Passeio de escuna / barco" },
    { value: "passeio_lancha_taxi_lancha", label: "Passeio de lancha / táxi lancha" },
    { value: "passeio_buggy_quadriciclo", label: "Passeio de buggy / quadriciclo" },
    { value: "trilhas_caminhadas", label: "Trilhas e caminhadas" },
    { value: "city_tour_cultural", label: "City tour / tour cultural" },
    { value: "mergulho_esportes_aquaticos", label: "Mergulho / esportes aquáticos" },
    { value: "turismo_rural_ecologico", label: "Turismo rural / ecológico" },
    { value: "teatro_cinema", label: "Teatros e cinemas" },
    { value: "ponto_de_cultura", label: "Pontos de cultura" },
    { value: "museu", label: "Museus" },
    { value: "outros_passeios", label: "Outros tipos de passeios" },
  ],

  servicos_turismo: [
    { value: "agencia_turismo", label: "Agência de turismo / receptivo" },
    { value: "guia_turistico_credenciado", label: "Guia de turismo credenciado" },
    { value: "transfer_transporte_turistico", label: "Transfer / transporte turístico" },
    { value: "fotografia_video_turistico", label: "Fotógrafo / vídeo turístico" },
    { value: "locacao_veiculos_vans", label: "Locação de veículos / vans" },
    { value: "outros_servicos_turismo", label: "Outros serviços de turismo" },
  ],
  produtos_turisticos: [
    { value: "souvenir_artesanato", label: "Souvenir / artesanato" },
    { value: "moda_praia", label: "Moda praia / roupas" },
    { value: "loja_tematica", label: "Loja temática / presentes" },
    { value: "produtos_regionais", label: "Produtos regionais / gourmet" },
    { value: "outros_produtos_turisticos", label: "Outros produtos turísticos" },
  ],
  outros: [{ value: "turismo_geral", label: "Turismo / serviços gerais" }],
};

// faixas de preço por pilar (gravadas em faixa_preco)
const FAIXA_PRECO_POR_PILAR = {
  onde_ficar: ["Diária até R$ 200", "Diária de R$ 200 a R$ 400", "Diária acima de R$ 400", "Consultar valores"],
  onde_comer: ["Economia / popular", "Intermediário", "Gastronomia refinada", "Consultar valores"],
  onde_passear: ["Passeios até R$ 100", "Passeios de R$ 100 a R$ 250", "Passeios acima de R$ 250", "Consultar valores"],
  servicos_turismo: ["Valores sob consulta", "Pacotes promocionais", "Atendimento personalizado"],
  produtos_turisticos: ["Lembrancinhas acessíveis", "Produtos intermediários", "Produtos premium"],
  onde_se_divertir: ["Entrada gratuita / consumação", "Ingressos até R$ 50", "Ingressos acima de R$ 50"],
  outros: ["Valores sob consulta"],
};

// comodidades para hospedagem (vamos jogar isso para dentro da descrição final)
const COMODIDADES_HOSPEDAGEM = [
  "Wi-Fi",
  "Estacionamento",
  "Piscina",
  "Beira-mar / frente lagoa",
  "Café da manhã incluso",
  "Acessibilidade",
  "Pet friendly",
  "Ar condicionado",
];

// facilidades para bares/restaurantes
const FACILIDADES_GASTRONOMIA = [
  "Música ao vivo",
  "Frente mar / lagoa",
  "Ambiente climatizado",
  "Espaço kids",
  "Opções vegetarianas / veganas",
  "Entrega delivery",
  "Aceita reservas",
];

export default function FormularioTurismo() {
  const router = useRouter();

  // pilar + subcategoria
  const [pilar, setPilar] = useState("onde_ficar");
  const [subcategoria, setSubcategoria] = useState("");

  // principais
  const [titulo, setTitulo] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [descricao, setDescricao] = useState("");

  // localização
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");

  // detalhes extras por tipo (vão ser combinados na descrição final)
  const [faixaPreco, setFaixaPreco] = useState("");
  const [tipoCozinha, setTipoCozinha] = useState("");
  const [horarioFuncionamento, setHorarioFuncionamento] = useState("");
  const [comodidadesHospedagem, setComodidadesHospedagem] = useState([]);
  const [facilidadesGastronomia, setFacilidadesGastronomia] = useState([]);
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [pontosPrincipais, setPontosPrincipais] = useState("");
  const [tipoPasseio, setTipoPasseio] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState("");

  // online / redes
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  // ✅ UPLOAD (Padrão Premium: logo + capa + galeria)
  const [logoArquivo, setLogoArquivo] = useState(null); // opcional
  const [capaArquivo, setCapaArquivo] = useState(null); // recomendado
  const [galeriaArquivos, setGaleriaArquivos] = useState([]); // até 7
  const [uploading, setUploading] = useState(false);

  // vídeo
  const [videoUrl, setVideoUrl] = useState("");

  // contato
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // termos
  const [aceitoTermos, setAceitoTermos] = useState(false);

  // mensagens
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // garante login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });
  }, [router]);

  // quando muda o pilar, resetar subcategoria e faixa de preço
  useEffect(() => {
    setSubcategoria("");
    setFaixaPreco("");
  }, [pilar]);

  // ✅ handlers uploads
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setLogoArquivo(file);
  };

  const handleCapaChange = (e) => {
    const file = e.target.files?.[0] || null;
    setCapaArquivo(file);
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGaleriaArquivos(files.slice(0, 7)); // até 7 (capa + 7 = 8 total)
  };

  // ✅ previews (Padrão Premium)
  const logoPreview = useMemo(() => (logoArquivo ? URL.createObjectURL(logoArquivo) : null), [logoArquivo]);
  const capaPreview = useMemo(() => (capaArquivo ? URL.createObjectURL(capaArquivo) : null), [capaArquivo]);
  const galeriaPreviews = useMemo(() => {
    if (!galeriaArquivos?.length) return [];
    return galeriaArquivos.map((f) => URL.createObjectURL(f));
  }, [galeriaArquivos]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (capaPreview) URL.revokeObjectURL(capaPreview);
      galeriaPreviews.forEach((p) => URL.revokeObjectURL(p));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoPreview, capaPreview, galeriaPreviews]);

  // checkbox comodidades hospedagem
  const toggleComodidadeHospedagem = (item) => {
    setComodidadesHospedagem((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  // checkbox facilidades gastronomia
  const toggleFacilidadeGastronomia = (item) => {
    setFacilidadesGastronomia((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    if (!pilar || !subcategoria) {
      setErro("Selecione o tipo de lugar/serviço e a categoria.");
      return;
    }

    if (!titulo || !cidade || !descricao) {
      setErro("Preencha pelo menos o título, a cidade e a descrição.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe ao menos um meio de contato (WhatsApp, telefone ou e-mail).");
      return;
    }

    if (!aceitoTermos) {
      setErro("Para publicar o anúncio, você precisa aceitar os termos de responsabilidade.");
      return;
    }

    // monta bloco de detalhes extras para enriquecer a descrição automaticamente
    const detalhesExtras = [];

    if (faixaPreco) detalhesExtras.push(`Faixa de preço: ${faixaPreco}.`);

    if (pilar === "onde_comer") {
      if (tipoCozinha) detalhesExtras.push(`Tipo de cozinha: ${tipoCozinha}.`);
      if (facilidadesGastronomia.length > 0) {
        detalhesExtras.push(`Facilidades: ${facilidadesGastronomia.join(", ")}.`);
      }
    }

    if (pilar === "onde_ficar") {
      if (comodidadesHospedagem.length > 0) {
        detalhesExtras.push(`Comodidades: ${comodidadesHospedagem.join(", ")}.`);
      }
    }

    if (pilar === "onde_passear") {
      if (tipoPasseio) detalhesExtras.push(`Tipo de passeio: ${tipoPasseio}.`);
      if (duracaoPasseio) detalhesExtras.push(`Duração média: ${duracaoPasseio}.`);
      if (pontosPrincipais) detalhesExtras.push(`Pontos principais: ${pontosPrincipais}.`);
    }

    if (publicoAlvo) detalhesExtras.push(`Ideal para: ${publicoAlvo}.`);
    if (horarioFuncionamento) detalhesExtras.push(`Horário de funcionamento: ${horarioFuncionamento}.`);

    const descricaoFinal = [descricao.trim(), detalhesExtras.length ? detalhesExtras.join(" ") : ""]
      .filter(Boolean)
      .join("\n\n");

    // ✅ UPLOAD PREMIUM: logo (opcional) + capa (recomendada) + galeria (opcional)
    // regra: imagens[] sempre começa pela CAPA (se existir). Assim o card fica bonito.
    let logoUrl = null;
    let capaUrl = null;
    const galeriaUrls = [];

    try {
      const bucket = "anuncios";

      // LOGO (opcional)
      if (logoArquivo) {
        setUploading(true);
        const ext = logoArquivo.name.split(".").pop();
        const path = `turismo/${user.id}/turismo-logo-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage.from(bucket).upload(path, logoArquivo);
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
        logoUrl = pub.publicUrl;
      }

      // CAPA (recomendada)
      if (capaArquivo) {
        setUploading(true);
        const ext = capaArquivo.name.split(".").pop();
        const path = `turismo/${user.id}/turismo-capa-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage.from(bucket).upload(path, capaArquivo);
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
        capaUrl = pub.publicUrl;
      }

      // GALERIA (até 7)
      if (galeriaArquivos && galeriaArquivos.length > 0) {
        setUploading(true);

        for (let i = 0; i < galeriaArquivos.length; i++) {
          const file = galeriaArquivos[i];
          const ext = file.name.split(".").pop();
          const path = `turismo/${user.id}/turismo-galeria-${Date.now()}-${i}.${ext}`;

          const { error: upErr } = await supabase.storage.from(bucket).upload(path, file);
          if (upErr) throw upErr;

          const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
          galeriaUrls.push(pub.publicUrl);
        }
      }
    } catch (err) {
      console.error("Erro ao enviar imagens de turismo:", err);
      setErro("Erro ao enviar as imagens. Tente novamente.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    // ✅ monta imagens (CAPA sempre primeiro)
    // - capaUrl (se existir) entra primeiro
    // - depois galeria
    // - logo entra por último (para não virar capa do card)
    let imagens = [];
    if (capaUrl) imagens.push(capaUrl);
    if (galeriaUrls.length) imagens = imagens.concat(galeriaUrls);
    if (logoUrl) imagens.push(logoUrl);

    if (imagens.length === 0) imagens = null;

    // INSERT no Supabase
    const { data, error } = await supabase
      .from("anuncios")
      .insert({
        user_id: user.id,
        categoria: "turismo",
        titulo,
        descricao: descricaoFinal,
        cidade,
        bairro,
        endereco,
        nome_negocio: nomeNegocio || null,
        faixa_preco: faixaPreco || null,
        site_url: siteUrl || null,
        instagram: instagram || null,
        imagens,
        video_url: videoUrl || null,
        telefone: telefone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        contato: contatoPrincipal,
        pilar_turismo: pilar,
        subcategoria_turismo: subcategoria,
        horario_atendimento: horarioFuncionamento || null,
        status: "ativo",
        destaque: false,
        nome_contato: nomeContato || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar anúncio de turismo:", error);
      setErro(`Erro ao salvar anúncio: ${error.message || "Tente novamente em instantes."}`);
      return;
    }

    setSucesso("Anúncio de turismo enviado com sucesso! Redirecionando…");

    // limpa formulário
    setTitulo("");
    setNomeNegocio("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setEndereco("");
    setFaixaPreco("");
    setTipoCozinha("");
    setHorarioFuncionamento("");
    setComodidadesHospedagem([]);
    setFacilidadesGastronomia([]);
    setDuracaoPasseio("");
    setPontosPrincipais("");
    setTipoPasseio("");
    setPublicoAlvo("");
    setSiteUrl("");
    setInstagram("");

    // ✅ reset upload
    setLogoArquivo(null);
    setCapaArquivo(null);
    setGaleriaArquivos([]);

    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);

    setTimeout(() => {
      if (data && data.id) {
        router.push(`/turismo/anuncio/${data.id}`);
      } else {
        router.push("/painel/meus-anuncios");
      }
    }, 1500);
  };

  // opções da subcategoria de acordo com o pilar selecionado
  const subcategoriasAtuais = SUBCATEGORIAS_POR_PILAR[pilar] || [];
  const faixasPrecoAtuais = FAIXA_PRECO_POR_PILAR[pilar] || [];

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6 text-xs md:text-sm">
      {erro && (
        <p className="text-red-600 text-xs md:text-sm border border-red-100 rounded-md px-3 py-2 bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-emerald-600 text-xs md:text-sm border border-emerald-100 rounded-md px-3 py-2 bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* ✅ BLOCO PREMIUM: FOTOS + LOGOMARCA (NO TOPO) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900">Fotos e logomarca (no topo)</h3>
        <p className="mt-1 text-[11px] text-slate-600">
          Recomendado: JPG/PNG até ~2MB. A <b>capa</b> vira a foto principal do card.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* LOGO */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-900">Logomarca (opcional, mas recomendado)</p>
            <p className="mt-1 text-[11px] text-slate-600">
              A logo aparece junto com as fotos (não vira capa).
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-3 w-full text-xs"
            />

            {logoPreview && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoPreview} alt="Preview logo" className="h-32 w-full object-contain" />
              </div>
            )}
          </div>

          {/* CAPA */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-900">Foto de capa (recomendada)</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Essa deve ser a foto mais bonita (fachada / vitrine / ambiente).
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleCapaChange}
              className="mt-3 w-full text-xs"
            />

            {capaPreview && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capaPreview} alt="Preview capa" className="h-32 w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* GALERIA */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-900">Galeria (opcional) — até 7 fotos</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Fotos extras: quartos, piscina, pratos, equipe, detalhes, praia, roteiro do passeio…
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriaChange}
            className="mt-3 w-full text-xs"
          />

          {galeriaArquivos.length > 0 && (
            <>
              <p className="mt-2 text-[11px] text-slate-500">
                {galeriaArquivos.length} foto(s) selecionada(s).
              </p>

              <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
                {galeriaPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="mt-3 text-[11px] text-slate-500">
            Se der erro no upload: tente fotos menores (até ~2MB) e em JPG/PNG.
          </p>
        </div>
      </div>

      {/* BLOCO: TIPO DE LUGAR / SERVIÇO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Tipo de lugar / serviço de turismo
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Onde seu anúncio se encaixa? *
              <span
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-700"
                title="Isso define em qual seção do Guia ONDE (Onde ficar, Onde comer, Onde passear, etc.) o seu anúncio vai aparecer."
              >
                i
              </span>
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={pilar}
              onChange={(e) => setPilar(e.target.value)}
              required
            >
              {PILARES_TURISMO.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Categoria / subcategoria *
              <span
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-700"
                title="Escolha o tipo que melhor representa seu negócio, passeio ou serviço."
              >
                i
              </span>
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {subcategoriasAtuais.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* BLOCO: PRINCIPAIS */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Informações principais</h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Nome do local / título do anúncio *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Pousada Orla Bardot, Restaurante Vista Mar, Passeio Arraial 7 Praias…"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Nome do negócio (opcional)
            <span
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-700"
              title="Use se o nome fantasia for diferente do título do anúncio."
            >
              i
            </span>
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Grupo Orla Bardot, Restaurante Dom Carlito…"
            value={nomeNegocio}
            onChange={(e) => setNomeNegocio(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Descrição detalhada *
            <span
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-700"
              title="Use este espaço para destacar os principais diferenciais. Os campos abaixo vão complementar automaticamente a descrição."
            >
              i
            </span>
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-28"
            placeholder="Conte em poucas linhas o que torna seu local ou serviço especial."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* BLOCO: LOCALIZAÇÃO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">Cidade *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {CIDADES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">Bairro / região</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex.: Centro, Orla, Praia do Forte…"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">Endereço (opcional)</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Rua, número, ponto de referência…"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: DETALHES ESPECÍFICOS POR TIPO */}
      {faixasPrecoAtuais.length > 0 && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">Faixa de preço</h2>
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Selecione a faixa que melhor representa seu negócio
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={faixaPreco}
              onChange={(e) => setFaixaPreco(e.target.value)}
            >
              <option value="">Selecione...</option>
              {faixasPrecoAtuais.map((fp) => (
                <option key={fp} value={fp}>
                  {fp}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Hospedagem */}
      {pilar === "onde_ficar" && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">Detalhes da hospedagem</h2>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Comodidades
              <span
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-700"
                title="Marque os principais itens que o hóspede encontra no seu espaço."
              >
                i
              </span>
            </label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {COMODIDADES_HOSPEDAGEM.map((item) => (
                <label key={item} className="flex items-center gap-2 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    className="h-3 w-3"
                    checked={comodidadesHospedagem.includes(item)}
                    onChange={() => toggleComodidadeHospedagem(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Público-alvo (opcional)
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={publicoAlvo}
              onChange={(e) => setPublicoAlvo(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Casais">Casais</option>
              <option value="Famílias">Famílias</option>
              <option value="Grupos de amigos">Grupos de amigos</option>
              <option value="Turistas em trabalho/negócios">Turistas em trabalho/negócios</option>
            </select>
          </div>
        </div>
      )}

      {/* Gastronomia */}
      {pilar === "onde_comer" && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Detalhes para bares e restaurantes
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">Tipo de cozinha</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={tipoCozinha}
                onChange={(e) => setTipoCozinha(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Comida caseira">Comida caseira</option>
                <option value="Frutos do mar">Frutos do mar</option>
                <option value="Churrasco">Churrasco</option>
                <option value="Massas e pizzas">Massas e pizzas</option>
                <option value="Comida internacional">Comida internacional</option>
                <option value="Lanches e petiscos">Lanches e petiscos</option>
                <option value="Cafés, doces e sobremesas">Cafés, doces e sobremesas</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700">Público-alvo (opcional)</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={publicoAlvo}
                onChange={(e) => setPublicoAlvo(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Famílias">Famílias</option>
                <option value="Casais">Casais</option>
                <option value="Grupos de amigos">Grupos de amigos</option>
                <option value="Turistas em geral">Turistas em geral</option>
                <option value="Eventos e grupos (festas, confraternizações)">
                  Eventos e grupos (festas, confraternizações)
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">Facilidades</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {FACILIDADES_GASTRONOMIA.map((item) => (
                <label key={item} className="flex items-center gap-2 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    className="h-3 w-3"
                    checked={facilidadesGastronomia.includes(item)}
                    onChange={() => toggleFacilidadeGastronomia(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Passeios */}
      {pilar === "onde_passear" && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">Informações do passeio</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">Tipo de passeio</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={tipoPasseio}
                onChange={(e) => setTipoPasseio(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Passeio de barco / escuna">Passeio de barco / escuna</option>
                <option value="Passeio de lancha / táxi lancha">Passeio de lancha / táxi lancha</option>
                <option value="Passeio de buggy / quadriciclo">Passeio de buggy / quadriciclo</option>
                <option value="Trilhas e caminhadas">Trilhas e caminhadas</option>
                <option value="City tour / tour cultural">City tour / tour cultural</option>
                <option value="Mergulho / esportes aquáticos">Mergulho / esportes aquáticos</option>
                <option value="Outro tipo de passeio">Outro tipo de passeio</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Duração média (opcional)
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Ex.: 2h, 4h, dia inteiro…"
                value={duracaoPasseio}
                onChange={(e) => setDuracaoPasseio(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Pontos principais do roteiro (opcional)
            </label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-24"
              placeholder="Praias, ilhas, mirantes, paradas para banho, trilhas, etc."
              value={pontosPrincipais}
              onChange={(e) => setPontosPrincipais(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* BLOCO: ONLINE / REDES */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Site, reservas e redes sociais</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Site / página de reservas
            </label>
            <input
              type="url"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Link do seu site, Booking, Instagram com link, etc."
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">Instagram</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="@seuinstagram ou link do perfil"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BLOCO: VÍDEO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Vídeo (opcional)</h2>
        <div>
          <label className="block text-[11px] font-medium text-slate-700">URL do vídeo (YouTube)</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Cole aqui o link do vídeo no YouTube (se tiver)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: CONTATO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados de contato</h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">Nome do responsável</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Nome do responsável pelo atendimento"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Telefone fixo ou celular"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="DDD + número"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Seu e-mail para contato"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: HORÁRIO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Horário de funcionamento</h2>
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Descreva de forma simples (opcional)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Todos os dias, 8h às 22h. Fecha às terças."
            value={horarioFuncionamento}
            onChange={(e) => setHorarioFuncionamento(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: TERMOS */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que assumo total
            responsabilidade pelo conteúdo publicado. Estou ciente e de acordo com os{" "}
            <a
              href="/termos-de-uso"
              className="text-cyan-700 underline hover:text-cyan-800"
              target="_blank"
              rel="noreferrer"
            >
              Termos de uso do Classilagos
            </a>
            .
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-sky-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Publicar anúncio de turismo"}
      </button>
    </form>
  );
}
