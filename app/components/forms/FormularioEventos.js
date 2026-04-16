"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { syncUserMetadataFromForm } from "../../../lib/syncUserMetadata";

/** Card fora do componente principal */
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

function isValidUrl(url) {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function FormularioEventos() {
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

  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const servicosEventos = [
    "Buffet completo",
    "Doces e Salgados (salgadinhos)",
    "Bolo & confeitaria",
    "Decoração de festas",
    "Balões / cenários instagramáveis",
    "DJ",
    "Som e iluminação",
    "Banda / música ao vivo",
    "Fotografia de eventos",
    "Filmagem de eventos",
    "Cerimonial / organização de eventos",
    "Recreação / animação infantil",
    "Aluguel de brinquedos",
    "Espaço para festas / salão",
    "Barracas / tendas / estruturas",
    "Bar de drinks / bartender",
    "Aluguel de mesas, cadeiras e louças",
    "Food truck / carrinhos (pipoca, churros, hot dog etc.)",
    "Outros serviços para eventos",
  ];

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setGaleriaFiles((prev) => {
      const combinado = [...prev, ...files];
      return combinado.slice(0, 7);
    });

    e.target.value = "";
  };

  const removerGaleria = (index) => {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const previewLogo = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : ""), [logoFile]);
  const previewCapa = useMemo(() => (capaFile ? URL.createObjectURL(capaFile) : ""), [capaFile]);
  const previewsGaleria = useMemo(() => galeriaFiles.map((f) => URL.createObjectURL(f)), [galeriaFiles]);

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
      return "Preencha título, cidade e tipo de serviço para eventos.";
    }

    if (!descricao.trim()) {
      return "Preencha a descrição do serviço.";
    }

    if (!email.trim()) {
      return "Informe seu e-mail para publicar o anúncio.";
    }

    if (!capaFile) {
      return "Envie a foto de capa (obrigatória).";
    }

    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!aceitoResponsabilidade) {
      return "Para publicar o anúncio, marque a declaração de responsabilidade pelas informações.";
    }

    if (!isValidUrl(siteUrl.trim())) {
      return "O link do site parece inválido.";
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
          origem: "anuncio_eventos",
        });
      }

      const bucket = "anuncios";
      const base = `servicos/${ownerKey}/eventos-${Date.now()}`;

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
        for (const file of galeriaFiles) {
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          const path = `${base}-galeria-${idx}.${ext}`;
          idx++;
          const url = await uploadUmaImagem({ bucket, path, file });
          if (url) galeriaUrls.push(url);
        }
      }

      const imagens = [capaUrl, ...galeriaUrls, ...(logoUrl ? [logoUrl] : [])];

      const descricaoFinal = `${descricao}

=== Informações complementares ===
Tipo de serviço: ${areaProfissional || "-"}
Responsável: ${nomeProfissional || "-"}
Empresa / negócio: ${nomeNegocio || "-"}
Atende no local do evento: ${atendeDomicilio ? "Sim" : "Não"}
Horário de atendimento: ${horarioAtendimento || "-"}
Faixa de preço: ${faixaPreco || "-"}
Site: ${siteUrl || "-"}
Instagram: ${instagram || "-"}
`.trim();

      const payload = {
        user_id: user?.id || null,
        categoria: "servico",
        subcategoria_servico: "eventos",

        titulo: titulo.trim(),
        descricao: descricaoFinal,
        cidade,
        bairro: bairro.trim(),

        nome_contato: nomeProfissional.trim(),
        nome_negocio: nomeNegocio.trim(),
        area_profissional: areaProfissional,

        atende_domicilio: atendeDomicilio,
        horario_atendimento: horarioAtendimento.trim(),
        faixa_preco: faixaPreco.trim(),

        telefone: telefone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        contato: contatoPrincipal,
        site_url: siteUrl.trim(),
        instagram: instagram.trim(),

        imagens,
        logo_url: logoUrl || null,

        status: user ? "ativo" : "pendente",
        destaque: false,

        email_confirmado: !!user,
        email_confirmado_em: user ? new Date().toISOString() : null,
        criado_sem_login: !user,
      };

      const { data, error: insertError } = await supabase
        .from("anuncios")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) {
        console.error("Erro ao salvar serviço:", insertError);
        setErro("Erro ao salvar o anúncio. Tente novamente em alguns instantes.");
        return;
      }

      // 🔥 CONVERSÃO GOOGLE ADS
