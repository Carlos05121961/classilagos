"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

// ✅ Parser oficial
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
 * Normaliza a finalidade para o padrão do Supabase/RPC (usando LIKE)
 */
function normalizarFinalidade(fin) {
  const t = normaliza(fin);
  if (!t) return null;

  if (t.includes("temporada")) return "%temporada%";
  if (t.includes("aluguel")) return "%aluguel%";
  if (t.includes("venda")) return "%venda%";

  return null;
}

// =========================
// Tipos: Canonicalização (DB)
// =========================
const TIPO_CANONICO = {
  "casa": "Casa",
  "apartamento": "Apartamento",
  "cobertura": "Cobertura",
  "kitnet / studio": "Kitnet / Studio",
  "kitnet": "Kitnet / Studio",
  "studio": "Kitnet / Studio",
  "terreno / lote": "Terreno / Lote",
  "terreno": "Terreno / Lote",
  "lote": "Terreno / Lote",
  "comercial": "Comercial",
  "loja / sala": "Loja / Sala",
  "loja": "Comercial",          // ✅ loja vira GRUPO comercial
  "sala": "Loja / Sala",
  "galpao": "Galpão",
  "galpão": "Galpão",
  "sitio / chacara": "Sítio / Chácara",
  "sitio": "Sítio / Chácara",
  "chacara": "Sítio / Chácara",
  "chácara": "Sítio / Chácara",
  "outros": "Outros",
};

function canonizarTipo(tipo) {
  const t = normaliza(tipo || "");
  if (!t) return null;

  // tenta match direto
  if (TIPO_CANONICO[t]) return TIPO_CANONICO[t];

  // tenta ajustes comuns
  const t2 = t.replace(/\s+/g, " ").trim();
  if (TIPO_CANONICO[t2]) return TIPO_CANONICO[t2];

  // fallback: mantém como veio
  return tipo || null;
}

