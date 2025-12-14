"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidUrl(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  try {
    // aceita com ou sem https:// (vamos normalizar depois se quiser)
    new URL(s.startsWith("http") ? s : `https://${s}`);
    return true;
  } catch {
    return false;
  }
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

  // várias imagens (até 8)
  const [imagensFiles, setImagensFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // login
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

  // preview das imagens
  const previews = useMemo(() => {
    return (imagensFiles || []).map((f) => URL.createObjectURL(f));
  }, [imagensFiles]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [previews]);

  // ✅ acumula até 8, valida imagem e tamanho
  const handleImagensChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxBytes = 2 * 1024 * 1024; // 2MB
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

    setImagensFiles((prev) => {
      const combinado = [...prev, ...valid];
      return combinado.slice(0, 8);
    });

    // permite escolher o mesmo arquivo novamente se quiser
    e.target.value = "";
  };

  const removerImagem = (idx) => {
    setImagensFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const Card = ({ title, subtitle, children }) => (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-sm md:text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] md:text-xs text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setErro("Você precisa estar logado para anunciar um serviço.");
      router.push("/login");
      return;
    }

    if (!titulo || !cidade || !areaProfissional) {
      setErro("Preencha Título, Cidade e o Tipo de serviço profissional.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).");
      return;
    }

    if (!isValidEmail(email)) {
      setErro("Digite um e-mail válido (ou deixe em branco).");
      return;
    }

    if (!isValidUrl(siteUrl)) {
      setErro("O site informado parece inválido. Ex.: meusite.com.br ou https://meusite.com.br");
      return;
    }

    if (!aceitoResponsabilidade) {
      setErro("Para publicar, marque a declaração de responsabilidade.");
      return;
    }

    setUploading(true);

    try {
      const bucket = "anuncios";

      // upload (até 8)
      let imagensUrls = [];

      if (imagensFiles?.length) {
        const uploads = await Promise.all(
          imagensFiles.slice(0, 8).map(async (file, index) => {
            const ext = file.name.split(".").pop();
            const path = `servicos/${user.id}/profissionais-${Date.now()}-${index}.${ext}`;

            const { error: uploadErro } = await supabase.storage
              .from(bucket)
              .upload(path, file);

            if (uploadErro) throw uploadErro;

            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            return data?.publicUrl || null;
          })
        );

        imagensUrls = uploads.filter(Boolean);
      }

      // normaliza siteUrl (se veio sem http)
      const siteUrlFinal = siteUrl?.trim()
        ? siteUrl.trim().startsWith("http")
          ? siteUrl.trim()
          : `https://${siteUrl.trim()}`
        : null;

      const { data: inserted, error: insertError } = await supabase
        .from("anuncios")
        .insert({
          user_id: user.id,
          categoria: "servico",
          subcategoria_servico: "profissionais",

          titulo,
          descricao,
          cidade,
          bairro,

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

          imagens: imagensUrls.length ? imagensUrls : null,

          status: "ativo",
          destaque: false,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Erro ao salvar serviço:", insertError);
        setErro(`Erro ao salvar o anúncio: ${insertError.message || "tente novamente."}`);
        setUploading(false);
        return;
      }

      setSucesso("Serviço profissional cadastrado com sucesso! Redirecionando…");

      // limpa
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
      setImagensFiles([]);
      setAceitoResponsabilidade(false);

      setTimeout(() => {
        router.push(`/anuncios/${inserted.id}`);
      }, 1200);
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
        title="Informações do serviço"
        subtitle="Capriche no título e na descrição: isso é o que mais traz contatos."
      >
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
              <label className="block text-[11px] font-semibold text-slate-700">
                Bairro / Região
              </label>
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
            <p className="mt-1 text-[11px] text-slate-500">
              Isso melhora a busca e organiza o Classilagos.
            </p>
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

      <Card
        title="Profissional / empresa"
        subtitle="Opcional, mas dá mais confiança e melhora a conversão."
      >
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
              <label className="block text-[11px] font-semibold text-slate-700">
                Nome da empresa (se tiver)
              </label>
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
              <label className="block text-[11px] font-semibold text-slate-700">
                Horário de atendimento
              </label>
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
            <label className="block text-[11px] font-semibold text-slate-700">
              Faixa de preço (opcional)
            </label>
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
              <label className="block text-[11px] font-semibold text-slate-700">
                Telefone
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                WhatsApp
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                E-mail
              </label>
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
              <label className="block text-[11px] font-semibold text-slate-700">
                Site (opcional)
              </label>
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
        title="Fotos do serviço / logo"
        subtitle="Até 8 imagens. A primeira vira destaque no card."
      >
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            multiple
            className="text-sm"
            onChange={handleImagensChange}
          />

          {previews?.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {previews.map((src, idx) => (
                <div key={src} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Imagem ${idx + 1}`} className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removerImagem(idx)}
                    className="absolute top-1 right-1 rounded-full bg-white/90 border border-slate-200 px-2 py-1 text-[10px] text-slate-700 hover:bg-white"
                    title="Remover"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-500">
            JPG/PNG até 2MB cada. Total máximo: 8 imagens.
          </p>
        </div>
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

