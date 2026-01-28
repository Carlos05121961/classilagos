"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}
function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

// ✅ segurança: só aceita caminhos internos
function sanitizeNext(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!v.startsWith("/")) return "";
  if (v.startsWith("//")) return "";
  return v;
}

// ✅ cidades fixas (Região dos Lagos + Maricá)
const CIDADES = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro d'Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
];

export default function PerfilPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const [email, setEmail] = useState("");

  // ✅ Destino pós-perfil (vem do callback: /perfil?next=/anunciar/curriculo etc)
  const [nextPath, setNextPath] = useState("");

  // Campos do perfil (salvos em user_metadata do Supabase Auth)
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [endereco, setEndereco] = useState("");

  // Senha (opcional)
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const whatsappLimpo = useMemo(() => onlyDigits(whatsapp), [whatsapp]);

  // Número oficial do Classilagos para confirmar WhatsApp (coloque no .env se quiser)
  // ex: NEXT_PUBLIC_CLASSILAGOS_WHATSAPP=5521999999999
  const numeroOficial = useMemo(() => {
    const n = onlyDigits(process.env.NEXT_PUBLIC_CLASSILAGOS_WHATSAPP || "");
    return n || "55"; // fallback (você deve definir o número oficial)
  }, []);

  const confirmarWhatsAppLink = useMemo(() => {
    const msg = `Olá! Quero confirmar meu WhatsApp no Classilagos.%0A%0AMeu e-mail: ${encodeURIComponent(
      normalizeEmail(email)
    )}%0AMeu WhatsApp: ${encodeURIComponent(whatsappLimpo)}`;
    return `https://wa.me/${numeroOficial}?text=${msg}`;
  }, [numeroOficial, email, whatsappLimpo]);

  // ✅ pega next da URL sem complicar (sem useSearchParams)
  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      const rawNext = qs.get("next") || "";
      setNextPath(sanitizeNext(rawNext));
    } catch {
      setNextPath("");
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setErro("");
      setOk("");
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();
      if (!alive) return;

      if (error) {
        console.error("getUser error:", error);
      }

      const user = data?.user;

      // Se não estiver logado, manda para login
      if (!user) {
        router.replace("/login");
        return;
      }

      // Se o e-mail não estiver confirmado, não deixa seguir
      if (!user.email_confirmed_at) {
        setEmail(user.email || "");
        setLoading(false);
        setErro("Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e confirme o acesso.");
        return;
      }

      const meta = user.user_metadata || {};

      setEmail(user.email || "");
      setNome(meta.nome || "");
      setCidade(meta.cidade || "");
      setWhatsapp(meta.whatsapp || "");
      setEndereco(meta.endereco || "");

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, [router]);

  async function handleSalvar(e) {
    e.preventDefault();
    setErro("");
    setOk("");

    const nomeLimpo = String(nome || "").trim();
    const cidadeLimpa = String(cidade || "").trim();
    const whats = onlyDigits(whatsapp);
    const end = String(endereco || "").trim();

    // validações básicas (sem travar demais)
    const partesNome = nomeLimpo.split(" ").filter(Boolean);
    if (partesNome.length < 2) return setErro("Por favor, informe nome e sobrenome.");
    if (!cidadeLimpa) return setErro("Informe sua cidade.");
    if (whats.length < 10) return setErro("Informe seu WhatsApp com DDD (apenas números).");

    // senha opcional
    const querSenha = String(senha || "").length > 0 || String(confirmarSenha || "").length > 0;
    if (querSenha) {
      if (senha.length < 6) return setErro("A senha deve ter pelo menos 6 caracteres.");
      if (senha !== confirmarSenha) return setErro("A confirmação de senha não confere.");
    }

    setSaving(true);

    try {
      const payload = {
        data: {
          nome: nomeLimpo,
          cidade: cidadeLimpa,
          whatsapp: whats,
          endereco: end,
          whatsapp_confirmado: false,
        },
      };

      if (querSenha) payload.password = senha;

      const { error } = await supabase.auth.updateUser(payload);

      if (error) {
        console.error("updateUser error:", error);
        setErro("Não foi possível salvar seu perfil agora. Tente novamente em instantes.");
        return;
      }

setOk("Perfil salvo com sucesso! ✅");
setSenha("");
setConfirmarSenha("");

// ✅ Depois de salvar: se veio next, vai pra ele; senão, painel
router.replace(nextPath || "/painel");

    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-slate-700 text-sm">Carregando seu perfil...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* topo */}
        <div className="rounded-3xl bg-gradient-to-r from-cyan-700 via-teal-600 to-emerald-500 text-white shadow-lg p-6 mb-6">
          <p className="text-xs tracking-widest opacity-90">PERFIL DO USUÁRIO</p>
          <h1 className="text-2xl font-semibold mt-1">Complete seu perfil</h1>
          <p className="text-sm opacity-95 mt-2">
            É rápido e só uma vez. Assim seus anúncios ficam mais fáceis e automáticos.
          </p>
          <p className="text-xs opacity-90 mt-3">
            Seu e-mail: <span className="font-semibold">{email || "—"}</span>
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
            {erro}
          </div>
        )}

        {ok && (
          <div className="mb-4 rounded-md bg-emerald-100 border border-emerald-300 px-3 py-2 text-sm text-emerald-800">
            {ok}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSalvar} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome completo *
              </label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome e sobrenome"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cidade *
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
              >
                <option value="">Selecione sua cidade</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Isso ajuda o Classilagos a mostrar melhor seus anúncios na sua região.
              </p>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                WhatsApp *
              </label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="DDD + número (somente números)"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <div className="mt-2">
                <a
                  href={confirmarWhatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border ${
                    whatsappLimpo.length >= 10
                      ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      : "border-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
                  }`}
                  title="Confirmar WhatsApp"
                >
                  Confirmar WhatsApp pelo WhatsApp
                </a>
                <p className="text-[11px] text-slate-500 mt-1">
                  Você vai enviar uma mensagem automática para confirmar seu número (sem código/SMS).
                </p>
              </div>
            </div>

            {/* Endereço (opcional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Endereço (opcional)
              </label>
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, bairro (opcional)"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Senha (opcional) */}
            <div className="pt-2 border-t border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Criar senha (opcional)
              </h2>
              <p className="text-[11px] text-slate-500 mb-3">
                Você pode usar só o link por e-mail, mas a senha facilita entrar depois.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Senha</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2.5 px-6 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Salvar perfil"}
              </button>

              <Link
                href="/painel"
                className="w-full sm:w-auto text-center rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold py-2.5 px-6"
              >
                Voltar ao painel
              </Link>
            </div>
          </form>
        </div>

        <p className="text-[11px] text-slate-500 mt-4">
          Dica: depois de salvar seu perfil, você pode clicar em <strong>Anuncie grátis</strong> e seus dados vão ajudar a preencher mais rápido.
        </p>
      </div>
    </main>
  );
}
