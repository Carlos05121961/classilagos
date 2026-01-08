"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// ✅ Card fora do componente (evita remount a cada render)
function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-sm md:text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] md:text-xs text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ✅ listas fora (estabilidade + organização)
const CIDADES = [
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

const AREAS = [
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
  "Beleza / Estética",
  "Gastronomia / Cozinha",
  "Limpeza / Conservação",
  "Segurança / Portaria",
  "Financeiro / Contábil",
  "Marketing / Mídias sociais",
  "Logística / Estoque",
  "Telemarketing / Call Center",
  "Industrial / Produção",
  "Autônomo / Freelancer",
  "Outros",
];

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

  // Foto do currículo
  const [fotoFile, setFotoFile] = useState(null);

  // Checkbox
  const [aceitoTermos, setAceitoTermos] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, [router]);

  // preview da foto
  const fotoPreview = useMemo(() => {
    if (!fotoFile) return null;
    return URL.createObjectURL(fotoFile);
  }, [fotoFile]);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setErro("A foto precisa ser uma imagem (JPG/PNG).");
      setFotoFile(null);
      e.target.value = "";
      return;
    }

    const maxBytes = 1.5 * 1024 * 1024; // 1,5MB
    if (file.size > maxBytes) {
      setErro("A foto está muito pesada. Use uma imagem de até 1,5MB.");
      setFotoFile(null);
      e.target.value = "";
      return;
    }

    setErro("");
    setFotoFile(file);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      setErro("Você precisa estar logado para cadastrar seu currículo.");
      router.push("/login");
      return;
    }

    if (!nome || !cidade || !areaProfissional) {
      setErro("Preencha pelo menos Nome, Cidade e Área profissional.");
      return;
    }

    const contatoPrincipal = whatsapp || telefone || email;
    if (!contatoPrincipal) {
      setErro("Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).");
      return;
    }

    if (!isValidEmail(email)) {
      setErro("Digite um e-mail válido (ou deixe em branco).");
      return;
    }

    if (!aceitoTermos) {
      setErro("Para cadastrar seu currículo, marque a confirmação de responsabilidade.");
      return;
    }

    setUploading(true);

    let fotoUrl = null;

    try {
      const bucket = "anuncios";

      // Upload da foto (opcional)
      if (fotoFile) {
        const ext = fotoFile.name.split(".").pop();
        const path = `curriculos/${user.id}/foto-${Date.now()}.${ext}`;

        const { error: uploadErroFoto } = await supabase.storage.from(bucket).upload(path, fotoFile);
        if (uploadErroFoto) throw uploadErroFoto;

        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
        fotoUrl = publicData?.publicUrl || null;
      }

      const tituloDb = `Currículo - ${nome}${areaProfissional ? ` (${areaProfissional})` : ""}`;

      const descricaoBase =
        resumo?.trim() ||
        experienciasProf?.trim() ||
        formacaoAcademica?.trim() ||
        "Currículo cadastrado no banco de talentos do Classilagos.";

      const { data: inserted, error: insertError } = await supabase
        .from("anuncios")
        .insert({
          user_id: user.id,
          categoria: "curriculo",
          titulo: tituloDb,
          descricao: descricaoBase,
          cidade,
          bairro,

          nome_contato: nome,
          contato: contatoPrincipal,
          telefone: telefone || null,
          whatsapp: whatsapp || null,
          email: email || null,

          area_profissional: areaProfissional,
          escolaridade_minima: escolaridade || null,
          formacao_academica: formacaoAcademica || null,
          experiencias_profissionais: experienciasProf || null,
          habilidades: habilidades || null,
          idiomas: idiomas || null,

          curriculo_foto_url: fotoUrl,

          status: "ativo",
          destaque: false,
        })
        .select("id")
        .single();

      if (insertError) {
        setErro(`Erro ao salvar seu currículo: ${insertError.message || "Tente novamente."}`);
        return;
      }

      setSucesso("Currículo cadastrado com sucesso! Redirecionando…");

      setTimeout(() => {
        router.push(`/anuncios/${inserted.id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setErro(`Erro ao salvar seu currículo: ${err?.message || "Tente novamente."}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-700">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs md:text-sm text-emerald-700">
          {sucesso}
        </div>
      )}

      <Card title="Dados pessoais" subtitle="Preencha o básico para aparecer no banco de talentos.">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Idade (opcional)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Cidade <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Bairro / Região</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Perfil profissional" subtitle="Escolha a área para empresas te encontrarem com facilidade.">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">
              Área profissional desejada <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={areaProfissional}
              onChange={(e) => setAreaProfissional(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Escolaridade</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Ex.: Ensino médio completo, superior em andamento..."
              value={escolaridade}
              onChange={(e) => setEscolaridade(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Formação acadêmica / cursos</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={formacaoAcademica}
              onChange={(e) => setFormacaoAcademica(e.target.value)}
              placeholder="Cursos, faculdades, especializações, treinamentos..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Experiências profissionais</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={experienciasProf}
              onChange={(e) => setExperienciasProf(e.target.value)}
              placeholder="Últimos empregos, funções e tempo de atuação..."
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Habilidades / competências</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={habilidades}
                onChange={(e) => setHabilidades(e.target.value)}
                placeholder="Ex.: atendimento, vendas, informática, cozinha..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Resumo profissional</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder="Breve resumo de quem você é profissionalmente."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Idiomas (se houver)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={idiomas}
              onChange={(e) => setIdiomas(e.target.value)}
              placeholder="Ex.: Inglês básico, Espanhol intermediário..."
            />
          </div>
        </div>
      </Card>

      <Card title="Foto do currículo" subtitle="Opcional. Ajuda a dar credibilidade.">
        <div className="grid gap-3 md:grid-cols-[160px,1fr] items-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="aspect-square flex items-center justify-center text-[11px] text-slate-500">
              {fotoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoPreview} alt="Preview da foto" className="h-full w-full object-cover bg-white" />
              ) : (
                "Sem foto"
              )}
            </div>
          </div>

          <div>
            <input type="file" accept="image/*" onChange={handleFotoChange} className="text-sm" />
            <p className="mt-2 text-[11px] text-slate-500">JPG/PNG até 1,5MB.</p>

            {fotoFile && (
              <button
                type="button"
                onClick={() => setFotoFile(null)}
                className="mt-2 inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                Remover foto
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card title="Contatos" subtitle="Pelo menos um canal é obrigatório.">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">Pelo menos um desses canais será exibido para empresas.</p>
      </Card>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <label className="flex items-start gap-2 text-[11px] md:text-xs text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações são verdadeiras e autorizo a exibição do meu currículo para empresas na plataforma
            Classilagos.
          </span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 w-full bg-emerald-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {uploading ? "Enviando currículo..." : "Cadastrar currículo"}
        </button>
      </div>
    </form>
  );
}
