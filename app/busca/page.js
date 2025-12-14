"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

// ✅ Parser oficial (ajuste o caminho se você colocou em outro lugar)
import { parseBusca } from "../../lib/busca/parser";


// =========================
// Helpers
// =========================
function normaliza(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detalheUrl(id) {
  return `/anuncios/${id}`;
}

/**
 * Normaliza a finalidade para o padrão do Classilagos/Supabase
 * (padrão oficial recomendado)
 * venda | aluguel | aluguel_temporada
 */
function normalizarFinalidade(fin) {
  const t = normaliza(fin);
  if (!t) return null;

  // manda com % para o ILIKE bater com qualquer variação salva no banco
  if (t.includes("temporada")) return "%temporada%";
  if (t.includes("aluguel")) return "%aluguel%";
  if (t.includes("venda")) return "%venda%";

  return null;
}



/**
 * Monta o q "limpo" para o RPC buscar_anuncios:
 * - se o parser extrair termos livres, usamos eles
 * - senão, usamos o texto original normalizado (sem mexer demais)
 */
function montarQLimpo(parsed, qOriginal) {
  const termos = Array.isArray(parsed?.termosLivres) ? parsed.termosLivres : [];
  const q1 = termos.join(" ").trim();
  if (q1) return q1;

  // ✅ se o parser identificou tipo_imovel (ex.: "Apartamento"), usa isso como texto
  if (parsed?.tipo_imovel) return String(parsed.tipo_imovel).trim();

  // fallback final: mantém o que o usuário digitou
  return String(qOriginal || "").trim();
}


// =========================
// Page
// =========================
export default function BuscaPage() {
  const [q, setQ] = useState("");
  const [categoriaUrl, setCategoriaUrl] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // debug / chips
  const [parsed, setParsed] = useState(null);

  // Lê querystring
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setQ(params.get("q") || "");
    setCategoriaUrl(params.get("categoria") || "");
  }, []);

  // Busca com fallback (NUNCA fica vazio)
  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      try {
        setCarregando(true);
        setErro("");

        // 1) parser oficial
        const p = parseBusca(q || "");
        // 🔁 Fallback de finalidade direto do texto digitado
const textoNorm = normaliza(q || "");

const finFallback =
  textoNorm.includes("temporada")
    ? "%temporada%"
    : textoNorm.includes("aluguel") || textoNorm.includes("alugar")
    ? "%aluguel%"
    : textoNorm.includes("venda") ||
      textoNorm.includes("comprar") ||
      textoNorm.includes("vende")
    ? "%venda%"
    : null;

        if (!cancelado) setParsed(p);

        // 2) decide filtros finais (URL tem prioridade se vier preenchida)
        const catFinal = categoriaUrl || p?.categoria || null;
        const cidFinal = p?.cidade || null;
       const finFinal = normalizarFinalidade(p?.finalidade) || finFallback;

        // 3) q "limpa" (termos livres)
        const qLimpa = montarQLimpo(p, q);
        const qParam = qLimpa ? qLimpa : null;

        // -----------------------------
        // 1) tenta: q + fin + cidade + categoria (mais preciso)
        // -----------------------------
       let resp1 = await supabase.rpc("buscar_anuncios", {
  q: qParam,
  cat: catFinal,
  cid: cidFinal,
  fin: finFinal,
  tip: p?.tipo_imovel || null,   // ✅ NOVO
  lim: 80,
  off: 0,
});


        if (resp1.error) throw resp1.error;

        let lista = Array.isArray(resp1.data) ? resp1.data : [];

        // -----------------------------
        // 2) fallback: q sem fin (ainda relevante)
        // -----------------------------
        if (lista.length === 0 && qParam) {
          let resp2 = await supabase.rpc("buscar_anuncios", {
            q: qParam,
            cat: catFinal,
            cid: cidFinal,
            fin: null,
            lim: 80,
            off: 0,
          });

          if (!resp2.error) {
            lista = Array.isArray(resp2.data) ? resp2.data : [];
          }
        }

        // -----------------------------
        // 3) fallback final: últimos anúncios da categoria (sem q, sem fin)
        // -----------------------------
        if (lista.length === 0) {
          let resp3 = await supabase.rpc("buscar_anuncios", {
            q: null,
            cat: catFinal,
            cid: cidFinal, // mantém cidade se tiver, ajuda muito
            fin: null,
            lim: 24,
            off: 0,
          });

          if (!resp3.error) {
            lista = Array.isArray(resp3.data) ? resp3.data : [];
          }
        }

        // Ordena: destaque > rank > data
        lista.sort((a, b) => {
          const ad = a?.destaque ? 1 : 0;
          const bd = b?.destaque ? 1 : 0;
          if (bd !== ad) return bd - ad;

          const ar = typeof a?.rank === "number" ? a.rank : 0;
          const br = typeof b?.rank === "number" ? b.rank : 0;
          if (br !== ar) return br - ar;

          const at = new Date(a?.created_at || 0).getTime();
          const bt = new Date(b?.created_at || 0).getTime();
          return bt - at;
        });

        if (!cancelado) setResultados(lista);
      } catch (e) {
        console.error(e);
        if (!cancelado) {
          setErro("Não foi possível buscar agora.");
          setResultados([]);
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    buscar();
    return () => {
      cancelado = true;
    };
  }, [q, categoriaUrl]);

  const chips = useMemo(() => {
    const arr = [];
    if (q) arr.push({ k: "Texto", v: q });

    // categoria (URL ou parser)
    const catChip = categoriaUrl || parsed?.categoria;
    if (catChip) arr.push({ k: "Categoria", v: catChip });

    if (parsed?.cidade) arr.push({ k: "Cidade", v: parsed.cidade });
    if (parsed?.finalidade) arr.push({ k: "Finalidade", v: parsed.finalidade });
    if (parsed?.tipo_imovel) arr.push({ k: "Tipo", v: parsed.tipo_imovel });

    return arr;
  }, [q, categoriaUrl, parsed]);

  return (
    <main className="bg-slate-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Resultado da busca</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {chips.map((c) => (
            <span
              key={c.k}
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs"
            >
              {c.k}: <b className="ml-1">{c.v}</b>
            </span>
          ))}
        </div>

        {erro && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-sm text-white/70">Carregando...</p>
        ) : resultados.length === 0 ? (
          <p className="text-sm text-white/70">Nenhum resultado encontrado.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {resultados.map((a) => {
              const imagens = Array.isArray(a.imagens) ? a.imagens : [];
              const capa =
                imagens.find((img) => typeof img === "string" && img.trim() !== "") ||
                "/imoveis/sem-foto.jpg";

              return (
                <Link
                  key={a.id}
                  href={detalheUrl(a.id)}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden"
                >
                  <div className="h-36 bg-black/20 overflow-hidden">
                    <img
                      src={capa}
                      alt={a.titulo || "Anúncio"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="text-sm font-semibold line-clamp-2">{a.titulo}</div>
                    <div className="mt-1 text-xs text-white/70">
                      {a.categoria} • {a.cidade}
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                      {a.tipo_imovel ? `Tipo: ${a.tipo_imovel} • ` : ""}
                      {a.finalidade ? `Finalidade: ${a.finalidade}` : ""}
                    </div>

                    {a.preco && <div className="mt-2 text-sm font-semibold">{a.preco}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

