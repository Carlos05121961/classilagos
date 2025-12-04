"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioNautica() {
  const router = useRouter();

  // Campos principais
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Tipo de anúncio
  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");

  // Dados da embarcação
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [material, setMaterial] = useState("");

  // Motor
  const [marcaMotor, setMarcaMotor] = useState("");
  const [potenciaMotor, setPotenciaMotor] = useState("");
  const [qtdMotores, setQtdMotores] = useState("");
  const [horasMotor, setHorasMotor] = useState("");

  // Capacidade
  const [capacidade, setCapacidade] = useState("");
  const [cabines, setCabines] = useState("");
  const [banheiros, setBanheiros] = useState("");

  // Passeio
  const [tipoPasseio, setTipoPasseio] = useState("");
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [valorPessoa, setValorPessoa] = useState("");
  const [valorFechado, setValorFechado] = useState("");
  const [itensInclusos, setItensInclusos] = useState("");

  // Vaga marina
  const [tipoVaga, setTipoVaga] = useState("");
  const [comprimentoMaximo, setComprimentoMaximo] = useState("");
  const [estrutura, setEstrutura] = useState("");

  // Fotos
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
    "Passeio turístico",
    "Outros",
  ];

  const finalidadesNautica = ["Venda", "Aluguel", "Passeio", "Serviço", "Vaga em marina"];

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

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;

    if (!contatoPrincipal) {
      setErro("Informe pelo menos um contato.");
      return;
    }

    if (!finalidade || !subcategoria) {
      setErro("Selecione finalidade e subcategoria.");
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
      setErro("Erro ao enviar imagens.");
      return;
    } finally {
      setUploading(false);
    }

    const imagens = urlsUpload;

    const { data, error } = await supabase
      .from("anuncios")
      .insert({
        user_id: user.id,
        categoria: "nautica",

        titulo,
        descricao,

        cidade,
        bairro,

        subcategoria,
        finalidade: finalidade.toLowerCase(),

        marca_embarcacao: marca,
        modelo_embarcacao: modelo,
        ano_embarcacao: ano,
        comprimento_pes: comprimento,
        material_casco: material,

        marca_motor: marcaMotor,
        potencia_motor_hp: potenciaMotor,
        qtd_motores: qtdMotores,
        horas_motor: horasMotor,

        capacidade_pessoas: capacidade,
        qtd_cabines: cabines,
        qtd_banheiros: banheiros,

        tipo_passeio: tipoPasseio,
        duracao_passeio: duracaoPasseio,
        valor_passeio_pessoa: valorPessoa,
        valor_passeio_fechado: valorFechado,
        itens_inclusos: itensInclusos,

        tipo_vaga: tipoVaga,
        comprimento_maximo_pes: comprimentoMaximo,
        estrutura_disponivel: estrutura,

        imagens,
        video_url: videoUrl,

        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
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

    setSucesso("Anúncio enviado! Redirecionando…");

    setTimeout(() => {
      router.push(`/anuncios/${data.id}`);
    }, 1500);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6 text-xs md:text-sm">

      {erro && (
        <p className="text-red-600 text-xs border border-red-200 bg-red-50 rounded px-3 py-2">{erro}</p>
      )}
      {sucesso && (
        <p className="text-green-600 text-xs border border-green-200 bg-green-50 rounded px-3 py-2">{sucesso}</p>
      )}

      {/* TIPO */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-900">Tipo do anúncio</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700">Subcategoria *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {subcategoriasNautica.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700">Finalidade *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {finalidadesNautica.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* INFOS PRINCIPAIS */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Informações principais</h2>

        <div>
          <label className="text-[11px] font-medium text-slate-700">Título *</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-700">Descrição *</label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 h-28"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </div>

      {/* LOCALIZAÇÃO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700">Cidade *</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {cidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700">Bairro</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* DETALHES EMBARCAÇÃO */}
      {(finalidade === "Venda" || finalidade === "Aluguel") && (
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Detalhes da embarcação</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-slate-700">Marca</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" value={marca} onChange={(e) => setMarca(e.target.value)} />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700">Modelo</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" value={modelo} onChange={(e) => setModelo(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input placeholder="Ano" className="border rounded-lg px-3 py-2" value={ano} onChange={(e) => setAno(e.target.value)} />
          <input placeholder="Comprimento (pés)" className="border rounded-lg px-3 py-2" value={comprimento} onChange={(e) => setComprimento(e.target.value)} />
          <input placeholder="Material do casco" className="border rounded-lg px-3 py-2" value={material} onChange={(e) => setMaterial(e.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input placeholder="Marca do motor" className="border rounded-lg px-3 py-2" value={marcaMotor} onChange={(e) => setMarcaMotor(e.target.value)} />
          <input placeholder="Potência total (HP)" className="border rounded-lg px-3 py-2" value={potenciaMotor} onChange={(e) => setPotenciaMotor(e.target.value)} />
          <input placeholder="Qtde. de motores" className="border rounded-lg px-3 py-2" value={qtdMotores} onChange={(e) => setQtdMotores(e.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input placeholder="Horas de motor" className="border rounded-lg px-3 py-2" value={horasMotor} onChange={(e) => setHorasMotor(e.target.value)} />
          <input placeholder="Capacidade (pessoas)" className="border rounded-lg px-3 py-2" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
          <input placeholder="Cabines" className="border rounded-lg px-3 py-2" value={cabines} onChange={(e) => setCabines(e.target.value)} />
        </div>

        <input placeholder="Banheiros" className="border rounded-lg px-3 py-2" value={banheiros} onChange={(e) => setBanheiros(e.target.value)} />
      </div>
      )}

      {/* PASSEIO */}
      {finalidade === "Passeio" && (
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Informações do passeio</h2>

        <input placeholder="Tipo de passeio" className="border rounded-lg px-3 py-2" value={tipoPasseio} onChange={(e) => setTipoPasseio(e.target.value)} />

        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Duração" className="border rounded-lg px-3 py-2" value={duracaoPasseio} onChange={(e) => setDuracaoPasseio(e.target.value)} />
          <input placeholder="Valor por pessoa" className="border rounded-lg px-3 py-2" value={valorPessoa} onChange={(e) => setValorPessoa(e.target.value)} />
        </div>

        <input placeholder="Valor passeio fechado" className="border rounded-lg px-3 py-2" value={valorFechado} onChange={(e) => setValorFechado(e.target.value)} />

        <textarea placeholder="Itens inclusos" className="border rounded-lg px-3 py-2 h-24" value={itensInclusos} onChange={(e) => setItensInclusos(e.target.value)} />
      </div>
      )}

      {/* VAGA MARINA */}
      {finalidade === "Vaga em marina" && (
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Vaga em marina / guardaria</h2>

        <input placeholder="Tipo de vaga" className="border rounded-lg px-3 py-2" value={tipoVaga} onChange={(e) => setTipoVaga(e.target.value)} />

        <input placeholder="Comprimento máximo (pés)" className="border rounded-lg px-3 py-2" value={comprimentoMaximo} onChange={(e) => setComprimentoMaximo(e.target.value)} />

        <textarea placeholder="Estrutura disponível" className="border rounded-lg px-3 py-2 h-24" value={estrutura} onChange={(e) => setEstrutura(e.target.value)} />
      </div>
      )}

      {/* FOTOS */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Fotos</h2>

        <input type="file" multiple onChange={handleArquivosChange} className="text-xs" />

        {arquivos.length > 0 && (
          <p className="text-[11px] text-slate-500">{arquivos.length} arquivo(s) selecionado(s)</p>
        )}
      </div>

      {/* VÍDEO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Vídeo (opcional)</h2>

        <input
          type="text"
          placeholder="URL do vídeo"
          className="border rounded-lg px-3 py-2 w-full"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      {/* CONTATO */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="font-semibold text-slate-900">Contato</h2>

        <input placeholder="Nome do responsável" className="border rounded-lg px-3 py-2 w-full" value={nomeContato} onChange={(e) => setNomeContato(e.target.value)} />

        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Telefone" className="border rounded-lg px-3 py-2" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <input placeholder="WhatsApp" className="border rounded-lg px-3 py-2" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>

        <input placeholder="E-mail" className="border rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {/* TERMOS */}
      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
          <input type="checkbox" className="mt-0.5" checked={aceitoTermos} onChange={(e) => setAceitoTermos(e.target.checked)} />
          <span>
            Declaro que as informações são verdadeiras e estou de acordo com os{" "}
            <a href="/termos-de-uso" className="text-cyan-700 underline">Termos de Uso</a>.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-sky-600 text-white rounded-full py-3 font-semibold hover:bg-sky-700 transition"
      >
        {uploading ? "Enviando anúncio..." : "Publicar anúncio em Náutica"}
      </button>
    </form>
  );
}

