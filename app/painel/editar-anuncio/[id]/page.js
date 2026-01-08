"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";
import AuthGuard from "../../../components/AuthGuard";

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

// Selects (mantém simples e robusto)
const FINALIDADES_IMOVEIS = [
  { value: "venda", label: "Venda" },
  { value: "aluguel", label: "Aluguel" },
  { value: "aluguel_temporada", label: "Aluguel por temporada" },
];


const SUBCATEGORIAS_SERVICO = [
  { value: "profissionais", label: "Profissionais & Serviços" },
  { value: "classimed", label: "Saúde (Classimed)" },
  { value: "eventos", label: "Festas & Eventos" },
];

const PILARES_TURISMO = [
  { value: "onde_ficar", label: "Onde ficar" },
  { value: "onde_comer", label: "Onde comer" },
  { value: "onde_se_divertir", label: "Onde se divertir" },
  { value: "onde_passear", label: "Onde passear" },
  { value: "servicos_turismo", label: "Serviços do turismo" },
  { value: "produtos_turisticos", label: "Produtos turísticos" },
  { value: "outros", label: "Outros" },
];

function cleanStr(v) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : "";
}
function emptyToNull(v) {
  const s = cleanStr(v);
  return s ? s : null;
}
function onlyDigits(v) {
  return (v ?? "").toString().replace(/\D/g, "");
}
function isEmail(v) {
  const s = cleanStr(v);
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function categoriaLabel(cat) {
  switch ((cat || "").toLowerCase()) {
    case "imoveis":
      return "Imóveis";
    case "veiculos":
      return "Veículos";
    case "nautica":
      return "Náutica";
    case "pets":
      return "Pets";
    case "emprego":
      return "Empregos";
    case "curriculo":
      return "Currículos";
    case "servico":
      return "Serviços";
    case "turismo":
      return "Turismo";
    case "lagolistas":
      return "LagoListas";
    default:
      return "Anúncios";
  }
}

export default function EditarAnuncioPage() {
  const { id } = useParams();
  const router = useRouter();
  const anuncioId = useMemo(() => (id ? String(id) : ""), [id]);

  const [user, setUser] = useState(null);
  const [anuncio, setAnuncio] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  // ✅ FOTOS (upload no editar)
const MAX_IMAGENS = 8;
const BUCKET_IMAGENS = "anuncios";

const [imagens, setImagens] = useState([]);      // URLs que já estão salvas no anúncio
const [novasFiles, setNovasFiles] = useState([]); // arquivos escolhidos agora
const [uploading, setUploading] = useState(false);

function removerImagem(url) {
  setImagens((prev) => prev.filter((u) => u !== url));
}

async function uploadNovasImagens() {
  if (!novasFiles?.length) return [];

  // limita total (existentes + novas)
  const vagas = Math.max(0, MAX_IMAGENS - (imagens?.length || 0));
  if (vagas <= 0) {
    setErro(`Você já atingiu o limite de ${MAX_IMAGENS} fotos.`);
    return [];
  }

  const filesParaUpload = novasFiles.slice(0, vagas);

  setUploading(true);
  setErro("");

  try {
    const urls = [];

    for (const file of filesParaUpload) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safeName = (file.name || "foto").replace(/[^\w.-]+/g, "_");
      const path = `${anuncioId}/${Date.now()}-${Math.random().toString(16).slice(2)}-${safeName}`;

      const { error: upErr } = await supabase
        .storage
        .from(BUCKET_IMAGENS)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || `image/${ext}`,
        });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from(BUCKET_IMAGENS).getPublicUrl(path);
      if (data?.publicUrl) urls.push(data.publicUrl);
    }

    // limpa seleção depois do upload
    setNovasFiles([]);
    return urls;
  } catch (e) {
    console.error("Erro upload imagens:", e);
    setErro("Não foi possível enviar as fotos agora. Tente novamente.");
    return [];
  } finally {
    setUploading(false);
  }
}


  // Form (base + campos avançados)
  const [form, setForm] = useState({
    // base
    titulo: "",
    descricao: "",
    cidade: "",
    bairro: "",
    endereco: "",
    preco: "",
    telefone: "",
    whatsapp: "",
    email: "",
    contato: "",
    video_url: "",

    // imoveis
    tipo_imovel: "",
    finalidade: "",
    area: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    mobiliado: "",
    condominio: "",
    iptu: "",
    aceita_financiamento: "",

    // veiculos / nautica
    marca: "",
    modelo: "",
    ano: "",
    km: "",

    // empregos
    area_profissional: "",
    tipo_vaga: "",
    modelo_trabalho: "",
    carga_horaria: "",
    faixa_salarial: "",

    // servicos
    subcategoria_servico: "",
    nome_negocio: "",
    faixa_preco: "",
    horario_atendimento: "",
    atende_domicilio: false,
    site_url: "",
    instagram: "",

    // turismo (taxonomia)
    pilar_turismo: "",
    subcategoria_turismo: "",

    // lagolistas (dados empresa)
    razao_social: "",
    cnpj: "",
    inscricao_municipal: "",
    registro_profissional: "",

    // pets
    subcategoria_pet: "",
  });

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // carregar usuário + anúncio (só do dono)
  useEffect(() => {
    async function boot() {
      if (!anuncioId) return;
      setLoading(true);
      setErro("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setErro("Erro ao carregar usuário.");
        setLoading(false);
        return;
      }
      if (!user) {
        setErro("Você precisa estar logado para editar anúncios.");
        setLoading(false);
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", anuncioId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.error(error);
        setErro("Não foi possível carregar este anúncio (ou ele não é seu).");
        setLoading(false);
        return;
      }

      setAnuncio(data);

      setForm({
        // base
        titulo: data.titulo || "",
        descricao: data.descricao || "",
        cidade: data.cidade || "",
        bairro: data.bairro || "",
        endereco: data.endereco || "",
        preco: data.preco || "",
        telefone: data.telefone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        contato: data.contato || "",
        video_url: data.video_url || "",

        // imoveis
        tipo_imovel: data.tipo_imovel || "",
       finalidade:
  data.finalidade === "temporada"
    ? "aluguel_temporada"
    : (data.finalidade || ""),
        area: data.area || "",
        quartos: data.quartos || "",
        banheiros: data.banheiros || "",
        vagas: data.vagas || "",
        mobiliado: data.mobiliado || "",
        condominio: data.condominio || "",
        iptu: data.iptu || "",
        aceita_financiamento: data.aceita_financiamento || "",

        // veiculos / nautica
        marca: data.marca || "",
        modelo: data.modelo || "",
        ano: data.ano || "",
        km: data.km || "",

        // empregos
        area_profissional: data.area_profissional || "",
        tipo_vaga: data.tipo_vaga || "",
        modelo_trabalho: data.modelo_trabalho || "",
        carga_horaria: data.carga_horaria || "",
        faixa_salarial: data.faixa_salarial || "",

        // servicos
        subcategoria_servico: data.subcategoria_servico || "",
        nome_negocio: data.nome_negocio || "",
        faixa_preco: data.faixa_preco || "",
        horario_atendimento: data.horario_atendimento || data.horarioFuncionamento || "",
        atende_domicilio: typeof data.atende_domicilio === "boolean" ? data.atende_domicilio : false,
        site_url: data.site_url || "",
        instagram: data.instagram || "",

        // turismo
        pilar_turismo: data.pilar_turismo || "",
        subcategoria_turismo: data.subcategoria_turismo || "",

        // lagolistas
        razao_social: data.razao_social || "",
        cnpj: data.cnpj || "",
        inscricao_municipal: data.inscricao_municipal || "",
        registro_profissional: data.registro_profissional || "",

        // pets
        subcategoria_pet: data.subcategoria_pet || data.tipo_pet || "",
      });

      setLoading(false);
    }

    boot();
  }, [anuncioId]);

  const cat = (anuncio?.categoria || "").toLowerCase();
  const isImoveis = cat === "imoveis";
  const isVeiculos = cat === "veiculos";
  const isNautica = cat === "nautica";
  const isEmprego = cat === "emprego";
  const isCurriculo = cat === "curriculo";
  const isServico = cat === "servico";
  const isTurismo = cat === "turismo";
  const isLagolistas = cat === "lagolistas";
  const isPets = cat === "pets";

  function validate() {
    if (!cleanStr(form.titulo) || !cleanStr(form.descricao) || !cleanStr(form.cidade)) {
      return "Preencha pelo menos: Título, Descrição e Cidade.";
    }
    if (!isEmail(form.email)) {
      return "E-mail inválido.";
    }
    // WhatsApp/Telefone: deixa livre, mas se tiver poucos dígitos dá aviso
    const w = onlyDigits(form.whatsapp);
    if (w && w.length < 10) {
      return "WhatsApp parece curto demais. Confira o número.";
    }
    return "";
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user || !anuncioId || !anuncio) return;

    const msg = validate();
    if (msg) {
      setErro(msg);
      return;
    }

    setSaving(true);
    setErro("");

    // BASE: sempre salva
    const payload = {
      titulo: cleanStr(form.titulo),
      descricao: cleanStr(form.descricao),
      cidade: cleanStr(form.cidade),
      bairro: emptyToNull(form.bairro),
      endereco: emptyToNull(form.endereco),
      preco: emptyToNull(form.preco),
      telefone: emptyToNull(form.telefone),
      whatsapp: emptyToNull(form.whatsapp),
      email: emptyToNull(form.email),
      contato: emptyToNull(form.contato),
      video_url: emptyToNull(form.video_url),
    };

    // CAMPOS POR CATEGORIA (sem gambiarra: só o que faz sentido)
    if (isImoveis) {
      payload.tipo_imovel = emptyToNull(form.tipo_imovel);
      payload.finalidade = emptyToNull(form.finalidade);
      payload.area = emptyToNull(form.area);
      payload.quartos = emptyToNull(form.quartos);
      payload.banheiros = emptyToNull(form.banheiros);
      payload.vagas = emptyToNull(form.vagas);
      payload.mobiliado = emptyToNull(form.mobiliado);
      payload.condominio = emptyToNull(form.condominio);
      payload.iptu = emptyToNull(form.iptu);
      payload.aceita_financiamento = emptyToNull(form.aceita_financiamento);
    }

    if (isVeiculos || isNautica) {
      payload.marca = emptyToNull(form.marca);
      payload.modelo = emptyToNull(form.modelo);
      payload.ano = emptyToNull(form.ano);
      payload.km = emptyToNull(form.km);
    }

    if (isEmprego) {
      payload.area_profissional = emptyToNull(form.area_profissional);
      payload.tipo_vaga = emptyToNull(form.tipo_vaga);
      payload.modelo_trabalho = emptyToNull(form.modelo_trabalho);
      payload.carga_horaria = emptyToNull(form.carga_horaria);
      payload.faixa_salarial = emptyToNull(form.faixa_salarial);
    }

    if (isServico) {
      payload.subcategoria_servico = emptyToNull(form.subcategoria_servico);
      payload.nome_negocio = emptyToNull(form.nome_negocio);
      payload.faixa_preco = emptyToNull(form.faixa_preco);
      payload.horario_atendimento = emptyToNull(form.horario_atendimento);
      payload.horarioFuncionamento = emptyToNull(form.horario_atendimento);
      payload.atende_domicilio = !!form.atende_domicilio;
      payload.site_url = emptyToNull(form.site_url);
      payload.instagram = emptyToNull(form.instagram);
    }

    if (isTurismo) {
      payload.pilar_turismo = emptyToNull(form.pilar_turismo);
      payload.subcategoria_turismo = emptyToNull(form.subcategoria_turismo);
      payload.faixa_preco = emptyToNull(form.faixa_preco);
      payload.horario_atendimento = emptyToNull(form.horario_atendimento);
      payload.horarioFuncionamento = emptyToNull(form.horario_atendimento);
      payload.nome_negocio = emptyToNull(form.nome_negocio);
      payload.site_url = emptyToNull(form.site_url);
      payload.instagram = emptyToNull(form.instagram);
    }

    if (isLagolistas) {
      payload.area_profissional = emptyToNull(form.area_profissional);
      payload.nome_negocio = emptyToNull(form.nome_negocio);
      payload.razao_social = emptyToNull(form.razao_social);
      payload.cnpj = emptyToNull(form.cnpj);
      payload.inscricao_municipal = emptyToNull(form.inscricao_municipal);
      payload.registro_profissional = emptyToNull(form.registro_profissional);
      payload.site_url = emptyToNull(form.site_url);
      payload.instagram = emptyToNull(form.instagram);
    }

    if (isPets) {
      payload.subcategoria_pet = emptyToNull(form.subcategoria_pet);
    }

    // curriculo: por enquanto não mexe em pdf/foto (evita mexer em storage sem precisar)
    // mas mantém base (titulo/descricao/cidade/contatos), que é o essencial.

    const { error } = await supabase
      .from("anuncios")
      .update(payload)
      .eq("id", anuncioId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setErro("Erro ao salvar. Tente novamente.");
      setSaving(false);
      return;
    }

    router.push("/painel/meus-anuncios");
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F5FBFF] px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Editar anúncio</h1>
              <p className="text-sm text-slate-600">
                Categoria: <span className="font-semibold">{categoriaLabel(anuncio?.categoria)}</span>
              </p>
            </div>

            <Link
              href="/painel/meus-anuncios"
              className="hidden sm:inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar
            </Link>
          </header>

          {loading && <p className="text-sm text-slate-600">Carregando…</p>}

          {!loading && erro && (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-4">
              <p className="text-sm text-red-600">{erro}</p>
              <div className="mt-3">
                <Link
                  href="/painel/meus-anuncios"
                  className="inline-flex rounded-full bg-[#21D4FD] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
                >
                  Voltar ao painel
                </Link>
              </div>
            </div>
          )}

          {!loading && !erro && anuncio && (
            <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
              {/* BASE */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-900">Informações principais</h2>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Título *</label>
                  <input
                    value={form.titulo}
                    onChange={(e) => setField("titulo", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Descrição *</label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => setField("descricao", e.target.value)}
                    rows={6}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Cidade *</label>
                    <select
                      value={form.cidade}
                      onChange={(e) => setField("cidade", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                    >
                      <option value="">Selecione…</option>
                      {CIDADES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Bairro</label>
                    <input
                      value={form.bairro}
                      onChange={(e) => setField("bairro", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Endereço</label>
                  <input
                    value={form.endereco}
                    onChange={(e) => setField("endereco", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Preço / Valor</label>
                  <input
                    value={form.preco}
                    onChange={(e) => setField("preco", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </div>
              </section>

              {/* CONTATO */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-900">Contato</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">WhatsApp</label>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => setField("whatsapp", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Telefone</label>
                    <input
                      value={form.telefone}
                      onChange={(e) => setField("telefone", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">E-mail</label>
                    <input
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Contato (texto)</label>
                    <input
                      value={form.contato}
                      onChange={(e) => setField("contato", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">Vídeo (URL)</label>
                  <input
                    value={form.video_url}
                    onChange={(e) => setField("video_url", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="https://youtube.com/…"
                  />
                </div>
              </section>

              {/* IMÓVEIS */}
              {isImoveis && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Detalhes do imóvel</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Tipo do imóvel</label>
                      <input
                        value={form.tipo_imovel}
                        onChange={(e) => setField("tipo_imovel", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Finalidade</label>
                      <select
                        value={form.finalidade}
                        onChange={(e) => setField("finalidade", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                      >
                        <option value="">Selecione…</option>
                        {FINALIDADES_IMOVEIS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Área (m²)</label>
                      <input
                        value={form.area}
                        onChange={(e) => setField("area", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Quartos</label>
                      <input
                        value={form.quartos}
                        onChange={(e) => setField("quartos", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Banheiros</label>
                      <input
                        value={form.banheiros}
                        onChange={(e) => setField("banheiros", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Vagas</label>
                      <input
                        value={form.vagas}
                        onChange={(e) => setField("vagas", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Mobiliado</label>
                      <input
                        value={form.mobiliado}
                        onChange={(e) => setField("mobiliado", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="Sim / Não / Parcial"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Aceita financiamento</label>
                      <input
                        value={form.aceita_financiamento}
                        onChange={(e) => setField("aceita_financiamento", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="Sim / Não / A combinar"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Condomínio</label>
                      <input
                        value={form.condominio}
                        onChange={(e) => setField("condominio", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">IPTU</label>
                      <input
                        value={form.iptu}
                        onChange={(e) => setField("iptu", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* VEÍCULOS / NÁUTICA */}
              {(isVeiculos || isNautica) && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Detalhes</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Marca</label>
                      <input
                        value={form.marca}
                        onChange={(e) => setField("marca", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Modelo</label>
                      <input
                        value={form.modelo}
                        onChange={(e) => setField("modelo", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Ano</label>
                      <input
                        value={form.ano}
                        onChange={(e) => setField("ano", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">KM / Horas</label>
                      <input
                        value={form.km}
                        onChange={(e) => setField("km", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* EMPREGOS */}
              {isEmprego && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Detalhes da vaga</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Área profissional</label>
                      <input
                        value={form.area_profissional}
                        onChange={(e) => setField("area_profissional", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Tipo de vaga</label>
                      <input
                        value={form.tipo_vaga}
                        onChange={(e) => setField("tipo_vaga", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="CLT, PJ, Freelancer…"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Modelo de trabalho</label>
                      <input
                        value={form.modelo_trabalho}
                        onChange={(e) => setField("modelo_trabalho", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="Presencial, híbrido, remoto…"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Carga horária</label>
                      <input
                        value={form.carga_horaria}
                        onChange={(e) => setField("carga_horaria", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Faixa salarial</label>
                    <input
                      value={form.faixa_salarial}
                      onChange={(e) => setField("faixa_salarial", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>
                </section>
              )}

              {/* SERVIÇOS */}
              {isServico && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Detalhes do serviço</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Tipo de serviço</label>
                      <select
                        value={form.subcategoria_servico}
                        onChange={(e) => setField("subcategoria_servico", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                      >
                        <option value="">Selecione…</option>
                        {SUBCATEGORIAS_SERVICO.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Nome do negócio</label>
                      <input
                        value={form.nome_negocio}
                        onChange={(e) => setField("nome_negocio", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Faixa de preço</label>
                      <input
                        value={form.faixa_preco}
                        onChange={(e) => setField("faixa_preco", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="Ex: a partir de R$ 80"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Horário de atendimento</label>
                      <input
                        value={form.horario_atendimento}
                        onChange={(e) => setField("horario_atendimento", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="Ex: Seg–Sex 8h às 18h"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!form.atende_domicilio}
                      onChange={(e) => setField("atende_domicilio", e.target.checked)}
                    />
                    Atende em domicílio
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Site</label>
                      <input
                        value={form.site_url}
                        onChange={(e) => setField("site_url", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Instagram</label>
                      <input
                        value={form.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="@seunegocio"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* TURISMO */}
              {isTurismo && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Detalhes do turismo</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Pilar</label>
                      <select
                        value={form.pilar_turismo}
                        onChange={(e) => setField("pilar_turismo", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                      >
                        <option value="">Selecione…</option>
                        {PILARES_TURISMO.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Subcategoria</label>
                      <input
                        value={form.subcategoria_turismo}
                        onChange={(e) => setField("subcategoria_turismo", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                        placeholder="Ex: pousada_hotel_hostel"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Nome do negócio</label>
                      <input
                        value={form.nome_negocio}
                        onChange={(e) => setField("nome_negocio", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Faixa de preço</label>
                      <input
                        value={form.faixa_preco}
                        onChange={(e) => setField("faixa_preco", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Horário</label>
                      <input
                        value={form.horario_atendimento}
                        onChange={(e) => setField("horario_atendimento", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Endereço</label>
                      <input
                        value={form.endereco}
                        onChange={(e) => setField("endereco", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Site</label>
                      <input
                        value={form.site_url}
                        onChange={(e) => setField("site_url", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Instagram</label>
                      <input
                        value={form.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* LAGOLISTAS */}
              {isLagolistas && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Dados do comércio</h2>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Segmento / Área profissional</label>
                    <input
                      value={form.area_profissional}
                      onChange={(e) => setField("area_profissional", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Nome do negócio</label>
                      <input
                        value={form.nome_negocio}
                        onChange={(e) => setField("nome_negocio", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Razão social</label>
                      <input
                        value={form.razao_social}
                        onChange={(e) => setField("razao_social", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">CNPJ</label>
                      <input
                        value={form.cnpj}
                        onChange={(e) => setField("cnpj", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Inscrição municipal</label>
                      <input
                        value={form.inscricao_municipal}
                        onChange={(e) => setField("inscricao_municipal", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Registro profissional</label>
                    <input
                      value={form.registro_profissional}
                      onChange={(e) => setField("registro_profissional", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Site</label>
                      <input
                        value={form.site_url}
                        onChange={(e) => setField("site_url", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">Instagram</label>
                      <input
                        value={form.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* PETS */}
              {isPets && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900">Detalhes do pet</h2>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">Categoria do pet</label>
                    <input
                      value={form.subcategoria_pet}
                      onChange={(e) => setField("subcategoria_pet", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="Ex: cães, gatos, aves…"
                    />
                  </div>
                </section>
              )}

              {/* AÇÕES */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Link
  href={`/anuncio/${anuncioId}`}
  className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
>
  Ver anúncio
</Link>


                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center rounded-full bg-[#21D4FD] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3] disabled:opacity-60"
                >
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                Premium: esta edição salva apenas campos do seu pilar (sem sujeira em outras categorias).
              </p>
            </form>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
