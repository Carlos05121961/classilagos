"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

// Componente que usa useSearchParams (deve ficar separadinho)
function ListaNauticaContent() {
  const params = useSearchParams();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 FILTROS CAPTURADOS DA URL
  const tipo = params.get("tipo") || "";
  const finalidade = params.get("finalidade") || "";
  const subcategoria = params.get("subcategoria") || "";
  const grupo = params.get("grupo") || "";

  // 🔎 TÍTULO DA LISTA
  let tituloPagina = "Anúncios náuticos";

  if (grupo) {
    switch (grupo) {
      case "lanchas-veleiros":
        tituloPagina = "Lanchas e veleiros à venda";
        break;
      case "jetski-caiaques":
        tituloPagina = "Jetski, stand-up & caiaques";
        break;
      case "barcos-pesca":
        tituloPagina = "Barcos de pesca";
        break;
      case "motores-equipamentos":
        tituloPagina = "Motores & equipamentos";
        break;
      case "marinas-guardarias":
        tituloPagina = "Marinas & guardarias";
        break;
      case "servicos-nauticos":
        tituloPagina = "Serviços náuticos";
        break;
      case "pecas-acessorios":
        tituloPagina = "Peças & acessórios";
        break;
      default:
        tituloPagina = "Anúncios náuticos";
        break;
    }
  } else if (finalidade) {
    tituloPagina = `Náutica — ${finalidade}`;
  } else if (tipo) {
    tituloPagina = `Náutica — ${tipo}`;
  } else if (subcategoria) {
    tituloPagina = `Náutica — ${subcategoria}`;
  }

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);

      let query = supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, preco, imagens, subcategoria_nautica, finalidade_nautica, categoria, destaque, status"
        )
        .eq("categoria", "nautica")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false });

      // Filtro direto por finalidade (ex.: aluguel)
      if (finalidade) {
        query = query.eq("finalidade_nautica", finalidade);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao carregar anúncios de náutica:", error);
        setAnuncios([]);
        setLoading(false);
        return;
      }

      let filtrados = data || [];
      const norm = (s) => (s || "").toLowerCase();

      if (grupo) {
        switch (grupo) {
          case "lanchas-veleiros":
            filtrados = filtrados.filter((a) => {
              const sub = norm(a.subcategoria_nautica);
              const fin = norm(a.finalidade_nautica);
              return (
                fin === "venda" &&
                (sub.includes("lancha") || sub.includes("veleiro"))
              );
            });
            break;

          case "jetski-caiaques":
            filtrados = filtrados.filter((a) => {
              const sub = norm(a.subcategoria_nautica);
              return (
                sub.includes("jet") ||
                sub.includes("ski") ||
                sub.includes("stand-up") ||
                sub.includes("stand up") ||
                sub.includes("caiaque")
              );
            });
            break;

          case "barcos-pesca":
            filtrados = filtrados.filter((a) =>
              norm(a.subcategoria_nautica).includes("pesca")
            );
            break;

          case "motores-equipamentos":
            filtrados = filtrados.filter((a) => {
              const sub = norm(a.subcategoria_nautica);
              if (!sub || sub === "outros") return false;
              if (sub === "motores & equipamentos") return true;
              if (sub.includes("motor")) return true;
              if (sub.includes("equip")) return true;
              return false;
            });
            break;

          case "marinas-guardarias":
            filtrados = filtrados.filter((a) => {
              const sub = norm(a.subcategoria_nautica);
              return sub.includes("marina") || sub.includes("guardaria");
            });
            break;

          case "servicos-nauticos":
            filtrados = filtrados.filter((a) => {
              const sub = norm(a.subcategoria_nautica);
              return (
                sub.includes("serviço") ||
                sub.includes("servico") ||
                sub.includes("manutenção") ||
                sub.includes("manutencao") ||
                sub.includes("reforma")
              );
            });
            break;

          case "pecas-acessorios":
            filtrados = filtrados.filter((a) => {
              const sub = norm(a.subcategoria_nautica);
              if (!sub || sub === "outros") return false;
              if (sub === "peças & acessórios" || sub === "pecas & acessorios")
                return true;
              if (
                sub.includes("peça") ||
                sub.includes("peca") ||
                sub.includes("acess")
              )
                return true;
              return false;
            });
            break;

          default:
            break;
        }
      } else {
        if (tipo) {
          const t = tipo.toLowerCase();
          filtrados = filtrados.filter(
            (a) => norm(a.subcategoria_nautica) === t
          );
        }
        if (subcategoria) {
          const s = subcategoria.toLowerCase();
          filtrados = filtrados.filter(
            (a) => norm(a.subcategoria_nautica) === s
          );
        }
      }

      setAnuncios(filtrados);
      setLoading(false);
    };

    carregar();
  }, [tipo, finalidade, subcategoria, grupo]);

  return (
    <main className="bg-white min-h-screen">
      {/* TOPO */}
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Classilagos &gt; Náutica
            </p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {tituloPagina}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Embarcações, motores, serviços e equipamentos náuticos na Região
              dos Lagos.
            </p>
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
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="h-28 md:h-32 bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs px-3 py-2">
                  Carregando...
                </div>
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
              const img =
                Array.isArray(item.imagens) && item.imagens.length > 0
                  ? item.imagens[0]
                  : null;

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
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">
                      {item.titulo}
                    </p>

                    <p className="text-[10px] text-slate-300">
                      {item.subcategoria_nautica
                        ? `${item.subcategoria_nautica} • `
                        : ""}
                      {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>

                    {item.preco && (
                      <p className="text-[11px] font-bold text-emerald-300">
                        {item.preco}
                      </p>
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

