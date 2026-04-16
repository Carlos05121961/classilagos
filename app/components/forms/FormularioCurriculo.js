"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { syncUserMetadataFromForm } from "../../../lib/syncUserMetadata";

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

export default function FormularioCurriculo() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");

  const [areaProfissional, setAreaProfissional] = useState("");
  const [objetivoProfissional, setObjetivoProfissional] = useState("");

  const [ultimoEmprego, setUltimoEmprego] = useState("");
  const [funcao, setFuncao] = useState("");
  const [tempoTrabalho, setTempoTrabalho] = useState("");

  const [escolaridadeSel, setEscolaridadeSel] = useState({
    fundamental: false,
    medio: false,
    tecnico: false,
    superior: false,
  });
  const [curso, setCurso] = useState("");

  const [habilidades, setHabilidades] = useState("");
  const [resumo, setResumo] = useState("");

  const [disponibilidadeHorario, setDisponibilidadeHorario] = useState("");
  const [cnh, setCnh] = useState("");
  const [cursosRapidos, setCursosRapidos] = useState("");

  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [fotoFile, setFotoFile] = useState(null);
  const [curriculoFile, setCurriculoFile] = useState(null);
  const [curriculoNome, setCurriculoNome] = useState("");

  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [salvarNoPerfil, setSalvarNoPerfil] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const fotoPreview = useMemo(() => {
    if (!fotoFile) return null;
    return URL.createObjectURL(fotoFile);
  }, [fotoFile]);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setErro("A foto 3x4 precisa ser uma imagem (JPG/PNG).");
      setFotoFile(null);
      e.target.value = "";
      return;
    }

    const maxBytes = 1.5 * 1024 * 1024;
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

    const maxBytes = 5 * 1024 * 1024;
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

    if (!email.trim()) {
      return "Informe seu e-mail para publicar o currículo.";
    }

    if (!isValidEmail(email)) {
      return "Digite um e-mail válido.";
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

  async function uploadArquivo({ bucket, path, file }) {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
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

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ownerKey =
        user?.id || `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      if (user && salvarNoPerfil) {
        await supabase
          .from("profiles")
          .update({
            name: nome || null,
            phone: compactBRPhone(telefone) || compactBRPhone(whatsapp) || null,
            city: cidade || null,
          })
          .eq("id", user.id);
      }

      if (user) {
        await syncUserMetadataFromForm(user, {
          nome,
          cidade,
          whatsapp: compactBRPhone(whatsapp),
          telefone: compactBRPhone(telefone),
          email,
          origem: "anuncio_curriculo",
        });
      }

      const bucket = "anuncios";

      let fotoUrl = null;
      let curriculoArquivoUrl = null;

      if (fotoFile) {
        const ext = (fotoFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `curriculos/${ownerKey}/foto-3x4-${Date.now()}.${ext}`;
        fotoUrl = await uploadArquivo({ bucket, path, file: fotoFile });
      }

      if (curriculoFile) {
        const ext = (curriculoFile.name.split(".").pop() || "pdf").toLowerCase();
        const path = `curriculos/${ownerKey}/arquivo-${Date.now()}.${ext}`;
        curriculoArquivoUrl = await uploadArquivo({ bucket, path, file: curriculoFile });
      }

      const tituloDb = `Currículo - ${nome}${areaProfissional ? ` (${areaProfissional})` : ""}`;
      let descricaoFinal = buildDescricaoBase();

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
          user_id: user?.id || null,
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

          escolaridade_minima: escolaridadeTexto() || null,
          formacao_academica: curso || null,
          experiencias_profissionais: expTexto,
          habilidades: habilidades || null,

          curriculo_foto_url: fotoUrl,
          imagens: fotoUrl ? [fotoUrl] : [],

          status: user ? "ativo" : "pendente",
          destaque: false,

          email_confirmado: !!user,
          email_confirmado_em: user ? new Date().toISOString() : null,
          criado_sem_login: !user,
        })
        .select("id")
        .single();

      if (insertError) {
        setErro(`Erro ao publicar seu currículo: ${insertError.message || "Tente novamente."}`);
        return;
      }

       // 🔥 CONVERSÃO GOOGLE ADS
if (typeof window !== "undefined" && window.gtag) {
  window.gtag('event', 'conversion', {
    'send_to': 'AW-17865509628/j9HeCPy0w50cEPyV-MZC'
  });
}

      if (!user) {
        const redirectTo = `${window.location.origin}/auth/confirmar-anuncio?anuncio=${inserted.id}`;

        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectTo,
          },
        });

        if (signInError) {
          console.error("Erro ao enviar confirmação por e-mail:", signInError);

          const msg = String(signInError.message || "").toLowerCase();

          if (msg.includes("security purposes") || msg.includes("only request this after")) {
            setSucesso(
              "Seu currículo foi enviado com sucesso e está pendente. Aguarde cerca de 1 minuto e verifique seu e-mail para confirmar o cadastro."
            );
          } else {
            setSucesso(
              "Seu currículo foi enviado e está pendente. Houve um problema ao enviar o e-mail de confirmação agora. Tente entrar novamente mais tarde."
            );
          }

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${inserted.id}`
            );
          }, 1500);
        } else {
          setSucesso("Currículo enviado com sucesso! Redirecionando...");

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${inserted.id}`
            );
          }, 1500);
        }
      } else {
        setSucesso("Currículo publicado com sucesso! Redirecionando…");
        setTimeout(() => {
          router.push("/painel/meus-anuncios");
        }, 1200);
      }

      setNome("");
      setDataNascimento("");
      setCidade("");
      setBairro("");
      setCep("");
      setAreaProfissional("");
      setObjetivoProfissional("");
      setUltimoEmprego("");
      setFuncao("");
      setTempoTrabalho("");
      setEscolaridadeSel({
        fundamental: false,
        medio: false,
        tecnico: false,
        superior: false,
      });
      setCurso("");
      setHabilidades("");
      setResumo("");
      setDisponibilidadeHorario("");
      setCnh("");
      setCursosRapidos("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setFotoFile(null);
      setCurriculoFile(null);
      setCurriculoNome("");
      setAceitoTermos(false);
    } catch (err) {
      console.error(err);
      setErro(`Erro ao publicar seu currículo: ${err?.message || "Tente novamente."}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleEscolaridade = (key) => {
    setEscolaridadeSel((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
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
              <p className="mt-2 text-[11px] text-slate-500">Clique para selecionar.</p>
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

      <Card
        title="Anexos (opcional)"
        subtitle="Envie uma foto 3x4 do seu rosto e/ou anexe seu currículo em PDF ou imagem."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-900">Foto 3x4 (rosto)</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Use uma foto do seu rosto. Evite enviar imagem do currículo aqui.
            </p>

            <div className="mt-3 grid gap-3 grid-cols-[110px,1fr] items-start">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="aspect-square flex items-center justify-center text-[11px] text-slate-500">
                  {fotoPreview ? (
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

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-900">Currículo (PDF ou imagem)</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Opcional. Envie seu currículo em PDF ou uma foto nítida do documento.
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

        <label className="mt-4 flex items-start gap-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={salvarNoPerfil}
            onChange={(e) => setSalvarNoPerfil(e.target.checked)}
          />
          <span>
            Salvar meus dados básicos no perfil para facilitar futuros anúncios.
          </span>
        </label>

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
            Declaro que as informações acima são verdadeiras e assumo total responsabilidade pelos dados informados neste currículo.
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
  );
}