if (typeof window !== "undefined" && window.gtag) {
  window.gtag('event', 'conversion', {
    'send_to': 'AW-17865509628/j9HeCPy0w50cEPyV-MZC'
  });
}

      if (!user) {
        const redirectTo = `${window.location.origin}/auth/confirmar-anuncio?anuncio=${data.id}`;

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
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${data.id}`
            );
          }, 1500);
        } else {
          setSucesso("Anúncio enviado com sucesso! Redirecionando...");

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${data.id}`
            );
          }, 1500);
        }
      } else {
        setSucesso("Serviço para festas e eventos cadastrado com sucesso! Redirecionando...");

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

      <Card
        title="Informações do serviço para festas e eventos"
        subtitle="Título claro + fotos bonitas = mais pedidos de orçamento."
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Título do anúncio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: Buffet infantil em Maricá, DJ para casamentos, Decoração de festas..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Cidade <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex.: Centro, Itaipuaçu, Bacaxá..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Tipo de serviço para eventos <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={areaProfissional}
              onChange={(e) => setAreaProfissional(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {servicosEventos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              Escolha o tipo principal. Isso ajuda as pessoas a encontrarem seu anúncio mais rápido.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Descrição do serviço <span className="text-red-500">*</span>
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Explique como funciona seu serviço, tipos de eventos que atende, pacotes, diferenciais, cidades atendidas etc."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      <Card title="Profissional / empresa" subtitle="Se tiver nome do negócio, ajuda na credibilidade.">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Nome do responsável</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={nomeProfissional}
              onChange={(e) => setNomeProfissional(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Nome da empresa / buffet / espaço (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3 items-center">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700">Horário de atendimento</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: Segunda a sábado, 9h às 20h / Domingo para eventos"
              value={horarioAtendimento}
              onChange={(e) => setHorarioAtendimento(e.target.value)}
            />
          </div>

          <label className="mt-5 flex items-center gap-2 text-[11px] text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={atendeDomicilio}
              onChange={(e) => setAtendeDomicilio(e.target.checked)}
            />
            Atendemos no local do evento
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">Faixa de preço (opcional)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Ex.: A partir de R$ 800, Pacotes a combinar"
            value={faixaPreco}
            onChange={(e) => setFaixaPreco(e.target.value)}
          />
        </div>
      </Card>

      <Card
        title="Fotos e logomarca (no topo)"
        subtitle="Recomendado: JPG/PNG até ~2MB. A capa vira a foto principal do card. A logomarca (opcional) não vira capa."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">Logomarca (opcional, mas recomendado)</p>
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
              Essa deve ser a foto mais bonita (serviço / evento / ambiente).
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
            Fotos extras: outros ângulos, montagem, equipe, detalhes, eventos anteriores…
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
          Se der erro no upload: tente fotos menores (até ~2MB) e em JPG/PNG.
        </p>
      </Card>

      <Card title="Contatos" subtitle="Pelo menos um canal (WhatsApp, telefone ou e-mail).">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Site / página (opcional)</label>
            <input
              type="url"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="https://..."
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Instagram ou rede social (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="@meuevento"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Pelo menos um desses canais será exibido para contato.
        </p>
      </Card>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <label className="flex items-start gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoResponsabilidade}
            onChange={(e) => setAceitoResponsabilidade(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que sou responsável por qualquer negociação realizada a partir deste serviço. Estou de acordo com os termos de uso do Classilagos.
          </span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? "Publicando serviço..." : "Publicar serviço para eventos"}
        </button>
      </div>
    </form>
  );
}
