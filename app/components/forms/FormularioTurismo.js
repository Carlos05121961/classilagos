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

  // FOTO
  const [fotoCapa, setFotoCapa] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ESTADO
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [aceitoResponsabilidade, setAceitoResponsabilidade] = useState(false);

  // Verifica login
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

  // Mapeia o tipo de lugar para pilar_turismo e subcategoria_turismo
  function mapearPilarESubcategoria(tipo) {
    switch (tipo) {
      case "Pousada / Hotel / Hostel":
        return { pilar: "onde_ficar", sub: "pousada_hotel_hostel" };
      case "Casa / apartamento de temporada":
        return { pilar: "onde_ficar", sub: "temporada" };
      case "Bar / Restaurante / Quiosque":
        return { pilar: "onde_comer", sub: "bar_restaurante_quiosque" };
      case "Passeio de barco / lancha":
        return { pilar: "onde_passear", sub: "passeio_barco_lancha" };
      case "City tour / passeios terrestres":
        return { pilar: "onde_passear", sub: "city_tour" };
      case "Passeio de quadriciclo / buggy":
        return { pilar: "onde_passear", sub: "quadriciclo_buggy" };
      case "Mergulho":
        return { pilar: "onde_passear", sub: "mergulho" };
      case "Trilha / ecoturismo":
        return { pilar: "onde_passear", sub: "trilha_ecoturismo" };
      case "Guias de turismo":
        return { pilar: "servicos_turismo", sub: "guia_turistico" };
      case "Agência de turismo / viagens":
        return { pilar: "servicos_turismo", sub: "agencia_turismo" };
      case "Produtos turísticos / lembranças (sublimação)":
        return { pilar: "produtos_turisticos", sub: "produtos_sublimacao" };
      case "Outros serviços de turismo":
        return { pilar: "servicos_turismo", sub: "outros_servicos" };
      default:
        return { pilar: null, sub: null };
    }
  }

  const tiposQueSaoPasseio = [
    "Passeio de barco / lancha",
    "City tour / passeios terrestres",
    "Passeio de quadriciclo / buggy",
    "Mergulho",
    "Trilha / ecoturismo",
  ];
  const exibirBlocoPasseios = tiposQueSaoPasseio.includes(tipoLugar);

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
      setErro("Preencha pelo menos título, tipo de lugar e cidade.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    if (!aceitoResponsabilidade) {
      setErro(
        "Para publicar o anúncio, marque a declaração de responsabilidade pelas informações."
      );
      return;
    }

    let fotoUrl = null;

    try {
      setUploading(true);

      // upload da foto de capa (opcional)
      if (fotoCapa) {
        const ext = fotoCapa.name.split(".").pop();
        const path = `${user.id}/turismo-capa-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("anuncios")
          .upload(path, fotoCapa);

        if (uploadError) {
          console.error("Erro ao fazer upload da foto:", uploadError);
        } else {
          const { data } = supabase.storage.from("anuncios").getPublicUrl(path);
          fotoUrl = data.publicUrl;
        }
      }

      // Montar descrição final com extras (mantendo seu padrão)
      let descricaoFinal = descricao || "";
      descricaoFinal += `\n\nTipo de lugar: ${tipoLugar}`;
      if (site) descricaoFinal += `\nSite: ${site}`;
      if (instagram) descricaoFinal += `\nInstagram: ${instagram}`;
      if (facebook) descricaoFinal += `\nFacebook: ${facebook}`;

      const { pilar, sub } = mapearPilarESubcategoria(tipoLugar);

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
        imagens: fotoUrl ? [fotoUrl] : null,
        status: "ativo",

        // CAMPOS DE TURISMO ESPECÍFICOS
        pilar_turismo: pilar,
        subcategoria_turismo: sub,
        nome_negocio: nomeNegocio || titulo,
        faixa_preco: faixaPreco || null,
        site_url: site || null,
        instagram: instagram || null,

        // CAMPOS DE PASSEIOS / AVENTURA
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
        setErro("Erro ao salvar o anúncio de turismo. Tente novamente.");
        return;
      }

      setSucesso("Anúncio de turismo publicado com sucesso!");

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado. Tente de novo.");
    } finally {
      setUploading(false);
    }
  }

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

      {/* BLOCO 1 – INFORMAÇÕES PRINCIPAIS */}
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
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Ex: Pousada Sol de Maricá, Passeio de barco em Cabo Frio..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nome do negócio (opcional)
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Nome fantasia, como aparece para o público"
            value={nomeNegocio}
            onChange={(e) => setNomeNegocio(e.target.value)}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Se não preencher, usaremos o título do anúncio como nome do negócio.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tipo de lugar / serviço *
          </label>
          <select
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            value={tipoLugar}
            onChange={(e) => setTipoLugar(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option>Pousada / Hotel / Hostel</option>
            <option>Casa / apartamento de temporada</option>
            <option>Bar / Restaurante / Quiosque</option>
            <option>Passeio de barco / lancha</option>
            <option>City tour / passeios terrestres</option>
            <option>Passeio de quadriciclo / buggy</option>
            <option>Mergulho</option>
            <option>Trilha / ecoturismo</option>
            <option>Guias de turismo</option>
            <option>Agência de turismo / viagens</option>
            <option>Produtos turísticos / lembranças (sublimação)</option>
            <option>Outros serviços de turismo</option>
          </select>
        </div>
      </div>

      {/* BLOCO 2 – LOCALIZAÇÃO */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cidade *
            </label>
            <select
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {cidades.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bairro / região
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              placeholder="Ex: Centro, Itaipuaçu, Braga..."
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BLOCO 3 – DESCRIÇÃO */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Descreva o local / serviço *
        </label>
        <textarea
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          placeholder="Fale sobre acomodações, estrutura, atrativos, diferenciais, formas de pagamento, etc."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>

      {/* BLOCO 3.1 – FAIXA DE PREÇO */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Faixa de preço (opcional)
        </label>
        <input
          type="text"
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          placeholder="Ex: Diária a partir de R$ 220, Passeio a partir de R$ 120 por pessoa"
          value={faixaPreco}
          onChange={(e) => setFaixaPreco(e.target.value)}
        />
      </div>

      {/* BLOCO 4 – CAMPOS ESPECIAIS PARA PASSEIOS */}
      {exibirBlocoPasseios && (
        <div className="space-y-3 border-t border-slate-200 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Detalhes do passeio / atividade
          </h2>

          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Tipo de passeio (ex.: passeio de escuna, mergulho com cilindro, trilha leve...)"
            value={tipoPasseio}
            onChange={(e) => setTipoPasseio(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Duração (ex.: 2h, 3h30, dia inteiro)"
              value={duracaoPasseio}
              onChange={(e) => setDuracaoPasseio(e.target.value)}
            />
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Valor por pessoa (ex.: R$ 150)"
              value={valorPasseioPessoa}
              onChange={(e) => setValorPasseioPessoa(e.target.value)}
            />
          </div>

          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Valor passeio fechado (ex.: R$ 800 até 4 pessoas)"
            value={valorPasseioFechado}
            onChange={(e) => setValorPasseioFechado(e.target.value)}
          />

          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            placeholder="Ponto de embarque / encontro (ex.: Praia dos Anjos – Arraial do Cabo)"
            value={pontoEmbarque}
            onChange={(e) => setPontoEmbarque(e.target.value)}
          />

          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-24 resize-none"
            placeholder="Itens inclusos (ex.: colete, máscara, fotos digitais, lanche a bordo...)"
            value={itensInclusos}
            onChange={(e) => setItensInclusos(e.target.value)}
          />
        </div>
      )}

      {/* BLOCO 5 – LINKS EXTRAS */}
      <div className="space-y-3 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Site e redes sociais (opcional)
        </h2>
        <input
          type="text"
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Site / página de reservas"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
        <input
          type="text"
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <input
          type="text"
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          placeholder="Facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />
        <p className="text-[11px] text-slate-500">
          Essas informações serão incluídas na descrição do anúncio.
        </p>
      </div>

      {/* BLOCO 6 – FOTO */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Foto de capa (opcional)
        </h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFotoCapa(e.target.files[0] || null)}
          className="text-sm"
        />
        <p className="text-[11px] text-slate-500">
          Imagens em JPG ou PNG, tamanho máximo recomendado 1 MB.
        </p>
      </div>

      {/* BLOCO 7 – CONTATO */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Dados de contato
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nome do responsável
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            value={nomeResponsavel}
            onChange={(e) => setNomeResponsavel(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um meio de contato será exibido (WhatsApp, telefone ou
          e-mail).
        </p>
      </div>

      {/* RESPONSABILIDADE */}
      <div className="mt-2 flex items-start gap-2">
        <input
          id="responsabilidade"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          checked={aceitoResponsabilidade}
          onChange={(e) => setAceitoResponsabilidade(e.target.checked)}
        />
        <label
          htmlFor="responsabilidade"
          className="text-[11px] md:text-xs text-slate-600"
        >
          Declaro que todas as informações deste anúncio são verdadeiras e que
          o serviço está de acordo com as normas de turismo e legislação
          vigente.
        </label>
      </div>

      {/* BOTÃO */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {uploading ? "Publicando anúncio..." : "Publicar anúncio de turismo"}
      </button>
    </form>
  );
}

