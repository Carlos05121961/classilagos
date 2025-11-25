"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

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
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  }

  async function salvarDados(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!nome.trim()) {
      setErro("Informe seu nome completo.");
      return;
    }
    if (!cidade.trim()) {
      setErro("Informe sua cidade.");
      return;
    }
    if (!whatsapp.trim()) {
      setErro("Informe um telefone/WhatsApp válido.");
      return;
    }
    if (!cep.trim()) {
      setErro("Informe o CEP.");
      return;
    }
    if (!endereco.trim()) {
      setErro("Informe o endereço (rua, avenida...).");
      return;
    }
    if (!numero.trim()) {
      setErro("Informe o número do imóvel.");
      return;
    }
    if (!bairro.trim()) {
      setErro("Informe o bairro.");
      return;
    }
    if (!uf.trim()) {
      setErro("Informe a UF (estado).");
      return;
    }
    if (!dataNascimento) {
      setErro("Informe sua data de nascimento.");
      return;
    }

    const idade = calcularIdade(dataNascimento);
    if (idade !== null && idade < 18) {
      setErro("Para usar o Classilagos é necessário ter 18 anos ou mais.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.auth.updateUser({
      // e-mail não será alterado aqui, apenas metadados
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

    if (error) {
      console.error(error);
      setErro("Não foi possível salvar as alterações. Tente novamente.");
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
          Editar cadastro
        </h1>
        <p className="text-xs text-slate-600 mb-5">
          Atualize suas informações pessoais e de contato.
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

          {/* CEP */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              CEP *
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
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Endereço (rua, avenida...) *
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Número *
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
                Bairro *
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
                UF *
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

          {/* BOTÃO SALVAR */}
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
