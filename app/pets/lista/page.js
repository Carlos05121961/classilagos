"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

/** normaliza string: minúsculo + sem acento + trim */
function nstr(v) {
  return (v || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizarFiltro(valor) {
  const v = nstr(valor);
  if (!v) return "";
  if (v.startsWith("animais")) return "animais";
  if (v.includes("ado")) return "adocao";
  if (v.includes("achado") || v.includes("perdido")) return "achados";
  if (v.includes("serv")) return "servicos";
  return "";
}

function tituloPorFiltro(filtro) {
  switch (filtro) {
    case "animais":
      return "Pets – Animais à venda";
    case "adocao":
      return "Pets – Adoção / Doação";
    case "achados":
      return "Pets – Achados e perdidos";
    case "servicos":
      return "Pets – Serviços pet & acessórios";
    default:
      return "Pets – Lista";
  }
}

function isDestaqueTruthy(v) {
  if (v === true) return true;
  const s = nstr(v);
  return s === "true" || s === "1" || s === "sim" || s === "yes";
}

/** classifica em um dos 4 grupos (igual Pets/page.js) */
function classificarGrupo(anuncio) {
  const sub = nstr(anuncio?.subcategoria_pet || anuncio?.tipo_imovel || "");
  const titulo = nstr(anuncio?.titulo || "");
  const desc = nstr(anuncio?.descricao || "");

  // Achados e perdidos
  if (
    sub.includes("achado") ||
    sub.includes("perdido") ||
    titulo.includes("achado") ||
    titulo.includes("perdido")
  ) {
    return "achados";
  }

  // Adoção / doação
  if (
    sub.includes("adocao") ||
    sub.includes("doacao") ||
    titulo.includes("adocao") ||
    desc.includes("adocao")
  ) {
    return "adocao";
  }

  // Serviços pet & acessórios
  if (
    sub.includes("serv") ||
    sub.includes("acess") ||
    sub.includes("banho") ||
    sub.includes("tosa") ||
    sub.includes("hotel") ||
    sub.includes("hosped") ||
    sub.includes("clinica") ||
    sub.includes("veterin") ||
    titulo.includes("veterin") ||
    desc.includes("veterin") ||
    desc.includes("banho") ||
    desc.includes("tosa") ||
    desc.includes("clinica")
  ) {
    return "servicos";
  }

  return "animais";
}

function ListaPetsContent() {
  const searchParams = useSearchParams();

  const rawSub = searchParams.get("subcategoria");
  const rawCat = searchParams.get("categoria");
  const filtroSlug = normalizarFiltro(rawSub || rawCat);

  // ✅ motor novo
  const qRaw = (searchParams.get("q") || "").trim();
  const q = nstr(qRaw);
  const tipoRaw = (searchParams.get("tipo") || "").trim();
  const tipo = nstr(tipoRaw);
  const cidade = (searchParams.get("cidade") || "").trim();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  const tituloPagina = useMemo(() => {
    // se vier busca, prioriza um título mais “motor”
    if (qRaw || tipoRaw || cidade) {
      let t = "Pets – Resultados";
      if (tipoRaw) t = `Pets – ${tipoRaw}`;
      if (cidade) t += ` em ${cidade}`;
      return t;
    }
    return tituloPorFiltro(filtroSlug);
  }, [qRaw, tipoRaw, cidade, filtroSlug]);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setLoading(true);

        // ✅ padrão premium (igual Imóveis): ativo OU null + ordem premium
        let query = supabase
          .from("anuncios")
          .select(
            `
            id,
            titulo,
            descricao,
            cidade,
            bairro,
            preco,
            imagens,
            categoria,
            status,
            tipo_imovel,
            subcategoria_pet,
            destaque,
            prioridade,
            created_at
          `
          )
          .eq("categoria", "pets")
          .or("status.is.null,status.eq.ativo")
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(250);

        // filtro por cidade pode ir no DB (é exato)
        if (cidade) query = query.eq("cidade", cidade);

        const { data, error } = await query;

        if (cancelado) return;

        if (error) {
          console.error("Erro ao carregar anúncios de pets:", error);
          setAnuncios([]);
          return;
        }

        let lista = data || [];

        // ✅ Busca sem acento (resolve clinica/clinica)
        if (q) {
          const termos = q.split(/\s+/).filter(Boolean);
          lista = lista.filter((a) => {
            const blob = `${nstr(a.titulo)} ${nstr(a.descricao)} ${nstr(
              a.subcategoria_pet || a.tipo_imovel
            )} ${nstr(a.cidade)} ${nstr(a.bairro)}`;
            return termos.every((t) => blob.includes(t));
          });
        }

        // ✅ filtro por "tipo" do motor (4 grupos)
        if (tipo) {
          const tipoSlug = normalizarFiltro(tipo);
          if (tipoSlug) {
            lista = lista.filter((a) => classificarGrupo(a) === tipoSlug);
          }
        }

        // ✅ filtro antigo por cards (subcategoria/categoria)
        if (filtroSlug) {
          lista = lista.filter((a) => classificarGrupo(a) === filtroSlug);
        }

        setAnuncios(lista);
      } catch (e) {
        console.error("Erro inesperado ao carregar anúncios de pets:", e);
        if (!cancelado) setAnuncios([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [filtroSlug, q, tipo, cidade, qRaw, tipoRaw]);

  return (
    <main className="bg-white min-h-screen">
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Classilagos &gt; Pets</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">{tituloPagina}</h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">Anúncios de pets na Região dos Lagos.</p>

            <p className="mt-2 text-[11px] text-slate-500">
              {loading ? "Carregando..." : `${anuncios.length} resultado(s)`}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <Link href="/pets" className="text-xs text-slate-600 underline">
              &larr; Voltar para Pets
            </Link>
            <Link
              href="/anunciar?tipo=pets"
              className="inline-flex mt-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Anunciar para pets
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
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
            Nenhum anúncio de pets encontrado.
            <div className="mt-4">
              <Link className="text-blue-600 underline" href="/pets">
                Voltar para Pets
              </Link>
            </div>
          </div>
        )}

        {!loading && anuncios.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anuncios.map((item) => {
              const img = Array.isArray(item.imagens) && item.imagens.length > 0 ? item.imagens[0] : null;
              const subLabel = item.subcategoria_pet || item.tipo_imovel || "Pets";

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
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
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-white bg-blue-800">
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
                      {subLabel} • {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>
                    {item.preco && <p className="text-[11px] font-bold text-emerald-300">{item.preco}</p>}
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

export default function ListaPetsPage() {
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
      <ListaPetsContent />
    </Suspense>
  );
}

