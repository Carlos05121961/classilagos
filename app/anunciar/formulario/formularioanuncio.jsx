"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

const CATEGORIAS_LABELS = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas",
};

const CIDADES_REGIAO = [
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

export default function FormularioAnuncio() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tipo = searchParams.get("tipo") || "imoveis";
  const categoriaLabel = CATEGORIAS_LABELS[tipo] || "Anúncio";

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Campos básicos
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");

  // Campos de imóvel / anúncio
  const [preco, setPreco] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipoImovel, setTipoImovel] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("Sim");

  // Contato detalhado
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [imobiliaria, setImobiliaria] = useState("");
  const [corretor, setCorretor] = useState("");
  const [creci, setCreci] = useState("");

  // Vídeo
  const [videoUrl, setVideoUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Busca o usuário logado
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao buscar usuário:", error.message);
      }
      setUser(data?.user ?? null);
      setLoadingUser(false);
    }

    loadUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Você precisa estar logado para publicar um anúncio.");
      return;
    }

    // Validações mínimas
    if (!titulo || !descricao || !cidade || !telefone) {
      setErrorMsg(
        "Preencha pelo menos Título, Descrição, Cidade e Telefone para contato."
      );
      return;
    }

    setSaving(true);

    try {
      // Campo "contato" antigo (NOT NULL na tabela) – montamos automaticamente
      const contatoResumo = [
        telefone ? `Tel: ${telefone}` : "",
        whatsapp ? `WhatsApp: ${whatsapp}` : "",
        email ? `E-mail: ${email}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const { error } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: tipo, // imoveis, veiculos, etc.
        titulo,
        descricao,
        cidade,
        contato: contatoResumo, // mantém compatibilidade com a coluna antiga
        video_url: videoUrl || null,

        // Campos extras para imóveis (e servem também para outras categorias se quiser)
        preco,
        bairro,
        endereco,
        tipo_imovel: tipoImovel,
        finalidade,
        area,
        quartos,
        banheiros,
        vagas,
        condominio,
        iptu,
        aceita_financiamento: aceitaFinanciamento,

        telefone,
        whatsapp,
        email,
        imobiliaria,
        corretor,
        creci,

        status: "ativo",
        destaque: false,
      });

      if (error) {
        console.error("Erro Supabase:", error);
        setErrorMsg(
          "Não foi possível salvar seu anúncio. Tente novamente em alguns instantes."
        );
        setSaving(false);
        return;
      }

      // Sucesso
      router.push("/painel/meus-anuncios");
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
      setSaving(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 text-sm">
          Carregando informações do usuário…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-lg font-semibold text-gray-900">
            Você precisa estar logado
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Para criar um anúncio no Classilagos, faça login ou crie sua conta
            gratuitamente.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ir para login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Criar anúncio em {categoriaLabel}
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Preencha os dados do seu anúncio. Depois você poderá gerenciar tudo no
        seu painel.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Título */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Título do anúncio *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Casa 2 quartos com varanda em Maricá"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Descrição do anúncio *
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={5}
            placeholder="Descreva o imóvel, localização, características, condições de pagamento etc."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Cidade */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Cidade / Região *
          </label>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecione uma cidade</option>
            {CIDADES_REGIAO.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Bairro / Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Bairro / Região (opcional)
            </label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Ex: Centro, Itaipuaçu, Ponta Negra…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Valor (R$) (opcional)
            </label>
            <input
              type="text"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Ex: 450000"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Endereço (opcional)
          </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, número, complemento (se desejar)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Campos mais específicos para imóveis – opcionais, mas já deixam preparado */}
        {tipo === "imoveis" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de imóvel
                </label>
                <select
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Terreno">Terreno / Lote</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Sala comercial">Sala comercial</option>
                  <option value="Loja">Loja</option>
                  <option value="Sítio / Chácara">Sítio / Chácara</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Finalidade
                </label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                  <option value="temporada">Temporada</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Área (m²)
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: 200"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Quartos
                </label>
                <input
                  type="number"
                  min="0"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Banheiros
                </label>
                <input
                  type="number"
                  min="0"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Vagas de garagem
                </label>
                <input
                  type="number"
                  min="0"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Condomínio (R$)
                </label>
                <input
                  type="text"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value)}
                  placeholder="Se não tiver, deixe em branco"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  IPTU (R$ / ano)
                </label>
                <input
                  type="text"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value)}
                  placeholder="Se não souber, deixe em branco"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Aceita financiamento?
              </label>
              <select
                value={aceitaFinanciamento}
                onChange={(e) => setAceitaFinanciamento(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="A combinar">A combinar</option>
              </select>
            </div>
          </>
        )}

        {/* Contato */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Telefone principal para contato *
          </label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(21) 9XXXX-XXXX"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp (opcional)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(21) 9XXXX-XXXX"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              E-mail (opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@dominio.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Imobiliária (se houver)
            </label>
            <input
              type="text"
              value={imobiliaria}
              onChange={(e) => setImobiliaria(e.target.value)}
              placeholder="Nome da imobiliária"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Corretor responsável
            </label>
            <input
              type="text"
              value={corretor}
              onChange={(e) => setCorretor(e.target.value)}
              placeholder="Seu nome ou do corretor"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              CRECI
            </label>
            <input
              type="text"
              value={creci}
              onChange={(e) => setCreci(e.target.value)}
              placeholder="Seu CRECI (se tiver)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Vídeo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Link do vídeo no YouTube (opcional)
          </label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            Cole aqui o link do vídeo do imóvel no YouTube. Ele será aberto em
            uma nova aba.
          </p>
        </div>

        {/* Mensagem de erro */}
        {errorMsg && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push("/painel")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Voltar para o painel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Publicando anúncio..." : "Confirmar e publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}
