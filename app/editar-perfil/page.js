"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import PremiumButton from "../components/PremiumButton";

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

  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }

      const u = data.user;
      const m = u.user_metadata || {};

      setNome(m.nome || "");
      setCidade(m.cidade || "");
      setWhatsapp(m.whatsapp || "");
      setCep(m.cep || "");
      setEndereco(m.endereco || "");
      setNumero(m.numero || "");
      setBairro(m.bairro || "");
      setUf(m.uf || "");
      setDataNascimento(m.data_nascimento || "");
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

    if (!nome || !cidade || !whatsapp || !cep || !endereco || !numero || !bairro || !uf || !dataNascimento) {
      setErro("Preencha os campos obrigatórios.");
      return;
    }

    const idade = calcularIdade(dataNascimento);
    if (idade !== null && idade < 18) {
      setErro("É necessário ter 18 anos ou mais.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        nome,
        cidade,
        whatsapp,
        cep,
        endereco,
        numero,
        bairro,
        uf,
        data_nascimento: dataNascimento,
      },
    });

    setSalvando(false);

    if (!error) {
      router.back();
    } else {
      setErro("Erro ao salvar. Tente novamente.");
    }
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Carregando…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">

        {/* 🔝 TARJA SUPERIOR */}
        <div className="mb-6 rounded-3xl p-6 text-white shadow-lg bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500">
          <h1 className="text-2xl font-bold mb-1">Complete seu perfil</h1>
          <p className="text-sm opacity-95">
            É rápido e só uma vez. Depois você continua seu anúncio.
          </p>
          <p className="mt-1 text-xs opacity-80">
            Seu e-mail: {email}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={salvarDados}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3 text-sm"
        >
          <input className="w-full rounded-xl border px-3 py-2" placeholder="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2" placeholder="Cidade *" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2" placeholder="WhatsApp *" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2" placeholder="CEP *" value={cep} onChange={(e) => setCep(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2" placeholder="Endereço *" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2" placeholder="Número *" value={numero} onChange={(e) => setNumero(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2" placeholder="Bairro *" value={bairro} onChange={(e) => setBairro(e.target.value)} />
          <input className="w-full rounded-xl border px-3 py-2 uppercase" placeholder="UF *" value={uf} onChange={(e) => setUf(e.target.value)} />
          <input type="date" className="w-full rounded-xl border px-3 py-2" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />

          {erro && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              {erro}
            </div>
          )}

          {/* 🔽 BOTÃO FINAL */}
          <PremiumButton
            type="submit"
            disabled={salvando}
            variant="primary"
            className="mt-4 bg-gradient-to-r from-orange-400 via-pink-500 to-cyan-400 shadow-[0_0_18px_rgba(255,140,0,0.45)] hover:scale-[1.03]"
          >
            {salvando ? "Salvando…" : "Salvar e continuar →"}
          </PremiumButton>
        </form>
      </div>
    </main>
  );
}
