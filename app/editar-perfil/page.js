"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function EditarPerfilPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // campos
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // busca usuário
  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/login");
        return;
      }

      const u = data.user;

      setNome(u.user_metadata?.nome || "");
      setCidade(u.user_metadata?.cidade || "");
      setWhatsapp(u.user_metadata?.whatsapp || "");
      setEmail(u.email || "");

      setLoading(false);
    }

    carregar();
  }, [router]);

  async function salvarDados(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setSalvando(true);

    // atualizar metadados
    const { error } = await supabase.auth.updateUser({
      email,
      data: {
        nome,
        cidade,
        whatsapp
      }
    });

    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar as alterações.");
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
        <h1 className="text-xl font-bold text-slate-900 mb-1">
          Editar meu cadastro
        </h1>
        <p className="text-xs text-slate-600 mb-5">
          Atualize suas informações abaixo.
        </p>

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
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Cidade
            </label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
              placeholder="(21) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="mt-2 w-full rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Salvar alterações"}
          </button>
        </form>
      </div>
    </main>
  );
}
