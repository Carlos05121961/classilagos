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

function isValidUrl(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  try {
    new URL(s.startsWith("http") ? s : `https://${s}`);
    return true;
  } catch {
    return false;
  }
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

export default function FormularioProfissionais() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [nomeProfissional, setNomeProfissional] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [areaProfissional, setAreaProfissional] = useState("");

  const [atendeDomicilio, setAtendeDomicilio] = useState(false);
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [faixaPreco, setFaixaPreco] = useState("");

  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [capaFile, setCapaFile] = useState(null);
  const [galeriaFiles, setGaleriaFiles] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  const servicosProfissionais = [
    "Eletricista",
    "Encanador",
    "Marido de aluguel",
    "Pedreiro / Reformas",
    "Pintor",
    "Gesseiro",
    "Azulejista",
    "Marceneiro / Carpinteiro",
    "Serralheiro",
    "Vidraceiro",
    "Piscineiro (Cuidador de piscinas)",
    "Jardineiro / Paisagismo",
    "Diarista / Faxineira",
    "Passadeira",
    "Reboque / Guincho",
    "Cuidador(a) de idosos",
    "Babá / Cuidador(a) infantil",
    "Churrasqueiro",
    "Cozinheiro(a) / Marmitex / Quentinha",
    "Técnico em informática",
    "Manutenção de celulares",
    "Manutenção de eletrônicos e eletrodomésticos",
    "Manutenção de ar-condicionado / refrigeração",
    "Chaveiro",
    "Motorista particular / Transporte executivo",
    "Transporte / Frete / Carreto",
    "Van escolar",
    "Arquiteto",
    "Engenheiro civil",
    "Engenheiro elétrico",
    "Engenheiro mecânico",
    "Designer de interiores",
    "Aulas particulares",
    "Aulas de música / canto / instrumentos",
    "Aulas de idiomas",
    "Designer gráfico",
    "Social media / Marketing digital",
    "Consultor(a) / Mentor(a)",
    "Outros serviços profissionais",
  ];

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxBytes = 2 * 1024 * 1024;
    const onlyImages = files.filter((f) => f?.type?.startsWith("image/"));

    const valid = [];
    for (const f of onlyImages) {
      if (f.size > maxBytes) continue;
      valid.push(f);
    }

    if (onlyImages.length !== files.length) {
      setErro("Apenas imagens (JPG/PNG) são aceitas.");
    } else if (valid.length !== onlyImages.length) {
      setErro("Alguma imagem passou de 2MB e foi ignorada.");
    } else {
      setErro("");
    }

    setGaleriaFiles((prev) => {
      const combinado = [...prev, ...valid];
      return combinado.slice(0, 7);
    });

    e.target.value = "";
  };

  const removerGaleria = (idx) => {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const previewLogo = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : ""), [logoFile]);
  const previewCapa = useMemo(() => (capaFile ? URL.createObjectURL(capaFile) : ""), [capaFile]);
  const previewsGaleria = useMemo(
    () => galeriaFiles.map((f) => URL.createObjectURL(f)),
    [galeriaFiles]
  );

  useEffect(() => {
    return () => {
      if (previewLogo) URL.revokeObjectURL(previewLogo);
      if (previewCapa) URL.revokeObjectURL(previewCapa);
      previewsGaleria.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [previewLogo, previewCapa, previewsGaleria]);

  async function uploadUmaImagem({ bucket, path, file }) {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function validarAntesDeEnviar() {
    const contatoPrincipal = whatsapp || telefone || email;

    if (!titulo || !cidade || !areaProfissional) {
      return "Preencha Título, Cidade e o Tipo de serviço profissional.";
    }

    if (!descricao.trim()) {
      return "Preencha a descrição do serviço.";
    }

    if (!capaFile) {
      return "Envie a foto de capa (obrigatória).";
    }

    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!email.trim()) {
      return "Informe seu e-mail para publicar o anúncio.";
    }

    if (!isValidEmail(email)) {
      return "Digite um e-mail válido.";
    }

    if (!isValidUrl(siteUrl)) {
      return "O site informado parece inválido. Ex.: meusite.com.br ou https://meusite.com.br";
    }

    if (!aceitoResponsabilidade) {
      return "Para publicar, marque a declaração de responsabilidade.";
    }

    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const valid = validarAntesDeEnviar();
    if (valid) {
      setErro(valid);
      return;
    }

    const contatoPrincipal = whatsapp.trim() || telefone.trim() || email.trim();

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ownerKey =
        user?.id || `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      if (user) {
        await syncUserMetadataFromForm(user, {
          nome: nomeProfissional || nomeNegocio,
          cidade,
          whatsapp,
          telefone,
          email,
          origem: "anuncio_profissionais",
        });
      }

      const bucket = "anuncios";
      const base = `servicos/${ownerKey}/profissionais-${Date.now()}`;

      let logoUrl = "";
      if (logoFile) {
        const ext = (logoFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${base}-logo.${ext}`;
        logoUrl = await uploadUmaImagem({ bucket, path, file: logoFile });
      }

      let capaUrl = "";
      {
        const ext = (capaFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${base}-capa.${ext}`;
        capaUrl = await uploadUmaImagem({ bucket, path, file: capaFile });
      }

      const galeriaUrls = [];
      if (galeriaFiles.length) {
        let idx = 0;
        for (const file of galeriaFiles.slice(0, 7)) {
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          const path = `${base}-galeria-${idx}.${ext}`;
          idx++;
          const url = await uploadUmaImagem({ bucket, path, file });
          if (url) galeriaUrls.push(url);
        }
      }

      const imagens = [capaUrl, ...galeriaUrls, ...(logoUrl ? [logoUrl] : [])];

      const siteUrlFinal = siteUrl?.trim()
        ? siteUrl.trim().startsWith("http")
          ? siteUrl.trim()
          : `https://${siteUrl.trim()}`
        : null;

      const descricaoFinal = `${descricao}

=== Informações complementares ===
Tipo de serviço: ${areaProfissional || "-"}
Profissional / responsável: ${nomeProfissional || "-"}
Empresa / negócio: ${nomeNegocio || "-"}
Atende em domicílio: ${atendeDomicilio ? "Sim" : "Não"}
Horário de atendimento: ${horarioAtendimento || "-"}
Faixa de preço: ${faixaPreco || "-"}
Site: ${siteUrlFinal || "-"}
Instagram: ${instagram || "-"}
`.trim();

      const { data: inserted, error: insertError } = await supabase
        .from("anuncios")
        .insert({
          user_id: user?.id || null,
          categoria: "servico",
          subcategoria_servico: "profissionais",

          titulo: titulo.trim(),
          descricao: descricaoFinal,
          cidade,
          bairro: bairro.trim(),

          nome_contato: nomeProfissional || null,
          nome_negocio: nomeNegocio || null,
          area_profissional: areaProfissional,

          atende_domicilio: atendeDomicilio,
          horario_atendimento: horarioAtendimento || null,
          faixa_preco: faixaPreco || null,

          telefone: telefone || null,
          whatsapp: whatsapp || null,
          email: email || null,
          contato: contatoPrincipal,

          site_url: siteUrlFinal,
          instagram: instagram || null,

          imagens,
          logo_url: logoUrl || null,

          status: user ? "ativo" : "pendente",
          destaque: false,

          email_confirmado: !!user,
          email_confirmado_em: user ? new Date().toISOString() : null,
          criado_sem_login: !user,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Erro ao salvar serviço:", insertError);
        setErro(`Erro ao salvar o anúncio: ${insertError.message || "tente novamente."}`);
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
              "Seu anúncio foi enviado com sucesso e está pendente. Aguarde cerca de 1 minuto e verifique seu e-mail para confirmar o cadastro."
            );
          } else {
            setSucesso(
              "Seu anúncio foi enviado e está pendente. Houve um problema ao enviar o e-mail de confirmação agora. Tente entrar novamente mais tarde."
            );
          }

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${inserted.id}`
            );
          }, 1500);
        } else {
          setSucesso("Anúncio enviado com sucesso! Redirecionando...");

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${inserted.id}`
            );
          }, 1500);
        }
      } else {
        setSucesso("Serviço profissional cadastrado com sucesso! Redirecionando…");

        setTimeout(() => {
          router.push("/painel/meus-anuncios");
        }, 1200);
      }

      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setNomeProfissional("");
      setNomeNegocio("");
      setAreaProfissional("");
      setAtendeDomicilio(false);
      setHorarioAtendimento("");
      setFaixaPreco("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setSiteUrl("");
      setInstagram("");
      setLogoFile(null);
      setCapaFile(null);
      setGaleriaFiles([]);
      setAceitoResponsabilidade(false);
    } catch (err) {
      console.error(err);
      setErro(`Erro ao salvar seu anúncio de serviço: ${err?.message || "tente novamente."}`);
    } finally {
      setUploading(false);
    }
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

      <Card title="Informações do serviço" subtitle="Capriche no título e na descrição: isso é o que mais traz contatos.">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Título do anúncio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex.: Eletricista residencial, Diarista de confiança, Aulas de violão..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Cidade <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <label className="block text-[11px] font-semibold text-slate-700">Bairro / Região</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Tipo de serviço profissional <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={areaProfissional}
              onChange={(e) => setAreaProfissional(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {servicosProfissionais.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">Isso melhora a busca e organiza o Classilagos.</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Descrição do serviço <span className="text-red-500">*</span>
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Explique o que você faz, experiência, regiões atendidas, formas de pagamento, urgência etc."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      <Card title="Profissional / empresa" subtitle="Opcional, mas dá mais confiança e melhora a conversão.">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Nome do profissional / responsável
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={nomeProfissional}
                onChange={(e) => setNomeProfissional(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Nome da empresa (se tiver)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={nomeNegocio}
                onChange={(e) => setNomeNegocio(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[2fr,1fr] items-center">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Horário de atendimento</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ex.: Seg a sáb, 8h às 18h / Emergências"
                value={horarioAtendimento}
                onChange={(e) => setHorarioAtendimento(e.target.value)}
              />
            </div>

            <label className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={atendeDomicilio}
                onChange={(e) => setAtendeDomicilio(e.target.checked)}
              />
              Atendo em domicílio
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Faixa de preço (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex.: a partir de R$ 120 / a combinar"
              value={faixaPreco}
              onChange={(e) => setFaixaPreco(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card title="Contatos" subtitle="Pelo menos um canal é obrigatório.">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Site (opcional)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="meusite.com.br ou https://meusite.com.br"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Instagram / rede social (opcional)
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="@meuservico"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será exibido.
          </p>
        </div>
      </Card>

      <Card
        title="Fotos e logomarca (no topo)"
        subtitle="Recomendado: JPG/PNG até 2MB. A capa vira a foto principal do card. A logomarca (opcional) não vira capa."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">Logomarca (opcional)</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Sua logo aparece junto com as fotos (não vira capa).
            </p>

            <input
              type="file"
              accept="image/*"
              className="mt-3 w-full text-xs"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />

            {previewLogo && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img src={previewLogo} alt="Preview logo" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">
              Foto de capa (obrigatória) <span className="text-red-500">*</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Essa deve ser a foto mais bonita do seu serviço.
            </p>

            <input
              type="file"
              accept="image/*"
              className="mt-3 w-full text-xs"
              onChange={(e) => setCapaFile(e.target.files?.[0] || null)}
              required
            />

            {previewCapa && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img src={previewCapa} alt="Preview capa" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold text-slate-700">Galeria (opcional) — até 7 fotos</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Fotos extras: outros ângulos, detalhes, antes/depois, equipe, ferramentas…
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-3 w-full text-xs"
            onChange={handleGaleriaChange}
          />

          {galeriaFiles.length > 0 && (
            <>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] text-slate-500">{galeriaFiles.length} foto(s) selecionada(s).</p>
                <p className="text-[11px] text-slate-500">Clique no ✕ para remover</p>
              </div>

              <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
                {previewsGaleria.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white"
                  >
                    <img src={src} alt={`Galeria ${idx + 1}`} className="h-full w-full object-cover" />

                    <button
                      type="button"
                      onClick={() => removerGaleria(idx)}
                      className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-[10px] px-2 py-1 hover:bg-black/75"
                      aria-label="Remover imagem"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Se der erro no upload: tente fotos menores (até 2MB) e em JPG/PNG.
        </p>
      </Card>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={aceitoResponsabilidade}
            onChange={(e) => setAceitoResponsabilidade(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que sou responsável por qualquer
            negociação realizada a partir deste serviço.
          </span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? "Publicando serviço..." : "Publicar serviço profissional"}
        </button>
      </div>
    </form>
  );
}
