"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default function FormularioLagolistas() {
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    titulo: "",
    razao_social: "",
    cnpj: "",
    inscricao_municipal: "",
    registro_profissional: "",
    descricao: "",
    cidade: "",
    endereco: "",
    telefone: "",
    whatsapp: "",
    email: "",
    imagemUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
      const {
        titulo,
        razao_social,
        cnpj,
        inscricao_municipal,
        registro_profissional,
        descricao,
        cidade,
        endereco,
        telefone,
        whatsapp,
        email,
        imagemUrl,
      } = formData;

      // verifica usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErro("Você precisa estar logado para anunciar.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("anuncios")
        .insert({
          categoria: "lagolistas",
          titulo,
          descricao,
          cidade,
          endereco,
          telefone,
          whatsapp,
          email,
          usuario_id: user.id,
          imagens: imagemUrl ? [imagemUrl] : [],

          // campos NOVOS / OPCIONAIS
          cnpj: cnpj || null,
          razao_social: razao_social || null,
          inscricao_municipal: inscricao_municipal || null,
          registro_profissional: registro_profissional || null,
        });

      if (insertError) {
        console.error(insertError);
        setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      } else {
        setMensagem("Anúncio cadastrado com sucesso no Lagolistas! 🎉");
        // limpa o formulário
        setFormData({
          titulo: "",
          razao_social: "",
          cnpj: "",
          inscricao_municipal: "",
          registro_profissional: "",
          descricao: "",
          cidade: "",
          endereco: "",
          telefone: "",
          whatsapp: "",
          email: "",
          imagemUrl: "",
        });

        // opcional: redirecionar para a página do Lagolistas
        // router.push("/lagolistas");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro inesperado ao salvar o anúncio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Anunciar no Lagolistas
      </h1>
      <p className="text-sm text-slate-600 mb-6">
        Preencha os dados do seu comércio, empresa ou serviço. Os campos de
        CNPJ, razão social, inscrição municipal e registro profissional são
        opcionais, mas passam mais segurança para o cliente.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NOME / TÍTULO */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome do comércio / título do anúncio *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Padaria Pão Quentinho"
          />
        </div>

        {/* RAZÃO SOCIAL (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Razão social (opcional)
          </label>
          <input
            type="text"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Pão Quentinho Comércio de Alimentos LTDA"
          />
        </div>

        {/* CNPJ (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            CNPJ (opcional)
          </label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 12.345.678/0001-90"
          />
          <p className="text-xs text-slate-500 mt-1">
            Essa informação é pública em muitos cadastros e ajuda a passar
            confiança para o cliente.
          </p>
        </div>

        {/* INSCRIÇÃO MUNICIPAL (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Inscrição municipal (opcional)
          </label>
          <input
            type="text"
            name="inscricao_municipal"
            value={formData.inscricao_municipal}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 123456-7"
          />
        </div>

        {/* REGISTRO PROFISSIONAL (CRECI, CRM, OAB...) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Registro profissional (CRECI, CRM, OAB, CREA, etc.) – opcional
          </label>
          <input
            type="text"
            name="registro_profissional"
            value={formData.registro_profissional}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: CRECI 12345-RJ"
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descrição do seu comércio / serviços *
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Conte o que você oferece, diferenciais, horários, formas de pagamento..."
          />
        </div>

        {/* CIDADE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cidade *
          </label>
          <select
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione a cidade</option>
            <option value="Maricá">Maricá</option>
            <option value="Saquarema">Saquarema</option>
            <option value="Araruama">Araruama</option>
            <option value="Iguaba Grande">Iguaba Grande</option>
            <option value="São Pedro da Aldeia">São Pedro da Aldeia</option>
            <option value="Arraial do Cabo">Arraial do Cabo</option>
            <option value="Cabo Frio">Cabo Frio</option>
            <option value="Búzios">Búzios</option>
            <option value="Rio das Ostras">Rio das Ostras</option>
          </select>
        </div>

        {/* ENDEREÇO */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Endereço completo *
          </label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rua, número, bairro, ponto de referência..."
          />
        </div>

        {/* TELEFONE / WHATSAPP / EMAIL */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefone fixo (opcional)
            </label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: (22) 0000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              WhatsApp *
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: (22) 9 9999-9999"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            E-mail de contato (opcional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: contato@minhaempresa.com.br"
          />
        </div>

        {/* IMAGEM PRINCIPAL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            URL da imagem principal (fachada, logo, vitrine) *
          </label>
          <input
            type="url"
            name="imagemUrl"
            value={formData.imagemUrl}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cole aqui o link da imagem hospedada"
          />
          <p className="text-xs text-slate-500 mt-1">
            Depois podemos evoluir para upload direto pelo site. Por enquanto é
            só colar o link da imagem.
          </p>
        </div>

        {/* MENSAGENS */}
        {erro && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {erro}
          </div>
        )}
        {mensagem && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
            {mensagem}
          </div>
        )}

        {/* BOTÃO */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Salvando anúncio..." : "Publicar no Lagolistas"}
          </button>
        </div>
      </form>
    </section>
  );
}
