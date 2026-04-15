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

function formatBRLInput(v) {
  const d = onlyDigits(v);
  if (!d) return "";
  const n = Number(d);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR");
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

export default function FormularioVeiculos() {
  const router = useRouter();

  const [capaFile, setCapaFile] = useState(null);
  const [galeriaFiles, setGaleriaFiles] = useState([]);

  const [isAgencia, setIsAgencia] = useState(false);
  const [logoArquivo, setLogoArquivo] = useState(null);

  const [condicaoVeiculo, setCondicaoVeiculo] = useState("");
  const [isFinanciado, setIsFinanciado] = useState(false);
  const [isConsignado, setIsConsignado] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");

  const [finalidade, setFinalidade] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("");

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

  const [preco, setPreco] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [aceitoTermos, setAceitoTermos] = useState(false);

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

  const handleCapaChange = (e) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setCapaFile(f || null);
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGaleriaFiles(files.slice(0, 8));
  };

  const handleLogoChange = (e) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setLogoArquivo(f || null);
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

    if (!capaFile) return "Envie a foto de capa (obrigatória).";
    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }
    if (!email.trim()) return "Informe seu e-mail para publicar o anúncio.";
    if (!finalidade || !tipoVeiculo) {
      return "Selecione a finalidade e o tipo de veículo.";
    }
    if (!condicaoVeiculo) {
      return "Informe a condição do veículo (usado, seminovo ou 0 km).";
    }
    if (!titulo.trim() || !descricao.trim()) {
      return "Preencha o título e a descrição do anúncio.";
    }
    if (!cidade) return "Selecione a cidade do anúncio.";
    if (!preco.trim()) return "Informe o preço do veículo.";
    if (!isYoutubeUrl(videoUrl.trim())) {
      return "A URL do vídeo deve ser do YouTube (youtube.com ou youtu.be).";
    }
    if (isAgencia && !logoArquivo) {
      return "Você marcou Agência de veículos. Envie a logomarca (1 imagem).";
    }
    if (!aceitoTermos) {
      return "Você precisa declarar que está de acordo com os termos e responsabilidade do anúncio.";
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
          origem: "anuncio_veiculos",
        });
      }

      const bucketName = "anuncios";

      const capaUrl = await uploadToPublicUrl(
        bucketName,
        ownerKey,
        capaFile,
        "veiculos",
        "capa"
      );

      let galeriaUrls = [];
      if (galeriaFiles.length > 0) {
        const uploads = await Promise.all(
          galeriaFiles.map(async (file, idx) => {
            const url = await uploadToPublicUrl(
              bucketName,
              ownerKey,
              file,
              "veiculos",
              `galeria-${idx}`
            );
            return { idx, url };
          })
        );

        uploads.sort((a, b) => a.idx - b.idx);
        galeriaUrls = uploads.map((u) => u.url);
      }

      let logoUrl = null;
      if (isAgencia && logoArquivo) {
        logoUrl = await uploadToPublicUrl(
          bucketName,
          ownerKey,
          logoArquivo,
          "veiculos",
          "logo"
        );
      }

      const imagens = [capaUrl, ...galeriaUrls].filter(Boolean);

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
Agência de veículos: ${isAgencia ? "Sim" : "Não"}
Aceita troca: ${aceitaTroca === "sim" ? "Sim" : "Não"}
`.trim();

      const descricaoFinal = `${descricao.trim()}

${detalhesVeiculoTexto}
`.trim();

      const payload = {
        user_id: user?.id || null,
        categoria: "veiculos",
        titulo: titulo.trim(),
        descricao: descricaoFinal,
        cidade,
        bairro: bairro.trim(),
        endereco: endereco.trim(),
        cep: cep.trim(),
        preco: preco.trim(),

        capa_url: capaUrl,
        imagens,
        logo_url: logoUrl,

        video_url: videoUrl.trim(),
        telefone: telefone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        contato: contatoPrincipal,

        tipo_imovel: tipoVeiculo,
        finalidade: finalidade.toLowerCase(),
        nome_contato: nomeContato.trim(),

        condicao_veiculo: condicaoVeiculo,
        zero_km: condicaoVeiculo === "0km",
        financiado: isFinanciado,
        consignado: isConsignado,
        loja_revenda: isAgencia,

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

      setCapaFile(null);
      setGaleriaFiles([]);
      setIsAgencia(false);
      setLogoArquivo(null);

      setCondicaoVeiculo("");
      setIsFinanciado(false);
      setIsConsignado(false);

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
      setVideoUrl("");

      setNomeContato("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");

      setAceitoTermos(false);
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro ao enviar o anúncio. Tente novamente em alguns instantes.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-5">
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

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Fotos (capa + galeria)</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          A <b>capa</b> é a foto principal do card. A <b>galeria</b> são fotos extras do veículo.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold text-slate-900">
            Foto de capa (obrigatória) <span className="text-red-600">*</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Esta será a <b>foto principal</b> do seu anúncio.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleCapaChange}
            className="mt-3 w-full text-xs"
          />

          {capaFile?.name && (
            <p className="mt-2 text-[11px] text-slate-600">
              Capa selecionada: <b>{capaFile.name}</b>{" "}
              <button
                type="button"
                onClick={() => setCapaFile(null)}
                className="ml-2 underline text-slate-700"
              >
                remover
              </button>
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">
            Galeria (opcional) — até 8 fotos
          </label>
          <p className="mt-1 text-[11px] text-slate-500">
            Fotos extras: traseira, interior, painel, motor, detalhes…
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriaChange}
            className="mt-2 w-full text-xs"
          />
          {galeriaFiles.length > 0 && (
            <p className="mt-2 text-[11px] text-slate-600">
              {galeriaFiles.length} foto(s) selecionada(s).{" "}
              <button
                type="button"
                onClick={() => setGaleriaFiles([])}
                className="ml-2 underline text-slate-700"
              >
                remover todas
              </button>
            </p>
          )}
          <p className="mt-2 text-[11px] text-slate-500">
            Se der erro no upload: tente fotos menores (até ~2MB) e em JPG.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Agência de veículos</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Se você marcar, sua <b>logomarca</b> aparece como um <b>selo</b> no anúncio.
        </p>

        <label className="mt-3 inline-flex items-start gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={isAgencia}
            onChange={(e) => {
              const v = e.target.checked;
              setIsAgencia(v);
              if (!v) setLogoArquivo(null);
            }}
          />
          <span>
            Sou <b>agência / loja / revenda</b> e quero exibir minha logomarca no anúncio.
          </span>
        </label>

        {isAgencia && (
          <div className="mt-4">
            <label className="block text-[11px] font-semibold text-slate-700">
              Enviar logomarca (1 imagem) <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-2 w-full text-xs"
            />
            {logoArquivo?.name && (
              <p className="mt-2 text-[11px] text-slate-600">
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

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Classificação do anúncio</h3>

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
              <option value="0km">0 km</option>
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
            </div>
          </div>
        </div>
      </div>

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
      </div>

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
        </div>
      </div>

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
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Vídeo do veículo (opcional)</h3>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700">URL do vídeo (YouTube)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cole aqui o link do YouTube"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <h3 className="text-sm font-bold text-slate-900">Dados de contato</h3>

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
