"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

export default function AnunciarImovelPage() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // Campos principais
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [preco, setPreco] = useState("");
  const [tipoImovel, setTipoImovel] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("Sim");

  // Contato
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [imobiliaria, setImobiliaria] = useState("");
  const [corretor, setCorretor] = useState("");
  const [creci, setCreci] = useState("");

  // Imagens (até 4 URLs)
  const [imagem1, setImagem1] = useState("");
  const [imagem2, setImagem2] = useState("");
  const [imagem3, setImagem3] = useState("");
  const [imagem4, setImagem4] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!titulo || !cidade || !telefone) {
      setErro("Por favor, preencha pelo menos Título, Cidade e Telefone.");
      return;
    }

    setLoading(true);

    try {
      const imagensArray = [imagem1, imagem2, imagem3, imagem4].filter(
        (url) => url && url.trim() !== ""
      );

      const { error } = await supabase.from("anuncios").insert([
        {
          categoria: "imoveis",
          titulo,
          descricao,
          cidade,
          bairro,
          endereco,
          preco,
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
          imagens: imagensArray,
          status: "ativo",
          destaque: false,
        },
      ]);

      if (error) {
        console.error("Erro ao salvar anúncio:", error);
        setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      } else {
        setMensagem("Anúncio cadastrado com sucesso! Em breve estará no ar.");

        // Limpa formulário
        setTitulo("");
        setDescricao("");
        setCidade("");
        setBairro("");
        setEndereco("");
        setPreco("");
        setTipoImovel("");
        setFinalidade("");
        setArea("");
        setQuartos("");
        setBanheiros("");
        setVagas("");
        setCondominio("");
        setIptu("");
        setAceitaFinanciamento("Sim");
        setTelefone("");
        setWhatsapp("");
        setEmail("");
        setImobiliaria("");
        setCorretor("");
        setCreci("");
        setImagem1("");
        setImagem2("");
        setImagem3("");
        setImagem4("");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErro("Erro inesperado ao salvar o anúncio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* BANNER TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-4">
        <div className="w-full max-w-5xl px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu IMÓVEL totalmente GRÁTIS - Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Anuncie seu imóvel grátis
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Preencha os dados do imóvel com carinho. Quanto mais completo, mais
          chances você tem de encontrar o comprador certo.
        </p>

        {erro && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            {mensagem}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200"
        >
          {/* DADOS DO IMÓVEL */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Dados do imóvel
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do anúncio *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Linda casa em condomínio fechado em Cabo Frio"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de imóvel
                </label>
                <select
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Finalidade
                </label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                  <option value="temporada">Temporada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="Ex.: 450000"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Área (m²)
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex.: 200"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quartos
                </label>
                <input
                  type="number"
                  min="0"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banheiros
                </label>
                <input
                  type="number"
                  min="0"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vagas de garagem
                </label>
                <input
                  type="number"
                  min="0"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Condomínio (R$)
                </label>
                <input
                  type="text"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value)}
                  placeholder="Se não tiver, deixe em branco"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IPTU (R$ por ano)
                </label>
                <input
                  type="text"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value)}
                  placeholder="Se não souber, deixe em branco"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aceita financiamento?
                </label>
                <select
                  value={aceitaFinanciamento}
                  onChange={(e) => setAceitaFinanciamento(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                  <option value="A combinar">A combinar</option>
                </select>
              </div>
            </div>
          </div>

          {/* LOCALIZAÇÃO */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Localização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex.: Maricá, Cabo Frio, Búzios..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairro / Região
                </label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex.: Centro, Itaipuaçu, Ponta Negra..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço (opcional)
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, complemento (se desejar)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Descrição do imóvel
            </h2>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os principais diferenciais do imóvel, vista, estado de conservação, proximidade da praia, lagoa, comércio, escolas etc."
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Dica: um bom texto com detalhes honestos aumenta muito as chances
              de contato.
            </p>
          </div>

          {/* FOTOS */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Fotos do imóvel
            </h2>
            <p className="text-[11px] text-slate-500 mb-2">
              Nesta primeira versão, informe os links (URLs) das fotos
              hospedadas em algum serviço (Supabase Storage, Google Fotos etc.).
              Em breve teremos envio direto de imagens pelo site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={imagem1}
                onChange={(e) => setImagem1(e.target.value)}
                placeholder="URL da foto 1"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={imagem2}
                onChange={(e) => setImagem2(e.target.value)}
                placeholder="URL da foto 2"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={imagem3}
                onChange={(e) => setImagem3(e.target.value)}
                placeholder="URL da foto 3"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={imagem4}
                onChange={(e) => setImagem4(e.target.value)}
                placeholder="URL da foto 4"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* CONTATO */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Dados de contato
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(22) 99999-0000"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(22) 99999-0000"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@dominio.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Imobiliária (se houver)
                </label>
                <input
                  type="text"
                  value={imobiliaria}
                  onChange={(e) => setImobiliaria(e.target.value)}
                  placeholder="Nome da imobiliária"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corretor responsável
                </label>
                <input
                  type="text"
                  value={corretor}
                  onChange={(e) => setCorretor(e.target.value)}
                  placeholder="Seu nome ou do corretor"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CRECI
                </label>
                <input
                  type="text"
                  value={creci}
                  onChange={(e) => setCreci(e.target.value)}
                  placeholder="Seu CRECI (se tiver)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              O Classilagos apenas divulga anúncios e não intermedia pagamentos,
              visitas ou negociações. Verifique sempre a identidade do
              anunciante e a documentação do imóvel antes de fechar negócio.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Publicar anúncio"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
