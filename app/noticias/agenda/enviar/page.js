"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";

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

const CATEGORIAS = [
  "Show",
  "Festival",
  "Feira",
  "Gastronomia",
  "Cultura",
  "Esporte",
  "Religioso",
  "Teatro",
  "Outros",
];

export default function EnviarEventoPage() {
  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [categoria, setCategoria] = useState("Show");
  const [local, setLocal] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [linkIngresso, setLinkIngresso] = useState("");
  const [contato, setContato] = useState("");
  const [descricao, setDescricao] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  const valido = useMemo(() => {
    return titulo.trim().length >= 5 && cidade && dataInicio;
  }, [titulo, cidade, dataInicio]);

  async function handleEnviar() {
    setErro("");
    setMsg("");

    if (!valido) {
      setErro("Preencha pelo menos: título (min. 5), cidade e data.");
      return;
    }

    try {
      setLoading(true);

      // pega usuário se estiver logado (se não estiver, user_id fica null)
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || null;

      const payload = {
        user_id: userId,
        titulo: titulo.trim(),
        cidade,
        categoria,
        local: local.trim() || null,
        endereco: endereco.trim() || null,
        data_inicio: dataInicio,
        hora_inicio: horaInicio.trim() || null,
        link_ingresso: linkIngresso.trim() || null,
        contato: contato.trim() || null,
        descricao: descricao.trim() || null,
        // IMPORTANTE: pela RLS, tem que ser pendente e destaque false
        status: "pendente",
        destaque: false,
      };

      const { error } = await supabase.from("agenda_eventos").insert(payload);

      if (error) throw error;

      setMsg("Evento enviado com sucesso! ✅ Ele será revisado e publicado em breve.");
      setTitulo("");
      setLocal("");
      setEndereco("");
      setDataInicio("");
      setHoraInicio("");
      setLinkIngresso("");
      setContato("");
      setDescricao("");
      setCidade("Maricá");
      setCategoria("Show");
    } catch (e) {
      console.error(e);
      setErro("Não foi possível enviar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-5">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias • Agenda</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
            Enviar evento para a Agenda
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-600">
            Seu evento entra como <b>pendente</b> e a equipe Classilagos publica após revisão.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/noticias/agenda"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar para Agenda
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
          {erro && (
            <div className="mb-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3">
              {erro}
            </div>
          )}
          {msg && (
            <div className="mb-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-2xl px-4 py-3">
              {msg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600">Título *</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Show de verão, Feira gastronômica..."
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">Cidade *</label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600">Local</label>
              <input
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Ex.: Orla, Praça, Clube, Casa de show..."
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600">Endereço</label>
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro (opcional)"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">Data *</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">Horário</label>
              <input
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                placeholder="Ex.: 20:00"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600">Link (ingresso / instagram / site)</label>
              <input
                value={linkIngresso}
                onChange={(e) => setLinkIngresso(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600">Contato</label>
              <input
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                placeholder="WhatsApp / telefone / e-mail (texto)"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte mais detalhes (opcional)"
                rows={4}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleEnviar}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar evento"}
            </button>

            <Link
              href="/noticias/agenda"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ver agenda
            </Link>
          </div>

          <p className="mt-3 text-[10px] text-slate-400">
            Importante: eventos enviados aparecem como <b>pendente</b> até aprovação.
          </p>
        </div>
      </section>
    </main>
  );
}
