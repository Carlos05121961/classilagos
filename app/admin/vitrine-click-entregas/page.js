"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../supabaseClient";

const TIPOS = [
  { value: "pizza_lanches", label: "Pizza / Lanches" },
  { value: "marmita", label: "Marmita" },
  { value: "restaurante", label: "Restaurante" },
  { value: "farmacia", label: "Farmácia" },
  { value: "agua_gas", label: "Água / Gás" },
  { value: "bebidas", label: "Bebidas" },
  { value: "padaria", label: "Padaria" },
  { value: "pet_delivery", label: "Pet delivery" },
  { value: "frango_assado", label: "Frango assado" },
  { value: "outros", label: "Outros" },
];

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

export default function AdminVitrineClickEntregas() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [fCidade, setFCidade] = useState("Todas");
  const [fSoDelivery, setFSoDelivery] = useState(true);
  const [q, setQ] = useState("");

  const [rows, setRows] = useState([]);

  const cidades = useMemo(
    () => [
      "Maricá",
      "Saquarema",
      "Araruama",
      "Iguaba Grande",
      "São Pedro da Aldeia",
      "Arraial do Cabo",
      "Cabo Frio",
      "Búzios",
      "Rio das Ostras",
    ],
    []
  );

  async function carregar() {
    setLoading(true);

    let query = supabase
      .from("anuncios")
      .select(
        "id, titulo, cidade, bairro, status, categoria, tem_delivery, whatsapp, telefone, whatsapp_delivery, tipos_delivery, vitrine_delivery, vitrine_delivery_ordem"
      )
      .eq("categoria", "lagolistas")
      .eq("status", "ativo")
      .order("vitrine_delivery", { ascending: false })
      .order("vitrine_delivery_ordem", { ascending: true })
      .order("created_at", { ascending: false });

    if (fCidade !== "Todas") query = query.eq("cidade", fCidade);
    if (fSoDelivery) query = query.eq("tem_delivery", true);

    if (q.trim()) {
      // Busca simples (front-end) — suficiente pro admin
      // (Se quiser, depois fazemos ilike no banco.)
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setRows([]);
    } else {
      let base = Array.isArray(data) ? data : [];
      if (q.trim()) {
        const qq = q.trim().toLowerCase();
        base = base.filter((x) =>
          String(x.titulo || "").toLowerCase().includes(qq)
        );
      }
      setRows(base);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fCidade, fSoDelivery]);

  async function salvar(id, patch) {
    setSavingId(id);

    const { error } = await supabase
      .from("anuncios")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao salvar. Veja o console.");
    } else {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
    }

    setSavingId(null);
  }

  function toggleTipo(arr, tipo) {
    const a = safeArray(arr);
    if (a.includes(tipo)) return a.filter((t) => t !== tipo);
    return [...a, tipo];
  }

  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Vitrine Click / Disk-Entregas
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Marque quem entra na vitrine paga e defina ordem, tipos e WhatsApp de atendimento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full sm:w-[220px]">
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                Cidade
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                value={fCidade}
                onChange={(e) => setFCidade(e.target.value)}
              >
                <option value="Todas">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-[220px]">
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                Busca por título
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Ex.: Carlinhos do Gás"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") carregar();
                }}
              />
            </div>

            <div className="flex items-center gap-2 mt-6 sm:mt-0">
              <input
                id="soDelivery"
                type="checkbox"
                className="h-4 w-4"
                checked={fSoDelivery}
                onChange={(e) => setFSoDelivery(e.target.checked)}
              />
              <label htmlFor="soDelivery" className="text-sm text-slate-700">
                Só com delivery ativo
              </label>

              <button
                type="button"
                onClick={carregar}
                className="ml-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-extrabold text-white hover:bg-slate-800"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              {loading ? "Carregando…" : `${rows.length} anúncios`}
            </p>
            <p className="text-xs text-slate-500">
              Dica: ligue a vitrine e coloque ordem 1..n
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-600">Carregando…</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">Nenhum anúncio encontrado.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rows.map((r) => {
                const tipos = safeArray(r.tipos_delivery);
                const waAtual =
                  (r.whatsapp_delivery || r.whatsapp || r.telefone || "").toString();

                return (
                  <div key={r.id} className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-900">
                          #{r.id} • {r.titulo || "Sem título"}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {r.cidade || "—"}
                          {r.bairro ? ` • ${r.bairro}` : ""} • delivery:{" "}
                          <b>{r.tem_delivery ? "sim" : "não"}</b>
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {TIPOS.map((t) => {
                            const on = tipos.includes(t.value);
                            return (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() =>
                                  salvar(r.id, {
                                    tipos_delivery: toggleTipo(tipos, t.value),
                                  })
                                }
                                disabled={savingId === r.id}
                                className={[
                                  "rounded-full px-3 py-1 text-[11px] font-extrabold border transition",
                                  on
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                                ].join(" ")}
                                title="Clique para ligar/desligar este tipo"
                              >
                                {t.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-[520px]">
                        <div className="rounded-2xl border border-slate-200 p-3">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Na vitrine?
                          </label>
                          <button
                            type="button"
                            disabled={savingId === r.id}
                            onClick={() =>
                              salvar(r.id, { vitrine_delivery: !r.vitrine_delivery })
                            }
                            className={[
                              "w-full rounded-full px-3 py-2 text-xs font-extrabold transition",
                              r.vitrine_delivery
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300",
                            ].join(" ")}
                          >
                            {r.vitrine_delivery ? "ATIVA" : "DESLIGADA"}
                          </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-3">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Ordem
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            value={r.vitrine_delivery_ordem ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setRows((prev) =>
                                prev.map((x) =>
                                  x.id === r.id
                                    ? { ...x, vitrine_delivery_ordem: v === "" ? null : Number(v) }
                                    : x
                                )
                              );
                            }}
                            onBlur={() =>
                              salvar(r.id, {
                                vitrine_delivery_ordem:
                                  r.vitrine_delivery_ordem === "" ? null : r.vitrine_delivery_ordem,
                              })
                            }
                            disabled={savingId === r.id}
                          />
                          <p className="mt-1 text-[10px] text-slate-500">
                            Use 1,2,3… (menor aparece primeiro)
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-3">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            WhatsApp (atendimento)
                          </label>
                          <input
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            value={waAtual}
                            onChange={(e) => {
                              const v = e.target.value;
                              setRows((prev) =>
                                prev.map((x) =>
                                  x.id === r.id ? { ...x, whatsapp_delivery: v } : x
                                )
                              );
                            }}
                            onBlur={() =>
                              salvar(r.id, { whatsapp_delivery: (r.whatsapp_delivery || "").toString() })
                            }
                            disabled={savingId === r.id}
                            placeholder="55DDDNUMERO"
                          />
                          <p className="mt-1 text-[10px] text-slate-500">
                            Prioridade: whatsapp_delivery &gt; whatsapp &gt; telefone
                          </p>
                        </div>
                      </div>
                    </div>

                    {savingId === r.id && (
                      <p className="mt-3 text-xs text-slate-500">Salvando…</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
