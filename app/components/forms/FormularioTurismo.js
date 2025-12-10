"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioTurismo() {
  const router = useRouter();

  // CAMPOS PRINCIPAIS
  const [titulo, setTitulo] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [tipoLugar, setTipoLugar] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [descricao, setDescricao] = useState("");

  // PREÇO / INFO TURISMO
  const [faixaPreco, setFaixaPreco] = useState("");

  // CAMPOS ESPECIAIS PARA PASSEIOS / AVENTURA
  const [tipoPasseio, setTipoPasseio] = useState("");
  const [duracaoPasseio, setDuracaoPasseio] = useState("");
  const [valorPasseioPessoa, setValorPasseioPessoa] = useState("");
  const [valorPasseioFechado, setValorPasseioFechado] = useState("");
  const [pontoEmbarque, setPontoEmbarque] = useState("");
  const [itensInclusos, setItensInclusos] = useState("");

  // CONTATO / RESPONSÁVEL
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // LINKS EXTRA
  const [site, setSite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  // FOTOS
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ESTADOS
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);

  // LOGIN
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

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

  //--------------------------------------------
  // ⚙️ MAPEAR TIPO PARA PILAR E SUBCATEGORIA
  //--------------------------------------------
  function mapearPilarESubcategoria(tipo) {
    switch (tipo) {
      // 🏨 ONDE FICAR
      case "Pousada / Hotel / Hostel":
        return { pilar: "onde_ficar", sub: "pousada_hotel_hostel" };

      case "Casa / apartamento de temporada":
        return { pilar: "onde_ficar", sub: "temporada" };

      case "Camping / motorhome":
        return { pilar: "onde_ficar", sub: "camping_motorhome" };

      // 🍽️ ONDE COMER
      case "Bar / Restaurante / Quiosque":
        return { pilar: "onde_comer", sub: "bar_restaurante_quiosque" };

      // 🚤 ONDE PASSEAR
      case "Passeio de barco / escuna":
        return { pilar: "onde_passear", sub: "passeio_escuna" };

      case "Passeio de lancha":
        return { pilar: "onde_passear", sub: "passeio_lancha" };

      case "Passeio de jet-ski":
        return { pilar: "onde_passear", sub: "passeio_jetski" };

      case "Banana boat":
        return { pilar: "onde_passear", sub: "banana_boat" };

      case "Táxi lancha":
        return { pilar: "onde_passear", sub: "taxi_lancha" };

      case "City tour / passeios terrestres":
        return { pilar: "onde_passear", sub: "city_tour" };

      case "Passeio de quadriciclo / buggy":
        return { pilar: "onde_passear", sub: "quadriciclo_buggy" };

      case "Mergulho":
        return { pilar: "onde_passear", sub: "mergulho" };

      case "Trilha / ecoturismo":
        return { pilar: "onde_passear", sub: "trilha_ecoturismo" };

      case "Guias de turismo":
        return { pilar: "onde_passear", sub: "guia_turistico" };

      case "Agência de turismo / viagens":
        return { pilar: "onde_passear", sub: "agencia_turismo" };

      case "Outros serviços de turismo":
        return { pilar: "onde_passear", sub: "outros_servicos" };

      // 🎉 ONDE SE DIVERTIR
      case "Produtos turísticos / lembranças":
        return { pilar: "onde_se_divertir", sub: "produtos_turisticos" };

      default:
        return { pilar: null, sub: null };
    }
  }

  //--------------------------------------------
  // EXIBIR CAMPOS ESPECIAIS PARA PASSEIOS
  //--------------------------------------------
  const tiposPasseio = [
    "Passeio de barco / escuna",
    "Passeio de lancha",
    "Passeio de jet-ski",
    "Banana boat",
    "Táxi lancha",
    "City tour / passeios terrestres",
    "Passeio de quadriciclo / buggy",
    "Mergulho",
    "Trilha / ecoturismo",
  ];
  const exibirBlocoPasseios = tiposPasseio.includes(tipoLugar);

  //--------------------------------------------
  // UPLOAD DE FOTOS
  //--------------------------------------------
  const handleArquivosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setArquivos(files.slice(0, 8));
  };

  //--------------------------------------------
  // ENVIAR FORMULÁRIO
  //--------------------------------------------
  async function enviarFormulario(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado.");
      router.push("/login");
      return;
    }

    if (!titulo || !cidade || !tipoLugar) {
      setErro("Preencha título, tipo de lugar e cidade.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe pelo menos um contato.");
      return;
    }

    if (!aceitoResponsabilidade) {
      setErro("Marque a declaração de responsabilidade.");
      return;
    }

    //--------------------------------------------
    // UPLOAD DAS IMAGENS
    //--------------------------------------------
    let urlsUpload = [];

    try {
      if (arquivos.length > 0) {
        setUploading(true);

        const uploads = await Promise.all(
          arquivos.map(async (file, index) => {
            const ext = file.name.split(".").pop();
            const path = `${user.id}/turismo-${Date.now()}-${index}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("anuncios")
              .upload(path, file);

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage
              .from("anuncios")
              .getPublicUrl(path);

            return publicData.publicUrl;
          })
        );

        urlsUpload = uploads;
      }

      //--------------------------------------------
      // MONTA DESCRIÇÃO FINAL
      //--------------------------------------------
      let descricaoFinal = descricao;
      descricaoFinal += `\n\nTipo de lugar: ${tipoLugar}`;
      if (site) descricaoFinal += `\nSite: ${site}`;
      if (instagram) descricaoFinal += `\nInstagram: ${instagram}`;
      if (facebook) descricaoFinal += `\nFacebook: ${facebook}`;

      //--------------------------------------------
      // MAPEAR PILAR E SUBCATEGORIA
      //--------------------------------------------
      const { pilar, sub } = mapearPilarESubcategoria(tipoLugar);

      //--------------------------------------------
      // INSERIR NO SUPABASE
      //--------------------------------------------
      const { error } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "turismo",
        titulo,
        descricao: descricaoFinal,
        cidade,
        bairro,
        nome_contato: nomeResponsavel || null,
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal,
        imagens: urlsUpload.length ? urlsUpload : null,
        status: "ativo",

        // CAMPOS DE TURISMO
        pilar_turismo: pilar,
        subcategoria_turismo: sub,
        nome_negocio: nomeNegocio || titulo,
        faixa_preco: faixaPreco || null,
        site_url: site || null,
        instagram: instagram || null,

        // CAMPOS EXTRAS PARA PASSEIOS
        tipo_passeio: exibirBlocoPasseios ? tipoPasseio || null : null,
        duracao_passeio: exibirBlocoPasseios ? duracaoPasseio || null : null,
        valor_passeio_pessoa: exibirBlocoPasseios
          ? valorPasseioPessoa || null
          : null,
        valor_passeio_fechado: exibirBlocoPasseios
          ? valorPasseioFechado || null
          : null,
        ponto_embarque: exibirBlocoPasseios ? pontoEmbarque || null : null,
        itens_inclusos: exibirBlocoPasseios ? itensInclusos || null : null,
      });

      if (error) {
        console.error(error);
        setErro("Erro ao salvar o anúncio.");
        return;
      }

      setSucesso("Anúncio publicado com sucesso!");

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar imagens ou salvar o anúncio.");
    } finally {
      setUploading(false);
    }
  }

  //--------------------------------------------
  // COMPONENTE JSX
  //--------------------------------------------
  return (
    <form onSubmit={enviarFormulario} className="space-y-6">
      {/* mensagens */}
      {erro && (
        <p className="text-red-700 text-sm border border-red-200 p-3 rounded-2xl bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-emerald-700 text-sm border border-emerald-200 p-3 rounded-2xl bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* BLOCO PRINCIPAL */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Informações do local / serviço de turismo
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nome do local / título do anúncio *
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ex.: Pousada Sol de Maricá, Passeio de escuna..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold">Nome do negócio</label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            value={nomeNegocio}
            onChange={(e) => setNomeNegocio(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        {/* SELECT TIPO TURISMO */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            Tipo de lugar / serviço *
          </label>
          <select
            value={tipoLugar}
            onChange={(e) => setTipoLugar(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
            required
          >
            <option value="">Selecione...</option>

            {/* ONDE FICAR */}
            <option>Pousada / Hotel / Hostel</option>
            <option>Casa / apartamento de temporada</option>
            <option>Camping / motorhome</option>

            {/* ONDE COMER */}
            <option>Bar / Restaurante / Quiosque</option>

            {/* ONDE PASSEAR */}
            <option>Passeio de barco / escuna</option>
            <option>Passeio de lancha</option>
            <option>Passeio de jet-ski</option>
            <option>Banana boat</option>
            <option>Táxi lancha</option>
            <option>City tour / passeios terrestres</option>
            <option>Passeio de quadriciclo / buggy</option>
            <option>Mergulho</option>
            <option>Trilha / ecoturismo</option>

            {/* SERVIÇOS */}
            <option>Guias de turismo</option>
            <option>Agência de turismo / viagens</option>
            <option>Outros serviços de turismo</option>

            {/* ONDE SE DIVERTIR */}
            <option>Produtos turísticos / lembranças</option>
          </select>
        </div>
      </div>

      {/* LOCALIZAÇÃO */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold">Localização</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Cidade *</label>
            <select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
              required
            >
              <option value="">Selecione...</option>
              {cidades.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Bairro / região
            </label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Opcional"
            />
          </div>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-2 border-t pt-4">
        <label className="block text-xs font-semibold mb-1">
          Descrição *
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-32 resize-none"
          required
        />
      </div>

      {/* FAIXA DE PREÇO */}
      <div>
        <label className="block text-xs font-semibold mb-1">
          Faixa de preço (opcional)
        </label>
        <input
          type="text"
          value={faixaPreco}
          onChange={(e) => setFaixaPreco(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Ex.: Diária a partir de R$ 220"
        />
      </div>

      {/* CAMPOS EXTRAS PARA PASSEIOS */}
      {exibirBlocoPasseios && (
        <div className="space-y-3 border-t pt-4">
          <h2 className="text-sm font-semibold">Detalhes do passeio</h2>

          <input
            type="text"
            value={tipoPasseio}
            onChange={(e) => setTipoPasseio(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Tipo de passeio (ex.: escuna, mergulho, lancha privativa...)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={duracaoPasseio}
              onChange={(e) => setDuracaoPasseio(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Duração (ex.: 2h, 4h, dia inteiro)"
            />
            <input
              type="text"
              value={valorPasseioPessoa}
              onChange={(e) => setValorPasseioPessoa(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Valor por pessoa"
            />
          </div>

          <input
            type="text"
            value={valorPasseioFechado}
            onChange={(e) => setValorPasseioFechado(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Passeio fechado (ex.: R$ 800 até 4 pessoas)"
          />

          <input
            type="text"
            value={pontoEmbarque}
            onChange={(e) => setPontoEmbarque(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ponto de encontro / embarque"
          />

          <textarea
            value={itensInclusos}
            onChange={(e) => setItensInclusos(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-24 resize-none"
            placeholder="Itens inclusos no passeio"
          />
        </div>
      )}

      {/* LINKS */}
      <div className="space-y-3 border-t pt-4">
        <h2 className="text-sm font-semibold">Site e redes sociais</h2>

        <input
          type="text"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Site / página de reservas"
        />

        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Instagram"
        />

        <input
          type="text"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Facebook"
        />
      </div>

      {/* FOTOS */}
      <div className="space-y-2 border-t pt-4">
        <h2 className="text-sm font-semibold">Fotos (até 8 imagens)</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleArquivosChange}
          className="text-sm"
        />
        {arquivos.length > 0 && (
          <p className="text-[11px] text-slate-500">
            {arquivos.length} arquivo(s) selecionado(s)
          </p>
        )}
      </div>

      {/* CONTATO */}
      <div className="space-y-4 border-t pt-4">
        <h2 className="text-sm font-semibold">Dados de contato</h2>

        <div>
          <label className="block text-xs font-semibold mb-1">
            Nome do responsável
          </label>
          <input
            type="text"
            value={nomeResponsavel}
            onChange={(e) => setNomeResponsavel(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Telefone
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* RESPONSABILIDADE */}
      <div className="mt-2 flex items-start gap-2">
        <input
          id="resp"
          type="checkbox"
          checked={aceitoResponsabilidade}
          onChange={(e) => setAceitoResponsabilidade(e.target.checked)}
          className="mt-0.5 h-4 w-4 border-slate-300 text-blue-600"
        />
        <label htmlFor="resp" className="text-[11px] text-slate-600">
          Declaro que todas as informações são verdadeiras.
        </label>
      </div>

      {/* BOTÃO */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 mt-1"
      >
        {uploading ? "Publicando anúncio..." : "Publicar anúncio de turismo"}
      </button>
    </form>
  );
}
