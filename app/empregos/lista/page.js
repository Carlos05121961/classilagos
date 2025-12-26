"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

const cidades = [
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

function normalizarSemAcento(str = "") {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCategoriaValida(v) {
  const x = (v || "").toLowerCase().trim();
  if (x === "curriculo" || x === "currículos" || x === "curriculos") return "curriculo";
  return "emprego";
}

function pegarImagem(item) {
  // vagas usam imagens[] (logo opcional)
  const imgs = Array.isArray(item?.imagens) ? item.imagens : [];
  const img1 = imgs.find((u) => typeof u === "string" && u.trim() !== "");
  if (img1) return img1;

  // curriculo tem curriculo_foto_url
  if (item?.curriculo_foto_url) return item.curriculo_foto_url;

  return null;
}

function tituloPagina(categoria) {
  return categoria === "curriculo" ? "Empregos – Banco de Currículos" : "Empregos – Lista de Vagas";
}

function ListaEmpregosContent() {
  const params = useSearchParams();

  const categoria = getCategoriaValida(params.get("categoria"));
  const q = (params.get("q") || "").trim();
  const cidade = (params.get("cidade") || "").trim();

  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const titulo = useMemo(() => tituloPagina(categoria), [categoria]);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setLoading(true);
        setErro("");

        // 🔥 ATENÇÃO: aqui é do jeito que seu projeto está HOJE:
        // categoria = "emprego" OU "curriculo"
        let query = supabase
          .from("anuncios")
          .select(
            `
            id,
            titulo,
            descricao,
            cidade,
            bairro,
            imagens,
            created_at,
            status,

            faixa_salarial,
            tipo_vaga,
            modelo_trabalho,

            area_profissional,
            curriculo_foto_url
          `
          )
          .eq("categoria", categoria)
          .or("status.is.null,status.eq.ativo")
          .order("created_at", { ascending: false });

        if (cidade) query = query.eq("cidade", cidade);

        // ✅ Busca inteligente: primeiro tenta FTS (search_tsv), se der erro, cai no ilike
        const termo = normalizarSemAcento(q);

        if (termo) {
          // tenta FTS
          const q1 = query.textSearch("search_tsv", termo, {
            type: "websearch",
            config: "portuguese",
          });

          const { data, error } = await q1;

          if (error) {
            // fallback ilike
            let q2 = supabase
              .from("anuncios")
              .select(
                `
                id,
                titulo,
                descricao,
                cidade,
                bairro,
                imagens,
                created_at,
                status,

                faixa_salarial,
                tipo_vaga,
                modelo_trabalho,

                area_profissional,
                curriculo_foto_url
              `
              )
              .eq("categoria", categoria)
              .or("status.is.null,status.eq.ativo")
              .order("created_at", { ascending: false });

            if (cidade) q2 = q2.eq("cidade", cidade);

            // evita quebrar OR com vírgula
            const safe = termo.replace(/,/g, " ");
            q2 = q2.or(`titulo.ilike.%${safe}%,descricao.ilike.%${safe}%`);

            const { data: data2, error: err2 } = await q2;
            if (err2) throw err2;

            if (!cancelado) setItens(data2 || []);
          } else {
            if (!cancelado) setItens(data || []);
          }
        } else {
          const { data, error } = await query;
          if (error) throw error;
          if (!cancelado) setItens(data || []);
        }
      } catch (e) {
        console.error("Erro ao carregar lista Empregos:", e);
        if (!cancelado) {
          setErro("Não foi possível carregar agora. Tente novamente em instantes.");
          setItens([]);
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [categoria, q, cidade]);

  return (
    <main className="bg-white min-h-screen">
      {/* TOPO */}
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Classilagos &gt; Empregos</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">{titulo}</h1>

            <p className="mt-2 text-[11px] text-slate-500">
              {loading ? "Carregando..." : `${itens.length} resultado(s)`}
              {cidade ? ` • ${cidade}` : ""}
              {q ? ` • busca: "${q}"` : ""}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <Link href="/empregos" className="text-xs text-slate-600 underline">
              &larr; Voltar para Empregos
            </Link>

            <div className="flex gap-2 mt-2">
              <Link
                href="/anunciar/empregos"
                className="inline-flex rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
              >
                Publicar vaga
              </Link>
              <Link
                href="/anunciar/curriculo"
                className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Cadastrar currículo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {erro && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {erro}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-24 bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs px-3 py-2">Carregando...</div>
              </div>
            ))}
          </div>
        )}

        {!loading && itens.length === 0 && (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum resultado encontrado.
            <div className="mt-4">
              <Link className="text-emerald-700 underline" href="/empregos">
                Voltar para Empregos
              </Link>
            </div>
          </div>
        )}

        {!loading && itens.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itens.map((item) => {
              const img = pegarImagem(item);

              const isCurriculo = categoria === "curriculo";
              const tituloCard = isCurriculo
                ? (item.titulo || "").replace(/^Currículo -\s*/i, "")
                : item.titulo;

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 transition"
                >
                  <div className="flex gap-3 p-3">
                    <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={tituloCard || "Item"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400">{isCurriculo ? "CV" : "Logo"}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2">{tituloCard}</p>

                      <p className="mt-1 text-[11px] text-slate-600">
                        {item.cidade}
                        {item.bairro ? ` • ${item.bairro}` : ""}
                      </p>

                      {isCurriculo ? (
                        item.area_profissional ? (
                          <p className="mt-1 text-[11px] text-slate-500">{item.area_profissional}</p>
                        ) : null
                      ) : (
                        <p className="mt-1 text-[11px] text-emerald-700 font-semibold line-clamp-1">
                          {item.tipo_vaga ? item.tipo_vaga : "Vaga"}
                          {item.faixa_salarial ? ` • ${item.faixa_salarial}` : ""}
                          {item.modelo_trabalho ? ` • ${item.modelo_trabalho}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 text-[11px] flex justify-between">
                    <span>{isCurriculo ? "Ver currículo" : "Ver vaga"}</span>
                    <span className="opacity-80">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ListaEmpregosPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-10">
            <p className="text-sm text-slate-600">Carregando lista...</p>
          </section>
        </main>
      }
    >
      <ListaEmpregosContent />
    </Suspense>
  );
}
