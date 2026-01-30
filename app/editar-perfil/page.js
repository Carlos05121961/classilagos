"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  if (v.includes("http:") || v.includes("https:")) return "";
  return v;
}

function getPostAuthRedirect() {
  try {
    return sanitizeNext(localStorage.getItem("postAuthRedirect") || "");
  } catch {
    return "";
  }
}

function clearPostAuthRedirect() {
  try {
    localStorage.removeItem("postAuthRedirect");
  } catch {}
}

export default function EditarPerfilPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [uf, setUf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // ✅ destino (quando veio da land/cadastro)
  const destino = useMemo(() => getPostAuthRedirect(), []);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/login");
        return;
      }

      const u = data.user;
      const meta = u.user_metadata || {};

      setNome(meta.nome || "");
      setCidade(meta.cidade || "");
      setWhatsapp(meta.whatsapp || "");
      setCep(meta.cep || "");
      setEndereco(meta.endereco || "");
      setNumero(meta.numero || "");
      setBairro(meta.bairro || "");
      setUf(meta.uf || "");
      setDataNascimento(meta.data_nascimento || "");
      setEmail(u.email || "");

      setLoading(false);
    }

    carregar();
  }, [router]);

  function calcularIdade(dateStr) {
    if (!dateStr) return null;
    const hoje = new Date();
    const nasc = new Date(dateStr);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  async function salvarDados(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // ✅ essenciais (rápidos)
    if (!nome.trim()) return setErro("Informe seu nome completo.");
    if (!cidade.trim()) return setErro("Informe sua cidade.");
    if (!whatsapp.trim()) return setErro("Informe um telefone/WhatsApp válido.");
    if (!dataNascimento) return setErro("Informe sua data de nascimento.");

    const idade = calcularIdade(dataNascimento);
    if (idade !== null && idade < 18) {
      return setErro("Para usar o Classilagos é necessário ter 18 anos ou mais.");
    }

    setSalvando(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        nome: nome.trim(),
        cidade: cidade.trim(),
        whatsapp: whatsapp.trim(),
        // ✅ agora opcionais (como você quer)
        cep: String(cep || "").trim(),
        endereco: String(endereco || "").trim(),
        numero: String(numero || "").trim(),
        bairro: String(bairro || "").trim(),
        uf: String(uf || "").trim().toUpperCase(),
        data_nascimento: dataNascimento,
      },
    });

    setSalvando(false);

    if (error) {
      console.error(error);
      setErro("Não foi possível salvar as alterações. Tente novamente.");
      return;
    }

    // ✅ se existe destino (land/cadastro), volta automaticamente
    if (destino) {
      clearPostAuthRedirect();
      router.replace(destino);
      return;
    }

    setMensagem("Dados atualizados com sucesso!");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        Carregando dados…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5FBFF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-7">
        {/* Topo: etapa */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700">
              Etapa 1 de 2 • Dados rápidos
            </div>
            <div className="text-[11px] text-slate-500">
              {destino ? "Você volta automaticamente" : "Atualize quando quiser"}
            </div>
          </div>

          {/* barra progresso */}
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-1/2 bg-emerald-500 rounded-full" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900 mb-1">
            Complete seu perfil
          </h1>

          <p className="text-xs text-slate-600">
            É rápido e ajuda as empresas a confiarem nas informações.
            {destino ? (
              <>
                {" "}
                Depois de salvar, você será levado de volta para continuar seu anúncio.
              </>
            ) : null}
          </p>
        </div>

        {erro && (
          <div className="mb-3 rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-700">
            {mensagem}
          </div>
        )}

        <form onSubmit={salvarDados} className="space-y-3 text-xs">
          {/* NOME */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nome completo *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
              placeholder="Ex.: Maria Silva"
            />
          </div>

          {/* CIDADE */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Cidade *
            </label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
              placeholder="Ex.: Maricá"
            />
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              WhatsApp / Telefone *
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
              placeholder="Ex.: (21) 99999-9999"
            />
          </div>

          {/* EMAIL (SOMENTE LEITURA) */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              E-mail (não editável)
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* DATA DE NASCIMENTO */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Data de nascimento *
            </label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          {/* Dados opcionais */}
          <div className="pt-1">
            <div className="text-[11px] text-slate-500 mb-2">
              Endereço é opcional (você pode preencher depois).
            </div>

            {/* CEP */}
            <div className="mb-3">
              <label className="block text-slate-700 font-semibold mb-1">
                CEP (opcional)
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
                placeholder="Ex.: 28900-000"
              />
            </div>

            {/* ENDEREÇO + NÚMERO */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Endereço (opcional)
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Rua, avenida..."
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nº (opcional)
                </label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* BAIRRO + UF */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Bairro (opcional)
                </label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  UF (opcional)
                </label>
                <input
                  type="text"
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                  maxLength={2}
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm uppercase"
                  placeholder="RJ"
                />
              </div>
            </div>
          </div>

          {/* BOTÕES */}
          <button
            type="submit"
            disabled={salvando}
            className="mt-2 w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 disabled:opacity-60"
          >
            {salvando ? "Salvando…" : destino ? "Salvar e continuar →" : "Salvar alterações"}
          </button>

          {destino ? (
            <p className="text-[11px] text-slate-500 text-center">
              Você será redirecionado automaticamente para continuar seu anúncio.
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 text-center">
              Classilagos • Dados protegidos • Plataforma gratuita
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
