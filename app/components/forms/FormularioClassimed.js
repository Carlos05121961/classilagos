"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import { syncUserMetadataFromForm } from "../../../lib/syncUserMetadata";

function isValidUrl(url) {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function FormularioClassimed() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [especialidade, setEspecialidade] = useState("");
  const [descricao, setDescricao] = useState("");

  const [nomeProfissional, setNomeProfissional] = useState("");
  const [nomeClinica, setNomeClinica] = useState("");
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [atendeDomicilio, setAtendeDomicilio] = useState(false);
  const [faixaPreco, setFaixaPreco] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");

  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [capaFile, setCapaFile] = useState(null);
  const [galeriaFiles, setGaleriaFiles] = useState([]);

  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  const especialidades = [
    "Psicologia",
    "Psiquiatria",
    "Clínica geral",
    "Pediatria",
    "Ginecologia",
    "Nutrição",
    "Fisioterapia",
    "Fonoaudiologia",
    "Odontologia",
    "Massoterapia / Terapias integrativas",
    "Pilates",
    "Educação física / Personal",
    "Veterinário",
    "Outras especialidades",
  ];

  async function uploadOne({ bucket, file, path }) {
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file);
    if (upErr) throw upErr;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  }

  const handleLogoChange = (e) => {
    const f = e.target.files?.[0] || null;
    setLogoFile(f);
  };

  const handleCapaChange = (e) => {
    const f = e.target.files?.[0] || null;
    setCapaFile(f);
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGaleriaFiles(files.slice(0, 7));
  };

  function validarAntesDeEnviar() {
    const contatoPrincipal = whatsapp || telefone || email;

    if (!titulo || !cidade || !especialidade || !descricao) {
      return "Preencha pelo menos o título, cidade, especialidade e a descrição do serviço.";
    }

    if (!contatoPrincipal) {
      return "Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).";
    }

    if (!email.trim()) {
      return "Informe seu e-mail para publicar o anúncio.";
    }

    if (!aceitoTermos) {
      return "Para publicar no Classimed, marque a opção confirmando que as informações são verdadeiras.";
    }

    if (!capaFile) {
      return "Envie a FOTO DE CAPA (obrigatória). Ela será a imagem principal do seu anúncio.";
    }

    if (!isValidUrl(siteUrl.trim())) {
      return "O link do site parece inválido.";
    }

    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const valid = validarAntesDeEnviar();
    if (valid) {
      setErro(valid);
      return;
    }

    const contatoPrincipal = whatsapp.trim() || telefone.trim() || email.trim();

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ownerKey =
        user?.id || `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      if (user) {
        await syncUserMetadataFromForm(user, {
          nome: nomeProfissional || nomeClinica,
          cidade,
          whatsapp,
          telefone,
          email,
          origem: "anuncio_classimed",
        });
      }

      const bucket = "anuncios";
      const now = Date.now();

      let logoUrl = null;
      if (logoFile) {
        const ext = (logoFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `servicos/${ownerKey}/classimed/logo-${now}.${ext}`;
        logoUrl = await uploadOne({ bucket, file: logoFile, path });
      }

      let capaUrl = null;
      {
        const ext = (capaFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `servicos/${ownerKey}/classimed/capa-${now}.${ext}`;
        capaUrl = await uploadOne({ bucket, file: capaFile, path });
      }

      if (!capaUrl) {
        setErro("Não foi possível gerar a URL pública da capa. Tente novamente.");
        return;
      }

      let galeriaUrls = [];
      if (galeriaFiles.length > 0) {
        const uploads = await Promise.all(
          galeriaFiles.map(async (file, i) => {
            const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
            const path = `servicos/${ownerKey}/classimed/galeria-${now}-${i}.${ext}`;
            return await uploadOne({ bucket, file, path });
          })
        );
        galeriaUrls = uploads.filter(Boolean);
      }

      const imagens = [capaUrl, ...galeriaUrls];

      const descricaoFinal = `${descricao}

=== Informações complementares ===
Especialidade: ${especialidade || "-"}
Profissional / responsável: ${nomeProfissional || "-"}
Clínica / consultório: ${nomeClinica || "-"}
Horário de atendimento: ${horarioAtendimento || "-"}
Atende em domicílio: ${atendeDomicilio ? "Sim" : "Não"}
Faixa de preço: ${faixaPreco || "-"}
Site: ${siteUrl || "-"}
Instagram: ${instagram || "-"}
`.trim();

      const payload = {
        user_id: user?.id || null,
        categoria: "servico",
        subcategoria_servico: "classimed",
        titulo: titulo.trim(),
        descricao: descricaoFinal,
        cidade,
        bairro: bairro.trim(),

        nome_contato: nomeProfissional.trim(),
        nome_negocio: nomeClinica.trim(),
        area_profissional: especialidade,
        horario_atendimento: horarioAtendimento.trim(),
        atende_domicilio: atendeDomicilio,
        faixa_preco: faixaPreco.trim(),
        site_url: siteUrl.trim(),
        instagram: instagram.trim(),

        telefone: telefone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        contato: contatoPrincipal,

        imagens,
        logo_url: logoUrl || null,

        status: user ? "ativo" : "pendente",
        destaque: false,

        email_confirmado: !!user,
        email_confirmado_em: user ? new Date().toISOString() : null,
        criado_sem_login: !user,
      };

      const { data, error: insertError } = await supabase
        .from("anuncios")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) {
        console.error("Erro ao salvar anúncio Classimed:", insertError);
        setErro(`Erro ao salvar seu anúncio. Tente novamente: ${insertError.message || ""}`);
        return;
      }

      // 🔥 CONVERSÃO GOOGLE ADS
if (typeof window !== "undefined" && window.gtag) {
  window.gtag('event', 'conversion', {
    'send_to': 'AW-17865509628/j9HeCPy0w50cEPyV-MZC'
  });
}

      if (!user) {
        const redirectTo = `${window.location.origin}/auth/confirmar-anuncio?anuncio=${data.id}`;

        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectTo,
          },
        });

        if (signInError) {
          console.error("Erro ao enviar confirmação por e-mail:", signInError);

          const msg = String(signInError.message || "").toLowerCase();

          if (msg.includes("security purposes") || msg.includes("only request this after")) {
            setSucesso(
              "Seu anúncio foi enviado com sucesso e está pendente. Aguarde cerca de 1 minuto e verifique seu e-mail para confirmar o cadastro."
            );
          } else {
            setSucesso(
              "Seu anúncio foi enviado e está pendente. Houve um problema ao enviar o e-mail de confirmação agora. Tente entrar novamente mais tarde."
            );
          }

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${data.id}`
            );
          }, 1500);
        } else {
          setSucesso("Anúncio enviado com sucesso! Redirecionando...");

          setTimeout(() => {
            router.push(
              `/auth/check-email?email=${encodeURIComponent(email.trim())}&anuncio=${data.id}`
            );
          }, 1500);
        }
      } else {
        setSucesso("Anúncio Classimed publicado com sucesso! Redirecionando...");

        setTimeout(() => {
          router.push("/painel/meus-anuncios");
        }, 1200);
      }

      setTitulo("");
      setCidade("");
      setBairro("");
      setEspecialidade("");
      setDescricao("");
      setNomeProfissional("");
      setNomeClinica("");
      setHorarioAtendimento("");
      setAtendeDomicilio(false);
      setFaixaPreco("");
      setSiteUrl("");
      setInstagram("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setLogoFile(null);
      setCapaFile(null);
      setGaleriaFiles([]);
      setAceitoTermos(false);
    } catch (err) {
      console.error(err);
      setErro(`Erro ao salvar seu anúncio. Tente novamente: ${err.message || "Erro inesperado."}`);
    } finally {
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

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">Título do anúncio *</label>
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Escreva um título claro, por exemplo:
              <br />
              <strong>“Psicóloga clínica – Terapia cognitivo-comportamental em Maricá”</strong>.
            </div>
          </div>
        </div>

        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Ex.: Psicóloga clínica – Terapia cognitivo-comportamental em Maricá"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Localização</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Cidade *</label>
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
            <label className="block text-xs font-medium text-slate-700">Bairro / Região</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Ex.: Centro, Itaipuaçu, Bacaxá..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">Especialidade / área de atuação *</label>
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-64 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Escolha a área principal do seu atendimento. Isso organiza o Classimed e facilita a busca dos usuários.
            </div>
          </div>
        </div>

        <select
          className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {especialidades.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800">Descrição do serviço *</label>
          <div className="relative group text-[11px] text-slate-500 cursor-help">
            <span>ℹ</span>
            <div className="absolute right-0 top-5 hidden w-72 rounded-md bg-slate-900 text-white text-[11px] px-3 py-2 group-hover:block z-20 shadow-lg">
              Explique sua forma de atendimento, público-alvo, convênios (se houver), cidades atendidas e diferenciais.
            </div>
          </div>
        </div>

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm h-32"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Atendo adultos e adolescentes, presencial em Maricá e online..."
          required
        />
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Profissional / clínica</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Nome do profissional / responsável</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={nomeProfissional}
              onChange={(e) => setNomeProfissional(e.target.value)}
              placeholder="Ex.: Dra. Maria Silva"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Clínica / consultório (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={nomeClinica}
              onChange={(e) => setNomeClinica(e.target.value)}
              placeholder="Ex.: Espaço Vida Plena"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700">Horário de atendimento</label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={horarioAtendimento}
                onChange={(e) => setHorarioAtendimento(e.target.value)}
                placeholder="Ex.: Seg a sex, 9h às 18h"
              />
            </div>

            <label className="mt-5 flex items-center gap-2 text-[11px] text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={atendeDomicilio}
                onChange={(e) => setAtendeDomicilio(e.target.checked)}
              />
              Atende em domicílio
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Faixa de preço (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={faixaPreco}
              onChange={(e) => setFaixaPreco(e.target.value)}
              placeholder="Ex.: Sessões a partir de R$ 150"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700">Site / página (opcional)</label>
              <input
                type="url"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Instagram (opcional)</label>
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
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Fotos e logomarca (no topo)</h2>
        <p className="text-[11px] text-slate-500">
          Recomendado: JPG/PNG até ~2MB. A capa vira a foto principal do card. A logomarca é opcional.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">Logomarca (opcional)</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Sua logo aparece junto com as fotos.
            </p>
            <input
              type="file"
              accept="image/*"
              className="mt-3 w-full text-xs"
              onChange={handleLogoChange}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold text-slate-700">Foto de capa (obrigatória) *</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Essa deve ser a foto mais bonita do ambiente, consultório ou fachada.
            </p>
            <input
              type="file"
              accept="image/*"
              className="mt-3 w-full text-xs"
              onChange={handleCapaChange}
              required
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold text-slate-700">Galeria (opcional) — até 7 fotos</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Fotos extras: ambiente, equipe, equipamentos, sala, detalhes…
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-3 w-full text-xs"
            onChange={handleGaleriaChange}
          />
          {galeriaFiles.length > 0 && (
            <p className="mt-2 text-[11px] text-slate-500">
              {galeriaFiles.length} arquivo(s) selecionado(s).
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h2 className="text-sm font-semibold text-slate-900">Contatos</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">Telefone</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">WhatsApp</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Pelo menos um desses canais será exibido para contato dos pacientes.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-start gap-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={aceitoTermos}
            onChange={(e) => setAceitoTermos(e.target.checked)}
          />
          <span>
            Declaro que as informações preenchidas são verdadeiras e autorizo que este anúncio seja exibido no Classimed / Classilagos para pacientes da Região dos Lagos.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="mt-2 w-full bg-emerald-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {uploading ? "Publicando serviço..." : "Publicar meu serviço em saúde"}
      </button>
    </form>
  );
}
