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
  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");

  // Informações técnicas
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

  // Valor
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
    "Vaga em marina",
    "Serviços náuticos",
    "Peças e acessórios",
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
      setErro("Para publicar, você precisa aceitar os termos.");
      return;
    }

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
      console.error(err);
      setErro("Erro ao enviar as imagens.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    // Montagem do objeto (corrigido com null nos campos numéricos)
    const { error } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: "nautica",

      titulo,
      descricao,
      cidade,
      bairro,
      ponto_embarque: pontoEmbarque,

      preco: preco || null,

      imagens: urlsUpload,
      video_url: videoUrl,

      subcategoria_nautica: subcategoria,
      finalidade_nautica: finalidade,

      marca_embarcacao: marcaEmbarcacao,
      modelo_embarcacao: modeloEmbarcacao,
      ano_embarcacao: anoEmbarcacao || null,
      comprimento_pes: comprimentoPes || null,
      material_casco: materialCasco,

      marca_motor: marcaMotor,
      potencia_motor_hp: potenciaMotorHp || null,
      qtd_motores: qtdMotores || null,
      horas_motor: horasMotor || null,
      combustivel,

      capacidade_pessoas: capacidadePessoas || null,
      qtd_cabines: qtdCabines || null,
      qtd_banheiros: qtdBanheiros || null,

      tipo_passeio: tipoPasseio,
      duracao_passeio: duracaoPasseio,
      valor_passeio_pessoa: valorPessoa || null,
      valor_passeio_fechado: valorFechado || null,
      itens_inclusos: itensInclusos,

      tipo_vaga: tipoVaga,
      comprimento_maximo_pes: comprimentoMaximoPes || null,
      estrutura_disponivel: estruturaDisponivel,

      telefone,
      whatsapp,
      email,
      contato: contatoPrincipal,

      nome_contato: nomeContato,

      status: "ativo",
      destaque: false,
    });

    if (error) {
      console.error(error);
      setErro("Erro ao salvar anúncio. Verifique os campos.");
      return;
    }

    setSucesso("Anúncio náutico enviado com sucesso!");

    setTimeout(() => {
      router.push("/painel/meus-anuncios");
    }, 1800);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6 text-xs md:text-sm">

      {erro && (
        <p className="text-red-600 border px-3 py-2 bg-red-50 rounded-md">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="text-emerald-600 border px-3 py-2 bg-emerald-50 rounded-md">
          {sucesso}
        </p>
      )}

      {/* ====== TIPO ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Tipo de anúncio náutico</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium">Subcategoria *</label>
            <select
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2"
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
            <label className="text-[11px] font-medium">Finalidade *</label>
            <select
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2"
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

      {/* ====== TÍTULO / DESCRIÇÃO ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Informações principais</h2>

        <div>
          <label className="text-[11px] font-medium">Título *</label>
          <input
            type="text"
            autoComplete="off"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium">Descrição *</label>
          <textarea
            autoComplete="off"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 h-28"
          />
        </div>
      </div>

      {/* ====== LOCALIZAÇÃO ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium">Cidade *</label>
            <select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2"
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
            <label className="text-[11px] font-medium">Bairro</label>
            <input
              autoComplete="off"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium">Ponto de embarque</label>
          <input
            autoComplete="off"
            value={pontoEmbarque}
            onChange={(e) => setPontoEmbarque(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* ====== DETALHES ====== */}
      {(finalidade === "venda" || finalidade === "aluguel") && (
        <div className="space-y-3 border-t pt-4">
          <h2 className="text-sm font-semibold">Detalhes da embarcação</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium">Marca</label>
              <input
                autoComplete="off"
                value={marcaEmbarcacao}
                onChange={(e) => setMarcaEmbarcacao(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Modelo</label>
              <input
                autoComplete="off"
                value={modeloEmbarcacao}
                onChange={(e) => setModeloEmbarcacao(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-[11px] font-medium">Ano</label>
              <input
                type="number"
                autoComplete="off"
                value={anoEmbarcacao}
                onChange={(e) => setAnoEmbarcacao(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Comprimento (pés)</label>
              <input
                type="number"
                autoComplete="off"
                value={comprimentoPes}
                onChange={(e) => setComprimentoPes(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Material do casco</label>
              <input
                autoComplete="off"
                value={materialCasco}
                onChange={(e) => setMaterialCasco(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* MOTOR */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-[11px] font-medium">Marca do motor</label>
              <input
                autoComplete="off"
                value={marcaMotor}
                onChange={(e) => setMarcaMotor(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Potência (HP)</label>
              <input
                type="number"
                autoComplete="off"
                value={potenciaMotorHp}
                onChange={(e) => setPotenciaMotorHp(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Qtde. de motores</label>
              <input
                type="number"
                autoComplete="off"
                value={qtdMotores}
                onChange={(e) => setQtdMotores(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* OUTROS MOTOR */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-[11px] font-medium">Horas de motor</label>
              <input
                type="number"
                autoComplete="off"
                value={horasMotor}
                onChange={(e) => setHorasMotor(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Combustível</label>
              <input
                autoComplete="off"
                value={combustivel}
                onChange={(e) => setCombustivel(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Capacidade (pessoas)</label>
              <input
                type="number"
                autoComplete="off"
                value={capacidadePessoas}
                onChange={(e) => setCapacidadePessoas(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium">Cabines</label>
              <input
                type="number"
                autoComplete="off"
                value={qtdCabines}
                onChange={(e) => setQtdCabines(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Banheiros</label>
              <input
                type="number"
                autoComplete="off"
                value={qtdBanheiros}
                onChange={(e) => setQtdBanheiros(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* ====== PASSEIOS ====== */}
      {finalidade === "passeio" && (
        <div className="space-y-3 border-t pt-4">
          <h2 className="text-sm font-semibold">Informações do passeio</h2>

          <div>
            <label className="text-[11px] font-medium">Tipo de passeio</label>
            <input
              autoComplete="off"
              value={tipoPasseio}
              onChange={(e) => setTipoPasseio(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium">Duração</label>
              <input
                autoComplete="off"
                value={duracaoPasseio}
                onChange={(e) => setDuracaoPasseio(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">Valor por pessoa</label>
              <input
                type="number"
                autoComplete="off"
                value={valorPessoa}
                onChange={(e) => setValorPessoa(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium">Valor fechado</label>
            <input
              type="number"
              autoComplete="off"
              value={valorFechado}
              onChange={(e) => setValorFechado(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium">Itens inclusos</label>
            <textarea
              value={itensInclusos}
              onChange={(e) => setItensInclusos(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 h-24"
            />
          </div>
        </div>
      )}

      {/* ====== VAGA EM MARINA ====== */}
      {finalidade === "vaga_marina" && (
        <div className="space-y-3 border-t pt-4">
          <h2 className="text-sm font-semibold">Vaga em marina</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium">Tipo de vaga</label>
              <input
                autoComplete="off"
                value={tipoVaga}
                onChange={(e) => setTipoVaga(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium">
                Comprimento máximo (pés)
              </label>
              <input
                type="number"
                autoComplete="off"
                value={comprimentoMaximoPes}
                onChange={(e) => setComprimentoMaximoPes(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium">Estrutura disponível</label>
            <textarea
              value={estruturaDisponivel}
              onChange={(e) => setEstruturaDisponivel(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 h-24"
            />
          </div>
        </div>
      )}

      {/* ====== VALOR ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Valor</h2>

        <label className="text-[11px] font-medium">Preço</label>
        <input
          type="number"
          autoComplete="off"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ====== FOTOS ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Fotos</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleArquivosChange}
          className="mt-1 w-full text-xs"
        />
      </div>

      {/* ====== VIDEO ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Vídeo (opcional)</h2>
        <input
          type="text"
          autoComplete="off"
          placeholder="URL do vídeo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ====== CONTATO ====== */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Contato</h2>

        <label className="text-[11px] font-medium">Nome</label>
        <input
          autoComplete="off"
          value={nomeContato}
          onChange={(e) => setNomeContato(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium">Telefone</label>
            <input
              autoComplete="off"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium">WhatsApp</label>
            <input
              autoComplete="off"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <label className="text-[11px] font-medium">E-mail</label>
        <input
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* ====== TERMOS ====== */}
      <div className="space-y-2 border-t pt-4">
        <label className="flex gap-2 text-[11px]">
          <input
            type="checkbox"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações são verdadeiras e aceito os{" "}
            <a className="text-cyan-700 underline" href="/termos-de-uso" target="_blank">
              termos de uso
            </a>.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-sky-600 text-white rounded-full py-3 text-sm font-semibold"
      >
        {uploading ? "Enviando..." : "Publicar anúncio em Náutica"}
      </button>
    </form>
  );
}
