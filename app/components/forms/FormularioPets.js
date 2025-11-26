"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioPets() {
  const router = useRouter();

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // Subcategoria simples (Lista B)
  const [subcategoria, setSubcategoria] = useState(""); // Animais / Acessórios / Serviços pet

  // Para animais
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [vacinado, setVacinado] = useState("nao");
  const [castrado, setCastrado] = useState("nao");

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

  const subcategoriasPets = ["Animais", "Acessórios", "Serviços pet"];

  const especies = ["Cachorro", "Gato", "Ave", "Peixe", "Roedor", "Outros"];

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

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    if (!subcategoria) {
      setErro("Selecione o tipo de anúncio (Animais, Acessórios ou Serviços).");
      return;
    }

    if (!aceitoTermos) {
      setErro(
        "Para publicar o anúncio, você precisa aceitar os termos de responsabilidade."
      );
      return;
    }

    // Upload
    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const bucketName = "anuncios";

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}-pets-${index}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from(bucketName)
              .upload(filePath, file);

            if (uploadError) throw uploadError;

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
      setErro("Erro ao enviar as imagens. Tente novamente em instantes.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    const imagens = urlsUpload;

    // Para simplificar, vamos armazenar as infos de pet dentro da descrição extra
    const descricaoCompleta =
      subcategoria === "Animais"
        ? `${descricao}\n\nEspécie: ${especie || "-"} | Raça: ${
            raca || "-"
          } | Idade: ${idade || "-"} | Sexo: ${
            sexo || "-"
          } | Vacinado: ${vacinado} | Castrado: ${castrado}`
        : descricao;

    const { error } = await supabase.from("anuncios").insert({
      user_id: user.id,
      categoria: "pets",
      titulo,
      descricao: descricaoCompleta,
      cidade,
      bairro,
      preco,
      imagens,
      video_url: videoUrl,
      telefone,
      whatsapp,
      email,
      contato: contatoPrincipal,
      tipo_imovel: subcategoria, // aqui usamos tipo_imovel como "tipo do anúncio pets"
      nome_contato: nomeContato,
      status: "ativo",
      destaque: false,
    });

    if (error) {
      console.error(error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    setSucesso("Anúncio de pets enviado com sucesso!");

    // Limpa
    setTitulo("");
    setDescricao("");
    setCidade("");
    setBairro("");
    setSubcategoria("");
    setEspecie("");
    setRaca("");
    setIdade("");
    setSexo("");
    setVacinado("nao");
    setCastrado("nao");
    setPreco("");
    setArquivos([]);
    setVideoUrl("");
    setNomeContato("");
    setTelefone("");
    setWhatsapp("");
    setEmail("");
    setAceitoTermos(false);

    setTimeout(() => {
      router.push("/painel/meus-anuncios");
    }, 2000);
  };

  const Bloco = ({ titulo, children }) => (
    <div className="space-y-3 border-t border-slate-200 pt-4">
      <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
      {children}
    </div>
  );

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6 text-xs md:text-sm">
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

      {/* Tipo de anúncio */}
      <Bloco titulo="Tipo de anúncio para pets">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-700">
              Categoria *
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {subcategoriasPets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {subcategoria === "Animais" && (
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Espécie
              </label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
              >
                <option value="">Selecione...</option>
                {especies.map((e1) => (
                  <option key={e1} value={e1}>
                    {e1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Bloco>

      {/* Dados do animal (se for animais) */}
      {subcategoria === "Animais" && (
        <Bloco titulo="Informações do animal">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Raça
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Idade
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Ex.: 3 meses, 2 anos"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Sexo
              </label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Vacinado?
              </label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={vacinado}
                onChange={(e) => setVacinado(e.target.value)}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700">
                Castrado?
              </label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={castrado}
                onChange={(e) => setCastrado(e.target.value)}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
          </div>
        </Bloco>
      )}

      {/* Título e descrição */}
      <Bloco titulo="Informações do anúncio">
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Filhotes de cachorro SRD para adoção"
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
            placeholder="Descreva o animal, produto ou serviço com detalhes honestos."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
      </Bloco>

      {/* Localização */}
      <Bloco titulo="Localização">
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
              Bairro / Região
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Ex.: Centro, Itaipuaçu..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
      </Bloco>

      {/* Valor */}
      <Bloco titulo="Valor">
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Preço (R$)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder={
              subcategoria === "Animais"
                ? "Ex.: taxa simbólica, R$ 300,00 etc."
                : "Ex.: R$ 80,00 o banho, R$ 50,00 o produto..."
            }
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </Bloco>

      {/* Fotos */}
      <Bloco titulo="Fotos">
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
          <p className="mt-1 text-[11px] text-slate-500">
            Formatos recomendados: JPG ou PNG, até 2MB cada.
          </p>
        </div>
      </Bloco>

      {/* Vídeo */}
      <Bloco titulo="Vídeo (opcional)">
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            URL do vídeo (YouTube)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Se tiver, cole aqui o link de um vídeo"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </Bloco>

      {/* Contato */}
      <Bloco titulo="Dados de contato">
        <div>
          <label className="block text-[11px] font-medium text-slate-700">
            Nome para contato
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Seu nome ou nome da empresa"
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

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será
          exibido para as pessoas entrarem em contato com você.
        </p>
      </Bloco>

      {/* Termos */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
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
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Enviando anúncio..." : "Publicar anúncio de pets"}
      </button>
    </form>
  );
}
