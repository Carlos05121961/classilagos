"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioCurriculo() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [areaProfissional, setAreaProfissional] = useState("");
  const [experiencias, setExperiencias] = useState("");
  const [formacao, setFormacao] = useState("");
  const [habilidades, setHabilidades] = useState("");

  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [foto, setFoto] = useState(null);
  const [curriculoPDF, setCurriculoPDF] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Verificação de login
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

  const enviarFormulario = async (e) => {
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

    if (!nome || !cidade || !areaProfissional) {
      setErro("Preencha pelo menos: nome, cidade e área profissional.");
      return;
    }

    let urlFoto = null;
    let urlPDF = null;

    try {
      setUploading(true);

      // Upload da foto (opcional)
      if (foto) {
        const ext = foto.name.split(".").pop();
        const path = `${user.id}/curriculo-foto-${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("anuncios")
          .upload(path, foto);

        if (!error) {
          const { data } = supabase.storage
            .from("anuncios")
            .getPublicUrl(path);
          urlFoto = data.publicUrl;
        }
      }

      // Upload do PDF (opcional)
      if (curriculoPDF) {
        const ext = curriculoPDF.name.split(".").pop();
        const path = `${user.id}/curriculo-${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("anuncios")
          .upload(path, curriculoPDF);

        if (!error) {
          const { data } = supabase.storage
            .from("anuncios")
            .getPublicUrl(path);
          urlPDF = data.publicUrl;
        }
      }

      // Inserção na tabela
      const { error } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "curriculo",
        titulo: `Currículo de ${nome}`,
        descricao: experiencias,
        cidade,
        bairro,
        nome_contato: nome,
        telefone,
        whatsapp,
        email,
        subcategoria_nautica: null, // ignorado
        finalidade_nautica: null,
        area_profissional: areaProfissional,
        beneficios: habilidades,
        video_url: null,
        imagens: urlFoto ? [urlFoto] : null,
        curriculo_url: urlPDF,
        status: "ativo",
      });

      if (error) {
        console.error(error);
        setErro("Erro ao salvar seu currículo. Tente novamente.");
        return;
      }

      setSucesso("Currículo enviado com sucesso!");

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);

    } catch (err) {
      console.error(err);
      setErro("Erro inesperado. Tente de novo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={enviarFormulario} className="space-y-6">

      {erro && (
        <p className="text-red-600 text-sm border p-2 rounded bg-red-50">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-green-700 text-sm border p-2 rounded bg-emerald-50">
          {sucesso}
        </p>
      )}

      <h2 className="text-lg font-semibold text-slate-900">
        Dados pessoais
      </h2>

      <div>
        <label className="text-xs font-medium">Nome completo *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Idade</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium">Cidade *</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
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
      </div>

      <div>
        <label className="text-xs font-medium">Bairro (opcional)</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
        />
      </div>

      {/* ÁREA PROFISSIONAL */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Área profissional *
        </h2>

        <select
          className="w-full mt-2 border rounded px-3 py-2 text-sm"
          value={areaProfissional}
          onChange={(e) => setAreaProfissional(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          <option>Administração</option>
          <option>Comércio / Vendas</option>
          <option>Construção civil</option>
          <option>Serviços gerais</option>
          <option>Educação</option>
          <option>Saúde</option>
          <option>Atendimento / Caixa</option>
          <option>Hotelaria / Turismo</option>
          <option>TI / Informática</option>
          <option>Motorista / Entregador</option>
          <option>Outros</option>
        </select>
      </div>

      {/* EXPERIÊNCIAS */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Experiências profissionais
        </h2>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-28"
          placeholder="Liste suas experiências, serviços prestados, funções, locais onde trabalhou..."
          value={experiencias}
          onChange={(e) => setExperiencias(e.target.value)}
        ></textarea>
      </div>

      {/* FORMAÇÃO */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold text-slate-900">Formação</h2>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-20"
          placeholder="Ex: Ensino médio completo, cursos, certificados..."
          value={formacao}
          onChange={(e) => setFormacao(e.target.value)}
        ></textarea>
      </div>

      {/* HABILIDADES */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold text-slate-900">Habilidades</h2>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-20"
          placeholder="Ex: informática, atendimento, organização, direção, cozinha..."
          value={habilidades}
          onChange={(e) => setHabilidades(e.target.value)}
        ></textarea>
      </div>

      {/* FOTO */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">Foto (opcional)</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files[0])}
          className="text-sm"
        />
      </div>

      {/* PDF */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">Upload do currículo PDF (opcional)</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setCurriculoPDF(e.target.files[0])}
          className="text-sm"
        />
      </div>

      {/* CONTATO */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">Contato</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Telefone</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium">WhatsApp</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium">E-mail</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses dados será exibido para empresas entrarem em contato.
        </p>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-blue-700"
      >
        {uploading ? "Enviando..." : "Enviar currículo"}
      </button>
    </form>
  );
}
