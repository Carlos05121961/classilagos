"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

const TIPOS_MAP = {
  pizza_lanches: "Pizza / Lanches",
  marmita: "Marmita",
  restaurante: "Restaurante",
  farmacia: "Farmácia",
  agua_gas: "Água / Gás",
  bebidas: "Bebidas",
  padaria: "Padaria",
  pet_delivery: "Pet delivery",
  frango_assado: "Frango assado",
  outros: "Outros",
};

const TIPOS_KEYS = Object.keys(TIPOS_MAP);

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function normalizeWhatsAppBR(numberRaw) {
  let n = onlyDigits(numberRaw);
  while (n.startsWith("0")) n = n.slice(1);
  if (!n) return "";
  if (n.startsWith("55")) return n;
  if (n.length === 10 || n.length === 11) return `55${n}`;
  return n;
}

function buildWaLink(whats, titulo) {
  const n = normalizeWhatsAppBR(whats);
  if (!n) return "";
  const msg = `Olá! Vi seu anúncio "${titulo || "no Classilagos"}" na vitrine Click-Entregas e quero fazer um pedido.`;
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
}

export default function AdminVitrineClickEntregasPage() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [itens, setItens] = useState([]);

  // filtros (admin)
  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("Todas");
  const [somenteVitrine, setSomenteVitrine] = useState(false);

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

    // ⚠️ Aqui buscamos SOMENTE quem tem_delivery = true
    // (sua regra: disk-entregas só entra quem tem delivery + whatsapp preparado)
    let q = supabase
      .from("anuncios")
      .select(
        "id, created_at, categoria, titulo, cidade, bairro, status, imagens, whatsapp, whatsapp_delivery, tem_delivery, tipos_delivery, vitrine_delivery, vitrine_delivery_ordem"
      )
      .eq("status", "ativo")
      .eq("tem_delivery", true)
      .order("vitrine_delivery", { ascending: false })
      .order("vitrine_delivery_ordem", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    const { data, error } = await q;

    if (error) {
      console.error("Erro ao carregar vitrine:", error);
      setItens([]);
    } else {
      setItens(Array.isArray(data) ? data : []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listaFiltrada = useMemo(() => {
    const base = Array.isArray(itens) ? itens : [];
    const b = busca.trim().toLowerCase();

    return base.filter((x) => {
      if (somenteVitrine && !x.vitrine_delivery) return false;
      if (cidade !== "Todas" && x.cidade !== cidade) return false;

      if (b) {
        const t = String(x.titulo || "").toLowerCase();
        const c = String(x.cidade || "").toLowerCase();
        const bb = String(x.bairro || "").toLowerCase();
        if (!t.includes(b) && !c.includes(b) && !bb.includes(b)) return false;
      }
      return true;
    });
  }, [itens, busca, cidade, somenteVitrine]);

  async function salvar(item, patch) {
    const next = { ...item, ...patch };

    // atualização otimista (sem travar a tela)
    setItens((prev) => prev.map((x) => (x.id === item.id ? next : x)));

    setSavingId(item.id);

    const { error } = await supabase
      .from("anuncios")
      .update(patch)
      .eq("id", item.id);

    setSavingId(null);

    if (error) {
      console.error("Erro ao salvar:", error);
      // rollback
      setItens((prev) => prev.map((x) => (x.id === item.id ? item : x)));
      alert("Não consegui salvar (ver console).");
    }
  }

  function thumbUrl(item) {
    const arr = Array.isArray(item?.imagens) ? item.imagens : [];
    const first = arr.find((u) => typeof u === "string" && u.trim() !== "");
    return first || "/lagolistas/sem-foto.jpg";
  }

  return (
    <main className="bg-slate-950 min-h-screen text-slate-50">
      {/* topo */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-7">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] text-slate-400">ADMIN • CLASSILAGOS</p>
              <h1 className="text-xl sm:text-2xl font-extrabold">
                Vitrine Click-Entregas
              </h1>
              <p className="mt-1 text-[12px] text-slate-300 max-w-2xl">
                Aqui você ativa quem aparece na vitrine paga. Regra do portal:
                só entra na lista quem tem <b>delivery</b> ligado (tem_delivery=true).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/lagolistas"
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-[12px] font-semibold hover:bg-slate-800"
              >
                Ver LagoListas
              </Link>

              <button
                type="button"
                onClick={carregar}
                className="rounded-full bg-emerald-600 px-4 py-2 text-[12px] font-extrabold hover:bg-emerald-700"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* filtros */}
      <section className="max-w-6xl mx-auto px-4 py-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Buscar
              </label>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Ex.: Carlinhos do Gás, Maricá, Flamengo..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Cidade
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Todas">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-[12px] font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={somenteVitrine}
                onChange={(e) => setSomenteVitrine(e.target.checked)}
              />
              Só vitrine
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
            <span>
              {loading ? "Carregando…" : `${listaFiltrada.length} itens encontrados`}
            </span>
            <span className="text-slate-500">
              Dica: a vitrine pública deve buscar por{" "}
              <b>vitrine_delivery=true</b> + <b>ordem</b>.
            </span>
          </div>
        </div>
      </section>

      {/* lista */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-[12px] text-slate-300">
            Carregando anúncios com delivery…
          </div>
        ) : listaFiltrada.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-[12px] text-slate-300">
            Nenhum anúncio com delivery apareceu. Confirme se existem registros com{" "}
            <b>tem_delivery=true</b>.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {listaFiltrada.map((item) => {
              const capa = thumbUrl(item);

              const whatsPreferido = String(item.whatsapp_delivery || item.whatsapp || "").trim();
              const waLink = whatsPreferido ? buildWaLink(whatsPreferido, item.titulo) : "";

              const isSaving = savingId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-sm"
                >
                  <div className="flex gap-3 p-4">
                    {/* thumb */}
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={capa} alt={item.titulo || "Anúncio"} className="h-full w-full object-cover" />
                    </div>

                    {/* infos */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-extrabold text-white truncate">
                            {item.titulo || "Sem título"}
                          </p>
                          <p className="text-[11px] text-slate-300 truncate">
                            #{item.id} • {item.cidade || "—"}
                            {item.bairro ? ` • ${item.bairro}` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "text-[10px] font-bold px-2 py-1 rounded-full border",
                              item.vitrine_delivery
                                ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/40"
                                : "bg-slate-800 text-slate-300 border-slate-700",
                            ].join(" ")}
                          >
                            {item.vitrine_delivery ? "NA VITRINE" : "FORA"}
                          </span>
                        </div>
                      </div>

                      {/* controles */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* vitrine toggle */}
                        <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="text-[12px] font-semibold text-slate-200">
                            Mostrar na vitrine
                          </span>
                          <input
                            type="checkbox"
                            checked={!!item.vitrine_delivery}
                            disabled={isSaving}
                            onChange={(e) =>
                              salvar(item, { vitrine_delivery: e.target.checked })
                            }
                          />
                        </label>

                        {/* ordem */}
                        <label className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Ordem (menor = primeiro)
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.vitrine_delivery_ordem ?? ""}
                            disabled={isSaving}
                            onChange={(e) => {
                              const v = e.target.value;
                              const n = v === "" ? null : Number(v);
                              salvar(item, { vitrine_delivery_ordem: n });
                            }}
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex.: 1"
                          />
                        </label>

                        {/* tipos_delivery (multi) */}
                        <div className="sm:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
                          <p className="text-[11px] font-semibold text-slate-300 mb-2">
                            Tipos de delivery (para filtros)
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {TIPOS_KEYS.map((key) => {
                              const on = Array.isArray(item.tipos_delivery)
                                ? item.tipos_delivery.includes(key)
                                : false;

                              return (
                                <button
                                  key={key}
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => {
                                    const cur = Array.isArray(item.tipos_delivery)
                                      ? item.tipos_delivery
                                      : [];
                                    const next = on
                                      ? cur.filter((x) => x !== key)
                                      : [...cur, key];
                                    salvar(item, { tipos_delivery: next });
                                  }}
                                  className={[
                                    "px-3 py-1.5 rounded-full text-[11px] font-semibold border transition",
                                    on
                                      ? "bg-cyan-500/15 text-cyan-200 border-cyan-400/40"
                                      : "bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800",
                                  ].join(" ")}
                                  title={TIPOS_MAP[key]}
                                >
                                  {TIPOS_MAP[key]}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* whatsapp_delivery */}
                        <label className="sm:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2">
                          <span className="block text-[11px] font-semibold text-slate-300 mb-1">
                            WhatsApp do delivery (se vazio, usa o WhatsApp normal do anúncio)
                          </span>
                          <input
                            value={item.whatsapp_delivery || ""}
                            disabled={isSaving}
                            onChange={(e) =>
                              salvar(item, { whatsapp_delivery: e.target.value })
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex.: (21) 9xxxx-xxxx"
                          />
                        </label>

                        {/* ações */}
                        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                          <Link
                            href={`/anuncios/${item.id}`}
                            className="flex-1 text-center rounded-2xl bg-slate-800 px-4 py-2 text-[12px] font-extrabold text-white hover:bg-slate-700"
                          >
                            Abrir anúncio
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              if (!waLink) return;
                              window.open(waLink, "_blank", "noopener,noreferrer");
                            }}
                            disabled={!waLink}
                            className={[
                              "flex-1 rounded-2xl px-4 py-2 text-[12px] font-extrabold transition",
                              waLink
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-slate-700 text-slate-400 cursor-not-allowed",
                            ].join(" ")}
                          >
                            Testar WhatsApp
                          </button>
                        </div>

                        {isSaving && (
                          <p className="sm:col-span-2 text-[11px] text-slate-400">
                            Salvando…
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* rodapé do card */}
                  <div className="px-4 pb-4">
                    <p className="text-[11px] text-slate-400">
                      Regras: para aparecer na vitrine pública, marque <b>Mostrar na vitrine</b> e defina a <b>ordem</b>.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
