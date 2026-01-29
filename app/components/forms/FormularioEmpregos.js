"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

// (opcional) valida e-mail simples
function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// ✅ PREMIUM FIX: Card FORA do componente (evita perder foco ao digitar)
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

// ✅ Draft helpers (campanha Empregos)
const DRAFT_KEY = "cl_empregos_vagas_draft_v1";

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

export default function FormularioEmpregos() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [areaProfissional, setAreaProfissional] = useState("");
  const [tipoVaga, setTipoVaga] = useState("");
  const [modeloTrabalho, setModeloTrabalho] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [faixaSalarial, setFaixaSalarial] = useState("");
  const [beneficios, setBeneficios] = useState("");

  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);

  // ✅ auth / fluxo premium
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authSending, setAuthSending] = useState(false);
  const [hasDraftToPublish, setHasDraftToPublish] = useState(false);

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

  // preview da logo
  const logoPreview = useMemo(() => {
    if (!logo) return null;
    return URL.createObjectURL(logo);
  }, [logo]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setLogo(null);
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setErro("A logo precisa ser uma imagem (JPG/PNG).");
      setLogo(null);
      e.target.value = "";
      return;
    }

    const maxBytes = 1.5 * 1024 * 1024; // 1,5MB
    if (file.size > maxBytes) {
      setErro("A logo está muito pesada. Use uma imagem de até 1,5MB.");
      setLogo(null);
      e.target.value = "";
      return;
    }

    setErro("");
    setLogo(file);
    e.target.value = "";
  };

  function validateForm() {
    if (!titulo || !cidade || !areaProfissional || !tipoVaga || !descricao) {
      return "Preencha todos os campos obrigatórios (*).";
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!isValidEmail(email)) {
      return "Digite um e-mail válido (ou deixe em branco).";
    }

    if (!aceitoResponsabilidade) {
      return "Para publicar a vaga, marque a declaração de responsabilidade.";
    }

    return "";
  }

  // ✅ pega user logado (se tiver), sem forçar login
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

  // ✅ ao abrir, se existir draft, repõe os campos
  useEffect(() => {
    const d = loadDraft();
    if (!d?.payload) return;

    const p = d.payload;

    if (!titulo) setTitulo(p.titulo || "");
    if (!descricao) setDescricao(p.descricao || "");
    if (!cidade) setCidade(p.cidade || "");
    if (!bairro) setBairro(p.bairro || "");

    if (!areaProfissional) setAreaProfissional(p.areaProfissional || "");
    if (!tipoVaga) setTipoVaga(p.tipoVaga || "");
    if (!modeloTrabalho) setModeloTrabalho(p.modeloTrabalho || "");
    if (!cargaHoraria) setCargaHoraria(p.cargaHoraria || "");
    if (!faixaSalarial) setFaixaSalarial(p.faixaSalarial || "");
    if (!beneficios) setBeneficios(p.beneficios || "");

    if (!nomeContato) setNomeContato(p.nomeContato || "");
    if (!telefone) setTelefone(p.telefone || "");
    if (!whatsapp) setWhatsapp(p.whatsapp || "");
    if (!email) setEmail(p.email || "");

    if (!aceitoResponsabilidade) setAceitoResponsabilidade(Boolean(p.aceitoResponsabilidade));

    // logo não restaura (arquivo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ autosave rascunho (leve)
  useEffect(() => {
    if (uploading) return;

    const payload = {
      tipo: "empregos",
      titulo,
      descricao,
      cidade,
      bairro,
      areaProfissional,
      tipoVaga,
      modeloTrabalho,
      cargaHoraria,
      faixaSalarial,
      beneficios,
      nomeContato,
      telefone,
      whatsapp,
      email,
      aceitoResponsabilidade,
    };

    const t = setTimeout(() => saveDraft(payload), 350);
    return () => clearTimeout(t);
  }, [
    uploading,
    titulo,
    descricao,
    cidade,
    bairro,
    areaProfissional,
    tipoVaga,
    modeloTrabalho,
    cargaHoraria,
    faixaSalarial,
    beneficios,
    nomeContato,
    telefone,
    whatsapp,
    email,
    aceitoResponsabilidade,
  ]);

  async function publishNow(loggedUser) {
    setErro("");
    setSucesso("");

    const v = validateForm();
    if (v) {
      setErro(v);
      return;
    }

    let logoUrl = null;

    try {
      setUploading(true);

      // upload da logo (se houver)
      if (logo) {
        const ext = logo.name.split(".").pop();
        const path = `${loggedUser.id}/empregos-logo-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage.from("anuncios").upload(path, logo);

        if (uploadError) {
          console.error("Erro ao fazer upload da logo:", uploadError);
          setErro("Não consegui enviar a logo. Tente outra imagem ou publique sem logo.");
          return;
        }

        const { data } = supabase.storage.from("anuncios").getPublicUrl(path);
        logoUrl = data?.publicUrl || null;
      }

      const contatoPrincipal = whatsapp || telefone || email;

      // ✅ importante: categoria consistente
      const categoriaEmpregos = "empregos";

      const { data: inserted, error } = await supabase
        .from("anuncios")
        .insert({
          user_id: loggedUser.id,
          categoria: categoriaEmpregos,

          titulo,
          descricao,
          cidade,
          bairro,

          nome_contato: nomeContato || null,
          telefone: telefone || null,
          whatsapp: whatsapp || null,
          email: email || null,
          contato: contatoPrincipal,

          area_profissional: areaProfissional,
          tipo_vaga: tipoVaga,
          modelo_trabalho: modeloTrabalho || null,
          carga_horaria: cargaHoraria || null,
          faixa_salarial: faixaSalarial || null,
          beneficios: beneficios || null,

          // usa imagens[] para a logo (padrão seu)
          imagens: logoUrl ? [logoUrl] : null,

          status: "ativo",
          destaque: false,
        })
        .select("id")
        .single();

      if (error) {
        console.error(error);
        setErro("Erro ao salvar a vaga. Tente novamente.");
        return;
      }

      clearDraft();
      setHasDraftToPublish(false);

      setSucesso("Vaga publicada com sucesso! Redirecionando…");

      setTimeout(() => {
        router.push(`/anuncios/${inserted.id}`);
      }, 900);
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado. Tente de novo.");
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

      // ✅ volta para /anunciar/empregos (campanha Empregos)
      // depois de confirmar, a pessoa volta e clica "Publicar agora (grátis)"
      const redirect = `${base}?next=${encodeURIComponent("/anunciar/empregos")}`;

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

  const enviarFormulario = async (e) => {
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
      setAuthEmail((email || "").trim().toLowerCase());
      setShowAuthModal(true);
      return;
    }

    // ✅ logado: publica direto
    await publishNow(user);
  };

  return (
    <>
      <form onSubmit={enviarFormulario} className="space-y-4">
        {/* mensagens */}
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
                className="rounded-full bg-sky-600 text-white px-5 py-2 text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60"
              >
                {uploading ? "Publicando..." : "Publicar agora (grátis)"}
              </button>
            </div>
          </div>
        )}

        {/* INFORMAÇÕES DA VAGA */}
        <Card title="Informações da vaga" subtitle="Campos com * são obrigatórios.">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Título da vaga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Ex: Atendente de loja, Auxiliar administrativo..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Área profissional <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={areaProfissional}
                onChange={(e) => setAreaProfissional(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option>Administração</option>
                <option>Atendimento / Caixa</option>
                <option>Comércio / Vendas</option>
                <option>Construção civil</option>
                <option>Serviços gerais</option>
                <option>Educação</option>
                <option>Saúde</option>
                <option>Hotelaria / Turismo</option>
                <option>Motorista / Entregador</option>
                <option>TI / Informática</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Tipo de vaga <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={tipoVaga}
                  onChange={(e) => setTipoVaga(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  <option>CLT</option>
                  <option>Temporário</option>
                  <option>Estágio</option>
                  <option>Freelancer</option>
                  <option>Prestador / PJ</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Modelo</label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={modeloTrabalho}
                  onChange={(e) => setModeloTrabalho(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option>Presencial</option>
                  <option>Híbrido</option>
                  <option>Home-office</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Carga horária</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Ex: 44h semanais"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Faixa salarial</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Ex: R$ 1.600 a R$ 1.900"
                  value={faixaSalarial}
                  onChange={(e) => setFaixaSalarial(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Benefícios</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Vale-transporte, alimentação, plano de saúde..."
                  value={beneficios}
                  onChange={(e) => setBeneficios(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* LOCAL */}
        <Card title="Local da vaga" subtitle="Cidade é obrigatória para aparecer nas buscas.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Cidade <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
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
              <label className="block text-[11px] font-semibold text-slate-700">Bairro</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro, Itaipuaçu..."
              />
            </div>
          </div>
        </Card>

        {/* DESCRIÇÃO */}
        <Card title="Descrição da vaga" subtitle="Explique atividades, requisitos, horários e como se candidatar.">
          <label className="block text-[11px] font-semibold text-slate-700">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Explique a função, atividades, requisitos e detalhes importantes."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </Card>

        {/* LOGO */}
        <Card
          title="Logo da empresa"
          subtitle="Opcional. Se você confirmar o e-mail em outro momento/dispositivo, pode ser necessário selecionar a logo novamente."
        >
          <div className="grid gap-3 md:grid-cols-[160px,1fr] items-start">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div className="aspect-square flex items-center justify-center text-[11px] text-slate-500">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Preview da logo" className="h-full w-full object-contain bg-white" />
                ) : (
                  "Sem logo"
                )}
              </div>
            </div>

            <div>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
              <p className="mt-2 text-[11px] text-slate-500">JPG/PNG até 1,5MB. (Logo quadrada fica mais bonita)</p>

              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="mt-2 inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Remover logo
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* CONTATO */}
        <Card title="Dados de contato" subtitle="Pelo menos um meio será exibido (WhatsApp, telefone ou e-mail).">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Nome do responsável</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={nomeContato}
                onChange={(e) => setNomeContato(e.target.value)}
                placeholder="Ex: RH da empresa, nome do responsável..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Telefone para contato"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="DDD + número"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              Plataforma 100% gratuita • Confirmação de e-mail serve apenas para evitar spam e anúncios falsos.
            </p>
          </div>
        </Card>

        {/* RESPONSABILIDADE + BOTÃO */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <label className="flex items-start gap-2 text-[11px] md:text-xs text-slate-600">
            <input
              id="responsabilidade"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
              checked={aceitoResponsabilidade}
              onChange={(e) => setAceitoResponsabilidade(e.target.checked)}
            />
            <span>
              Declaro que todas as informações desta vaga são verdadeiras, estão de acordo com a legislação vigente e que
              não há conteúdo discriminatório ou ilegal.
            </span>
          </label>

          <button
            type="submit"
            disabled={uploading}
            className="mt-4 w-full bg-sky-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60"
          >
            {uploading ? "Publicando..." : "Publicar vaga (grátis)"}
          </button>
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
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                className="flex-1 rounded-full bg-sky-600 text-white py-2.5 text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
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

