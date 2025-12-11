"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioLagolistas() {
  const router = useRouter();

  // Campos principais
  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");

  // Segmento (categoria principal do comércio)
  const [segmento, setSegmento] = useState("");

  // Dados da empresa / comércio
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [registroProfissional, setRegistroProfissional] = useState("");

  // Descrição
  const [descricao, setDescricao] = useState("");

  // Links
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Imagens (logo + até 4 fotos)
  const [imagensFiles, setImagensFiles] = useState([]);

  // Estados gerais
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Verificar login (mesmo padrão)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
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

  const segmentosLagolistas = [
    "Materiais de construção & reformas",
    "Supermercados & mercearias",
    "Farmácias & drogarias",
    "Bazares & variedades",
    "Piscinas, jardins & paisagismo",
    "Móveis, decoração & utilidades",
    "Serviços em geral",
    "Saúde, beleza & bem-estar",
    "Educação & escolas",
    "Turismo & passeios",
    "Bares, lanchonetes & cafeterias",
    "Pizzarias & delivery",
    "Hotéis, pousadas & hospedagem",
    "Outros",
  ];

  const handleSubmit = async (e) => {
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

    // Validações principais
    if (!titulo || !cidade || !descricao) {
      setErro(
        "Preencha pelo menos o título, a cidade e a descrição do seu comércio/serviço."
      );
      return;
    }

    if (!segmento) {
      setErro(
        "Selecione o segmento principal do seu negócio (materiais de construção, bazar, farmácia, etc.)."
      );
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro(
        "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail)."
      );
      return;
    }

    if (!aceitoTermos) {
      setErro(
        "Para publicar no LagoListas, marque a opção confirmando que as informações são verdadeiras."
      );
      return;
    }

    setUploading(true);

    let imagensUrls = [];

    try {
      const bucket = "anuncios";

      // Upload opcional de até 5 imagens
      if (imagensFiles && imagensFiles.length > 0) {
        const filesArray = Array.from(imagensFiles).slice(0, 5);

        for (let index = 0; index < filesArray.length; index++) {
          const file = filesArray[index];
          const ext = file.name.split(".").pop();
          const path = `lagolistas/${user.id}/lagolistas-${Date.now()}-${index}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file);

          if (uploadError) {
            console.error("Erro upload imagem Lagolistas:", uploadError);
            throw uploadError;
          }

          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          if (data?.publicUrl) {
            imagensUrls.push(data.publicUrl);
          }
        }
      }

      // INSERT no Supabase
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,

        // Categoria para o LagoListas
        categoria: "lagolistas",

        titulo,
        descricao,
        cidade,
        bairro,
        endereco,

        // segmento principal (usaremos no filtro e na vitrine)
        area_profissional: segmento,

        // dados da empresa
        nome_negocio: nomeNegocio || null,
        razao_social: razaoSocial || null,
        cnpj: cnpj || null,
        inscricao_municipal: inscricaoMunicipal || null,
        registro_profissional: registroProfissional || null,

        // links
        site_url: siteUrl || null,
        instagram: instagram || null,

        // contatos
        telefone: telefone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        contato: contatoPrincipal,

        // imagens (logo + fachada + interior, etc.)
        imagens: imagensUrls.length > 0 ? imagensUrls : null,

        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao salvar anúncio Lagolistas:", insertError);
        setErro(
          `Erro ao salvar seu anúncio. Tente novamente: ${
            insertError.message || ""
          }`
        );
        setUploading(false);
        return;
      }

      setSucesso("Anúncio publicado com sucesso no LagoListas! 🎉");

      // Limpar formulário
      setTitulo("");
      setCidade("");
      setBairro("");
      setEndereco("");
      setSegmento("");
      setNomeNegocio("");
      setRazaoSocial("");
      setCnpj("");
      setInscricaoMunicipal("");
      setRegistroProfissional("");
      setDescricao("");
      setSiteUrl("");
      setInstagram("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setImagensFiles([]);
      setAceitoTermos(false);

      setUploading(false);

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro(
        `Erro ao salvar seu anúncio. Tente novamente: ${
          err.message || "Erro inesperado."
        }`
      );
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <p className="text-red-600 text-xs md:text-sm border border-red-100 rounded-md px-3 py-2 bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-green-600 text-xs md:text-sm border border-emerald-100 rounded-md px-3 py-2 bg-emerald-50">
          {sucesso}
        </p>
      )}

      {/* TÍTULO DO ANÚNCIO */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">
            Título do anúncio *
          </label>

          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Ex.: <strong>“Materiais de Construção São José – Entregamos em toda Maricá”</strong>{" "}
              ou{" "}
              <strong>“Bazar Tudo em Casa – Utilidades & presentes em Cabo Frio”</strong>.
            </div>
          </div>
        </div>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ex.: Mercado Pão Quentinho – Café da manhã e lanches"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* LOCALIZAÇÃO */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
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
            <label className="block text-xs font-medium text-slate-700">
              Bairro / Região (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Ex.: Centro, Itaipuaçu, Braga..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Endereço completo (opcional, mas recomendado)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, número, sala, ponto de referência..."
          />
        </div>
      </div>

      {/* SEGMENTO / CATEGORIA */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Segmento do seu negócio *
          </h2>
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Isso ajuda o cliente a encontrar mais rápido. Ex.:{" "}
              <strong>“Materiais de construção & reformas”</strong>,{" "}
              <strong>“Bazares & variedades”</strong>,{" "}
              <strong>“Farmácias & drogarias”</strong>, etc.
            </div>
          </div>
        </div>

        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={segmento}
          onChange={(e) => setSegmento(e.target.value)}
          required
        >
          <option value="">Selecione o segmento principal...</option>
          {segmentosLagolistas.map((seg) => (
            <option key={seg} value={seg}>
              {seg}
            </option>
          ))}
        </select>
      </div>

      {/* DADOS DA EMPRESA */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Dados da empresa / comércio
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Nome fantasia / nome do comércio
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
              placeholder="Ex.: Mercado São José"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Razão social (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Ex.: São José Comércio de Alimentos LTDA"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              CNPJ (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Inscrição municipal (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={inscricaoMunicipal}
              onChange={(e) => setInscricaoMunicipal(e.target.value)}
              placeholder="Ex.: 123456-7"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Registro profissional (CRECI, CRM, OAB etc.) – opcional
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={registroProfissional}
              onChange={(e) => setRegistroProfissional(e.target.value)}
              placeholder="Ex.: CRECI 12345-RJ"
            />
          </div>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-1 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">
            Descrição do seu comércio / serviços *
          </label>

          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Fale o que você oferece, diferenciais, horário de
              funcionamento, formas de pagamento, delivery, promoções etc.
            </div>
          </div>
        </div>

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-32"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Loja de materiais de construção com entrega rápida, área de madeira, ferragens, hidráulica, elétrica, tintas e muito mais..."
          required
        />
      </div>

      {/* LINKS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Links (opcional)</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Site / página
            </label>
            <input
              type="url"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Instagram
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@seu_perfil"
            />
          </div>
        </div>
      </div>

      {/* LOGO / FOTOS */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Logo e fotos do comércio (até 5 imagens)
          </h2>
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              A primeira imagem será usada como capa na vitrine. Use, se
              possível, uma logo em boa resolução e uma foto da fachada ou do
              interior da loja.
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full text-xs"
          onChange={(e) => setImagensFiles(e.target.files)}
        />
        <p className="text-[11px] text-slate-500">
          Formato recomendado: JPG ou WEBP, até 5 imagens. Dica: use sempre sua
          logomarca em uma das fotos.
        </p>
      </div>

      {/* CONTATOS */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Contatos</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Telefone
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              WhatsApp
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será exibido
          para contato dos clientes.
        </p>
      </div>

      {/* CONFIRMAÇÃO */}
      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações preenchidas são verdadeiras e autorizo
            que este anúncio seja exibido no LagoListas / Classilagos para os
            consumidores da Região dos Lagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="mt-2 w-full bg-blue-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {uploading
          ? "Publicando anúncio..."
          : "Publicar meu comércio no LagoListas"}
      </button>
    </form>
  );
}
