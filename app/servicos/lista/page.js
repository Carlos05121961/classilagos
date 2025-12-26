"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

function tituloPorTipo(tipo) {
  if (tipo === "classimed") return "Serviços – Saúde (Classimed)";
  if (tipo === "eventos") return "Serviços – Festas & Eventos";
  if (tipo === "profissionais") return "Serviços – Profissionais & Serviços";
  return "Serviços – Lista";
}

function ListaServicosContent() {
  const searchParams = useSearchParams();

  const tipo = (searchParams.get("tipo") || "").trim(); // classimed|eventos|profissionais
  const q = (searchParams.get("q") || "").trim();
  const cidade = (searchParams.get("cidade") || "").trim();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const tituloPagina = useMemo(() => {
    if (q || cidade) {
      let t = "Serviços – Resultados";
      if (tipo) t = tituloPorTipo(tipo);
      if (cidade) t += ` em ${cidade}`;
      return t;
    }
    return tituloPorTipo(tipo);
  }, [tipo, q, cidade]);

  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      try {
        setLoading(true);
        setErro("");

        let query = supabase
          .from("anuncios")
          .select(
            `
            id,
            titulo,
            descricao,
            cidade,
            bairro,
            faixa_preco,
            atende_domicilio,
            subcategoria_servico,
            imagens,
            created_at,
            status,
            destaque,
            prioridade
          `
          )
          .or("categoria.eq.servicos,categoria.eq.servico,categoria.eq.serviços")
          .or("status.is.null,status.eq.ativo") // igual padrão Premium: não some anúncio antigo
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false });

        if (tipo) query = query.eq("subcategoria_servico", tipo);
        if (cidade) query = query.eq("cidade", cidade);

        if (q) {
          const safe = q.replace(/,/g, " ");
          query = query.or(`titulo.ilike.%${safe}%,descricao.ilike.%${safe}%`);
        }

        const { data, error } = await query;
        if (cancelado) return;

        if (error) {
          console.error("Erro ao carregar serviços (lista):", error);
          setAnuncios([]);
          setErro("Não foi possível carregar os serviços agora. Tente novamente.");
        } else {
          setAnuncios(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado serviços (lista):", e);
        if (!cancelado) {
          setAnuncios([]);
          setErro("Erro inesperado ao carregar serviços. Tente novamente.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    carregar();
    return () => {
      cancelado = true;
    };
  }, [tipo, q, cidade]);

  return (
    <main className="bg-white min-h-screen">
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Classilagos &gt; Serviços</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">{tituloPagina}</h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">Profissionais e empresas em toda a Região dos Lagos.</p>
            <p className="mt-2 text-[11px] text-slate-500">
              {loading ? "Carregando..." : `${anuncios.length} resultado(s)`}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <Link href="/servicos" className="text-xs text-slate-600 underline">
              &larr; Voltar para Serviços
            </Link>

            <div className="flex gap-2">
              <Link
                href="/anunciar/servicos/profissionais"
                className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Anunciar serviço
              </Link>
            </div>
          </div>
        </div>

        {/* atalhos rápidos */}
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/servicos/lista"
              className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              Ver tudo
            </Link>
            <Link
              href="/servicos/lista?tipo=classimed"
              className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Saúde (Classimed)
            </Link>
            <Link
              href="/servicos/lista?tipo=eventos"
              className="inline-flex rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-[11px] font-semibold text-pink-700 hover:bg-pink-100"
            >
              Festas & Eventos
            </Link>
            <Link
              href="/servicos/lista?tipo=profissionais"
              className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
            >
              Profissionais
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        {erro && (
          <p className="text-xs text-red-600 border border-red-100 rounded-md bg-red-50 px-3 py-2 mb-4">
            {erro}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-28 md:h-32 bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs px-3 py-2">Carregando...</div>
              </div>
            ))}
          </div>
        )}

        {!loading && anuncios.length === 0 && (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum serviço encontrado.
            <div className="mt-4">
              <Link className="text-blue-600 underline" href="/servicos">
                Voltar para Serviços
              </Link>
            </div>
          </div>
        )}

        {!loading && anuncios.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anuncios.map((item) => {
              const img = Array.isArray(item.imagens) && item.imagens.length > 0 ? item.imagens[0] : null;
              const tipoLabel =
                item.subcategoria_servico === "classimed"
                  ? "Saúde (Classimed)"
                  : item.subcategoria_servico === "eventos"
                  ? "Festas & Eventos"
                  : item.subcategoria_servico === "profissionais"
                  ? "Profissionais"
                  : "Serviços";

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    {img ? (
                      <Image src={img} alt={item.titulo} fill sizes="300px" className="object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-white bg-slate-400">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">{item.titulo}</p>
                    <p className="text-[10px] text-slate-300">
                      {tipoLabel} • {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>

                    {item.faixa_preco && <p className="text-[11px] font-bold text-emerald-300">{item.faixa_preco}</p>}
                    {item.atende_domicilio && (
                      <p className="text-[10px] text-emerald-200">Atende em domicílio</p>
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

export default function ListaServicosPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-10">
            <p className="text-sm text-slate-600">Carregando serviços...</p>
          </section>
        </main>
      }
    >
      <ListaServicosContent />
    </Suspense>
  );
}