// =========================
// Limpeza do q (evitar filtro duplo)
// =========================
function removerPalavras(q, palavras = []) {
  let out = ` ${String(q || "")} `;
  for (const p of palavras) {
    const pn = normaliza(p);
    if (!pn) continue;
    const re = new RegExp(`(^|\\s)${pn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "gi");
    out = out.replace(re, " ");
  }
  return out.replace(/\s+/g, " ").trim();
}

/**
 * Monta q "limpo":
 * - usa termosLivres do parser
 * - remove palavras que já viraram filtros (finalidade/tipo/cidade)
 * - se sobrar vazio, retorna "" (aí a gente manda q=null pro RPC)
 */
function montarQLimpo(parsed, qOriginal, { cidFinal, tipFinal, finFinal } = {}) {
  const termos = Array.isArray(parsed?.termosLivres) ? parsed.termosLivres : [];
  let q1 = (termos.join(" ").trim() || String(qOriginal || "").trim());

  // remove palavras de finalidade (evitar "aluguel" + "temporada" etc)
  const finTxt = normaliza(parsed?.finalidade || "");
  if (finTxt.includes("temporada")) {
    q1 = removerPalavras(q1, [
      "aluguel","alugar","alugo","locacao","locação","mensal","anual",
      "por temporada","temporada","diaria","diária","diarias","diárias",
    ]);
  } else if (finTxt.includes("aluguel")) {
    q1 = removerPalavras(q1, ["temporada","por temporada","diaria","diária","diarias","diárias"]);
  } else if (finTxt.includes("venda")) {
    q1 = removerPalavras(q1, ["venda","vender","vendo","comprar","compra","vende","à venda","a venda"]);
  }

  // ✅ remove cidade do texto livre quando houver filtro de cidade
  if (cidFinal) q1 = removerPalavras(q1, [cidFinal]);

  // ✅ remove palavras do tipo quando houver filtro de tipo
  // (especial para Sitio/Chacara e Loja/Comercial)
  const tipNorm = normaliza(tipFinal || "");
  if (tipFinal) {
    if (tipNorm.includes("sitio") || tipNorm.includes("chacara")) {
      q1 = removerPalavras(q1, ["sitio", "sítio", "chacara", "chácara", "sitio / chacara", "sítio / chácara"]);
    } else if (tipNorm.includes("kitnet") || tipNorm.includes("studio")) {
      q1 = removerPalavras(q1, ["kitnet", "quitinete", "studio", "stúdio"]);
    } else if (tipNorm.includes("comercial")) {
      // aqui está o pulo do gato: não pode deixar "loja" e "comercial" apertando a FTS
      q1 = removerPalavras(q1, ["loja", "comercial", "sala", "ponto", "ponto comercial"]);
    } else if (tipNorm.includes("loja / sala")) {
      q1 = removerPalavras(q1, ["loja", "sala", "sala comercial", "office", "loja / sala"]);
    } else if (tipNorm.includes("galp")) {
      q1 = removerPalavras(q1, ["galpao", "galpão", "deposito", "depósito", "armazem", "armazém"]);
    } else if (tipNorm.includes("cobertura")) {
      q1 = removerPalavras(q1, ["cobertura"]);
    } else if (tipNorm.includes("apartamento")) {
      q1 = removerPalavras(q1, ["apartamento", "apto", "apt", "ap"]);
    } else if (tipNorm.includes("casa")) {
      q1 = removerPalavras(q1, ["casa", "residencia", "residência"]);
    } else if (tipNorm.includes("terreno") || tipNorm.includes("lote")) {
      q1 = removerPalavras(q1, ["terreno", "lote", "loteamento"]);
    }
  }

  // limpeza leve de tokens genéricos
  q1 = q1.replace(/\s+/g, " ").trim();

  return q1;
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

  // Busca com fallback
  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      try {
        setCarregando(true);
        setErro("");

        // 1) parser oficial
        const p0 = parseBusca(q || "");
        const textoNorm = normaliza(q || "");

        // fallback de finalidade direto do texto
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

        // 2) filtros finais
        const catFinal = categoriaUrl || p0?.categoria || null;
        const cidFinal = p0?.cidade || null;

        // finalidade final (like)
        const finFinal = normalizarFinalidade(p0?.finalidade) || finFallback;

        // ✅ tipo final: canonizado + regra especial para LOJA
        // - se digitar "loja", tratamos como Comercial (grupo)
        let tipFinal = canonizarTipo(p0?.tipo_imovel) || null;
        if (textoNorm.includes("loja")) tipFinal = "Comercial";
        // se parser vier "Loja / Sala", mas o usuário digitou "loja", também vira Comercial
        if (tipFinal === "Loja / Sala" && textoNorm.includes("loja")) tipFinal = "Comercial";

        const p = { ...p0, tipo_imovel: tipFinal };

        if (!cancelado) setParsed(p);

        // 3) q "limpa"
        const qLimpa = montarQLimpo(p, q, { cidFinal, tipFinal, finFinal });
        const qParam = qLimpa ? qLimpa : null; // ✅ se ficar vazio, manda null

        // -----------------------------
        // 1) tenta: q + fin + cidade + categoria (+ tipo)
        // -----------------------------
        let resp1 = await supabase.rpc("buscar_anuncios", {
          q: qParam,
          cat: catFinal,
          cid: cidFinal,
          fin: finFinal,
          tip: tipFinal, // ✅ agora vem corrigido
          lim: 80,
          off: 0,
        });

        if (resp1.error) throw resp1.error;

        let lista = Array.isArray(resp1.data) ? resp1.data : [];

        // -----------------------------
        // 2) fallback: q sem fin
        // -----------------------------
        if (lista.length === 0 && qParam) {
          let resp2 = await supabase.rpc("buscar_anuncios", {
            q: qParam,
            cat: catFinal,
            cid: cidFinal,
            fin: null,
            tip: tipFinal, // ✅ mantém tipo
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
            cid: cidFinal,
            fin: null,
            tip: tipFinal, // ✅ mantém tipo se houver (ex: Sítio/Chácara + Araruama)
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

