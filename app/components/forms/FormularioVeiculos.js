"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioVeiculos() {
  const router = useRouter();

  // Classificação / condição
  const [condicao, setCondicao] = useState(""); // usado / seminovo / 0km
  const [classZeroKm, setClassZeroKm] = useState(false);
  const [classConsignado, setClassConsignado] = useState(false);
  const [classFinanciado, setClassFinanciado] = useState(false);
  const [classLojaRevenda, setClassLojaRevenda] = useState(false);

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // Localização
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");

  // Tipo / finalidade
  const [finalidade, setFinalidade] = useState(""); // venda / troca / aluguel
  const [tipoVeiculo, setTipoVeiculo] = useState(""); // carro / moto / etc.

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

  // Valores
  const [preco, setPreco] = useState("");

  // Upload de arquivos (fotos)
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo (URL – apenas YouTube)
  const [videoUrl, setVideoUrl] = useState("");

  // Contatos
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Termos de responsabilidade
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
    "SUV",
    "Utilitário",
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

  const condicoes = ["Usado", "Seminovo", "0 km"];

  // Garante login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    // máximo 8 fotos
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
      router.push("/login");
      return;
    }

    if (!condicao) {
      setErro(
        "Selecione a condição do veículo (usado, seminovo ou 0 km)."
      );
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;

    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    if (!finalidade || !tipoVeiculo) {
      setErro("Selecione a finalidade e o tipo de veículo.");
      return;
    }

    if (!aceitoTermos) {
      setErro(
        "Você precisa declarar que está de acordo com os termos e responsabilidade do anúncio."
      );
      return;
    }

    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const bucketName = "anuncios";

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-${index}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from(bucketName)
              .upload(filePath, file);

            if (uploadError) {
              console.error("Erro ao subir imagem:", uploadError);
              throw uploadError;
            }

            const { data: publicData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath);

            return publicData.publicUrl;
          })
        );

        urlsUpload = uploads;
      }
    } catch (err) {
      console.error(err);
      setErro(
        "Ocorreu um erro ao enviar as imagens. Tente novamente em alguns instantes."
      );
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    const imagens = urlsUpload;

    // Monta um bloco com os detalhes do veículo para guardar dentro da descrição
    const detalhesVeiculoTexto = `
=== Detalhes do veículo ===
Condição: ${condicao || "-"}
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
Financiado: ${financiado === "sim" ? "Sim" : "Não"}
Aceita troca: ${aceitaTroca === "sim" ? "Sim" : "Não"}
0 km (classificação): ${classZeroKm ? "Sim" : "Não"}
Consignado: ${classConsignado ? "Sim" : "Não"}
Financiado (classificação): ${classFinanciado ? "Sim" : "Não"}
Loja / Revenda: ${classLojaRevenda ? "Sim" : "Não"}
`.trim();

    const descricaoFinal = `${descricao.trim()}

${detalhesVeiculoTexto}
`.trim();

    // Grava no Supabase usando a mesma tabela "anuncios"
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

        // campos genéricos reaproveitados
        tipo_imovel: tipoVeiculo, // aqui vai o tipo de veículo
        finalidade: finalidade.toLowerCase(), // venda / troca / aluguel
        nome_contato: nomeContato,

        // NOVOS CAMPOS DE CLASSIFICAÇÃO (colunas criadas no Supabase)
        condicao: condicao.toLowerCase(), // "usado" | "seminovo" | "0 km" (ajuste no SQL se precisar)
        zero_km: classZeroKm,
        consignado: classConsignado,
        financiado: classFinanciado,
        loja_revenda: classLojaRevenda,

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

    // Redireciona para a página do anúncio
    setTimeout(() => {
      router.push(`/anuncios/${data.id}`);
    }, 1500);

    // Limpa formulário
    setCondicao("");
    setClassZeroKm(false);
    setClassConsignado(false);
    setClassFinanciado(false);
    setClassLojaRevenda(false);

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
    setFinanciado("nao");
    setAceitaTroca("nao");
    setPreco("");
    setArquivos([]);
    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);
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

      {/* BLOCO: CLASSIFICAÇÃO DO ANÚNCIO */}
      <div className="space-y-4 border-b border-slate-100 pb-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Classificação do anúncio
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Condição do veículo *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={condicao}
              onChange={(e) => setCondicao(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {condicoes.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              Ex.: A maioria dos anúncios será de veículos usados ou seminovos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 mt-1">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={classZeroKm}
                onChange={(e) => setClassZeroKm(e.target.checked)}
              />
              <span>0 KM (Zero Quilômetro)</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={classConsignado}
                onChange={(e) => setClassConsignado(e.target.checked)}
              />
              <span>Consignado</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={classFinanciado}
                onChange={(e) => setClassFinanciado(e.target.checked)}
              />
              <span>Financiado</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={classLojaRevenda}
                onChange={(e) => setClassLojaRevenda(e.target.checked)}
              />
              <span>Loja / Revenda</span>
            </label>
          </div>
        </div>
      </div>

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
            placeholder="Descreva o estado geral, manutenção, pneus, documentação, histórico do veículo..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Dica: informações claras e honestas geram mais confiança e contatos.
          </p>
        </div>
      </div>

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
              placeholder="Rua, número, complemento..."
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

      {/* BLOCO: DETALHES DO VEÍCULO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Detalhes do veículo
        </h2>

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
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex: 65.000 km"
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
                <option key={c} value={c}>
                  {c}
                </option>
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
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2 text-xs text-slate-700">
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

      {/* BLOCO: FOTOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos do veículo</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Enviar fotos (upload) – até 8 imagens
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleArquivosChange}
            className="mt-1 w-full text-xs"
          />
          {arquivos.length > 0 && (
            <p className="mt-1 text-[11px] text-slate-500">
              {arquivos.length} arquivo(s) selecionado(s).
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            Formatos recomendados: JPG ou PNG, até 2MB cada.
          </p>
        </div>
      </div>

      {/* BLOCO: VÍDEO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Vídeo do veículo (opcional)
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            URL do vídeo (YouTube)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Cole aqui o link do vídeo no YouTube (se tiver)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: CONTATO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados de contato</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Nome de contato
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Nome do proprietário, lojista ou revenda"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Telefone
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Telefone para contato"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              WhatsApp
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="DDD + número"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será
          exibido para as pessoas entrarem em contato com você.
        </p>
      </div>

      {/* BLOCO: TERMOS DE RESPONSABILIDADE */}
      <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Declaro que todas as informações deste anúncio são verdadeiras e
            estou de acordo com os{" "}
            <a
              href="/termos-de-uso"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Termos de Uso do Classilagos
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

