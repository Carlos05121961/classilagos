"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { syncUserMetadataFromForm } from "../../../lib/syncUserMetadata";

function parseNumberOrNull(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

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

function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-sm md:text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-[11px] md:text-xs text-slate-600">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function FormularioNautica() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [pontoEmbarque, setPontoEmbarque] = useState("");

  const [subcategoria, setSubcategoria] = useState("");
  const [finalidade, setFinalidade] = useState("");

  const [marcaEmbarcacao, setMarcaEmbarcacao] = useState("");
  const [modeloEmbarcacao, setModeloEmbarcacao] = useState("");
  const [anoEmbarcacao, setAnoEmbarcacao] = useState("");
  const [comprimentoPes, setComprimentoPes] = useState("");
  const [materialCasco, setMaterialCasco] = useState("");

  const [marcaMotor, setMarcaMotor] = useState("");
  const [potenciaMotorHp, setPotenciaMotorHp] = useState("");
  const [qtdMotores, setQtdMotores] = useState("");
  const [horasMotor, setHorasMotor] = useState("");
  const [combustivel, setCombustivel] = useState("");

  const [capacidadePessoas, setCapacidadePessoas] = useState("");
  const [qtdCabines, setQtdCabines] = useState("");
  const [qtdBanheiros, setQtdBanheiros] = useState("");

  const [tipoPasseio, setTipoPasseio] = useState("");
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [valorPessoa, setValorPessoa] = useState("");
  const [valorFechado, setValorFechado] = useState("");
  const [itensInclusos, setItensInclusos] = useState("");

  const [tipoVaga, setTipoVaga] = useState("");
  const [comprimentoMaximoPes, setComprimentoMaximoPes] = useState("");
  const [estruturaDisponivel, setEstruturaDisponivel] = useState("");

  const [preco, setPreco] = useState("");

  const [capaArquivo, setCapaArquivo] = useState(null);
  const [galeriaArquivos, setGaleriaArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");

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

  const handleCapaChange = (e) => {
    const file = e.target.files?.[0] || null;
    setCapaArquivo(file);
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGaleriaArquivos(files.slice(0, 7));
  };

  const capaPreview = useMemo(() => {
    if (!capaArquivo) return null;
    return URL.createObjectURL(capaArquivo);
  }, [capaArquivo]);

  const galeriaPreviews = useMemo(() => {
    if (!galeriaArquivos?.length) return [];
    return galeriaArquivos.map((f) => URL.createObjectURL(f));
  }, [galeriaArquivos]);

  useEffect(() => {
    return () => {
      if (capaPreview) URL.revokeObjectURL(capaPreview);
      galeriaPreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [capaPreview, galeriaPreviews]);

  async function uploadImagem({ bucket, path, file }) {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  }

  function validarAntesDeEnviar() {
    if (!subcategoria || !finalidade) {
      return "Selecione a subcategoria e a finalidade do anúncio.";
    }

    if (!titulo.trim() || !descricao.trim() || !cidade) {
      return "Preencha pelo menos título, descrição e cidade.";
    }

    if (!email.trim()) {
      return "Informe seu e-mail para publicar o anúncio.";
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      return "Informe ao menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!aceitoTermos) {
      return "Para publicar o anúncio, você precisa aceitar os termos de responsabilidade.";
    }

    if (!isValidYoutubeUrl(videoUrl)) {
      return "O link do vídeo precisa ser do YouTube (youtube.com ou youtu.be).";
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

    const qtdMotoresNumber = parseNumberOrNull(qtdMotores);
    const capacidadePessoasNumber = parseNumberOrNull(capacidadePessoas);
    const qtdCabinesNumber = parseNumberOrNull(qtdCabines);
    const qtdBanheirosNumber = parseNumberOrNull(qtdBanheiros);

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
          email,
          origem: "anuncio_nautica",
        });
      }

      const bucket = "anuncios";

      let capaUrl = null;
      const galeriaUrls = [];

      if (capaArquivo) {
        const ext = (capaArquivo.name.split(".").pop() || "jpg").toLowerCase();
        const path = `nautica/${ownerKey}/nautica-capa-${Date.now()}.${ext}`;
        capaUrl = await uploadImagem({ bucket, path, file: capaArquivo });
      }

      if (galeriaArquivos?.length) {
        for (let i = 0; i < galeriaArquivos.length; i++) {
          const file = galeriaArquivos[i];
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          const path = `nautica/${ownerKey}/nautica-galeria-${Date.now()}-${i}.${ext}`;
          const url = await uploadImagem({ bucket, path, file });
          if (url) galeriaUrls.push(url);
        }
      }

      let imagens = [];
      if (capaUrl && galeriaUrls.length) imagens = [capaUrl, ...galeriaUrls];
      else if (capaUrl && !galeriaUrls.length) imagens = [capaUrl];
      else if (!capaUrl && galeriaUrls.length) imagens = galeriaUrls;

      const descricaoFinal = `${descricao}

=== Informações complementares náuticas ===
Subcategoria: ${subcategoria || "-"}
Finalidade: ${finalidade || "-"}
Ponto de embarque: ${pontoEmbarque || "-"}
Marca da embarcação: ${marcaEmbarcacao || "-"}
Modelo da embarcação: ${modeloEmbarcacao || "-"}
Ano: ${anoEmbarcacao || "-"}
Comprimento (pés): ${comprimentoPes || "-"}
Material do casco: ${materialCasco || "-"}
Marca do motor: ${marcaMotor || "-"}
Potência do motor (HP): ${potenciaMotorHp || "-"}
Qtde. motores: ${qtdMotores || "-"}
Horas de motor: ${horasMotor || "-"}
Combustível: ${combustivel || "-"}
Capacidade de pessoas: ${capacidadePessoas || "-"}
Cabines: ${qtdCabines || "-"}
Banheiros: ${qtdBanheiros || "-"}
Tipo de passeio: ${tipoPasseio || "-"}
Duração do passeio: ${duracaoPasseio || "-"}
Valor por pessoa: ${valorPessoa || "-"}
Valor fechado: ${valorFechado || "-"}
Itens inclusos: ${itensInclusos || "-"}
Tipo de vaga: ${tipoVaga || "-"}
Comprimento máximo (pés): ${comprimentoMaximoPes || "-"}
Estrutura disponível: ${estruturaDisponivel || "-"}
`.trim();

      const { data, error } = await supabase
        .from("anuncios")
        .insert({
          user_id: user?.id || null,
          categoria: "nautica",
          titulo: titulo.trim(),
          descricao: descricaoFinal,
          cidade,
          bairro: bairro.trim(),
          ponto_embarque: pontoEmbarque.trim(),
          preco: preco.trim(),
          imagens,
          video_url: videoUrl.trim(),
          telefone: telefone.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          contato: contatoPrincipal,

          subcategoria_nautica: subcategoria,
          finalidade_nautica: finalidade,

          tipo_imovel: subcategoria,
          finalidade,

          marca_embarcacao: marcaEmbarcacao.trim(),
          modelo_embarcacao: modeloEmbarcacao.trim(),
          ano_embarcacao: anoEmbarcacao.trim(),
          comprimento_pes: comprimentoPes.trim(),
          material_casco: materialCasco.trim(),

          marca_motor: marcaMotor.trim(),
          potencia_motor_hp: potenciaMotorHp.trim(),
          qtd_motores: qtdMotoresNumber,
          horas_motor: horasMotor.trim(),
          combustivel: combustivel.trim(),

          capacidade_pessoas: capacidadePessoasNumber,
          qtd_cabines: qtdCabinesNumber,
          qtd_banheiros: qtdBanheirosNumber,

          tipo_passeio: tipoPasseio.trim(),
          duracao_passeio: duracaoPasseio.trim(),
          valor_passeio_pessoa: valorPessoa.trim(),
          valor_passeio_fechado: valorFechado.trim(),
          itens_inclusos: itensInclusos.trim(),

          tipo_vaga: tipoVaga.trim(),
          comprimento_maximo_pes: comprimentoMaximoPes.trim(),
          estrutura_disponivel: estruturaDisponivel.trim(),

          status: user ? "ativo" : "pendente",
          destaque: false,
          nome_contato: nomeContato.trim(),

          email_confirmado: !!user,
          email_confirmado_em: user ? new Date().toISOString() : null,
          criado_sem_login: !user,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Erro ao salvar anúncio de náutica:", error);
        setErro(`Erro ao salvar anúncio: ${error.message || "Tente novamente em instantes."}`);
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

          if (msg.includes("security purposes") || msg.includes("only request this after")) {
            setSucesso(
              "Seu anúncio náutico foi enviado com sucesso e está pendente. Aguarde cerca de 1 minuto e verifique seu e-mail para confirmar o cadastro."
            );
          } else {
            setSucesso(
              "Seu anúncio náutico foi enviado e está pendente. Houve um problema ao enviar o e-mail de confirmação agora. Tente entrar novamente mais tarde."
            );
          }

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${data.id}`
            );
          }, 1500);
        } else {
          setSucesso("Anúncio náutico enviado com sucesso! Redirecionando…");

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${data.id}`
            );
          }, 1500);
        }
      } else {
        setSucesso("Anúncio náutico enviado com sucesso! Redirecionando…");

        setTimeout(() => {
          router.push("/painel/meus-anuncios");
        }, 1200);
      }

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
      setCapaArquivo(null);
      setGaleriaArquivos([]);
      setVideoUrl("");
      setNomeContato("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setAceitoTermos(false);
    } catch (err) {
      console.error("Erro ao enviar anúncio náutico:", err);
      setErro(err?.message || "Erro ao salvar anúncio. Tente novamente.");
    } finally {
      setUploading(false);
    }
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

      <Card
        title="Fotos (capa + galeria) — no topo"
        subtitle="A capa vira a foto principal do card. A galeria são fotos extras."
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold text-slate-900">
                Foto de capa (recomendada)
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                Escolha a foto mais bonita da embarcação ou do serviço.
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleCapaChange}
                className="mt-3 w-full text-xs"
              />

              {capaPreview && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={capaPreview}
                    alt="Preview capa"
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}

              {capaArquivo && (
                <button
                  type="button"
                  onClick={() => setCapaArquivo(null)}
                  className="mt-2 text-xs font-semibold text-slate-700 underline"
                >
                  Remover capa
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold text-slate-900">
                Galeria (opcional) — até 7 fotos
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                Fotos extras: interior, motor, detalhes, passeio...
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGaleriaChange}
                className="mt-3 w-full text-xs"
              />

              <p className="mt-2 text-[11px] text-slate-500">
                Se der erro no upload: tente fotos menores (até ~2MB) e em JPG/PNG.
              </p>

              {galeriaPreviews.length > 0 && (
                <>
                  <p className="mt-3 text-[11px] text-slate-600">
                    {galeriaPreviews.length} foto(s) selecionada(s)
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {galeriaPreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={src}
                          alt={`Preview galeria ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setGaleriaArquivos([])}
                    className="mt-2 text-xs font-semibold text-slate-700 underline"
                  >
                    Limpar galeria
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Tipo de anúncio náutico"
        subtitle="Escolha a categoria e a finalidade para o formulário se adaptar."
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

      <Card
        title="Informações principais"
        subtitle="Título e descrição caprichados fazem o anúncio aparecer melhor."
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
          </div>
        </div>
      </Card>

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

      {finalidade === "vaga_marina" && (
        <Card title="Informações da vaga em marina / guardaria" subtitle="Quanto mais claro, menos perguntas.">
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

      <Card title="Vídeo (opcional)" subtitle="Somente links do YouTube.">
        <label className="block text-[11px] font-semibold text-slate-700">URL do vídeo</label>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Cole aqui o link do vídeo no YouTube"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </Card>

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
