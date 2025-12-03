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

  // 🚀 NOVOS CAMPOS
  const [zeroKm, setZeroKm] = useState(false);
  const [consignado, setConsignado] = useState(false);
  const [lojaRevenda, setLojaRevenda] = useState(false);

  // Valores
  const [preco, setPreco] = useState("");

  // Uploads
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");

  // Contatos
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
  const combustiveis = ["Gasolina", "Etanol", "Flex", "Diesel", "GNV", "Elétrico"];
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

    // Upload de imagens
    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const bucket = "anuncios";

        const uploads = await Promise.all(
          arquivos.map(async (file, i) => {
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-${i}.${ext}`;

            const { error: uploadErr } = await supabase.storage
              .from(bucket)
              .upload(filePath, file);

            if (uploadErr) throw uploadErr;

            const { data: pub } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);

            return pub.publicUrl;
          })
        );

        urlsUpload = uploads;
      }
    } catch (err) {
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
      
      {/* ALERTAS */}
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

      {/* NOVO BLOCO: CLASSIFICAÇÃO */}
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
            0 KM (Zero Quilômetro)
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

      {/* --------------------------------------------- */}
      {/* BLOCO: TIPO DO ANÚNCIO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Tipo de anúncio
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Finalidade *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {finalidades.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Tipo de veículo *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={tipoVeiculo}
              onChange={(e) => setTipoVeiculo(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {tiposVeiculo.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: INFORMAÇÕES PRINCIPAIS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações do veículo
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: Honda Civic 2019 LXR, único dono, 60 mil km"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Descrição detalhada *
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-28"
            placeholder="Descreva o estado geral, manutenção, pneus, documentação..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Quanto mais detalhes, mais contatos você recebe.
          </p>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: LOCALIZAÇÃO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Cidade *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
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
            <label className="block text-xs font-medium text-slate-700">
              Bairro / Região
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex: Centro, Itaipuaçu, Ponta Negra..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Endereço (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Rua, número..."
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              CEP (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: DETALHES DO VEÍCULO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Detalhes</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Marca
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Modelo
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Ano
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Quilometragem
            </label>
            <input
              type="text"
              placeholder="Ex: 65.000 km"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Cor
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Portas
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={portas}
              onChange={(e) => setPortas(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Combustível
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={combustivel}
              onChange={(e) => setCombustivel(e.target.value)}
            >
              <option value="">Selecione...</option>
              {combustiveis.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Câmbio
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cambio}
              onChange={(e) => setCambio(e.target.value)}
            >
              <option value="">Selecione...</option>
              {cambios.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              IPVA pago?
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={ipvaPago}
              onChange={(e) => setIpvaPago(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Licenciamento em dia?
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={licenciado}
              onChange={(e) => setLicenciado(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Financiado?
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={financiado}
              onChange={(e) => setFinanciado(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Aceita troca?
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={aceitaTroca}
              onChange={(e) => setAceitaTroca(e.target.value)}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: VALORES */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Valores</h2>

        <div className="max-w-sm">
          <label className="block text-xs font-medium text-slate-700">
            Preço (R$) *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex: R$ 75.000"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: FOTOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Enviar fotos (até 8)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleArquivosChange}
            className="mt-1 w-full text-xs"
          />

          {arquivos.length > 0 && (
            <p className="text-[11px] text-slate-500 mt-1">
              {arquivos.length} arquivo(s) selecionado(s).
            </p>
          )}
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: VÍDEO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Vídeo (YouTube)</h2>

        <input
          type="text"
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Link do vídeo (opcional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: CONTATO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Dados de contato
        </h2>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Nome de contato"
          value={nomeContato}
          onChange={(e) => setNomeContato(e.target.value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* --------------------------------------------- */}
      {/* BLOCO: TERMOS */}
      <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações são verdadeiras e aceito os{" "}
            <a
              href="/termos-de-uso"
              className="underline"
              target="_blank"
            >
              Termos de Uso
            </a>.
          </span>
        </label>
      </div>

      {/* --------------------------------------------- */}
      <button
        type="submit"
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Enviar anúncio"}
      </button>
    </form>
  );
}

