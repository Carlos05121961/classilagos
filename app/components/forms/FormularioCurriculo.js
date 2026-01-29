"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// ✅ Card fora do componente (evita remount a cada render)
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

// ✅ listas fora (estabilidade + organização)
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

// ✅ Draft helpers (campanha Empregos)
const DRAFT_KEY = "cl_empregos_curriculo_draft_v1";

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

  // Dados pessoais
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [idade, setIdade] = useState("");
  const [areaProfissional, setAreaProfissional] = useState("");

  // Formação / experiência
  const [escolaridade, setEscolaridade] = useState("");
  const [formacaoAcademica, setFormacaoAcademica] = useState("");
  const [experienciasProf, setExperienciasProf] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [idiomas, setIdiomas] = useState("");
  const [resumo, setResumo] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Foto do currículo
  const [fotoFile, setFotoFile] = useState(null);

  // Checkbox
  const [aceitoTermos, setAceitoTermos] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // ✅ auth / fluxo premium
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authSending, setAuthSending] = useState(false);
  const [hasDraftToPublish, setHasDraftToPublish] = useState(false);

  // preview da foto
  const fotoPreview = useMemo(() => {
    if (!fotoFile) return null;
    return URL.createObjectURL(fotoFile);
  }, [fotoFile]);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  // ✅ pega user logado (se tiver), sem forçar login
  useEffect(() => {
    let alive = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUser(data?.user || null);

      // se estiver logado e existe draft, oferece "Publicar agora"
      const d = loadDraft();
      setHasDraftToPublish(Boolean(d?.payload));
    });

    // Listener para mudanças de auth (ex.: voltou do callback logado)
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

  // ✅ ao abrir, se existir draft, repõe os campos (modo campanha)
  useEffect(() => {
    const d = loadDraft();
    if (!d?.payload) return;

    const p = d.payload;

    // só preencher se estiver vazio, pra não atrapalhar quem já está editando
    if (!nome) setNome(p.nome || "");
    if (!cidade) setCidade(p.cidade || "");
    if (!bairro) setBairro(p.bairro || "");
    if (!idade) setIdade(p.idade || "");
    if (!areaProfissional) setAreaProfissional(p.areaProfissional || "");
    if (!escolaridade) setEscolaridade(p.escolaridade || "");
    if (!formacaoAcademica) setFormacaoAcademica(p.formacaoAcademica || "");
    if (!experienciasProf) setExperienciasProf(p.experienciasProf || "");
    if (!habilidades) setHabilidades(p.habilidades || "");
    if (!idiomas) setIdiomas(p.idiomas || "");
    if (!resumo) setResumo(p.resumo || "");
    if (!telefone) setTelefone(p.telefone || "");
    if (!whatsapp) setWhatsapp(p.whatsapp || "");
    if (!email) setEmail(p.email || "");
    if (!aceitoTermos) setAceitoTermos(Boolean(p.aceitoTermos));

    // fotoFile não restaura (arquivo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ autosave rascunho (leve) enquanto digita
  useEffect(() => {
    // não salva se estiver publicando
    if (uploading) return;

    const payload = {
      tipo: "curriculo",
      nome,
      cidade,
      bairro,
      idade,
      areaProfissional,
      escolaridade,
      formacaoAcademica,
      experienciasProf,
      habilidades,
      idiomas,
      resumo,
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
    cidade,
    bairro,
    idade,
    areaProfissional,
    escolaridade,
    formacaoAcademica,
    experienciasProf,
    habilidades,
    idiomas,
    resumo,
    telefone,
    whatsapp,
    email,
    aceitoTermos,
  ]);

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setErro("A foto precisa ser uma imagem (JPG/PNG).");
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

  function validateForm() {
    if (!nome || !cidade || !areaProfissional) {
      return "Preencha pelo menos Nome, Cidade e Área profissional.";
    }

    const contatoPrincipal = whatsapp || telefone || email;
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

    try {
      const bucket = "anuncios";

      // Upload da foto (opcional)
      if (fotoFile) {
        const ext = fotoFile.name.split(".").pop();
        const path = `curriculos/${loggedUser.id}/foto-${Date.now()}.${ext}`;

        const { error: uploadErroFoto } = await supabase.storage.from(bucket).upload(path, fotoFile);
        if (uploadErroFoto) throw uploadErroFoto;

        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
        fotoUrl = publicData?.publicUrl || null;
      }

      const tituloDb = `Currículo - ${nome}${areaProfissional ? ` (${areaProfissional})` : ""}`;

      const descricaoBase =
        resumo?.trim() ||
        experienciasProf?.trim() ||
        formacaoAcademica?.trim() ||
        "Currículo cadastrado no banco de talentos do Classilagos.";

      const contatoPrincipal = whatsapp || telefone || email;

      const { data: inserted, error: insertError } = await supabase
        .from("anuncios")
        .insert({
          user_id: loggedUser.id,
          categoria: "curriculo",
          titulo: tituloDb,
          descricao: descricaoBase,
          cidade,
          bairro,

          nome_contato: nome,
          contato: contatoPrincipal,
          telefone: telefone || null,
          whatsapp: whatsapp || null,
          email: email || null,

          area_profissional: areaProfissional,
          escolaridade_minima: escolaridade || null,
          formacao_academica: formacaoAcademica || null,
          experiencias_profissionais: experienciasProf || null,
          habilidades: habilidades || null,
          idiomas: idiomas || null,

          curriculo_foto_url: fotoUrl,

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

  async function sendConfirmEmail(emailToUse) {
    const clean = String(emailToUse || "").trim().toLowerCase();
    if (!clean) return "Informe um e-mail para confirmar.";
    if (!isValidEmail(clean)) return "Digite um e-mail válido.";

    setAuthSending(true);
    try {
      // ✅ sempre no mesmo domínio que o usuário está usando
      const base = `${window.location.origin}/auth/callback`;

      // ✅ volta para o próprio formulário (campanha Empregos)
      // quando o usuário voltar logado, ele clica "Publicar agora"
      const redirect = `${base}?next=${encodeURIComponent("/anunciar/curriculo")}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirect,
        },
      });

      if (error) {
        // rate limit etc
        return error.message || "Não foi possível enviar o e-mail agora. Tente novamente em instantes.";
      }

      // mantém draft salvo (já está) + fecha modal
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

    // ✅ se não estiver logado: pede confirmação por email (anti-spam)
    if (!user) {
      // usa o email do formulário como sugestão
      setAuthEmail((email || "").trim().toLowerCase());
      setShowAuthModal(true);
      return;
    }

    // ✅ logado: publica direto
    await publishNow(user);
  };

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

        {/* ✅ Se voltou logado e tem draft, oferece publicar */}
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

        <Card title="Dados pessoais" subtitle="Preencha o básico para aparecer no banco de talentos.">
          <div className="space-y-3">
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

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Idade (opcional)</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
              </div>

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
                <label className="block text-[11px] font-semibold text-slate-700">Bairro / Região</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Perfil profissional" subtitle="Escolha a área para empresas te encontrarem com facilidade.">
          <div className="space-y-3">
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

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Escolaridade</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ex.: Ensino médio completo, superior em andamento..."
                value={escolaridade}
                onChange={(e) => setEscolaridade(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Formação acadêmica / cursos</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={formacaoAcademica}
                onChange={(e) => setFormacaoAcademica(e.target.value)}
                placeholder="Cursos, faculdades, especializações, treinamentos..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Experiências profissionais</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={experienciasProf}
                onChange={(e) => setExperienciasProf(e.target.value)}
                placeholder="Últimos empregos, funções e tempo de atuação..."
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Habilidades / competências</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={habilidades}
                  onChange={(e) => setHabilidades(e.target.value)}
                  placeholder="Ex.: atendimento, vendas, informática, cozinha..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Resumo profissional</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Breve resumo de quem você é profissionalmente."
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Idiomas (se houver)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={idiomas}
                onChange={(e) => setIdiomas(e.target.value)}
                placeholder="Ex.: Inglês básico, Espanhol intermediário..."
              />
            </div>
          </div>
        </Card>

        <Card
          title="Foto do currículo"
          subtitle="Opcional. Se você confirmar o e-mail em outro momento/dispositivo, pode ser necessário selecionar a foto novamente."
        >
          <div className="grid gap-3 md:grid-cols-[160px,1fr] items-start">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div className="aspect-square flex items-center justify-center text-[11px] text-slate-500">
                {fotoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fotoPreview} alt="Preview da foto" className="h-full w-full object-cover bg-white" />
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
        </Card>

        <Card title="Contatos" subtitle="Pelo menos um canal é obrigatório.">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
              <input
                type="email"
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
              Declaro que as informações são verdadeiras e autorizo a exibição do meu currículo para empresas na plataforma
              Classilagos.
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

      {/* ✅ Modal de validação por e-mail */}
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
