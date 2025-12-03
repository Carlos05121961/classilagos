"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioVeiculos() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // Localização
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");

  // Tipo / finalidade
  const [finalidade, setFinalidade] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("");

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
  const [financiado, setFinanciado] = useState("nao");
  const [aceitaTroca, setAceitaTroca] = useState("nao");

  // 🚀 NOVOS CAMPOS (para ligar aos cards)
  const [zeroKm, setZeroKm] = useState(false);
  const [consignado, setConsignado] = useState(false);
  const [lojaRevenda, setLojaRevenda] = useState(false);

  // Valores
  const [preco, setPreco] = useState("");

  // Upload de arquivos
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo
  const [videoUrl, setVideoUrl] = useState("");

  // Contatos
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Listas
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
    "Caminhão",
    "Van",
    "Ônibus",
    "Quadriciclo",
    "Jet Ski",
    "Outros",
  ];

  const finalidades = ["Venda", "Troca", "Aluguel"];

  const combustiveis = [
    "Gasolina",
    "Etanol",
    "Flex",
    "Diesel",
    "GNV",
    "Elétrico",
  ];

  const cambios = ["Manual", "Automático", "CVT", "Outros"];

  // Garantir login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8));
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
      return router.push("/login");
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe ao menos um meio de contato.");
      return;
    }

    if (!finalidade || !tipoVeiculo) {
      setErro("Selecione finalidade e tipo de veículo.");
      return;
    }

    if (!aceitoTermos) {
      setErro("Você precisa aceitar os termos.");
      return;
    }

    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const bucket = "anuncios";

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-${index}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from(bucket)
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: pub } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);

            return pub.publicUrl;
          })
        );

        urlsUpload = uploads;
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar imagens.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    const imagens = urlsUpload;

    const detalhes = `
=== Detalhes do veículo ===
Finalidade: ${finalidade}
Tipo: ${tipoVeiculo}
Marca: ${marca}
Modelo: ${modelo}
Ano: ${ano}
KM: ${km}
Cor: ${cor}
Combustível: ${combustivel}
Câmbio: ${cambio}
Portas: ${portas}
IPVA pago: ${ipvaPago}
Licenciado: ${licenciado}
Financiado: ${financiado}
Aceita troca: ${aceitaTroca}
`.trim();

    const descricaoFinal = `${descricao}\n\n${detalhes}`;

    // 🔥 SALVA NO SUPABASE COM OS NOVOS CAMPOS
    const { data, error } = await supabase
      .from("anuncios")
      .insert({
        user_id: user.id,
        categoria: "veiculos",
        titulo,
        descricao: descricaoFinal,
        cidade,
        bairro,
        endereco,
        cep,
        preco,
        imagens,
        video_url: videoUrl,
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,

        tipo_imovel: tipoVeiculo,
        finalidade: finalidade.toLowerCase(),

        // 🚀 novos campos ligados aos cards
        zero_km: zeroKm,
        consignado,
        loja_revenda: lojaRevenda,
        financiado: financiado === "sim",

        nome_contato: nomeContato,
        status: "ativo",
        destaque: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      setErro("Erro ao salvar anúncio.");
      return;
    }

    setSucesso("Anúncio enviado com sucesso!");

    setTimeout(() => {
      router.push(`/anuncios/${data.id}`);
    }, 1500);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6">

      {erro && (
        <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="text-green-600 text-xs bg-green-50 border border-green-200 rounded px-3 py-2">
          {sucesso}
        </p>
      )}

      {/* 🚀 NOVO BLOCO: CLASSIFICAÇÃO DO VEÍCULO */}
      <div className="border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Classificação do anúncio
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={zeroKm}
              onChange={(e) => setZeroKm(e.target.checked)}
            />
            0 KM (zero quilômetro)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={financiado === "sim"}
              onChange={(e) => setFinanciado(e.target.checked ? "sim" : "nao")}
            />
            Financiado
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={consignado}
              onChange={(e) => setConsignado(e.target.checked)}
            />
            Consignado
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={lojaRevenda}
              onChange={(e) => setLojaRevenda(e.target.checked)}
            />
            Loja / Revenda
          </label>
        </div>
      </div>

      {/* resto do formulário permanece igual */}
