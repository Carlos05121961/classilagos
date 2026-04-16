"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { syncUserMetadataFromForm } from "../../../lib/syncUserMetadata";

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatCEP(v) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function isYoutubeUrl(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    return host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com";
  } catch {
    return false;
  }
}

export default function FormularioImoveis() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");

  const [finalidade, setFinalidade] = useState("");
  const [tipoImovel, setTipoImovel] = useState("");

  const [quartos, setQuartos] = useState("");
  const [suites, setSuites] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [areaConstruida, setAreaConstruida] = useState("");
  const [areaTerreno, setAreaTerreno] = useState("");

  const [preco, setPreco] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [mobiliado, setMobiliado] = useState("nao");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("nao");

  const [isImobiliaria, setIsImobiliaria] = useState(false);
  const [logoArquivo, setLogoArquivo] = useState(null);

  const [capaArquivo, setCapaArquivo] = useState(null);
  const [galeriaArquivos, setGaleriaArquivos] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");

  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

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

  const tiposImovel = [
    "Casa",
    "Apartamento",
    "Cobertura",
    "Kitnet / Studio",
    "Terreno / Lote",
    "Comercial",
    "Loja / Sala",
    "Galpão",
    "Sítio / Chácara",
    "Outros",
  ];

  const finalidades = [
    { label: "Venda", value: "venda" },
    { label: "Aluguel", value: "aluguel" },
    { label: "Aluguel por temporada", value: "temporada" },
  ];

  const handleCapaChange = (e) => {
    const file = (e.target.files || [])[0] || null;
    setCapaArquivo(file);
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGaleriaArquivos(files.slice(0, 8));
  };

  const handleLogoChange = (e) => {
    const file = (e.target.files || [])[0] || null;
    setLogoArquivo(file);
  };

  async function uploadToPublicUrl(bucketName, ownerKey, file, folder, prefix) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const rand = Math.random().toString(16).slice(2);
    const filePath = `${folder}/${ownerKey}/${prefix}-${Date.now()}-${rand}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  }

  function validarAntesDeEnviar() {
    const contatoPrincipal = whatsapp || telefone || email;

    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!email.trim()) {
      return "Informe seu e-mail para publicar o anúncio.";
    }

    if (!finalidade || !tipoImovel) {
      return "Selecione a finalidade e o tipo de imóvel.";
    }

    if (!titulo.trim() || !descricao.trim()) {
      return "Preencha o título e a descrição do anúncio.";
    }

    if (!cidade) {
      return "Selecione a cidade do anúncio.";
    }

    if (!preco.trim()) {
      return "Informe o preço do imóvel.";
    }

    if (!capaArquivo) {
      return "Envie 1 foto de capa do imóvel (obrigatória).";
    }

    if (isImobiliaria && !logoArquivo) {
      return "Você marcou corretor/imobiliária. Envie a logomarca (1 imagem).";
    }

    if (!isYoutubeUrl(videoUrl.trim())) {
      return "A URL do vídeo deve ser do YouTube (youtube.com ou youtu.be).";
    }

    if (!aceitoTermos) {
      return "Para publicar o anúncio, você precisa aceitar os termos de responsabilidade.";
    }

    return "";
  }

  const enviarAnuncio = async (e) => {
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
          nome: nomeContato,
          cidade,
          whatsapp,
          telefone,
          endereco,
          email,
          origem: "anuncio_imoveis",
        });
      }

      const bucketName = "anuncios";

      const capaUrl = await uploadToPublicUrl(
        bucketName,
        ownerKey,
        capaArquivo,
        "imoveis",
        "capa"
      );

      let galeriaUrls = [];
      if (galeriaArquivos.length > 0) {
        const uploads = await Promise.all(
          galeriaArquivos.map(async (file, idx) => {
            const url = await uploadToPublicUrl(
              bucketName,
              ownerKey,
              file,
              "imoveis",
              `galeria-${idx}`
            );
            return { idx, url };
          })
        );
        uploads.sort((a, b) => a.idx - b.idx);
        galeriaUrls = uploads.map((u) => u.url);
      }

      let logoUrl = null;
      if (isImobiliaria && logoArquivo) {
        logoUrl = await uploadToPublicUrl(
          bucketName,
          ownerKey,
          logoArquivo,
          "imoveis",
          "logo"
        );
      }

      const imagens = [capaUrl, ...galeriaUrls].filter(Boolean);

      const detalhesImovelTexto = `
