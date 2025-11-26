"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioNautica() {
  const router = useRouter();

  // CAMPOS BÁSICOS
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [pontoEmbarque, setPontoEmbarque] = useState("");

  // CATEGORIAS
  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");

  // PREÇO
  const [preco, setPreco] = useState("");

  // FOTOS
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // VIDEO
  const [videoUrl, setVideoUrl] = useState("");

  // CONTATO
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // CAMPOS TÉCNICOS PROFISSIONAIS
  const [marcaEmbarcacao, setMarcaEmbarcacao] = useState("");
  const [modeloEmbarcacao, setModeloEmbarcacao] = useState("");
  const [anoEmbarcacao, setAnoEmbarcacao] = useState("");
  const [comprimentoPes, setComprimentoPes] = useState("");
  const [materialCasco, setMaterialCasco] = useState("");

  // MOTOR
  const [marcaMotor, setMarcaMotor] = useState("");
  const [potenciaMotorHp, setPotenciaMotorHp] = useState("");
  const [qtdMotores, setQtdMotores] = useState("");
  const [horasMotor, setHorasMotor] = useState("");
  const [combustivel, setCombustivel] = useState("");

  // CAPACIDADE / INTERIOR
  const [capacidadePessoas, setCapacidadePessoas] = useState("");
  const [qtdCabines, setQtdCabines] = useState("");
  const [qtdBanheiros, setQtdBanheiros] = useState("");

  // DOCUMENTAÇÃO
  const [registroCapitania, setRegistroCapitania] = useState("");
  const [documentacaoEmDia, setDocumentacaoEmDia] = useState("");

  // PASSEIOS
  const [tipoPasseio, setTipoPasseio] = useState("");
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [valorPessoa, setValorPessoa] = useState("");
  const [valorFechado, setValorFechado] = useState("");
  const [itensInclusos, setItensInclusos] = useState("");

  // VAGA EM MARINA
  const [tipoVaga, setTipoVaga] = useState("");
  const [comprimentoMaxPes, setComprimentoMaxPes] = useState("");
  const [estruturaDisponivel, setEstruturaDisponivel] = useState("");

  // TERMOS
  const [aceitoTermos, setAceitoTermos] = useState(false);

  // MENSAGENS
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // LISTAS
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

  const finalidades = [
    "venda",
    "passeio",
    "aluguel",
    "servico",
    "vaga_marina",
  ];

  // LOGIN
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8));
  };

  // ENVIO
  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe ao menos um meio de contato.");
      return;
    }

    // UPLOAD
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

            const { data } = supabase.storage
              .from("anuncios")
              .getPublicUrl(filePath);

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
    }

    const imagens = urlsUpload;

    // INSERT
    const { error } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: "nautica",
      titulo,
      descricao,

      cidade,
      bairro,
      ponto_embarque: pontoEmbarque,

      preco,
      video_url: videoUrl,
      imagens,
      contato: contatoPrincipal,

      subcategoria_nautica: subcategoria,
      finalidade_nautica: finalidade,

      // CAMPOS TÉCNICOS
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

      registro_capitania: registroCapitania,
      documentacao_em_dia: documentacaoEmDia,

      tipo_passeio: tipoPasseio,
      duracao_passeio: duracaoPasseio,
      valor_passeio_pessoa: valorPessoa,
      valor_passeio_fechado: valorFechado,
      itens_inclusos: itensInclusos,

      tipo_vaga: tipoVaga,
      comprimento_maximo_pes: comprimentoMaxPes,
      estrutura_disponivel: estruturaDisponivel,

      nome_contato: nomeContato,
      telefone,
      whatsapp,
      email,

      status: "ativo",
      destaque: false,
    });

    if (error) {
      console.error(error);
      setErro("Erro ao salvar anúncio. Verifique os campos.");
      return;
    }

    setSucesso("Seu anúncio foi publicado com sucesso!");

    setTimeout(() => {
      router.push("/painel/meus-anuncios");
    }, 2000);
  };

  // COMPONENTE DE BLOCO
  const Bloco = ({ titulo, children }) => (
    <div className="space-y-4 border-t border-slate-200 pt-4">
      <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
      {children}
    </div>
  );

  return (
    <form onSubmit={enviarAnuncio} className="space-y-8 text-xs md:text-sm">

      {erro && (
        <p className="text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-2">
          {sucesso}
        </p>
      )}

      {/* BÁSICO */}
      <Bloco titulo="Tipo de anúncio náutico">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-slate-700">Subcategoria *</label>
            <select
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Selecione...</option>
              {subcategoriasNautica.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700">Finalidade *</label>
            <select
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Selecione...</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="passeio">Passeio turístico</option>
              <option value="servico">Serviço náutico</option>
              <option value="vaga_marina">Vaga em marina</option>
            </select>
          </div>

        </div>
      </Bloco>

      {/* IDENTIFICAÇÃO BÁSICA */}
      <Bloco titulo="Identificação da embarcação / serviço">
        <label className="block text-slate-700">Título *</label>
        <input
          className="w-full rounded-lg border px-3 py-2 mt-1"
          placeholder="Ex: Lancha FS 305 com 2 motores Mercury"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <label className="block text-slate-700">Descrição *</label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 mt-1 h-28"
          placeholder="Descreva todos os detalhes importantes..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </Bloco>

      {/* CAMPOS PROFISSIONAIS — APARECEM SE FOR VENDA */}
      {finalidade === "venda" && (
        <Bloco titulo="Detalhes da embarcação (Venda)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="form" placeholder="Marca" value={marcaEmbarcacao} onChange={(e)=>setMarcaEmbarcacao(e.target.value)} />
            <input className="form" placeholder="Modelo" value={modeloEmbarcacao} onChange={(e)=>setModeloEmbarcacao(e.target.value)} />
            <input className="form" placeholder="Ano" value={anoEmbarcacao} onChange={(e)=>setAnoEmbarcacao(e.target.value)} />
            <input className="form" placeholder="Comprimento (pés)" value={comprimentoPes} onChange={(e)=>setComprimentoPes(e.target.value)} />
            <input className="form" placeholder="Material do casco" value={materialCasco} onChange={(e)=>setMaterialCasco(e.target.value)} />
          </div>

          <h3 className="font-medium mt-4">Motorização</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="form" placeholder="Marca do motor" value={marcaMotor} onChange={(e)=>setMarcaMotor(e.target.value)} />
            <input className="form" placeholder="Potência (HP)" value={potenciaMotorHp} onChange={(e)=>setPotenciaMotorHp(e.target.value)} />
            <input className="form" placeholder="Quantidade de motores" value={qtdMotores} onChange={(e)=>setQtdMotores(e.target.value)} />
            <input className="form" placeholder="Horas de motor" value={horasMotor} onChange={(e)=>setHorasMotor(e.target.value)} />
            <input className="form" placeholder="Combustível" value={combustivel} onChange={(e)=>setCombustivel(e.target.value)} />
          </div>

          <h3 className="font-medium mt-4">Capacidade / Interior</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="form" placeholder="Pessoas" value={capacidadePessoas} onChange={(e)=>setCapacidadePessoas(e.target.value)} />
            <input className="form" placeholder="Cabines" value={qtdCabines} onChange={(e)=>setQtdCabines(e.target.value)} />
            <input className="form" placeholder="Banheiros" value={qtdBanheiros} onChange={(e)=>setQtdBanheiros(e.target.value)} />
          </div>

          <h3 className="font-medium mt-4">Documentação</h3>
          <input className="form" placeholder="Registro na Capitania" value={registroCapitania} onChange={(e)=>setRegistroCapitania(e.target.value)} />
          <input className="form mt-2" placeholder="Documentação em dia (sim/não)" value={documentacaoEmDia} onChange={(e)=>setDocumentacaoEmDia(e.target.value)} />
        </Bloco>
      )}

      {/* PASSEIOS */}
      {finalidade === "passeio" && (
        <Bloco titulo="Informações para Passeio Turístico">
          <input className="form" placeholder="Tipo de passeio (escuna, exclusivo...)" value={tipoPasseio} onChange={(e)=>setTipoPasseio(e.target.value)} />
          <input className="form mt-2" placeholder="Duração (horas)" value={duracaoPasseio} onChange={(e)=>setDuracaoPasseio(e.target.value)} />
          <input className="form mt-2" placeholder="Valor por pessoa" value={valorPessoa} onChange={(e)=>setValorPessoa(e.target.value)} />
          <input className="form mt-2" placeholder="Valor passeio fechado" value={valorFechado} onChange={(e)=>setValorFechado(e.target.value)} />
          <textarea className="form mt-2 h-24" placeholder="Itens inclusos (bebidas, equipamentos...)" value={itensInclusos} onChange={(e)=>setItensInclusos(e.target.value)} />
        </Bloco>
      )}

      {/* ALUGUEL */}
      {finalidade === "aluguel" && (
        <Bloco titulo="Informações para Aluguel">
          <textarea className="form h-24" placeholder="Regras, capacidade, horários..." value={itensInclusos} onChange={(e)=>setItensInclusos(e.target.value)} />
        </Bloco>
      )}

      {/* SERVIÇO NÁUTICO */}
      {finalidade === "servico" && (
        <Bloco titulo="Informações do Serviço Náutico">
          <textarea className="form h-24" placeholder="Descreva o serviço oferecido..." value={itensInclusos} onChange={(e)=>setItensInclusos(e.target.value)} />
        </Bloco>
      )}

      {/* VAGA EM MARINA */}
      {finalidade === "vaga_marina" && (
        <Bloco titulo="Informações da Vaga em Marina / Guardaria">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="form" placeholder="Tipo de vaga (seca, molhada)" value={tipoVaga} onChange={(e)=>setTipoVaga(e.target.value)} />
            <input className="form" placeholder="Comprimento máximo (pés)" value={comprimentoMaxPes} onChange={(e)=>setComprimentoMaxPes(e.target.value)} />
          </div>
          <textarea className="form h-24 mt-3" placeholder="Estrutura disponível (banheiro, água, luz...)" value={estruturaDisponivel} onChange={(e)=>setEstruturaDisponivel(e.target.value)} />
        </Bloco>
      )}

      {/* LOCAL */}
      <Bloco titulo="Localização / Embarque">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="form" value={cidade} onChange={(e)=>setCidade(e.target.value)}>
            <option value="">Cidade *</option>
            {cidades.map((c)=> <option key={c}>{c}</option>)}
          </select>

          <input className="form" placeholder="Bairro" value={bairro} onChange={(e)=>setBairro(e.target.value)} />
        </div>

        <input className="form mt-2" placeholder="Ponto de embarque (opcional)" value={pontoEmbarque} onChange={(e)=>setPontoEmbarque(e.target.value)} />
      </Bloco>

      {/* VALOR */}
      <Bloco titulo="Valor">
        <input className="form" placeholder="Preço (ex: R$ 250.000 ou R$ 150 por pessoa)" value={preco} onChange={(e)=>setPreco(e.target.value)} />
      </Bloco>

      {/* FOTOS */}
      <Bloco titulo="Fotos">
        <input type="file" multiple accept="image/*" onChange={handleArquivosChange} />
        {arquivos.length > 0 && (
          <p className="text-xs text-slate-500 mt-1">{arquivos.length} foto(s) selecionada(s)</p>
        )}
      </Bloco>

      {/* VÍDEO */}
      <Bloco titulo="Vídeo (YouTube)">
        <input className="form" placeholder="Link do vídeo" value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)} />
      </Bloco>

      {/* CONTATO */}
      <Bloco titulo="Contato">
        <input className="form" placeholder="Nome para contato" value={nomeContato} onChange={(e)=>setNomeContato(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <input className="form" placeholder="Telefone" value={telefone} onChange={(e)=>setTelefone(e.target.value)} />
          <input className="form" placeholder="WhatsApp" value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} />
        </div>
        <input className="form mt-2" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} />
      </Bloco>

      {/* TERMOS */}
      <label className="flex items-start gap-2 border-t pt-4 text-xs text-slate-600">
        <input type="checkbox" checked={aceitoTermos} onChange={(e)=>setAceitoTermos(e.target.checked)} />
        <span>
          Declaro que as informações são verdadeiras e estou de acordo com os
          <a href="/termos-de-uso" className="text-sky-700 underline ml-1" target="_blank">Termos de Uso</a>.
        </span>
      </label>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-full py-3 font-semibold"
      >
        {uploading ? "Enviando anúncio..." : "Publicar anúncio"}
      </button>
    </form>
  );
}
