"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioNautica() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [preco, setPreco] = useState("");

  // Classificação
  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");

  // Dados técnicos
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [material, setMaterial] = useState("");

  const [marcaMotor, setMarcaMotor] = useState("");
  const [potenciaMotor, setPotenciaMotor] = useState("");
  const [qtdMotores, setQtdMotores] = useState("");
  const [horasMotor, setHorasMotor] = useState("");

  const [capacidadePessoas, setCapacidadePessoas] = useState("");
  const [combustivel, setCombustivel] = useState("");

  const [qtdCabines, setQtdCabines] = useState("");
  const [qtdBanheiros, setQtdBanheiros] = useState("");

  const [registro, setRegistro] = useState("");
  const [documentacao, setDocumentacao] = useState("");

  // Passeio / Aluguel privado
  const [tipoPasseio, setTipoPasseio] = useState("");
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [valorPorPessoa, setValorPorPessoa] = useState("");
  const [valorFechado, setValorFechado] = useState("");
  const [pontoEmbarque, setPontoEmbarque] = useState("");
  const [itensInclusos, setItensInclusos] = useState("");

  // Marina
  const [tipoVaga, setTipoVaga] = useState("");
  const [comprimentoMax, setComprimentoMax] = useState("");
  const [estruturaDisponivel, setEstruturaDisponivel] = useState("");

  // Contato
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Fotos
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo
  const [videoUrl, setVideoUrl] = useState("");

  // Feedback
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const cidadesLista = [
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

  const subcategoriasLista = [
    "Lancha",
    "Veleiro",
    "Jetski",
    "Barco a laser",
    "Stand-up paddle",
    "Caiaque",
    "Bote inflável",
    "Pesca",
    "Motores",
    "Equipamentos",
    "Outros",
  ];

  const finalidadesLista = [
    "Venda",
    "Aluguel",
    "Serviço",
    "Vaga de marina",
  ];

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

  // Enviar
  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      return;
    }

    const contato = whatsapp || telefone || email;

    if (!contato) {
      setErro("Informe pelo menos um meio de contato.");
      return;
    }

    if (!subcategoria || !finalidade) {
      setErro("Selecione subcategoria e finalidade.");
      return;
    }

    // Upload das fotos
    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const ext = file.name.split(".").pop();
            const path = `${user.id}/${Date.now()}-${index}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("anuncios")
              .upload(path, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from("anuncios")
              .getPublicUrl(path);

            return data.publicUrl;
          })
        );

        urlsUpload = uploads;
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar imagens. Tente novamente.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    const imagens = urlsUpload;

    // Inserir no Supabase
    const { error } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: "nautica",

      titulo,
      descricao,
      cidade,
      bairro,
      endereco,
      preco,

      // Classificação
      subcategoria_nautica: subcategoria,
      finalidade_nautica: finalidade,

      // Dados técnicos
      marca_embarcacao: marca,
      modelo_embarcacao: modelo,
      ano_embarcacao: ano,
      comprimento_pes: comprimento,
      material_casco: material,

      marca_motor: marcaMotor,
      potencia_motor_hp: potenciaMotor,
      qtd_motores: qtdMotores,
      horas_motor: horasMotor,

      capacidade_pessoas: capacidadePessoas,
      combustivel,

      qtd_cabines: qtdCabines,
      qtd_banheiros: qtdBanheiros,

      registro_capitania: registro,
      documentacao_em_dia: documentacao,

      // Passeio / aluguel
      tipo_passeio: tipoPasseio,
      duracao_passeio: duracaoPasseio,
      valor_passeio_pessoa: valorPorPessoa,
      valor_passeio_fechado: valorFechado,
      ponto_embarque: pontoEmbarque,
      itens_inclusos: itensInclusos,

      // Marina
      tipo_vaga: tipoVaga,
      comprimento_maximo_pes: comprimentoMax,
      estrutura_disponivel: estruturaDisponivel,

      // Fotos + vídeo
      imagens,
      video_url: videoUrl,

      // Contato
      telefone,
      whatsapp,
      email,
      nome_contato: nomeContato,

      status: "ativo",
      destaque: false,
    });

    if (error) {
      console.error(error);
      setErro("Erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    setSucesso("Anúncio enviado com sucesso! Ele aparecerá em breve.");

    // Resetar formulário
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setEndereco("");
    setPreco("");

    setSubcategoria("");
    setFinalidade("");

    setMarca("");
    setModelo("");
    setAno("");
    setComprimento("");
    setMaterial("");

    setMarcaMotor("");
    setPotenciaMotor("");
    setQtdMotores("");
    setHorasMotor("");

    setCapacidadePessoas("");
    setCombustivel("");

    setQtdCabines("");
    setQtdBanheiros("");

    setRegistro("");
    setDocumentacao("");

    setTipoPasseio("");
    setDuracaoPasseio("");
    setValorPorPessoa("");
    setValorFechado("");
    setPontoEmbarque("");
    setItensInclusos("");

    setTipoVaga("");
    setComprimentoMax("");
    setEstruturaDisponivel("");

    setArquivos([]);
    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6">
      {/* MENSAGENS */}
      {erro && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="text-green-600 text-sm bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
          {sucesso}
        </p>
      {/* CLASSIFICAÇÃO */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Classificação</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Subcategoria *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {subcategoriasLista.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

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
              {finalidadesLista.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DADOS DA EMBARCAÇÃO */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados da embarcação</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">Marca</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Modelo</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Ano</label>
            <input
              type="number"
              min="1900"
              max="2099"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Comprimento (pés)
            </label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={comprimento}
              onChange={(e) => setComprimento(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Material do casco</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="fibra">Fibra</option>
              <option value="aluminio">Alumínio</option>
              <option value="madeira">Madeira</option>
              <option value="inflavel">Inflável</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOTORES */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Motor</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">Marca do motor</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={marcaMotor}
              onChange={(e) => setMarcaMotor(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Potência (HP)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={potenciaMotor}
              onChange={(e) => setPotenciaMotor(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Quantidade</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={qtdMotores}
              onChange={(e) => setQtdMotores(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Horas de uso</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={horasMotor}
              onChange={(e) => setHorasMotor(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* VALORES */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Preço</h2>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ex.: R$ 150.000"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
      </div>

      {/* FOTOS */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos</h2>

        <input type="file" accept="image/*" multiple onChange={handleArquivosChange} />

        {arquivos.length > 0 && (
          <p className="text-xs text-slate-500">{arquivos.length} foto(s) selecionada(s).</p>
        )}
      </div>

      {/* VÍDEO */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Vídeo (opcional)</h2>

        <input
          type="text"
          placeholder="URL do YouTube"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      {/* CONTATO */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Contato</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Telefone</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
        </div>

        <label className="block text-xs font-medium text-slate-700">E-mail</label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* BOTÃO */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white font-semibold rounded-full py-3 hover:bg-blue-700"
      >
        {uploading ? "Enviando..." : "Enviar anúncio"}
      </button>
    </form>
  );
}
