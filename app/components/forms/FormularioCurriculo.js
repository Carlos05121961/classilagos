"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

/* =========================
   Helpers
========================= */
function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}
function formatCEP(v) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}
function formatBRPhone(v) {
  const d = onlyDigits(v).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
function compactBRPhone(v) {
  return onlyDigits(v);
}
function joinLines(lines) {
  return lines
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .join("\n");
}

/* =========================
   UI: Card
========================= */
function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-sm md:text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] md:text-xs text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* =========================
   Lists
========================= */
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

const AREAS = [
  "Administração",
  "Atendimento / Caixa",
  "Comércio / Vendas",
  "Construção civil",
  "Serviços gerais",
  "Educação",
  "Saúde",
  "Hotelaria / Turismo",
  "Motorista / Entregador",
  "TI / Informática",
  "Beleza / Estética",
  "Gastronomia / Cozinha",
  "Limpeza / Conservação",
  "Segurança / Portaria",
  "Financeiro / Contábil",
  "Marketing / Mídias sociais",
  "Logística / Estoque",
  "Telemarketing / Call Center",
  "Industrial / Produção",
  "Autônomo / Freelancer",
  "Outros",
];

const ESCOLARIDADE_OPCOES = [
  { key: "fundamental", label: "Fundamental" },
  { key: "medio", label: "Médio" },
  { key: "tecnico", label: "Técnico" },
  { key: "superior", label: "Superior" },
];

const CNH_OPCOES = ["Não", "A", "B", "AB", "C", "D", "E"];

/* =========================
   Draft helpers
========================= */
const DRAFT_KEY = "cl_empregos_curriculo_draft_v3";

