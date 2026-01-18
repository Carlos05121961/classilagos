"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

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

const TIPOS = [
  { id: "pizza_lanches", label: "Pizza / Lanches" },
  { id: "marmita", label: "Marmita" },
  { id: "restaurante", label: "Restaurante" },
  { id: "farmacia", label: "Farmácia" },
  { id: "agua_gas", label: "Água / Gás" },
  { id: "bebidas", label: "Bebidas" },
  { id: "padaria", label: "Padaria" },
  { id: "pet_delivery", label: "Pet delivery" },
  { id: "frango_assado", label: "Frango assado" },
  { id: "outros", label: "Outros" },
];

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function normalizeWhatsAppBR(raw) {
  let d = onlyDigits(raw);
  if (!d) return "";

  if (!d.startsWith("55")) d = "55" + d;

  // 55 + DDD + número (mínimo 12 dígitos)
  if (d.length < 12) return "";

  return d;
}

function buildWhatsAppLink(rawNumber, message) {
  const n = normalizeWhatsAppBR(rawNumber);
  if (!n) return "";
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${n}${text ? `?text=${text}` : ""}`;
}

function pickCardImage(row) {
  if (row?.logo_url) return row.logo_url;
  if (row?.capa_url) return row.capa_url;
  if (Array.isArray(row?.imagens) && row.imagens.length) return row.imagens[0];
  return "";
}

function labelTipo(tipoId) {
  return TIPOS.find((t) => t.id === tipoId)?.label || tipoId;
}

export default function ClickEntregasPage() {
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function fetchData() {
    setLoading(true);
    setErro("");

    try {
      let query = supabase
        .from("anuncios")
        .select(
          [
            "id",
            "created_at",
            "categoria",
            "cidade",
            "bairro",
            "titulo",
            "nome_negocio",
            "whatsapp",
            "whatsapp_delivery",
            "horario_atendimento",
            "horario_delivery",
            "tipos_delivery",
            "logo_url",
            "capa_url",
            "imagens",
            "destaque",
            "prioridade",
          ].join(",")
        )
        .eq("categoria", "lagolistas")
        .eq("tem_delivery", true)
        .order("destaque", { ascending: false })
        .order("prioridade", { ascending: false })
        .order("created_at", { ascending: false });

      if (cidade) query = query.eq("cidade", cidade);

      if (tipo) {
        // tipos_delivery é text[] -> contains
        query = query.contains("tipos_delivery", [tipo]);
      }

      const qq = String(q || "").trim();
      if (qq) {
        // busca simples (sem mexer no search_tsv)
        // OR: nome_negocio, titulo, bairro
        query = query.or(
          `nome_negocio.ilike.%${qq}%,titulo.ilike.%${qq}%,bairro.ilike.%${qq}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setErro("Não foi possível carregar o Click-Entregas agora. Tente novamente.");
        setItems([]);
        setLoading(false);
        return;
      }

      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setErro("Erro inesperado ao carregar. Tente novamente.");
      setItems([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cidade, tipo]);

  const total = items.length;

  const cards = useMemo(() => {
    const baseMsg = "Olá! Vi vocês no Click-Entregas Classilagos e quero fazer um pedido.";
    return items.map((row) => {
      const whats = row.whatsapp_delivery || row.whatsapp || "";
      const waLink = buildWhatsAppLink(whats, baseMsg);
      const img = pickCardImage(row);

      const tipos = Array.isArray(row.tipos_delivery) ? row.tipos_delivery : [];
      const tiposLabel = tipos.slice(0, 3).map(labelTipo);
      const horario = row.horario_delivery || row.horario_atendimento || "";

      return { row, waLink, img, tiposLabel, horario };
    });
  }, [items]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* TOPO */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 border border-emerald-500/20">
                Click-Entregas • peça pelo WhatsApp
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-extrabold">
                Click-Entregas Classilagos
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                Encontre delivery e disk-entregas na sua cidade e peça direto pelo WhatsApp.
              </p>
            </div>

            <div className="text-xs text-slate-300">
              <Link href="/lagolistas" className="underline hover:text-white">
                Ver LagoListas
              </Link>
            </div>
          </div>

          {/* FILTROS */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Cidade
              </label>
              <select
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              >
                <option value="">Todas</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Tipo de entrega
              </label>
              <select
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Todos</option>
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Buscar (nome, título, bairro)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ex: pizzaria, centro, farmácia..."
                  className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={fetchData}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            {loading ? "Carregando..." : `${total} resultado(s) encontrado(s).`}
          </div>

          {erro && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-200">{erro}</p>
            </div>
          )}
        </div>
      </section>

      {/* LISTA */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
            Carregando Click-Entregas…
          </div>
        ) : total === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
            Nenhum delivery encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ row, waLink, img, tiposLabel, horario }) => (
              <div
                key={row.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 shadow-sm overflow-hidden"
              >
                {/* IMAGEM */}
                <div className="h-40 bg-slate-900">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={row.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-extrabold text-white line-clamp-2">
                        {row.nome_negocio || row.titulo}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {row.cidade}
                        {row.bairro ? ` • ${row.bairro}` : ""}
                      </p>
                    </div>

                    {row.destaque && (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-200 border border-amber-500/20">
                        Destaque
                      </span>
                    )}
                  </div>

                  {tiposLabel.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tiposLabel.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-200 border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {horario && (
                    <p className="mt-3 text-xs text-slate-300">
                      <span className="text-slate-400">Horário:</span> {horario}
                    </p>
                  )}

                  <div className="mt-4">
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 transition px-4 py-3 text-sm font-semibold"
                      >
                        Pedir no WhatsApp
                      </a>
                    ) : (
                      <div className="block w-full text-center rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300">
                        WhatsApp não informado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé informativo */}
        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs text-slate-300">
            💡 Os pedidos são feitos diretamente com cada estabelecimento via WhatsApp. O Classilagos
            funciona como vitrine e guia de comércios locais da Região dos Lagos.
          </p>
        </div>
      </section>
    </main>
  );
}