=== Detalhes do imóvel ===
Finalidade: ${finalidade || "-"}
Tipo de imóvel: ${tipoImovel || "-"}
Dormitórios: ${quartos || "-"}
Suítes: ${suites || "-"}
Banheiros: ${banheiros || "-"}
Vagas de garagem: ${vagas || "-"}
Área construída: ${areaConstruida || "-"}
Área total / terreno: ${areaTerreno || "-"}
Mobiliado: ${mobiliado === "sim" ? "Sim" : "Não"}
Aceita financiamento: ${aceitaFinanciamento === "sim" ? "Sim" : "Não"}
Condomínio: ${condominio || "-"}
IPTU: ${iptu || "-"}
Corretor / Imobiliária: ${isImobiliaria ? "Sim" : "Não"}
`.trim();

      const descricaoFinal = `${descricao.trim()}

${detalhesImovelTexto}
`.trim();

      const payload = {
        user_id: user?.id || null,
        categoria: "imoveis",
        titulo: titulo.trim(),
        descricao: descricaoFinal,
        cidade,
        bairro: bairro.trim(),
        endereco: endereco.trim(),
        cep: formatCEP(cep.trim()),
        preco: preco.trim(),

        capa_url: capaUrl,
        logo_url: logoUrl,
        imagens,

        video_url: videoUrl.trim(),
        telefone: telefone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        contato: contatoPrincipal,

        tipo_imovel: tipoImovel,
        finalidade,
        area: areaConstruida.trim() || areaTerreno.trim(),
        quartos: quartos.trim(),
        banheiros: banheiros.trim(),
        vagas: vagas.trim(),
        mobiliado,
        condominio: condominio.trim(),
        iptu: iptu.trim(),
        aceita_financiamento: aceitaFinanciamento,
        suites: suites.trim(),
        area_construida: areaConstruida.trim(),
        area_terreno: areaTerreno.trim(),
        nome_contato: nomeContato.trim(),

        status: user ? "ativo" : "pendente",
        destaque: false,

        email_confirmado: !!user,
        email_confirmado_em: user ? new Date().toISOString() : null,
        criado_sem_login: !user,
      };

      const { data, error } = await supabase
        .from("anuncios")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        console.error(error);
        setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
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

          if (
            msg.includes("security purposes") ||
            msg.includes("only request this after")
          ) {
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
        setSucesso("Anúncio enviado com sucesso! Redirecionando...");

        setTimeout(() => {
          router.push("/painel/meus-anuncios");
        }, 1200);
      }

      setTitulo("");
      setDescricao("");
      setCidade("");
      setBairro("");
      setEndereco("");
      setCep("");
      setFinalidade("");
      setTipoImovel("");
      setQuartos("");
      setSuites("");
      setBanheiros("");
      setVagas("");
      setAreaConstruida("");
      setAreaTerreno("");
      setPreco("");
      setCondominio("");
      setIptu("");
      setMobiliado("nao");
      setAceitaFinanciamento("nao");
      setCapaArquivo(null);
      setGaleriaArquivos([]);
      setVideoUrl("");
      setNomeContato("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setAceitoTermos(false);
      setIsImobiliaria(false);
      setLogoArquivo(null);
    } catch (err) {
      console.error("Erro geral ao enviar imóvel:", err);
      setErro(err?.message || "Ocorreu um erro inesperado ao enviar o anúncio.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6">
      {erro && (
        <p className="text-red-600 text-xs md:text-sm border border-red-100 rounded-md px-3 py-2 bg-red-50">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="text-green-600 text-xs md:text-sm border border-emerald-100 rounded-md px-3 py-2 bg-emerald-50">
          {sucesso}
        </p>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Tipo de anúncio</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Finalidade *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {finalidades.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Tipo de imóvel *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              value={tipoImovel}
              onChange={(e) => setTipoImovel(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {tiposImovel.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos do imóvel</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Foto de capa (obrigatória) *
            <span className="block text-[11px] text-slate-500">
              Esta será a foto principal do card e do anúncio.
            </span>
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleCapaChange}
            className="mt-1 w-full text-xs"
            required
          />

          {capaArquivo?.name && (
            <p className="mt-1 text-[11px] text-slate-500">
              Capa selecionada: <b>{capaArquivo.name}</b>{" "}
              <button
                type="button"
                onClick={() => setCapaArquivo(null)}
                className="ml-2 underline text-slate-700"
              >
                remover
              </button>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Galeria (opcional) – até 8 imagens
            <span className="block text-[11px] text-slate-500">
              Fotos extras do imóvel.
            </span>
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriaChange}
            className="mt-1 w-full text-xs"
          />

          {galeriaArquivos.length > 0 && (
            <p className="mt-1 text-[11px] text-slate-500">
              {galeriaArquivos.length} arquivo(s) selecionado(s).{" "}
              <button
                type="button"
                onClick={() => setGaleriaArquivos([])}
                className="ml-2 underline text-slate-700"
              >
                remover todas
              </button>
            </p>
          )}

          <p className="mt-1 text-[11px] text-slate-500">
            Se escolher mais de 8, o sistema usa somente as 8 primeiras.
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Corretor / Imobiliária</h2>

        <label className="flex items-start gap-2 text-[12px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={isImobiliaria}
            onChange={(e) => {
              const v = e.target.checked;
              setIsImobiliaria(v);
              if (!v) setLogoArquivo(null);
            }}
          />
          <span>
            Sou corretor/imobiliária e quero exibir minha <b>logomarca</b> no anúncio.
            <span className="block text-[11px] text-slate-500">
              A capa é a foto do imóvel. A logo é um selo separado.
            </span>
          </span>
        </label>

        {isImobiliaria && (
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Enviar logomarca (1 imagem) *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-1 w-full text-xs"
            />
            {logoArquivo?.name && (
              <p className="mt-1 text-[11px] text-slate-500">
                Logomarca selecionada: <b>{logoArquivo.name}</b>{" "}
                <button
                  type="button"
                  onClick={() => setLogoArquivo(null)}
                  className="ml-2 underline text-slate-700"
                >
                  remover
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Informações do imóvel</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">Título do anúncio *</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: Casa com 3 quartos em Itaipuaçu"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Descrição detalhada *</label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-28"
            placeholder="Descreva os detalhes do imóvel..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Cidade *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
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
            <label className="block text-xs font-medium text-slate-700">Bairro / Região</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div>
            <label className="block text-xs font-medium text-slate-700">Endereço (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">CEP (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cep}
              onChange={(e) => setCep(formatCEP(e.target.value))}
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Detalhes do imóvel</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">Dormitórios</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Suítes</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={suites}
              onChange={(e) => setSuites(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Banheiros</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Vagas de garagem</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={vagas}
              onChange={(e) => setVagas(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">Área construída (m²)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={areaConstruida}
              onChange={(e) => setAreaConstruida(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Área total / terreno (m²)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={areaTerreno}
              onChange={(e) => setAreaTerreno(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Imóvel mobiliado?</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              value={mobiliado}
              onChange={(e) => setMobiliado(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Valores</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">Preço (R$) *</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder={
                finalidade === "aluguel"
                  ? "Ex: R$ 2.500 / mês"
                  : finalidade === "temporada"
                  ? "Ex: R$ 500 / diária"
                  : "Ex: R$ 450.000"
              }
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Condomínio (R$)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={condominio}
              onChange={(e) => setCondominio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">IPTU (R$)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={iptu}
              onChange={(e) => setIptu(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Aceita financiamento?</label>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm max-w-xs bg-white text-slate-900"
            value={aceitaFinanciamento}
            onChange={(e) => setAceitaFinanciamento(e.target.value)}
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Vídeo do imóvel (opcional)</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">URL do vídeo (YouTube)</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados de contato</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">Nome de contato</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Termos de responsabilidade</h2>

        <label className="flex items-start gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que assumo total responsabilidade pelo conteúdo publicado. Estou ciente e de acordo com os{" "}
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
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Enviar anúncio"}
      </button>
    </form>
  );
}
