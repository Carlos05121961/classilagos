"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function AnunciarPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    cidade: "Maricá",
    contato: "",
    // campos novos
    tipo_imovel: "",
    finalidade: "",
    preco: "",
    area: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    endereco: "",
    bairro: "",
    condominio: "",
    iptu: "",
    aceita_financiamento: "",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    setFiles(Array.from(e.target.files || []));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      // 1) Upload das imagens (se tiver)
      let imageUrls = [];

      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const ext = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${ext}`;

          const { error: uploadError } = await supabase
            .storage
            .from("anuncios")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data } = supabase
            .storage
            .from("anuncios")
            .getPublicUrl(fileName);

          return data.publicUrl;
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      // 2) Inserir anúncio na tabela
      const { data, error } = await supabase
        .from("anuncios")
        .insert({
          categoria: "imoveis",
          titulo: form.titulo,
          descricao: form.descricao,
          cidade: form.cidade,
          contato: form.contato,

          tipo_imovel: form.tipo_imovel,
          finalidade: form.finalidade,
          preco: form.preco,
          area: form.area,
          quartos: form.quartos,
          banheiros: form.banheiros,
          vagas: form.vagas,
          endereco: form.endereco,
          bairro: form.bairro,
          condominio: form.condominio,
          iptu: form.iptu,
          aceita_financiamento: form.aceita_financiamento,

          imagens: imageUrls,
        })
        .select("id")
        .single();

      if (error) throw error;

      setSucesso("Anúncio criado com sucesso!");
      // 3) Redirecionar para a página do anúncio
      router.push(`/anuncios/${data.id}`);
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="w-full flex justify-center bg-slate-100 border-b py-4">
        <div className="w-full max-w-5xl px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar imóvel
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Preencha os dados do imóvel e envie suas fotos. Na fase de
            lançamento, todos os anúncios são <span className="font-semibold">GRÁTIS</span>.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow border border-slate-200 px-6 py-6 space-y-8"
        >
          {/* CAMPOS BÁSICOS */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Dados principais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TÍTULO */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do anúncio
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex.: Casa com vista para a lagoa em Maricá"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CIDADE */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cidade
                </label>
                <select
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              {/* CONTATO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  name="contato"
                  value={form.contato}
                  onChange={handleChange}
                  required
                  placeholder="(21) 99999-9999"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ENDEREÇO / MAPA */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço (para o mapa)
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro, cidade - esse endereço será usado no mapa"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Ex.: Rua das Flores 123, Itaipuaçu, Maricá - RJ.
                </p>
              </div>

              {/* BAIRRO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CARACTERÍSTICAS DO IMÓVEL */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Características do imóvel
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TIPO IMÓVEL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de imóvel
                </label>
                <select
                  name="tipo_imovel"
                  value={form.tipo_imovel}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="sitio_chacara">Sítio / Chácara</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="comercial">Sala / Loja comercial</option>
                </select>
              </div>

              {/* FINALIDADE */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Finalidade
                </label>
                <select
                  name="finalidade"
                  value={form.finalidade}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="venda">Venda</option>
                  <option value="aluguel_fixo">Aluguel fixo</option>
                  <option value="temporada">Aluguel por temporada</option>
                </select>
              </div>

              {/* PREÇO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="text"
                  name="preco"
                  value={form.preco}
                  onChange={handleChange}
                  placeholder="Ex.: 450.000,00"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ÁREA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Área (m²)
                </label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Ex.: 80"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* QUARTOS */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quartos
                </label>
                <input
                  type="text"
                  name="quartos"
                  value={form.quartos}
                  onChange={handleChange}
                  placeholder="Ex.: 2"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BANHEIROS */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banheiros
                </label>
                <input
                  type="text"
                  name="banheiros"
                  value={form.banheiros}
                  onChange={handleChange}
                  placeholder="Ex.: 1"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* VAGAS */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vagas de garagem
                </label>
                <input
                  type="text"
                  name="vagas"
                  value={form.vagas}
                  onChange={handleChange}
                  placeholder="Ex.: 1"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CONDOMÍNIO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor do condomínio (R$)
                </label>
                <input
                  type="text"
                  name="condominio"
                  value={form.condominio}
                  onChange={handleChange}
                  placeholder="Ex.: 350,00"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IPTU */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor do IPTU (R$ / ano)
                </label>
                <input
                  type="text"
                  name="iptu"
                  value={form.iptu}
                  onChange={handleChange}
                  placeholder="Ex.: 800,00"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ACEITA FINANCIAMENTO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aceita financiamento?
                </label>
                <select
                  name="aceita_financiamento"
                  value={form.aceita_financiamento}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="estuda">Estuda proposta</option>
                </select>
              </div>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              Descrição detalhada
            </h2>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Descreva o imóvel, pontos fortes, vista, proximidade da praia ou lagoa, comércio, etc."
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FOTOS */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              Fotos do imóvel
            </h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Você pode selecionar várias fotos de uma vez. Dê preferência para
              imagens em modo paisagem (deitadas).
            </p>
          </div>

          {/* MENSAGENS */}
          {erro && (
            <p className="text-sm text-red-600 font-medium">{erro}</p>
          )}
          {sucesso && (
            <p className="text-sm text-emerald-600 font-medium">{sucesso}</p>
          )}

          {/* BOTÃO */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Enviando anúncio..." : "Publicar anúncio"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
