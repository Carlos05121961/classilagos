"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioNautica() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [pontoEmbarque, setPontoEmbarque] = useState("");

  // Categoria / finalidade
  const [subcategoria, setSubcategoria] = useState(""); // Lancha, Veleiro, Jetski...
  const [finalidade, setFinalidade] = useState(""); // venda / aluguel / passeio / servico / vaga_marina

  // Informações técnicas básicas
  const [marcaEmbarcacao, setMarcaEmbarcacao] = useState("");
  const [modeloEmbarcacao, setModeloEmbarcacao] = useState("");
  const [anoEmbarcacao, setAnoEmbarcacao] = useState("");
  const [comprimentoPes, setComprimentoPes] = useState("");
  const [materialCasco, setMaterialCasco] = useState("");

  // Motor
  const [marcaMotor, setMarcaMotor] = useState("");
  const [potenciaMotorHp, setPotenciaMotorHp] = useState("");
  const [qtdMotores, setQtdMotores] = useState("");
  const [horasMotor, setHorasMotor] = useState("");
  const [combustivel, setCombustivel] = useState("");

  // Capacidade
  const [capacidadePessoas, setCapacidadePessoas] = useState("");
  const [qtdCabines, setQtdCabines] = useState("");
  const [qtdBanheiros, setQtdBanheiros] = useState("");

  // Passeios
  const [tipoPasseio, setTipoPasseio] = useState("");
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [valorPessoa, setValorPessoa] = useState("");
  const [valorFechado, setValorFechado] = useState("");
  const [itensInclusos, setItensInclusos] = useState("");

  // Vaga em marina
  const [tipoVaga, setTipoVaga] = useState("");
  const [comprimentoMaximoPes, setComprimentoMaximoPes] = useState("");
  const [estruturaDisponivel, setEstruturaDisponivel] = useState("");

  // Valor geral
  const [preco, setPreco] = useState("");

  // Upload
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Vídeo
  const [videoUrl, setVideoUrl] = useState("");

  // Contato
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Termos
  const [aceitoTermos, setAceitoTermos] = useState(false);

  // Mensagens
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

  const subcategoriasNautica = [
    "Lancha",
    "Veleiro",
    "Jetski",
    "Barco de pesca",
    "Stand-up / Caiaque",
    "Vaga em marina",
    "Serviços náuticos",
    "Outros",
  ];

  const finalidadesNautica = [
    { value: "venda", label: "Venda" },
    { value: "aluguel", label: "Aluguel" },
    { value: "passeio", label: "Passeio turístico" },
    { value: "servico", label: "Serviço náutico" },
    { value: "vaga_marina", label: "Vaga em marina / guardaria" },
  ];

  // Garante login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleArquivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8));
  };

  const enviarAnuncio = async (e: React.FormEvent) => {
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

    if (!subcategoria || !finalidade) {
      setErro("Selecione a subcategoria e a finalidade do anúncio.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe ao menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    if (!aceitoTermos) {
      setErro(
        "Para publicar o anúncio, você precisa aceitar os termos de responsabilidade."
      );
      return;
    }

    // Upload de imagens
    let urlsUpload: string[] = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-nautica-${index}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("anuncios")
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage
              .from("anuncios")
              .getPublicUrl(filePath);

            return publicData.publicUrl;
          })
        );

        urlsUpload = uploads;
      }
    } catch (err) {
      console.error("Erro ao enviar imagens de náutica:", err);
      setErro("Erro ao enviar as imagens. Tente novamente.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    const imagens = urlsUpload;

    // INSERT no Supabase
    const { data, error } = await supabase
      .from("anuncios")
      .insert({
        user_id: user.id,
        categoria: "nautica",
        titulo,
        descricao,
        cidade,
        bairro,
        ponto_embarque: pontoEmbarque,
        preco,
        imagens,
        video_url: videoUrl,
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,

        subcategoria_nautica: subcategoria,
        finalidade_nautica: finalidade,
        // também preenche a coluna genérica
        finalidade,

        marca_embarcacao: marcaEmbarcacao,
        modelo_embarcacao: modeloEmbarcacao,
        ano_embarcacao: anoEmbarcacao,
        comprimento_pes: comprimentoPes,
        material_casco: materialCasco,

        marca_motor: marcaMotor,
        potencia_motor_hp: potenciaMotorHp,
        qtd_motores: qtdMotores,
        horas_motor: horasMotor,
        combustivel,

        capacidade_pessoas: capacidadePessoas,
        qtd_cabines: qtdCabines,
        qtd_banheiros: qtdBanheiros,

        tipo_passeio: tipoPasseio,
        duracao_passeio: duracaoPasseio,
        valor_passeio_pessoa: valorPessoa,
        valor_passeio_fechado: valorFechado,
        itens_inclusos: itensInclusos,

        tipo_vaga: tipoVaga,
        comprimento_maximo_pes: comprimentoMaximoPes,
        estrutura_disponivel: estruturaDisponivel,

        status: "ativo",
        destaque: false,
        nome_contato: nomeContato,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar anúncio de náutica:", error);
      setErro(
        `Erro ao salvar anúncio: ${
          (error as any).message || "Tente novamente em instantes."
        }`
      );
      return;
    }

    setSucesso("Anúncio náutico enviado com sucesso! Redirecionando…");

    // Limpa formulário
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setPontoEmbarque("");
    setSubcategoria("");
    setFinalidade("");
    setMarcaEmbarcacao("");
    setModeloEmbarcacao("");
    setAnoEmbarcacao("");
    setComprimentoPes("");
    setMaterialCasco("");
    setMarcaMotor("");
    setPotenciaMotorHp("");
    setQtdMotores("");
    setHorasMotor("");
    setCombustivel("");
    setCapacidadePessoas("");
    setQtdCabines("");
    setQtdBanheiros("");
    setTipoPasseio("");
    setDuracaoPasseio("");
    setValorPessoa("");
    setValorFechado("");
    setItensInclusos("");
    setTipoVaga("");
    setComprimentoMaximoPes("");
    setEstruturaDisponivel("");
    setPreco("");
    setArquivos([]);
    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);

    setTimeout(() => {
      if (data?.id) {
        router.push(`/anuncios/${data.id}`);
      } else {
        router.push("/painel/meus-anuncios");
      }
    }, 1500);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6 text-xs md:text-sm">
      {erro && (
        <p className="text-red-600 text-xs md:text-sm border border-red-100 rounded-md px-3 py-2 bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-emerald-600 text-xs md:text-sm border border-emerald-100 rounded-md px-3 py-2 bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* BLOCO: TIPO */}
      {/* (daqui para baixo mantém igual ao seu, só copiei do seu código) */}

      {/* BLOCO: TIPO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Tipo de anúncio náutico</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Subcategoria *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {subcategoriasNautica.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Finalidade *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {finalidadesNautica.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* BLOCO: TÍTULO / DESCRIÇÃO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações principais
        </h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Lancha 30 pés com 2 motores Mercury"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Descrição detalhada *
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-28"
            placeholder="Descreva os principais detalhes da embarcação ou serviço..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* BLOCO: LOCALIZAÇÃO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Localização / ponto de embarque
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
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
            <label className="block text-[11px] font-medium text-slate-700">
              Bairro / região
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex.: Centro, Praia do Forte..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Ponto de embarque (opcional)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Marina X, píer da Praia Y..."
            value={pontoEmbarque}
            onChange={(e) => setPontoEmbarque(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: DETALHES (para venda/aluguel de embarcação) */}
      {(finalidade === "venda" || finalidade === "aluguel") && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Detalhes da embarcação
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Marca
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={marcaEmbarcacao}
                onChange={(e) => setMarcaEmbarcacao(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Modelo
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={modeloEmbarcacao}
                onChange={(e) => setModeloEmbarcacao(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Ano
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={anoEmbarcacao}
                onChange={(e) => setAnoEmbarcacao(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Comprimento (pés)
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={comprimentoPes}
                onChange={(e) => setComprimentoPes(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Material do casco
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={materialCasco}
                onChange={(e) => setMaterialCasco(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Marca do motor
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={marcaMotor}
                onChange={(e) => setMarcaMotor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Potência total (HP)
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={potenciaMotorHp}
                onChange={(e) => setPotenciaMotorHp(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Qtde. de motores
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={qtdMotores}
                onChange={(e) => setQtdMotores(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Horas de motor
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={horasMotor}
                onChange={(e) => setHorasMotor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Combustível
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={combustivel}
                onChange={(e) => setCombustivel(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Capacidade (pessoas)
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={capacidadePessoas}
                onChange={(e) => setCapacidadePessoas(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Cabines
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={qtdCabines}
                onChange={(e) => setQtdCabines(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Banheiros
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={qtdBanheiros}
                onChange={(e) => setQtdBanheiros(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* BLOCO: PASSEIOS */}
      {finalidade === "passeio" && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Informações do passeio
          </h2>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Tipo de passeio
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex.: passeio de lancha exclusivo, escuna, mergulho..."
              value={tipoPasseio}
              onChange={(e) => setTipoPasseio(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Duração média
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Ex.: 3h, 6h, dia inteiro"
                value={duracaoPasseio}
                onChange={(e) => setDuracaoPasseio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Valor por pessoa
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={valorPessoa}
                onChange={(e) => setValorPessoa(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Valor passeio fechado
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={valorFechado}
              onChange={(e) => setValorFechado(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Itens inclusos
            </label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-24"
              placeholder="Ex.: bebidas, coletes, máscara, churrasco..."
              value={itensInclusos}
              onChange={(e) => setItensInclusos(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* BLOCO: VAGA EM MARINA */}
      {finalidade === "vaga_marina" && (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Informações da vaga em marina / guardaria
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Tipo de vaga
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Ex.: seca, molhada..."
                value={tipoVaga}
                onChange={(e) => setTipoVaga(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Comprimento máximo (pés)
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={comprimentoMaximoPes}
                onChange={(e) => setComprimentoMaximoPes(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Estrutura disponível
            </label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-24"
              placeholder="Ex.: água, luz, banheiro, segurança 24h..."
              value={estruturaDisponivel}
              onChange={(e) => setEstruturaDisponivel(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* BLOCO: VALOR */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Valor</h2>
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Preço (R$)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: R$ 250.000, R$ 800 / passeio..."
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </div>

      {/* BLOCO: FOTOS */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos</h2>
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
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
        </div>
      </div>

      {/* BLOCO: VÍDEO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Vídeo (opcional)</h2>
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
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
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados de contato</h2>

        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Nome de contato
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Nome do proprietário ou empresa"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
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
            <label className="block text-[11px] font-medium text-slate-700">
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
          <label className="block text-[11px] font-medium text-slate-700">
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
      </div>

      {/* BLOCO: TERMOS */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações deste anúncio são verdadeiras e que
            assumo total responsabilidade pelo conteúdo publicado. Estou ciente
            e de acordo com os{" "}
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
        className="mt-2 w-full bg-sky-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Publicar anúncio em Náutica"}
      </button>
    </form>
  );
}

