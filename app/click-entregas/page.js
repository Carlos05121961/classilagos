"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function normalizeWhatsAppBR(numberRaw) {
  let n = onlyDigits(numberRaw);

  // Se veio com 0 no início, remove
  while (n.startsWith("0")) n = n.slice(1);

  // Se já tem 55 no início, ok
  if (n.startsWith("55")) return n;

  // Se parece número BR (10/11 dígitos), prefixa 55
  if (n.length === 10 || n.length === 11) return `55${n}`;

  // Caso diferente, retorna como está (melhor do que quebrar)
  return n;
}

function buildWhatsAppLink(numberRaw, message) {
  const n = normalizeWhatsAppBR(numberRaw);
  if (!n) return "";
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${n}${text ? `?text=${text}` : ""}`;
}

function labelTipo(tipo) {
  const map = {
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
  return map[tipo] || tipo;
}

export default function ClickEntregasPage() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [items, setItems] = useState([]);

  // filtros
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");

  const cidades = [
    "",
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

  const tipos = [
    { value: "", label: "Todos" },
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

  useEffect(() => {
    let alive = true;

    async function fetchData() {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          `
          id,
          created_at,
          categoria,
          status,
          titulo,
          descricao,
          cidade,
          bairro,
          endereco,
          nome_negocio,
          contato,
          telefone,
          whatsapp,
          whatsapp_delivery,
          horario_atendimento,
          horario_delivery,
          tipos_delivery,
          tem_delivery,
          imagens,
          logo_url,
          capa_url,
          destaque,
          vitrine,
          prioridade
        `
        )
        .eq("categoria", "lagolistas")
        .eq("tem_delivery", true)
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("vitrine", { ascending: false })
        .order("prioridade", { ascending: false })
        .order("created_at", { ascending: false });

      if (!alive) return;

      if (error) {
        console.error(error);
        setErro("Não foi possível carregar o Click-Entregas agora. Tente novamente.");
        setItems([]);
        setLoading(false);
        return;
      }

      setItems(data || []);
      setLoading(false);
    }

    fetchData();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return (items || []).filter((x) => {
      if (cidade && x.cidade !== cidade) return false;

      if (tipo) {
        const arr = Array.isArray(x.tipos_delivery) ? x.tipos_delivery : [];
        if (!arr.includes(tipo)) return false;
      }

      // precisa ter whatsapp válido (delivery ou geral)
      const w = x.whatsapp_delivery || x.whatsapp || "";
      if (!onlyDigits(w)) return false;

      return true;
    });
  }, [items, cidade, tipo]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            Click-Entregas • peça pelo WhatsApp
          </span>

          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
            Click-Entregas Classilagos
          </h1>

          <p className="mt-2 text-sm text-slate-600 max-w-3xl">
            Peça direto pelo WhatsApp nos comércios da sua cidade. Rápido, simples e local.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/lagolistas"
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Ver LagoListas
            </Link>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <h2 className="text-sm font-bold text-slate-900">Filtrar entregas</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Cidade</label>
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              >
                {cidades.map((c) => (
                  <option key={c || "todas"} value={c}>
                    {c ? c : "Todas as cidades"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Tipo de entrega</label>
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                {tipos.map((t) => (
                  <option key={t.value || "todos"} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1">
              Resultados: <strong className="text-slate-900">{filtered.length}</strong>
            </span>

            {(cidade || tipo) && (
              <button
                type="button"
                onClick={() => {
                  setCidade("");
                  setTipo("");
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
            <p className="text-xs md:text-sm font-semibold text-red-700">⚠️ Atenção</p>
            <p className="text-xs md:text-sm text-red-700 mt-1">{erro}</p>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 text-slate-700">
            Carregando entregas…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
            <p className="text-sm font-semibold text-slate-900">Nenhum delivery encontrado.</p>
            <p className="mt-1 text-sm text-slate-600">
              Tente trocar a cidade ou o tipo de entrega.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((x) => {
              const nome = x.nome_negocio || x.titulo || "Entrega";
              const tiposArr = Array.isArray(x.tipos_delivery) ? x.tipos_delivery : [];
              const wpp = x.whatsapp_delivery || x.whatsapp || "";

              const horario = x.horario_delivery || x.horario_atendimento || "";
              const msg = `Olá! Vi vocês no Click-Entregas Classilagos. Quero fazer um pedido.`;
              const waLink = buildWhatsAppLink(wpp, msg);

              const img =
                x.logo_url ||
                x.capa_url ||
                (Array.isArray(x.imagens) && x.imagens.length ? x.imagens[0] : null);

              return (
                <div
                  key={x.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  {/* imagem */}
                  <div className="h-36 bg-slate-100">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={nome} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-900 leading-tight">
                        {nome}
                      </h3>

                      {x.destaque && (
                        <span className="shrink-0 inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">
                          Destaque
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-600">
                      {x.cidade}
                      {x.bairro ? ` • ${x.bairro}` : ""}
                    </p>

                    {tiposArr.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {tiposArr.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200"
                          >
                            {labelTipo(t)}
                          </span>
                        ))}
                      </div>
                    )}

                    {horario && (
                      <p className="mt-3 text-xs text-slate-600">
                        <span className="font-semibold text-slate-900">Horário:</span>{" "}
                        {horario}
                      </p>
                    )}

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 transition"
                    >
                      Pedir no WhatsApp
                    </a>

                    <p className="mt-3 text-[11px] text-slate-500">
                      Pedido feito direto com o estabelecimento.
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
