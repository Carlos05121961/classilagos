"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

// validação simples de URL youtube (opcional)
function isValidYoutubeUrl(url) {
  if (!url) return true;
  const u = String(url).trim();
  if (!u) return true;
  return (
    u.includes("youtube.com/watch") ||
    u.includes("youtu.be/") ||
    u.includes("youtube.com/shorts/")
  );
}

/** ✅ PREMIUM FIX: Card fora do componente (senão perde foco ao digitar) */
function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-sm md:text-base font-semibold text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[11px] md:text-xs text-slate-600">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function FormularioPets() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Tipo de anúncio
  const [subcategoria, setSubcategoria] = useState(""); // Animais / Adoção / Achados / Serviços

  // Valor
  const [preco, setPreco] = useState("");

  // ✅ UPLOAD PREMIUM: logo (opcional p/ serviços) + capa (obrigatória) + galeria
  const [souServicoPet, setSouServicoPet] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [capaFile, setCapaFile] = useState(null);
  const [galeriaFiles, setGaleriaFiles] = useState([]);

  const [uploading, setUploading] = useState(false);

  // Vídeo (opcional)
  const [videoUrl, setVideoUrl] = useState("");

  // Contato
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Termos e mensagens
  const [aceitoTermos, setAceitoTermos] = useState(false);
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

  const subcategoriasPets = [
    "Animais",
    "Adoção / Doação",
    "Achados e perdidos",
    "Serviços pet & acessórios",
  ];

  // Garante login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  // ✅ Se escolheu "Serviços pet & acessórios", habilita opção de logo
  useEffect(() => {
    const isServicos = subcategoria === "Serviços pet & acessórios";
    setSouServicoPet(isServicos);

    // se saiu de serviços, zera logo pra não “carregar sem querer”
    if (!isServicos) setLogoFile(null);
  }, [subcategoria]);

  // ✅ limite dinâmico: total em imagens <= 8
  const maxGaleria = logoFile ? 6 : 7; // (logo + capa + 6) = 8 | (capa + 7) = 8

  const handleLogoChange = (e) => {
    const f = e.target.files?.[0] || null;
    setLogoFile(f);
    e.target.value = "";
  };

  const handleCapaChange = (e) => {
    const f = e.target.files?.[0] || null;
    setCapaFile(f);
    e.target.value = "";
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setGaleriaFiles((prev) => {
      const combinado = [...prev, ...files];
      return combinado.slice(0, maxGaleria);
    });

    e.target.value = "";
  };

  const removerGaleria = (index) => {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Preview
  const previewLogo = useMemo(() => {
    if (!logoFile) return null;
    return URL.createObjectURL(logoFile);
  }, [logoFile]);

  const previewCapa = useMemo(() => {
    if (!capaFile) return null;
    return URL.createObjectURL(capaFile);
  }, [capaFile]);

  const previewsGaleria = useMemo(() => {
    if (!galeriaFiles?.length) return [];
    return galeriaFiles.map((f) => URL.createObjectURL(f));
  }, [galeriaFiles]);

  useEffect(() => {
    return () => {
      if (previewLogo) URL.revokeObjectURL(previewLogo);
      if (previewCapa) URL.revokeObjectURL(previewCapa);
      previewsGaleria.forEach((p) => URL.revokeObjectURL(p));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewLogo, previewCapa, previewsGaleria]);

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setSubcategoria("");
    setPreco("");

    setLogoFile(null);
    setCapaFile(null);
    setGaleriaFiles([]);

    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);
  };

  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    if (!subcategoria) {
      setErro("Selecione o tipo de anúncio para pets.");
      return;
    }

    // ✅ capa obrigatória (Padrão Premium)
    if (!capaFile) {
      setErro("Envie uma foto de capa (obrigatória). Ela será a foto principal do anúncio.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).");
      return;
    }

    if (!aceitoTermos) {
      setErro("Para publicar o anúncio, você precisa aceitar os termos de responsabilidade.");
      return;
    }

    if (!isValidYoutubeUrl(videoUrl)) {
      setErro("O link do vídeo precisa ser do YouTube (youtube.com ou youtu.be).");
      return;
    }

    // Upload (logo opcional p/ serviços) + capa + galeria
    let logoUrl = null;
    let capaUrl = null;
    const galeriaUrls = [];

    try {
      setUploading(true);

      const bucket = "anuncios";
      const baseTime = Date.now();

      // ✅ LOGO (opcional) — só se for serviços
      if (souServicoPet && logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `pets/${user.id}/pets-logo-${baseTime}.${ext}`;

        const { error: uploadLogoError } = await supabase.storage
          .from(bucket)
          .upload(path, logoFile);

        if (uploadLogoError) throw uploadLogoError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        logoUrl = data.publicUrl;
      }

      // ✅ CAPA (obrigatória)
      {
        const ext = capaFile.name.split(".").pop();
        const path = `pets/${user.id}/pets-capa-${baseTime}.${ext}`;

        const { error: uploadCapaError } = await supabase.storage
          .from(bucket)
          .upload(path, capaFile);

        if (uploadCapaError) throw uploadCapaError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        capaUrl = data.publicUrl;
      }

      // ✅ GALERIA (opcional)
      if (galeriaFiles && galeriaFiles.length > 0) {
        const arquivos = Array.from(galeriaFiles).slice(0, maxGaleria);

        for (let i = 0; i < arquivos.length; i++) {
          const file = arquivos[i];
          const ext = file.name.split(".").pop();
          const path = `pets/${user.id}/pets-galeria-${baseTime}-${i}.${ext}`;

          const { error: uploadGalError } = await supabase.storage
            .from(bucket)
            .upload(path, file);

          if (uploadGalError) throw uploadGalError;

          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          galeriaUrls.push(data.publicUrl);
        }
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar as imagens. Tente novamente em instantes.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    // ✅ Monta imagens no padrão:
    // - capa SEMPRE é a foto principal do card
    // - se tiver logo, ela entra antes (pra UI usar como selo, se você quiser)
    // - total <= 8 garantido pelo maxGaleria
    const imagens = logoUrl ? [logoUrl, capaUrl, ...galeriaUrls] : [capaUrl, ...galeriaUrls];

    // INSERT no Supabase
    const { data, error } = await supabase
      .from("anuncios")
      .insert({
        user_id: user.id,
        categoria: "pets",

        titulo,
        descricao,
        cidade,
        bairro,
        preco,
        imagens,
        video_url: videoUrl || null,

        telefone: telefone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        contato: contatoPrincipal,
        nome_contato: nomeContato || null,

        // específicos de pets
        subcategoria_pet: subcategoria,

        // compatibilidade com motores/buscas existentes
        tipo_imovel: subcategoria,

        status: "ativo",
        destaque: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar anúncio de pets:", error);
      setErro(
        "Ocorreu um erro ao salvar o anúncio. Detalhes: " +
          (error.message || JSON.stringify(error))
      );
      return;
    }

    setSucesso("Anúncio de pets enviado com sucesso! Redirecionando…");

    setTimeout(() => {
      router.push(`/anuncios/${data.id}`);
    }, 1200);

    limparFormulario();
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-4">
      {/* Mensagens */}
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

      {/* TIPO */}
      <Card
        title="Tipo de anúncio para Pets"
        subtitle="Escolha o tipo correto para o anúncio aparecer nas listas certas."
      >
        <label className="block text-[11px] font-semibold text-slate-700">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          value={subcategoria}
          onChange={(e) => setSubcategoria(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {subcategoriasPets.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {subcategoria === "Adoção / Doação" && (
          <p className="mt-2 text-[11px] text-slate-500">
            Dica: descreva idade aproximada, vacinas, castração e temperamento.
          </p>
        )}
        {subcategoria === "Achados e perdidos" && (
          <p className="mt-2 text-[11px] text-slate-500">
            Dica: informe data/local onde foi visto e um ponto de referência.
          </p>
        )}
        {souServicoPet && (
          <p className="mt-2 text-[11px] text-slate-500">
            Se for clínica, banho e tosa, pet shop etc., você pode enviar a logomarca (opcional).
          </p>
        )}
      </Card>

      {/* PRINCIPAL */}
      <Card
        title="Informações do anúncio"
        subtitle="Título bom + descrição clara = mais contatos no WhatsApp."
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Título do anúncio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: Filhotes para adoção, banho e tosa, hotel para pets..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Descrição detalhada <span className="text-red-500">*</span>
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Descreva o animal, produto ou serviço com detalhes honestos."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      {/* LOCALIZAÇÃO */}
      <Card title="Localização" subtitle="Isso ajuda muito na busca por cidade.">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Cidade <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
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
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: Centro, Itaipuaçu..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* VALOR */}
      <Card title="Valor" subtitle="Se for adoção, pode deixar vazio ou colocar “taxa simbólica”.">
        <label className="block text-[11px] font-semibold text-slate-700">Preço (R$)</label>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Ex.: taxa simbólica, valor do serviço ou produto"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
      </Card>

      {/* ✅ UPLOAD PREMIUM (NO TOPO): Logo (serviços) + Capa + Galeria */}
      <Card
        title="Fotos (capa + galeria) — no topo"
        subtitle={`Recomendado: JPG/PNG até ~2MB. A capa vira a foto principal do card. ${
          souServicoPet ? "A logomarca (opcional) não vira capa." : ""
        }`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* LOGO (só para serviços) */}
          {souServicoPet ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold text-slate-700">Logomarca (opcional)</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Para clínica, pet shop, banho e tosa etc. (não vira capa).
              </p>

              <input
                type="file"
                accept="image/*"
                className="mt-3 w-full text-xs"
                onChange={handleLogoChange}
              />

              {previewLogo && (
                <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewLogo} alt="Preview logo" className="h-full w-full object-contain p-2" />
                </div>
              )}

              {logoFile && (
                <p className="mt-2 text-[11px] text-slate-500">
                  Logo selecionada: <span className="font-medium">{logoFile.name}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          {/* CAPA */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">
              Foto de capa (obrigatória) <span className="text-red-500">*</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              A foto mais bonita (pet / produto / fachada do serviço).
            </p>

            <input
              type="file"
              accept="image/*"
              className="mt-3 w-full text-xs"
              onChange={handleCapaChange}
              required
            />

            {previewCapa && (
              <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewCapa} alt="Preview capa" className="h-full w-full object-cover" />
              </div>
            )}

            {capaFile && (
              <p className="mt-2 text-[11px] text-slate-500">
                Capa selecionada: <span className="font-medium">{capaFile.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* GALERIA */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-700">
            Galeria (opcional) — até {maxGaleria} foto(s)
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Fotos extras: outros ângulos, detalhes, ambiente, equipe, produtos…
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
                <p className="text-[11px] text-slate-500">
                  {galeriaFiles.length} arquivo(s) na galeria.
                </p>
                <p className="text-[11px] text-slate-500">Clique no ✕ para remover</p>
              </div>

              <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
                {previewsGaleria.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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

              <p className="mt-2 text-[11px] text-slate-500">
                Dica: se der erro no upload, use fotos menores (até ~2MB) em JPG/PNG.
              </p>
            </>
          )}
        </div>
      </Card>

      {/* VÍDEO */}
      <Card title="Vídeo (opcional)" subtitle="Somente links do YouTube (youtube.com ou youtu.be).">
        <label className="block text-[11px] font-semibold text-slate-700">
          URL do vídeo (YouTube)
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Se tiver, cole aqui o link de um vídeo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </Card>

      {/* CONTATO */}
      <Card title="Dados de contato" subtitle="Pelo menos um canal (WhatsApp, telefone ou e-mail).">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Nome para contato
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Seu nome ou nome da empresa"
              value={nomeContato}
              onChange={(e) => setNomeContato(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Telefone para contato"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="DDD + número"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* TERMOS + BOTÃO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <label className="flex items-start gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e assumo total responsabilidade
            pelo conteúdo publicado. Estou de acordo com os{" "}
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

        <button
          type="submit"
          className="mt-4 w-full bg-sky-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? "Enviando anúncio..." : "Publicar anúncio de Pets"}
        </button>
      </div>
    </form>
  );
}
