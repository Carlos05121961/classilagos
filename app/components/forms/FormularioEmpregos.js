"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { syncUserMetadataFromForm } from "../../../lib/syncUserMetadata";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

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

    const maxBytes = 1.5 * 1024 * 1024;
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

    if (!email.trim()) {
      return "Informe seu e-mail para publicar a vaga.";
    }

    if (!isValidEmail(email)) {
      return "Digite um e-mail válido.";
    }

    if (!aceitoResponsabilidade) {
      return "Para publicar a vaga, marque a declaração de responsabilidade.";
    }

    return "";
  }

  async function uploadLogo(loggedUserOrOwnerKey) {
    if (!logo) return null;

    const ext = (logo.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${loggedUserOrOwnerKey}/empregos-logo-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("anuncios").upload(path, logo);

    if (uploadError) {
      console.error("Erro ao fazer upload da logo:", uploadError);
      throw new Error("Não consegui enviar a logo. Tente outra imagem ou publique sem logo.");
    }

    const { data } = supabase.storage.from("anuncios").getPublicUrl(path);
    return data?.publicUrl || null;
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

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ownerKey =
        user?.id || `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      if (user) {
        await syncUserMetadataFromForm(user, {
          nome: nomeContato,
          cidade,
          whatsapp,
          telefone,
          email,
          origem: "anuncio_empregos_vagas",
        });
      }

      const logoUrl = await uploadLogo(ownerKey);

      const contatoPrincipal = whatsapp.trim() || telefone.trim() || email.trim();

      const descricaoFinal = `${descricao}

=== Informações complementares da vaga ===
Área profissional: ${areaProfissional || "-"}
Tipo de vaga: ${tipoVaga || "-"}
Modelo de trabalho: ${modeloTrabalho || "-"}
Carga horária: ${cargaHoraria || "-"}
Faixa salarial: ${faixaSalarial || "-"}
Benefícios: ${beneficios || "-"}
Responsável: ${nomeContato || "-"}
`.trim();

      const { data: inserted, error } = await supabase
        .from("anuncios")
        .insert({
          user_id: user?.id || null,
          categoria: "empregos",

          titulo: titulo.trim(),
          descricao: descricaoFinal,
          cidade,
          bairro: bairro.trim(),

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

          imagens: logoUrl ? [logoUrl] : null,

          status: user ? "ativo" : "pendente",
          destaque: false,

          email_confirmado: !!user,
          email_confirmado_em: user ? new Date().toISOString() : null,
          criado_sem_login: !user,
        })
        .select("id")
        .single();

      if (error) {
        console.error(error);
        setErro("Erro ao salvar a vaga. Tente novamente.");
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
              "Sua vaga foi enviada com sucesso e está pendente. Aguarde cerca de 1 minuto e verifique seu e-mail para confirmar o cadastro."
            );
          } else {
            setSucesso(
              "Sua vaga foi enviada e está pendente. Houve um problema ao enviar o e-mail de confirmação agora. Tente entrar novamente mais tarde."
            );
          }

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${inserted.id}`
            );
          }, 1500);
        } else {
          setSucesso("Vaga enviada com sucesso! Redirecionando...");

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${inserted.id}`
            );
          }, 1500);
        }
      } else {
        setSucesso("Vaga publicada com sucesso! Redirecionando…");

        setTimeout(() => {
          router.push("/painel/meus-anuncios");
        }, 1200);
      }

      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setAreaProfissional("");
      setTipoVaga("");
      setModeloTrabalho("");
      setCargaHoraria("");
      setFaixaSalarial("");
      setBeneficios("");
      setNomeContato("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setLogo(null);
      setAceitoResponsabilidade(false);
    } catch (err) {
      console.error(err);
      setErro(err?.message || "Erro inesperado. Tente de novo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={enviarFormulario} className="space-y-4">
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

      <Card
        title="Logo da empresa"
        subtitle="Opcional. Se você confirmar o e-mail em outro momento/dispositivo, pode ser necessário selecionar a logo novamente."
      >
        <div className="grid gap-3 md:grid-cols-[160px,1fr] items-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="aspect-square flex items-center justify-center text-[11px] text-slate-500">
              {logoPreview ? (
                <img src={logoPreview} alt="Preview da logo" className="h-full w-full object-contain bg-white" />
              ) : (
                "Sem logo"
              )}
            </div>
          </div>

          <div>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
            <p className="mt-2 text-[11px] text-slate-500">JPG/PNG até 1,5MB. Logo quadrada costuma ficar melhor.</p>

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
  );
}
