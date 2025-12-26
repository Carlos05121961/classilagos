"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

// ===== helpers =====
function normalizarSemAcento(str = "") {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDestaqueTruthy(v) {
  if (v === true) return true;
  const s = String(v || "").toLowerCase().trim();
  return s === "true" || s === "1" || s === "sim" || s === "yes";
}

function sortPremiumLocal(arr) {
  return [...(arr || [])].sort((a, b) => {
    const da = isDestaqueTruthy(a?.destaque) ? 1 : 0;
    const db = isDestaqueTruthy(b?.destaque) ? 1 : 0;
    if (db !== da) return db - da;

    const pa = Number.isFinite(Number(a?.prioridade)) ? Number(a.prioridade) : 0;
    const pb = Number.isFinite(Number(b?.prioridade)) ? Number(b.prioridade) : 0;
    if (pb !== pa) return pb - pa;

    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return tb - ta;
  });
}

// Componente que usa useSearchParams (deve ficar separadinho)
function ListaNauticaContent() {
  const params = useSearchParams();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // 🔍 FILTROS CAPTURADOS DA URL
  const tipo = params.get("tipo") || "";
  const finalidade = params.get("finalidade") || "";
  const subcategoria = params.get("subcategoria") || "";
  const grupo = params.get("grupo") || "";

  // 🔎 TÍTULO DA LISTA
  const tituloPagina = useMemo(() => {
    let titulo = "Anúncios náuticos";

    if (grupo) {
      switch (grupo) {
        case "lanchas-veleiros":
          return "Lanchas e veleiros à venda";
        case "jetski-caiaques":
          return "Jetski, stand-up & caiaques";
        case "barcos-pesca":
          return "Barcos de pesca";
        case "motores-equipamentos":
          return "Motores & equipamentos";
        case "marinas-guardarias":
          return "Marinas & guardarias";
        case "servicos-nauticos":
          return "Serviços náuticos";
        case "pecas-acessorios":
          return "Peças & acessórios";
        default:
          return titulo;
      }
    }

    if (finalidade) return `Náutica — ${finalidade}`;
    if (tipo) return `Náutica — ${tipo}`;
    if (subcategoria) return `Náutica — ${subcategoria}`;
    return titulo;
  }, [grupo, finalidade, tipo, subcategoria]);

  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      try {
        setLoading(true);
        setErro("");

        let query = supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, preco, imagens, subcategoria_nautica, finalidade_nautica, categoria, destaque, prioridade, status, created_at"
          )
          .eq("categoria", "nautica")
          // ✅ igual Imóveis: ativo OU null (não “some” anúncio)
          .or("status.is.null,status.eq.ativo")
          // ✅ ordem premium (DB)
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false });

        // Filtro direto por finalidade (ex.: aluguel / venda)
        if (finalidade) {
          query = query.eq("finalidade_nautica", finalidade);
        }

        const { data, error } = await query;

        if (cancelado) return;

        if (error) {
          console.error("Erro ao carregar anúncios de náutica:", error);
          setAnuncios([]);
          setErro("Não foi possível carregar os anúncios agora.");
          return;
        }

        let filtrados = sortPremiumLocal(data || []);

        const norm = (s) => normalizarSemAcento(s);

        // ✅ filtros por grupo (mais tolerante, sem acento/caixa)
        if (grupo) {
          switch (grupo) {
            case "lanchas-veleiros":
              filtrados = filtrados.filter((a) => {
                const sub = norm(a.subcategoria_nautica);
                const fin = norm(a.finalidade_nautica);
                return fin === "venda" && (sub.includes("lancha") || sub.includes("veleiro"));
              });
              break;

            case "jetski-caiaques":
              filtrados = filtrados.filter((a) => {
                const sub = norm(a.subcategoria_nautica);
                return sub.includes("jet") || sub.includes("ski") || sub.includes("stand up") || sub.includes("standup") || sub.includes("caiaque");
              });
              break;

            case "barcos-pesca":
              filtrados = filtrados.filter((a) => norm(a.subcategoria_nautica).includes("pesca"));
              break;

            case "motores-equipamentos":
              filtrados = filtrados.filter((a) => {
                const sub = norm(a.subcategoria_nautica);
                if (!sub || sub === "outros") return false;
                return sub.includes("motor") || sub.includes("equip") || sub.includes("motores equipamentos");
              });
              break;

            case "marinas-guardarias":
              filtrados = filtrados.filter((a) => {
                const sub = norm(a.subcategoria_nautica);
                return sub.includes("marina") || sub.includes("guardaria") || sub.includes("vaga");
              });
              break;

            case "servicos-nauticos":
              filtrados = filtrados.filter((a) => {
                const sub = norm(a.subcategoria_nautica);
                return sub.includes("servico") || sub.includes("manutencao") || sub.includes("reforma");
              });
              break;

            case "pecas-acessorios":
              filtrados = filtrados.filter((a) => {
                const sub = norm(a.subcategoria_nautica);
                if (!sub || sub === "outros") return false;
                return sub.includes("peca") || sub.includes("acessor") || sub.includes("pecas acessorios");
              });
              break;

            default:
              break;
          }
        } else {
          // ✅ filtros diretos (tipo/subcategoria) sem depender de igualdade exata
          if (tipo) {
            const t = norm(tipo);
            filtrados = filtrados.filter((a) => norm(a.subcategoria_nautica).includes(t));
          }
          if (subcategoria) {
            const s = norm(subcategoria);
            filtrados = filtrados.filter((a) => norm(a.subcategoria_nautica).includes(s));
          }
        }

        setAnuncios(filtrados);
      } catch (e) {
        console.error("Erro inesperado ao carregar náutica:", e);
        if (!cancelado) {
          setAnuncios([]);
          setErro("Não foi possível carregar os anúncios agora.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    carregar();
    return () => {
      cancelado = true;
    };
  }, [tipo, finalidade, subcategoria, grupo]);

  return (
    <main className="bg-white min-h-screen">
      {/* TOPO */}
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Classilagos &gt; Náutica</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">{tituloPagina}</h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Embarcações, motores, serviços e equipamentos náuticos na Região dos Lagos.
            </p>

            <div className="mt-2 text-[11px] text-slate-500">
              {loading ? "Carregando..." : `${anuncios.length} resultado(s)`}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <Link href="/nautica" className="text-xs text-slate-600 underline">
              &larr; Voltar para Náutica
            </Link>
            <Link
              href="/anunciar?tipo=nautica"
              className="inline-flex mt-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Anunciar na Náutica
            </Link>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {erro && (
          <p className="text-xs text-red-600 mb-3 border border-red-100 rounded-md px-3 py-2 bg-red-50">
            {erro}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-28 md:h-32 bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs px-3 py-2">Carregando...</div>
              </div>
            ))}
          </div>
        )}

        {!loading && anuncios.length === 0 && (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum anúncio encontrado.
            <div className="mt-4">
              <Link className="text-sky-600 underline" href="/nautica">
                Voltar para Náutica
              </Link>
            </div>
          </div>
        )}

        {!loading && anuncios.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anuncios.map((item) => {
              const img = Array.isArray(item.imagens) && item.imagens.length > 0 ? item.imagens[0] : null;

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    {img ? (
                      <Image
                        src={img}
                        alt={item.titulo}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-white bg-sky-900">
                        Sem foto
                      </div>
                    )}

                    {isDestaqueTruthy(item.destaque) && (
                      <span className="absolute top-2 left-2 rounded-full bg-amber-500 text-[10px] font-semibold text-white px-2 py-1 shadow">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">{item.titulo}</p>

                    <p className="text-[10px] text-slate-300">
                      {item.subcategoria_nautica ? `${item.subcategoria_nautica} • ` : ""}
                      {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>

                    {item.preco && (
                      <p className="text-[11px] font-bold text-emerald-300">{item.preco}</p>
                    )}

                    {item.finalidade_nautica && (
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        {item.finalidade_nautica}
                      </p>
                    )}
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

// Página com Suspense
export default function ListaNauticaPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-10">
            <p className="text-sm text-slate-600">Carregando anúncios...</p>
          </section>
        </main>
      }
    >
      <ListaNauticaContent />
    </Suspense>
  );
}
