"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

function ListaVeiculosContent() {
  const searchParams = useSearchParams();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    tipo: "",
    condicao: "",
    financiado: false,
    consignado: false,
    loja: false,
    locadora: false, // ✅ novo
  });

  // ✅ lê os parâmetros SEM travar (toda vez que a URL mudar)
  useEffect(() => {
    const tipo = searchParams.get("tipo") || "";
    const condicao = searchParams.get("condicao") || "";
    const financiado = searchParams.get("financiado") === "1";
    const consignado = searchParams.get("consignado") === "1";
    const loja = searchParams.get("loja") === "1";
    const locadora = searchParams.get("locadora") === "1"; // ✅ novo

    setFiltros({ tipo, condicao, financiado, consignado, loja, locadora });
  }, [searchParams]);

  // ✅ buscar anúncios conforme filtros
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setLoading(true);

        let query = supabase
          .from("anuncios")
          .select(
            "id, titulo, descricao, cidade, bairro, preco, imagens, tipo_imovel, condicao_veiculo, zero_km, financiado, consignado, loja_revenda, finalidade, destaque, created_at"
          )
          .eq("categoria", "veiculos")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false });

        if (filtros.tipo) query = query.eq("tipo_imovel", filtros.tipo);

        // ✅ condicao: trata 0km de duas formas
        if (filtros.condicao) {
          if (filtros.condicao === "0km") {
            query = query.or("condicao_veiculo.eq.0km,zero_km.eq.true");
          } else {
            query = query.eq("condicao_veiculo", filtros.condicao);
          }
        }

        if (filtros.financiado) query = query.eq("financiado", true);
        if (filtros.consignado) query = query.eq("consignado", true);
        if (filtros.loja) query = query.eq("loja_revenda", true);

        // ✅ Locadora (leve, sem depender de campo novo)
        if (filtros.locadora) {
          query = query.or(
            "finalidade.ilike.%aluguel%,finalidade.ilike.%loca%,titulo.ilike.%loca%,descricao.ilike.%loca%"
          );
        }

        const { data, error } = await query;

        if (cancelado) return;

        if (error) {
          console.error("Erro ao carregar veículos:", error);
          setAnuncios([]);
        } else {
          setAnuncios(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao carregar veículos:", e);
        if (!cancelado) setAnuncios([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [filtros]);

  const tituloPagina = useMemo(() => {
    let titulo = "Veículos em destaque";

    if (filtros.locadora) titulo = "Locação de carros";
    else if (filtros.tipo === "Carro") titulo = "Carros à venda";
    else if (filtros.tipo === "Moto") titulo = "Motos à venda";

    if (!filtros.locadora) {
      if (filtros.condicao === "seminovo") titulo = "Veículos seminovos";
      else if (filtros.condicao === "usado") titulo = "Veículos usados";
      else if (filtros.condicao === "0km") titulo = "Veículos 0 km";

      if (filtros.financiado) titulo = "Veículos financiados";
      if (filtros.consignado) titulo = "Veículos consignados";
      if (filtros.loja) titulo = "Veículos de loja / revenda";
    }

    return titulo;
  }, [filtros]);

  return (
    <main className="bg-white min-h-screen">
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Classilagos &gt; Veículos</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">{tituloPagina}</h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Anúncios publicados pelos usuários em toda a Região dos Lagos.
            </p>
            <div className="mt-2 text-[11px] text-slate-500">
              {loading ? "Carregando..." : `${anuncios.length} resultado(s)`}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <Link href="/veiculos" className="text-xs text-slate-600 underline">
              &larr; Voltar para veículos
            </Link>
            <Link
              href="/anunciar?tipo=veiculos"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Anunciar veículo grátis
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl shadow border border-slate-200">
                <div className="h-28 md:h-32 w-full bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">Carregando...</div>
              </div>
            ))}
          </div>
        )}

        {!loading && anuncios.length === 0 && (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum veículo encontrado para esse filtro.
            <div className="mt-4">
              <Link href="/veiculos" className="text-blue-600 underline text-sm">
                Voltar para veículos
              </Link>
            </div>
          </div>
        )}

        {!loading && anuncios.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anuncios.map((carro) => {
              const img = Array.isArray(carro.imagens) && carro.imagens.length > 0 ? carro.imagens[0] : null;

              return (
                <Link
                  key={carro.id}
                  href={`/anuncios/${carro.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    {img ? (
                      <Image
                        src={img}
                        alt={carro.titulo || "Veículo"}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2">
                    <p className="text-[11px] font-semibold line-clamp-2 uppercase">{carro.titulo}</p>
                    <p className="mt-1 text-[10px] text-slate-200">
                      {carro.cidade}
                      {carro.bairro ? ` • ${carro.bairro}` : ""}
                    </p>
                    {carro.preco && (
                      <p className="mt-1 text-[11px] font-bold text-emerald-300">R$ {carro.preco}</p>
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

export default function ListaVeiculosPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-600">Carregando...</div>}>
      <ListaVeiculosContent />
    </Suspense>
  );
}

