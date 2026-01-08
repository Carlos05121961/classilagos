"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

// Converte campo de texto para número ou null (para colunas numeric do Supabase)
function parseNumberOrNull(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

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
        <h2 className="text-sm md:text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] md:text-xs text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

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
  const [arquivos, setArquivos] = useState([]);
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
    "Motores & equipamentos",
    "Peças & acessórios",
    "Vaga em marina / guardaria",
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
      if (!data.user) router.push("/login");
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8));
  };

  // Preview das imagens selecionadas
  const previews = useMemo(() => {
    if (!arquivos?.length) return [];
    return arquivos.map((f) => URL.createObjectURL(f));
  }, [arquivos]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

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
      setErro("Informe ao menos um meio de contato (WhatsApp, telefone ou e-mail).");
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

    // Converte campos numéricos vazios para null (evita erro no Supabase)
    const qtdMotoresNumber = parseNumberOrNull(qtdMotores);
    const capacidadePessoasNumber = parseNumberOrNull(capacidadePessoas);
    const qtdCabinesNumber = parseNumberOrNull(qtdCabines);
    const qtdBanheirosNumber = parseNumberOrNull(qtdBanheiros);

    // Upload de imagens
    let urlsUpload = [];
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

        // Campos específicos
        subcategoria_nautica: subcategoria,
        finalidade_nautica: finalidade,

        // Campo genérico do site
        tipo_imovel: subcategoria,
        finalidade,

        marca_embarcacao: marcaEmbarcacao,
        modelo_embarcacao: modeloEmbarcacao,
        ano_embarcacao: anoEmbarcacao,
        comprimento_pes: comprimentoPes,
        material_casco: materialCasco,

        marca_motor: marcaMotor,
        potencia_motor_hp: potenciaMotorHp,
        qtd_motores: qtdMotoresNumber,
        horas_motor: horasMotor,
        combustivel,

        capacidade_pessoas: capacidadePessoasNumber,
        qtd_cabines: qtdCabinesNumber,
        qtd_banheiros: qtdBanheirosNumber,

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
      setErro(`Erro ao salvar anúncio: ${error.message || "Tente novamente em instantes."}`);
      return;
    }

    setSucesso("Anúncio náutico enviado com sucesso! Redirecionando…");

    setTimeout(() => {
      router.push(`/anuncios/${data.id}`);
    }, 1200);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-4">
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
        title="Tipo de anúncio náutico"
        subtitle="Escolha a categoria e a finalidade para o formulário se adaptar automaticamente."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Subcategoria <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
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
            <label className="block text-[11px] font-semibold text-slate-700">
              Finalidade <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
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
      </Card>

      {/* PRINCIPAL */}
      <Card
        title="Informações principais"
        subtitle="Título e descrição caprichados fazem o anúncio aparecer melhor na busca e nos cards."
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Título do anúncio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: Lancha 30 pés com 2 motores Mercury"
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
              placeholder="Descreva estado, manutenção, documentos, itens, rotas do passeio, etc."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Dica: informe cidade, ponto de embarque, e o que está incluso.
            </p>
          </div>
        </div>
      </Card>

      {/* LOCALIZAÇÃO */}
      <Card title="Localização e ponto de embarque" subtitle="Ajuda muito quem está filtrando por cidade.">
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
            <label className="block text-[11px] font-semibold text-slate-700">Bairro / região</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: Centro, Praia do Forte..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-slate-700">Ponto de embarque (opcional)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Ex.: Marina X, píer da Praia Y..."
            value={pontoEmbarque}
            onChange={(e) => setPontoEmbarque(e.target.value)}
          />
        </div>
      </Card>

      {/* DETALHES (venda/aluguel) */}
      {(finalidade === "venda" || finalidade === "aluguel") && (
        <Card title="Detalhes da embarcação" subtitle="Preencha o que tiver — quanto mais completo, melhor.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Marca</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={marcaEmbarcacao}
                onChange={(e) => setMarcaEmbarcacao(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Modelo</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={modeloEmbarcacao}
                onChange={(e) => setModeloEmbarcacao(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Ano</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={anoEmbarcacao}
                onChange={(e) => setAnoEmbarcacao(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Comprimento (pés)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={comprimentoPes}
                onChange={(e) => setComprimentoPes(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Material do casco</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={materialCasco}
                onChange={(e) => setMaterialCasco(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Marca do motor</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={marcaMotor}
                onChange={(e) => setMarcaMotor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Potência total (HP)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={potenciaMotorHp}
                onChange={(e) => setPotenciaMotorHp(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Qtde. de motores</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={qtdMotores}
                onChange={(e) => setQtdMotores(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Horas de motor</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={horasMotor}
                onChange={(e) => setHorasMotor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Combustível</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={combustivel}
                onChange={(e) => setCombustivel(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Capacidade (pessoas)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={capacidadePessoas}
                onChange={(e) => setCapacidadePessoas(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Cabines</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={qtdCabines}
                onChange={(e) => setQtdCabines(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Banheiros</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={qtdBanheiros}
                onChange={(e) => setQtdBanheiros(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* PASSEIOS */}
      {finalidade === "passeio" && (
        <Card title="Informações do passeio" subtitle="Conteúdo claro aqui vira vendas rápido.">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Tipo de passeio</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Ex.: lancha exclusiva, escuna, mergulho..."
                value={tipoPasseio}
                onChange={(e) => setTipoPasseio(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Duração média</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Ex.: 3h, 6h, dia inteiro"
                  value={duracaoPasseio}
                  onChange={(e) => setDuracaoPasseio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Valor por pessoa</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={valorPessoa}
                  onChange={(e) => setValorPessoa(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Valor passeio fechado</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={valorFechado}
                onChange={(e) => setValorFechado(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Itens inclusos</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Ex.: bebidas, coletes, máscara, churrasco..."
                value={itensInclusos}
                onChange={(e) => setItensInclusos(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* VAGA EM MARINA */}
      {finalidade === "vaga_marina" && (
        <Card title="Informações da vaga em marina / guardaria" subtitle="Quanto mais claro, menos perguntas no WhatsApp.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Tipo de vaga</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Ex.: seca, molhada..."
                value={tipoVaga}
                onChange={(e) => setTipoVaga(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Comprimento máximo (pés)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={comprimentoMaximoPes}
                onChange={(e) => setComprimentoMaximoPes(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[11px] font-semibold text-slate-700">Estrutura disponível</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Ex.: água, luz, banheiro, segurança 24h..."
              value={estruturaDisponivel}
              onChange={(e) => setEstruturaDisponivel(e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* VALOR */}
      <Card title="Valor" subtitle="Se for passeio, você pode colocar “a partir de…” também.">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700">Preço (R$)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Ex.: R$ 250.000, R$ 800 / passeio..."
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </Card>

      {/* FOTOS */}
      <Card title="Fotos" subtitle="Até 8 imagens. Capricha na primeira, ela vira a capa do anúncio.">
        <label className="block text-[11px] font-semibold text-slate-700">
          Enviar fotos (upload) – até 8 imagens
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleArquivosChange}
          className="mt-2 w-full text-xs"
        />

        {arquivos.length > 0 && (
          <>
            <p className="mt-2 text-[11px] text-slate-500">{arquivos.length} arquivo(s) selecionado(s).</p>
            <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
              {previews.map((src, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* VÍDEO */}
      <Card title="Vídeo (opcional)" subtitle="Somente links do YouTube (youtube.com ou youtu.be).">
        <label className="block text-[11px] font-semibold text-slate-700">URL do vídeo</label>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Cole aqui o link do vídeo no YouTube (se tiver)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </Card>

      {/* CONTATO */}
      <Card title="Dados de contato" subtitle="Pelo menos um canal (WhatsApp, telefone ou e-mail).">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Nome de contato</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Nome do proprietário ou empresa"
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
          className="mt-4 w-full rounded-full bg-sky-600 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? "Enviando anúncio..." : "Publicar anúncio em Náutica"}
        </button>
      </div>
    </form>
  );
}
