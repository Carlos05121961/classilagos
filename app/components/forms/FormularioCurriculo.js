"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function FormularioCurriculo() {
  const router = useRouter();

  // Dados pessoais
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [idade, setIdade] = useState("");
  const [areaProfissional, setAreaProfissional] = useState("");

  // Formação / experiência
  const [escolaridade, setEscolaridade] = useState("");
  const [formacaoAcademica, setFormacaoAcademica] = useState("");
  const [experienciasProf, setExperienciasProf] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [idiomas, setIdiomas] = useState("");
  const [resumo, setResumo] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Arquivos
  const [fotoFile, setFotoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  // Checkbox de confirmação
  const [aceitoTermos, setAceitoTermos] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  const areas = [
    "Administração",
    "Atendimento / Caixa",
    "Comércio / Vendas",
    "Construção civil",
    "Serviços gerais",
    "Educação",
    "Saúde",
    "Hotelaria / Turismo",
    "Motorista / Entregador",
    "TI / Informática",
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
      setErro("Você precisa estar logado para cadastrar seu currículo.");
      router.push("/login");
      return;
    }

    // Validações básicas
    if (!nome || !cidade || !areaProfissional) {
      setErro("Preencha pelo menos nome, cidade e área profissional.");
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
        "Para cadastrar seu currículo, marque a opção confirmando que as informações são verdadeiras."
      );
      return;
    }

    setUploading(true);

    let fotoUrl = null;
    let pdfUrl = null;

    try {
      const bucket = "anuncios";

      // Upload da foto (opcional)
      if (fotoFile) {
        const ext = fotoFile.name.split(".").pop();
        const path = `curriculos/${user.id}/foto-${Date.now()}.${ext}`;

        const { error: uploadErroFoto } = await supabase.storage
          .from(bucket)
          .upload(path, fotoFile);

        if (uploadErroFoto) {
          console.error("Erro upload foto currículo:", uploadErroFoto);
          throw uploadErroFoto;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        fotoUrl = data.publicUrl;
      }

      // Upload do PDF (opcional)
      if (pdfFile) {
        const ext = pdfFile.name.split(".").pop();
        const path = `curriculos/${user.id}/cv-${Date.now()}.${ext}`;

        const { error: uploadErroPdf } = await supabase.storage
          .from(bucket)
          .upload(path, pdfFile);

        if (uploadErroPdf) {
          console.error("Erro upload PDF currículo:", uploadErroPdf);
          throw uploadErroPdf;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        pdfUrl = data.publicUrl;
      }

      // Monta título e descrição principais
      const titulo =
        resumo || areaProfissional
          ? `Currículo - ${nome} (${areaProfissional})`
          : `Currículo - ${nome}`;

      const descricaoBase =
        resumo ||
        experienciasProf ||
        formacaoAcademica ||
        "Currículo cadastrado no banco de talentos do Classilagos.";

      // INSERT no Supabase
      const { error: insertError } = await supabase.from("anuncios").insert({
        user_id: user.id,
        categoria: "curriculo",
        titulo,
        descricao: descricaoBase,
        cidade,
        bairro,
        nome_contato: nome,
        // Campos específicos de currículo
        area_profissional: areaProfissional,
        escolaridade_minima: escolaridade,
        formacao_academica: formacaoAcademica,
        experiencias_profissionais: experienciasProf,
        habilidades,
        idiomas,
        // Contatos
        telefone,
        whatsapp,
        email,
        contato: contatoPrincipal, // coluna NOT NULL
        // Arquivos
        curriculo_foto_url: fotoUrl,
        curriculo_pdf_url: pdfUrl,
        status: "ativo",
      });

      if (insertError) {
        console.error("Erro ao inserir currículo:", insertError);
        setErro(
          `Erro ao salvar seu currículo: ${insertError.message || "Tente novamente."}`
        );
        setUploading(false);
        return;
      }

      setSucesso("Currículo cadastrado com sucesso!");
      setUploading(false);

      // Limpa campos depois de salvar
      setNome("");
      setCidade("");
      setBairro("");
      setIdade("");
      setAreaProfissional("");
      setEscolaridade("");
      setFormacaoAcademica("");
      setExperienciasProf("");
      setHabilidades("");
      setIdiomas("");
      setResumo("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setFotoFile(null);
      setPdfFile(null);
      setAceitoTermos(false);

      setTimeout(() => {
        router.push("/painel/meus-anuncios");
      }, 1800);
    } catch (err) {
      console.error(err);
      setErro(
        `Erro ao salvar seu currículo: ${err.message || "Tente novamente."}`
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

      {/* Dados pessoais */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados pessoais</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Nome completo *
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Idade (opcional)
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
            />
          </div>
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
              Bairro / Região
            </label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Perfil profissional */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Perfil profissional
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Área profissional desejada *
          </label>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={areaProfissional}
            onChange={(e) => setAreaProfissional(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Escolaridade
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ex.: Ensino médio completo, superior em andamento..."
            value={escolaridade}
            onChange={(e) => setEscolaridade(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Formação acadêmica / cursos
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-20"
            value={formacaoAcademica}
            onChange={(e) => setFormacaoAcademica(e.target.value)}
            placeholder="Cursos, faculdades, especializações, treinamentos..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Experiências profissionais
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-24"
            value={experienciasProf}
            onChange={(e) => setExperienciasProf(e.target.value)}
            placeholder="Últimos empregos, funções e tempo de atuação..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Habilidades / competências
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-20"
            value={habilidades}
            onChange={(e) => setHabilidades(e.target.value)}
            placeholder="Ex.: atendimento ao público, caixa, informática básica, cozinha, vendas..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Idiomas (se houver)
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={idiomas}
            onChange={(e) => setIdiomas(e.target.value)}
            placeholder="Ex.: Inglês básico, Espanhol intermediário..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Resumo profissional (opcional)
          </label>
          <textarea
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm h-20"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            placeholder="Faça um breve resumo de quem você é profissionalmente."
          />
        </div>
      </div>

      {/* Arquivos */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Arquivos (opcional)
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Foto para o currículo (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full text-xs"
            onChange={(e) => setFotoFile(e.target.files[0] || null)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Currículo em PDF (se já tiver pronto)
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="mt-1 w-full text-xs"
            onChange={(e) => setPdfFile(e.target.files[0] || null)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Você pode enviar apenas o formulário, apenas o PDF ou os dois.
          </p>
        </div>
      </div>

      {/* Contato */}
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
          Pelo menos um desses canais (telefone, WhatsApp ou e-mail) será
          exibido para contato das empresas.
        </p>
      </div>

      {/* Checkbox de confirmação */}
      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações preenchidas são verdadeiras e autorizo que
            meu currículo seja exibido para empresas na plataforma Classilagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="mt-2 w-full bg-emerald-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {uploading ? "Enviando currículo..." : "Cadastrar currículo"}
      </button>
    </form>
  );
}
