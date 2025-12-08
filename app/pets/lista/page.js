"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

function normalizarFiltro(valor) {
  const v = (valor || "").toLowerCase().trim();

  if (!v) return "";

  // aceita várias formas: "Animais", "animais-venda", etc.
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

function ListaPetsContent() {
  const searchParams = useSearchParams();

  // compat: aceita ?subcategoria=... ou ?categoria=...
  const rawSub = searchParams.get("subcategoria");
  const rawCat = searchParams.get("categoria");
  const filtroSlug = normalizarFiltro(rawSub || rawCat);

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  const tituloPagina = tituloPorFiltro(filtroSlug);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);

      const { data, error } = await supabase
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
            created_at
          `
        )
        .eq("categoria", "pets")
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar anúncios de pets:", error);
        setAnuncios([]);
        setLoading(false);
        return;
      }

      let lista = data || [];

      // 🔍 filtro por grupo (animais / adocao / achados / servicos)
      if (filtroSlug) {
        lista = lista.filter((a) => {
          const sub =
            (a.subcategoria_pet ||
              a.tipo_imovel || // compat anúncios antigos
              ""
            )
              .toLowerCase()
              .trim();

          switch (filtroSlug) {
            case "animais":
              return sub.startsWith("animais");
            case "adocao":
              return sub.includes("adocao") || sub.includes("adoção");
            case "achados":
              return sub.includes("achado") || sub.includes("perdido");
            case "servicos":
              return (
                sub.includes("servico") ||
                sub.includes("serviços") ||
                sub.includes("acess") // acessórios
              );
            default:
              return true;
          }
        });
      }

      setAnuncios(lista);
      setLoading(false);
    };

    carregar();
  }, [filtroSlug]);

  return (
    <main className="bg-white min-h-screen">
      {/* TOPO (padrão das listas) */}
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Classilagos &gt; Pets
            </p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {tituloPagina}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Anúncios de pets na Região dos Lagos.
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

      {/* LISTA DE ANÚNCIOS */}
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
              const img =
                Array.isArray(item.imagens) && item.imagens.length > 0
                  ? item.imagens[0]
                  : null;

              const subLabel =
                item.subcategoria_pet || item.tipo_imovel || "Pets";

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
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-white bg-blue-800">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">
                      {item.titulo}
                    </p>

                    <p className="text-[10px] text-slate-300">
                      {subLabel} • {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>

                    {item.preco && (
                      <p className="text-[11px] font-bold text-emerald-300">
                        {item.preco}
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
