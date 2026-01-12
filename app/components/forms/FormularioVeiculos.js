"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatCEP(v) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function formatBRLInput(v) {
  const d = onlyDigits(v);
  if (!d) return "";
  const n = Number(d);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR");
}

function isYoutubeUrl(url) {
  if (!url) return true; // opcional
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    return host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com";
  } catch {
    return false;
  }
}

export default function FormularioVeiculos() {
  const router = useRouter();

  // Classificação do anúncio
  const [condicaoVeiculo, setCondicaoVeiculo] = useState(""); // usado / seminovo / 0km
  const [isFinanciado, setIsFinanciado] = useState(false);
  const [isConsignado, setIsConsignado] = useState(false);
  const [isLojaRevenda, setIsLojaRevenda] = useState(false);

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // Localização
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");

  // Tipo / finalidade
  const [finalidade, setFinalidade] = useState(""); // Venda / Troca / Aluguel
  const [tipoVeiculo, setTipoVeiculo] = useState(""); // Carro / Moto / etc.

  // Detalhes do veículo
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [cor, setCor] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [cambio, setCambio] = useState("");
  const [portas, setPortas] = useState("");
  const [ipvaPago, setIpvaPago] = useState("nao");
  const [licenciado, setLicenciado] = useState("nao");
  const [aceitaTroca, setAceitaTroca] = useState("nao");

  // Valores
  const [preco, setPreco] = useState("");

  // Upload de arquivos
  const [arquivos, setArquivos] = useState([]); // fotos do veículo (até 8)
  const [logoArquivo, setLogoArquivo] = useState(null); // logo separada
  const [uploading, setUploading] = useState(false);

  // Vídeo
  const [videoUrl, setVideoUrl] = useState("");

  // Contatos
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Termos
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

  const tiposVeiculo = [
    "Carro",
    "Moto",
    "Caminhonete",
    "Caminhão",
    "Utilitário",
    "Van",
    "Ônibus",
    "Quadriciclo",
    "Jet Ski",
    "Outros",
  ];

  const finalidades = ["Venda", "Troca", "Aluguel"];
  const combustiveis = ["Gasolina", "Etanol", "Flex", "Diesel", "GNV", "Elétrico"];
  const cambios = ["Manual", "Automático", "CVT", "Outros"];

  // ====== previews das fotos ======
  const previews = useMemo(() => {
    if (!arquivos?.length) return [];
    return arquivos.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [arquivos]);

  // ✅ preview da logo
  const logoPreview = useMemo(() => {
    if (!logoArquivo) return null;
    return {
      name: logoArquivo.name,
      url: URL.createObjectURL(logoArquivo),
    };
  }, [logoArquivo]);

  useEffect(() => {
    // cleanup blob urls (fotos)
    return () => {
      previews.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arquivos]);

  useEffect(() => {
    // cleanup blob url (logo)
    return () => {
      if (logoPreview?.url) {
        try {
          URL.revokeObjectURL(logoPreview.url);
        } catch {}
      }
    };
  }, [logoPreview]);

  // Garante login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8));
  };

  const handleLogoChange = (e) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setLogoArquivo(f || null);
  };

  function validarAntesDeEnviar() {
    const contatoPrincipal = whatsapp || telefone || email;

    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }
    if (!finalidade || !tipoVeiculo) {
      return "Selecione a finalidade e o tipo de veículo.";
    }
    if (!condicaoVeiculo) {
      return "Informe a condição do veículo (usado, seminovo ou 0 km).";
    }
    if (!titulo.trim() || !descricao.trim()) {
      return "Preencha o título e a descrição do anúncio.";
    }
    if (!cidade) {
      return "Selecione a cidade do anúncio.";
    }
    if (!preco.trim()) {
      return "Informe o preço do veículo.";
    }
    if (!isYoutubeUrl(videoUrl.trim())) {
      return "A URL do vídeo deve ser do YouTube (youtube.com ou youtu.be).";
    }
    if (!aceitoTermos) {
      return "Você precisa declarar que está de acordo com os termos e responsabilidade do anúncio.";
    }
    return "";
  }

  async function uploadToPublicUrl(bucketName, userId, file, prefix) {
    const ext = file.name.split(".").pop();
    const safeExt = (ext || "jpg").toLowerCase();
    const filePath = `${userId}/${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}.${safeExt}`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return publicData.publicUrl;
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;

    let urlsUploadFotos = [];
    let urlUploadLogo = null;

    try {
      setUploading(true);
      const bucketName = "anuncios";

      // ✅ 1) LOGO (se houver) -> logo_url (SEPARADO)
      if (logoArquivo) {
        urlUploadLogo = await uploadToPublicUrl(bucketName, user.id, logoArquivo, "logo");
      }

      // ✅ 2) FOTOS (até 8) -> imagens[] (SOMENTE fotos)
      if (arquivos.length > 0) {
        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            return uploadToPublicUrl(bucketName, user.id, file, `foto-${index}`);
          })
        );
        urlsUploadFotos = uploads;
      }
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro ao enviar as imagens. Tente novamente em alguns instantes.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    // ✅ imagens: SOMENTE fotos do veículo (logo NÃO entra no array)
    const imagens = [...(urlsUploadFotos || [])];

    const detalhesVeiculoTexto = `
=== Detalhes do veículo ===
Condição: ${condicaoVeiculo || "-"}
Finalidade: ${finalidade || "-"}
Tipo de veículo: ${tipoVeiculo || "-"}
Marca: ${marca || "-"}
Modelo: ${modelo || "-"}
Ano: ${ano || "-"}
Quilometragem: ${km || "-"}
Cor: ${cor || "-"}
Combustível: ${combustivel || "-"}
Câmbio: ${cambio || "-"}
Portas: ${portas || "-"}
IPVA pago: ${ipvaPago === "sim" ? "Sim" : "Não"}
Licenciamento em dia: ${licenciado === "sim" ? "Sim" : "Não"}
Financiado: ${isFinanciado ? "Sim" : "Não"}
Consignado: ${isConsignado ? "Sim" : "Não"}
Loja / Revenda: ${isLojaRevenda ? "Sim" : "Não"}
Aceita troca: ${aceitaTroca === "sim" ? "Sim" : "Não"}
`.trim();

    const descricaoFinal = `${descricao.trim()}

${detalhesVeiculoTexto}
`.trim();

    const { data, error } = await supabase
      .from("anuncios")
      .insert({
        user_id: user.id,
        categoria: "veiculos",
        titulo: titulo.trim(),
        descricao: descricaoFinal,
        cidade,
        bairro: bairro.trim(),
        endereco: endereco.trim(),
        cep: cep.trim(),
        preco: preco.trim(),

        imagens, // ✅ só fotos
        logo_url: urlUploadLogo, // ✅ logo separada

        video_url: videoUrl.trim(),
        telefone: telefone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        contato: contatoPrincipal,

        // reutilizados
        tipo_imovel: tipoVeiculo,
        finalidade: finalidade.toLowerCase(),
        nome_contato: nomeContato.trim(),

        // usados nos cards
        condicao_veiculo: condicaoVeiculo,
        zero_km: condicaoVeiculo === "0km",
        financiado: isFinanciado,
        consignado: isConsignado,
        loja_revenda: isLojaRevenda,

        status: "ativo",
        destaque: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    setSucesso("Anúncio enviado com sucesso! Redirecionando…");

    setTimeout(() => {
      router.push(`/anuncios/${data.id}`);
    }, 1200);

    // limpa
    setCondicaoVeiculo("");
    setIsFinanciado(false);
    setIsConsignado(false);
    setIsLojaRevenda(false);

    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setEndereco("");
    setCep("");
    setFinalidade("");
    setTipoVeiculo("");
    setMarca("");
    setModelo("");
    setAno("");
    setKm("");
    setCor("");
    setCombustivel("");
    setCambio("");
    setPortas("");
    setIpvaPago("nao");
    setLicenciado("nao");
    setAceitaTroca("nao");
    setPreco("");
    setArquivos([]);
    setLogoArquivo(null);
    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-5">
      {/* ALERTAS */}
      {erro && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xs md:text-sm font-semibold text-red-700">⚠️ Atenção</p>
          <p className="text-xs md:text-sm text-red-700 mt-1">{erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xs md:text-sm font-semibold text-emerald-700">✅ Tudo certo</p>
          <p className="text-xs md:text-sm text-emerald-700 mt-1">{sucesso}</p>
        </div>
      )}

      {/* CABEÇALHO DO FORM */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
              Veículos • anúncio grátis
            </span>
            <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-slate-900">
              Formulário de veículo
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-600 max-w-2xl">
              Preencha com calma. Quanto mais completo, maior a chance de aparecer bem nos cards e receber contatos.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Dicas rápidas</p>
            <ul className="mt-1 list-disc ml-4 space-y-1">
              <li>Use um título bem claro (ano, modelo, versão).</li>
              <li>Suba 6–8 fotos (frente, traseira, interior, painel).</li>
              <li>Informe “0 km”, “seminovo” ou “usado” corretamente.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 1) CLASSIFICAÇÃO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Classificação do anúncio</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Esses campos alimentam os cards: 0 km, Seminovos, Financiados, Consignados e Loja/Revenda.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Condição do veículo <span className="text-red-600">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={condicaoVeiculo}
              onChange={(e) => setCondicaoVeiculo(e.target.value)}
              required
            >
              <option value="">Selecione…</option>
              <option value="usado">Usado</option>
              <option value="seminovo">Seminovo</option>
              <option value="0km">0 km (zero quilômetro)</option>
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700 mb-2">Marque se for o caso:</p>

            <div className="grid gap-2 text-xs text-slate-700">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFinanciado}
                  onChange={(e) => setIsFinanciado(e.target.checked)}
                />
                <span>Financiado</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isConsignado}
                  onChange={(e) => setIsConsignado(e.target.checked)}
                />
                <span>Consignado</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isLojaRevenda}
                  onChange={(e) => setIsLojaRevenda(e.target.checked)}
                />
                <span>Loja / Revenda</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2) TIPO DO ANÚNCIO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Tipo de anúncio</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Finalidade <span className="text-red-600">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione…</option>
              {finalidades.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              Isso vira <b>venda</b>, <b>troca</b> ou <b>aluguel</b> no banco.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Tipo de veículo <span className="text-red-600">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipoVeiculo}
              onChange={(e) => setTipoVeiculo(e.target.value)}
              required
            >
              <option value="">Selecione…</option>
              {tiposVeiculo.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {finalidade === "Troca" && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-800">
              ℹ️ Você marcou <b>Troca</b>. Lembre de reforçar no texto o que aceita (carro, moto, volta em dinheiro, etc.).
            </p>
          </div>
        )}
      </div>

      {/* 3) INFORMAÇÕES PRINCIPAIS */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Informações principais</h3>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">
            Título do anúncio <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Honda Civic 2019 LXR, único dono, 60 mil km"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Capricha aqui. Esse título aparece nos cards.
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">
            Descrição detalhada <span className="text-red-600">*</span>
          </label>
          <textarea
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[130px]"
            placeholder="Estado geral, manutenção, pneus, documentação, histórico, opcionais, detalhes…"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Dica: informações claras e honestas geram mais confiança e contatos.
          </p>
        </div>
      </div>

      {/* 4) LOCALIZAÇÃO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Localização</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Cidade <span className="text-red-600">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            >
              <option value="">Selecione…</option>
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
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Centro, Itaipuaçu, Ponta Negra…"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[2fr,1fr]">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Endereço (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rua, número, complemento…"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">CEP (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cep}
              onChange={(e) => setCep(formatCEP(e.target.value))}
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>

      {/* 5) DETALHES DO VEÍCULO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Detalhes do veículo</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Marca</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Ex: Chevrolet"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Modelo</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Ex: Onix LT"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Ano</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              placeholder="Ex: 2019"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Quilometragem</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 65.000 km"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Cor</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              placeholder="Ex: Prata"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Portas</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={portas}
              onChange={(e) => setPortas(e.target.value)}
              placeholder="Ex: 4"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Combustível</label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={combustivel}
              onChange={(e) => setCombustivel(e.target.value)}
            >
              <option value="">Selecione…</option>
              {combustiveis.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Câmbio</label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cambio}
              onChange={(e) => setCambio(e.target.value)}
            >
              <option value="">Selecione…</option>
              {cambios.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">IPVA pago?</label>
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={ipvaPago}
                onChange={(e) => setIpvaPago(e.target.value)}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Licenciamento em dia?</label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={licenciado}
              onChange={(e) => setLicenciado(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Aceita troca?</label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={aceitaTroca}
              onChange={(e) => setAceitaTroca(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6) VALORES */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Valores</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="max-w-sm">
            <label className="block text-[11px] font-semibold text-slate-700">
              Preço (R$) <span className="text-red-600">*</span>
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm font-semibold text-slate-600">R$</span>
              <input
                type="text"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="Ex: 75.000"
                value={preco}
                onChange={(e) => setPreco(formatBRLInput(e.target.value))}
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Digite números. Ex: 75000 → vira 75.000.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ 6.1) LOGOMARCA DA LOJA (se Loja/Revenda) */}
      {isLojaRevenda && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <h3 className="text-sm font-bold text-slate-900">Logomarca da loja (recomendado)</h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Essa imagem fica <b>separada</b> e aparece no “Resumo do anúncio”. Ela <b>NÃO</b> vira foto principal do card.
          </p>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold text-slate-700">
              Enviar logomarca (1 arquivo)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-2 w-full text-xs"
            />

            {logoPreview && (
              <div className="mt-3 max-w-xs rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoPreview.url} alt={logoPreview.name} className="w-full h-40 object-contain bg-white" />
                <div className="px-2 py-2">
                  <p className="text-[10px] text-slate-600 line-clamp-1">{logoPreview.name}</p>
                </div>
              </div>
            )}

            {logoArquivo && (
              <button
                type="button"
                onClick={() => setLogoArquivo(null)}
                className="mt-3 text-xs font-semibold text-slate-700 underline"
              >
                Remover logomarca
              </button>
            )}
          </div>
        </div>
      )}

      {/* 7) FOTOS */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Fotos do veículo</h3>
        <p className="mt-1 text-[11px] text-slate-500">Até 8 imagens. Recomendado: JPG/PNG.</p>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">
            Enviar fotos (upload)
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleArquivosChange}
            className="mt-2 w-full text-xs"
          />

          {arquivos.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-slate-600">
                {arquivos.length} arquivo(s) selecionado(s).
              </p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {previews.map((p) => (
                  <div
                    key={p.url}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="w-full h-28 object-cover" />
                    <div className="px-2 py-2">
                      <p className="text-[10px] text-slate-600 line-clamp-1">{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setArquivos([])}
                className="mt-3 text-xs font-semibold text-slate-700 underline"
              >
                Remover todas as fotos
              </button>
            </div>
          )}

          <p className="mt-2 text-[11px] text-slate-500">
            Se der erro no upload: tente fotos menores (até ~2MB) e em JPG.
          </p>
        </div>
      </div>

      {/* 8) VÍDEO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Vídeo do veículo (opcional)</h3>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">URL do vídeo (YouTube)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cole aqui o link do YouTube (youtube.com / youtu.be)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          {!isYoutubeUrl(videoUrl.trim()) && (
            <p className="mt-2 text-[11px] text-red-600">
              A URL parece não ser do YouTube.
            </p>
          )}
        </div>
      </div>

      {/* 9) CONTATO */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Dados de contato</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Pelo menos um canal (telefone, WhatsApp ou e-mail) precisa estar preenchido.
        </p>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">Nome de contato</label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do proprietário, lojista ou revenda"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Telefone para contato"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DDD + número"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* 10) TERMOS */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Termos e responsabilidade</h3>

        <div className="mt-3 text-xs text-slate-700">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={aceitoTermos}
              onChange={(e) => setAceitoTermos(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Declaro que todas as informações deste anúncio são verdadeiras e estou de acordo com os{" "}
              <a
                href="/termos-de-uso"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold"
              >
                Termos de Uso do Classilagos
              </a>
              .
            </span>
          </label>
        </div>
      </div>

      {/* BOTÃO FINAL */}
      <button
        type="submit"
        className="w-full rounded-full bg-blue-600 text-white py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Enviar anúncio"}
      </button>
    </form>
  );
}