function safeJsonParse(v) {
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}
function saveDraft(payload) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ payload, savedAt: Date.now() }));
  } catch {}
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return safeJsonParse(raw);
  } catch {
    return null;
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export default function FormularioCurriculo() {
  const router = useRouter();

  /* =========================
     Estados (baseados no currículo PDF)
  ========================= */
  // Dados pessoais
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); // texto livre __/__/____
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");

  // Perfil/objetivo
  const [areaProfissional, setAreaProfissional] = useState("");
  const [objetivoProfissional, setObjetivoProfissional] = useState("");

  // Experiência
  const [ultimoEmprego, setUltimoEmprego] = useState("");
  const [funcao, setFuncao] = useState("");
  const [tempoTrabalho, setTempoTrabalho] = useState("");

  // Formação / escolaridade
  const [escolaridadeSel, setEscolaridadeSel] = useState({
    fundamental: false,
    medio: false,
    tecnico: false,
    superior: false,
  });
  const [curso, setCurso] = useState("");

  // Habilidades / resumo
  const [habilidades, setHabilidades] = useState("");
  const [resumo, setResumo] = useState("");

  // Infos adicionais
  const [disponibilidadeHorario, setDisponibilidadeHorario] = useState("");
  const [cnh, setCnh] = useState("");
  const [cursosRapidos, setCursosRapidos] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Upload A: Foto 3x4 (rosto)
  const [fotoFile, setFotoFile] = useState(null);

  // Upload B: Arquivo do currículo (PDF/Imagem)
  const [curriculoFile, setCurriculoFile] = useState(null);
  const [curriculoNome, setCurriculoNome] = useState("");

  // Declaração
  const [aceitoTermos, setAceitoTermos] = useState(false);
   // ✅ salvar dados no perfil (autopreencher futuramente)
const [salvarNoPerfil, setSalvarNoPerfil] = useState(true);

  // UI states
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Auth/fluxo premium
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authSending, setAuthSending] = useState(false);
  const [hasDraftToPublish, setHasDraftToPublish] = useState(false);

  /* =========================
     Preview Foto 3x4
  ========================= */
  const fotoPreview = useMemo(() => {
    if (!fotoFile) return null;
    return URL.createObjectURL(fotoFile);
  }, [fotoFile]);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  /* =========================
     Auth (não força login)
  ========================= */
  useEffect(() => {
    let alive = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUser(data?.user || null);
      const d = loadDraft();
      setHasDraftToPublish(Boolean(d?.payload));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      const d = loadDraft();
      setHasDraftToPublish(Boolean(d?.payload));
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  /* =========================
     Restore draft ao abrir
  ========================= */
  useEffect(() => {
    const d = loadDraft();
    if (!d?.payload) return;
    const p = d.payload;

    if (!nome) setNome(p.nome || "");
    if (!dataNascimento) setDataNascimento(p.dataNascimento || "");
    if (!cidade) setCidade(p.cidade || "");
    if (!bairro) setBairro(p.bairro || "");
    if (!cep) setCep(p.cep || "");

    if (!areaProfissional) setAreaProfissional(p.areaProfissional || "");
    if (!objetivoProfissional) setObjetivoProfissional(p.objetivoProfissional || "");

    if (!ultimoEmprego) setUltimoEmprego(p.ultimoEmprego || "");
    if (!funcao) setFuncao(p.funcao || "");
    if (!tempoTrabalho) setTempoTrabalho(p.tempoTrabalho || "");

    if (p.escolaridadeSel && typeof p.escolaridadeSel === "object") {
      setEscolaridadeSel((prev) => ({ ...prev, ...p.escolaridadeSel }));
    }

    if (!curso) setCurso(p.curso || "");
    if (!habilidades) setHabilidades(p.habilidades || "");
    if (!resumo) setResumo(p.resumo || "");

    if (!disponibilidadeHorario) setDisponibilidadeHorario(p.disponibilidadeHorario || "");
    if (!cnh) setCnh(p.cnh || "");
    if (!cursosRapidos) setCursosRapidos(p.cursosRapidos || "");

    if (!telefone) setTelefone(p.telefone || "");
    if (!whatsapp) setWhatsapp(p.whatsapp || "");
    if (!email) setEmail(p.email || "");

    if (!aceitoTermos) setAceitoTermos(Boolean(p.aceitoTermos));
    // arquivos não restauram (fotoFile/curriculoFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     Autosave draft
  ========================= */
  useEffect(() => {
    if (uploading) return;

    const payload = {
      tipo: "curriculo",
      nome,
      dataNascimento,
      cidade,
      bairro,
      cep,

      areaProfissional,
      objetivoProfissional,

      ultimoEmprego,
      funcao,
      tempoTrabalho,

      escolaridadeSel,
      curso,

      habilidades,
      resumo,

      disponibilidadeHorario,
      cnh,
      cursosRapidos,

      telefone,
      whatsapp,
      email,

      aceitoTermos,
    };

    const t = setTimeout(() => saveDraft(payload), 350);
    return () => clearTimeout(t);
  }, [
    uploading,
    nome,
    dataNascimento,
    cidade,
    bairro,
    cep,
    areaProfissional,
    objetivoProfissional,
    ultimoEmprego,
    funcao,
    tempoTrabalho,
    escolaridadeSel,
    curso,
    habilidades,
    resumo,
    disponibilidadeHorario,
    cnh,
    cursosRapidos,
    telefone,
    whatsapp,
    email,
    aceitoTermos,
  ]);

  /* =========================
     Upload handlers
  ========================= */
  const handleFotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setErro("A foto 3x4 precisa ser uma imagem (JPG/PNG).");
      setFotoFile(null);
      e.target.value = "";
      return;
    }

    const maxBytes = 1.5 * 1024 * 1024; // 1,5MB
    if (file.size > maxBytes) {
      setErro("A foto está muito pesada. Use uma imagem de até 1,5MB.");
      setFotoFile(null);
      e.target.value = "";
      return;
    }

    setErro("");
    setFotoFile(file);
    e.target.value = "";
  };

  const handleCurriculoFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const isPdf = file.type === "application/pdf";
    const isImg = file.type?.startsWith("image/");

    if (!isPdf && !isImg) {
      setErro("Envie o currículo em PDF ou imagem (JPG/PNG).");
      setCurriculoFile(null);
      setCurriculoNome("");
      e.target.value = "";
      return;
    }

    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      setErro("O arquivo do currículo está muito pesado. Use até 5MB.");
      setCurriculoFile(null);
      setCurriculoNome("");
      e.target.value = "";
      return;
    }

    setErro("");
    setCurriculoFile(file);
    setCurriculoNome(file.name);
    e.target.value = "";
  };

  /* =========================
     Builders / validate
  ========================= */
  function escolaridadeTexto() {
    const picked = ESCOLARIDADE_OPCOES.filter((o) => escolaridadeSel[o.key]).map((o) => o.label);
    return picked.length ? picked.join(", ") : "";
  }

  function validateForm() {
    if (!nome || !cidade || !areaProfissional) {
      return "Preencha pelo menos Nome, Cidade e Área profissional.";
    }

    const contatoPrincipal = compactBRPhone(whatsapp) || compactBRPhone(telefone) || email;
    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!isValidEmail(email)) {
      return "Digite um e-mail válido (ou deixe em branco).";
    }

    if (!aceitoTermos) {
      return "Para publicar seu currículo, marque a confirmação de responsabilidade.";
    }

    return "";
  }

  function buildDescricaoBase() {
    const esc = escolaridadeTexto();

    return (
      joinLines([
        objetivoProfissional ? `Objetivo: ${objetivoProfissional}` : "",
        dataNascimento ? `Data de nascimento: ${dataNascimento}` : "",
        cep ? `CEP: ${cep}` : "",
        bairro ? `Bairro/Região: ${bairro}` : "",
        esc ? `Escolaridade: ${esc}` : "",
        curso ? `Curso (se houver): ${curso}` : "",
        ultimoEmprego ? `Último emprego: ${ultimoEmprego}` : "",
        funcao ? `Função: ${funcao}` : "",
        tempoTrabalho ? `Tempo de trabalho: ${tempoTrabalho}` : "",
        disponibilidadeHorario ? `Disponibilidade: ${disponibilidadeHorario}` : "",
        cnh ? `CNH: ${cnh}` : "",
        cursosRapidos ? `Cursos rápidos: ${cursosRapidos}` : "",
        habilidades ? `Habilidades: ${habilidades}` : "",
        resumo ? `Resumo: ${resumo}` : "",
      ]) || "Currículo cadastrado no banco de talentos do Classilagos."
    );
  }

  /* =========================
     Publish
  ========================= */
  async function publishNow(loggedUser) {
    setErro("");
    setSucesso("");

    const v = validateForm();
    if (v) {
      setErro(v);
      return;
    }

    setUploading(true);

    let fotoUrl = null;
    let curriculoArquivoUrl = null;

    try {
      const bucket = "anuncios";

      // Upload da foto 3x4 (opcional)
      if (fotoFile) {
        const ext = fotoFile.name.split(".").pop();
        const path = `curriculos/${loggedUser.id}/foto-3x4-${Date.now()}.${ext}`;

        const { error: uploadErroFoto } = await supabase.storage.from(bucket).upload(path, fotoFile);
        if (uploadErroFoto) throw uploadErroFoto;

        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
        fotoUrl = publicData?.publicUrl || null;
      }

      // Upload do arquivo do currículo (opcional) PDF/Imagem
      if (curriculoFile) {
        const ext = curriculoFile.name.split(".").pop();
        const safeExt = (ext || "").toLowerCase();
        const path = `curriculos/${loggedUser.id}/arquivo-${Date.now()}.${safeExt}`;

        const { error: uploadErroArq } = await supabase.storage.from(bucket).upload(path, curriculoFile);
        if (uploadErroArq) throw uploadErroArq;

        const { data: publicDataArq } = supabase.storage.from(bucket).getPublicUrl(path);
        curriculoArquivoUrl = publicDataArq?.publicUrl || null;
      }

      const tituloDb = `Currículo - ${nome}${areaProfissional ? ` (${areaProfissional})` : ""}`;
      const descricaoBase = buildDescricaoBase();

      let descricaoFinal = descricaoBase;
      if (curriculoArquivoUrl) {
        descricaoFinal += `\n\nCurrículo (arquivo): ${curriculoArquivoUrl}`;
      }

      const contatoPrincipal = compactBRPhone(whatsapp) || compactBRPhone(telefone) || email;

      const expTexto =
        joinLines([
          ultimoEmprego ? `Último emprego: ${ultimoEmprego}` : "",
          funcao ? `Função: ${funcao}` : "",
          tempoTrabalho ? `Tempo: ${tempoTrabalho}` : "",
        ]) || null;

      const { data: inserted, error: insertError } = await supabase
        .from("anuncios")
        .insert({
          user_id: loggedUser.id,
          categoria: "curriculo",
          titulo: tituloDb,
          descricao: descricaoFinal,

          cidade,
          bairro,

          nome_contato: nome,
          contato: contatoPrincipal,
          telefone: compactBRPhone(telefone) || null,
          whatsapp: compactBRPhone(whatsapp) || null,
          email: email || null,

          area_profissional: areaProfissional,

          // reaproveita campos existentes (sem mexer no banco)
          escolaridade_minima: escolaridadeTexto() || null,
          formacao_academica: curso || null,
          experiencias_profissionais: expTexto,
          habilidades: habilidades || null,

          // imagem principal do currículo
          curriculo_foto_url: fotoUrl,
          imagens: fotoUrl ? [fotoUrl] : [],

          status: "ativo",
          destaque: false,
        })
        .select("id")
        .single();

      if (insertError) {
        setErro(`Erro ao publicar seu currículo: ${insertError.message || "Tente novamente."}`);
        return;
      }

      clearDraft();
      setHasDraftToPublish(false);

      setSucesso("Currículo publicado com sucesso! Redirecionando…");
      setTimeout(() => {
        router.push(`/anuncios/${inserted.id}`);
      }, 900);
    } catch (err) {
      console.error(err);
      setErro(`Erro ao publicar seu currículo: ${err?.message || "Tente novamente."}`);
    } finally {
      setUploading(false);
    }
  }

  /* =========================
     OTP email
  ========================= */
  async function sendConfirmEmail(emailToUse) {
    const clean = String(emailToUse || "").trim().toLowerCase();
    if (!clean) return "Informe um e-mail para confirmar.";
    if (!isValidEmail(clean)) return "Digite um e-mail válido.";

    setAuthSending(true);
    try {
      const base = `${window.location.origin}/auth/callback`;
      const redirect = `${base}?next=${encodeURIComponent("/anunciar/curriculo")}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirect,
        },
      });

      if (error) {
        return error.message || "Não foi possível enviar o e-mail agora. Tente novamente em instantes.";
      }

      setShowAuthModal(false);
      setSucesso(
        "Enviamos um link de confirmação para seu e-mail. É 100% gratuito — a confirmação serve apenas para evitar anúncios falsos."
      );
      return "";
    } catch (e) {
      console.error(e);
      return "Não foi possível enviar o e-mail agora. Tente novamente em instantes.";
    } finally {
      setAuthSending(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const v = validateForm();
    if (v) {
      setErro(v);
      return;
    }

    if (!user) {
      setAuthEmail((email || "").trim().toLowerCase());
      setShowAuthModal(true);
      return;
    }

    await publishNow(user);
  };

  const toggleEscolaridade = (key) => {
    setEscolaridadeSel((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* =========================
     Render
  ========================= */
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-700">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs md:text-sm text-emerald-700">
            {sucesso}
          </div>
        )}

        {user && hasDraftToPublish && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs md:text-sm text-slate-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">Rascunho encontrado ✅</p>
                <p className="text-slate-600 text-[11px] md:text-xs">
                  Você já pode publicar agora. Plataforma 100% gratuita (confirmação só anti-spam).
                </p>
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => publishNow(user)}
                className="rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
              >
                {uploading ? "Publicando..." : "Publicar agora (grátis)"}
              </button>
            </div>
          </div>
        )}

        <Card title="Dados pessoais" subtitle="Preencha seus dados básicos para aparecer no banco de currículos.">
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-[1fr,220px]">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Data de nascimento</label>
                <input
                  type="text"
                  placeholder="__/__/____"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                <label className="block text-[11px] font-semibold text-slate-700">Bairro</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">CEP</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={cep}
                  onChange={(e) => setCep(formatCEP(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Área profissional" subtitle="Escolha a área para empresas te encontrarem com facilidade.">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Área profissional desejada <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={areaProfissional}
              onChange={(e) => setAreaProfissional(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Card title="Objetivo profissional" subtitle="Ex.: Primeiro emprego / Atendimento / Serviços gerais...">
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={objetivoProfissional}
            onChange={(e) => setObjetivoProfissional(e.target.value)}
            placeholder="Descreva seu objetivo profissional..."
          />
        </Card>

        <Card title="Experiência profissional" subtitle="Preencha se tiver (ou deixe em branco se for primeiro emprego).">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Último emprego</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={ultimoEmprego}
                onChange={(e) => setUltimoEmprego(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Função</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700">Tempo de trabalho</label>
              <input
                type="text"
                placeholder="Ex.: 6 meses / 1 ano..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={tempoTrabalho}
                onChange={(e) => setTempoTrabalho(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card title="Formação / Escolaridade" subtitle="Marque sua escolaridade e informe cursos (se houver).">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {ESCOLARIDADE_OPCOES.map((o) => (
                <label key={o.key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={Boolean(escolaridadeSel[o.key])}
                    onChange={() => toggleEscolaridade(o.key)}
                  />
                  <span className="text-[12px] md:text-sm">{o.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Curso (se houver)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card title="Habilidades" subtitle="Ex.: atendimento, informática básica, vendas, cozinha, limpeza...">
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={habilidades}
            onChange={(e) => setHabilidades(e.target.value)}
            placeholder="Liste suas habilidades..."
          />
        </Card>

        <Card title="Resumo profissional (opcional)" subtitle="Fale em poucas palavras quem você é e no que sabe trabalhar.">
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            placeholder="Conte um resumo rápido sobre você..."
          />
        </Card>

        <Card title="Informações adicionais (opcional)" subtitle="Disponibilidade, CNH e cursos rápidos.">
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Disponibilidade de horário</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={disponibilidadeHorario}
                  onChange={(e) => setDisponibilidadeHorario(e.target.value)}
                  placeholder="Ex.: manhã e tarde / noite / finais de semana..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">CNH</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CNH_OPCOES.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCnh(opt)}
                      className={`rounded-full px-3 py-1.5 text-xs border transition ${
                        cnh === opt
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Clique para selecionar (ex.: B, AB...).</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Cursos rápidos</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={cursosRapidos}
                onChange={(e) => setCursosRapidos(e.target.value)}
                placeholder="Ex.: informática, atendimento, recepção..."
              />
            </div>
          </div>
        </Card>

        {/* ====== 2 UPLOADS (Premium) ====== */}
        <Card
          title="Anexos (opcional)"
          subtitle="Envie uma foto 3x4 do seu rosto (para aparecer no card) e/ou anexe seu currículo em PDF/Imagem."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Upload A: Foto 3x4 */}
            <div className="rounded-2xl border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-900">Foto 3x4 (rosto)</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Recomendado. Use uma foto do seu rosto. Evite enviar imagem do currículo aqui.
              </p>

              <div className="mt-3 grid gap-3 grid-cols-[110px,1fr] items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <div className="aspect-square flex items-center justify-center text-[11px] text-slate-500">
                    {fotoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fotoPreview}
                        alt="Preview da foto"
                        className="h-full w-full object-cover bg-white"
                      />
                    ) : (
                      "Sem foto"
                    )}
                  </div>
                </div>

                <div>
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="text-sm" />
                  <p className="mt-2 text-[11px] text-slate-500">JPG/PNG até 1,5MB.</p>

                  {fotoFile && (
                    <button
                      type="button"
                      onClick={() => setFotoFile(null)}
                      className="mt-2 inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Upload B: Arquivo do currículo */}
            <div className="rounded-2xl border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-900">Currículo (PDF ou imagem)</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Opcional. Envie seu currículo em PDF (preferencial) ou uma foto nítida do documento.
              </p>

              <div className="mt-3">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleCurriculoFileChange}
                  className="text-sm"
                />
                <p className="mt-2 text-[11px] text-slate-500">PDF/JPG/PNG até 5MB.</p>

                {curriculoFile && (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[11px] text-slate-700 truncate">{curriculoNome}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCurriculoFile(null);
                        setCurriculoNome("");
                      }}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-700 hover:bg-white"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Contatos" subtitle="Pelo menos um canal é obrigatório.">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
              <input
                type="text"
                placeholder="(22) 9999-9999"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={telefone}
                onChange={(e) => setTelefone(formatBRPhone(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
              <input
                type="text"
                placeholder="(22) 99999-9999"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatBRPhone(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Pelo menos um desses canais será exibido para empresas. Plataforma 100% gratuita.
          </p>
        </Card>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <label className="flex items-start gap-2 text-[11px] md:text-xs text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
              checked={aceitoTermos}
              onChange={(e) => setAceitoTermos(e.target.checked)}
            />
            <span>
              Declaro que as informações acima são verdadeiras e assumo total responsabilidade pelos dados informados neste
              currículo.
            </span>
          </label>

          <button
            type="submit"
            disabled={uploading}
            className="mt-4 w-full bg-emerald-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {uploading ? "Publicando..." : "Publicar currículo (grátis)"}
          </button>

          <p className="mt-2 text-[11px] text-slate-500 text-center">
            100% gratuito • Confirmação de e-mail serve apenas para evitar spam e anúncios falsos.
          </p>
        </div>
      </form>

      {/* Modal de validação por e-mail */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-w-md w-full rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Confirmar e publicar (grátis)</h3>
            <p className="mt-1 text-xs text-slate-600">
              A plataforma é <strong>100% gratuita</strong>. A confirmação do e-mail é apenas para evitar spam e anúncios
              falsos. Seus dados já estão salvos como rascunho.
            </p>

            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-slate-700">Seu e-mail</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <p className="mt-2 text-[11px] text-slate-500">
                Depois de confirmar, volte aqui e clique em <strong>“Publicar agora (grátis)”</strong>.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  setErro("");
                  const msg = await sendConfirmEmail(authEmail);
                  if (msg) setErro(msg);
                }}
                disabled={authSending}
                className="flex-1 rounded-full bg-emerald-600 text-white py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                {authSending ? "Enviando..." : "Enviar link de confirmação"}
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
