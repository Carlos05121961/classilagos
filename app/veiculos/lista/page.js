
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

// componente interno que usa useSearchParams
function ListaVeiculosContent() {
  const searchParams = useSearchParams();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  const tipo = searchParams.get("tipo") || "";
  const condicao = searchParams.get("condicao") || "";
  const isFinanciado = searchParams.get("financiado") === "1";
  const isConsignado = searchParams.get("consignado") === "1";
  const isLoja = searchParams.get("loja") === "1";

  let tituloPagina = "Veículos em destaque";
  if (tipo === "Carro") tituloPagina = "Carros à venda";
  if (tipo === "Moto") tituloPagina = "Motos à venda";
  if (condicao === "seminovo") tituloPagina = "Veículos seminovos";
  if (condicao === "usado") tituloPagina = "Veículos usados";
  if (condicao === "0km") tituloPagina = "Veículos 0 km";
  if (isFinanciado) tituloPagina = "Veículos financiados";
  if (isConsignado) tituloPagina = "Veículos consignados";
  if (isLoja) tituloPagina = "Veículos de loja / revenda";

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);

      let query = supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, preco, imagens, tipo_imovel, condicao_veiculo, zero_km, financiado, consignado, loja_revenda, finalidade"
        )
        .eq("categoria", "veiculos")
        .order("created_at", { ascending: false });

      if (tipo) {
        query = query.eq("tipo_imovel", tipo);
      }
      if (condicao) {
        query = query.eq("condicao_veiculo", condicao);
      }
      if (isFinanciado) {
        query = query.eq("financiado", true);
      }
      if (isConsignado) {
        query = query.eq("consignado", true);
      }
      if (isLoja) {
        query = query.eq("loja_revenda", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao carregar veículos:", error);
        setAnuncios([]);
      } else {
        setAnuncios(data || []);
      }

      setLoading(false);
    };

    carregar();
  }, [tipo, condicao, isFinanciado, isConsignado, isLoja]);

  return (
    <main className="bg-white min-h-screen">
      {/* TOPO / BARRA DE TÍTULO */}
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Classilagos &gt; Veículos
            </p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {tituloPagina}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Anúncios publicados pelos usuários em toda a Região dos Lagos.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <Link
              href="/veiculos"
              className="text-xs text-slate-600 underline"
            >
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

      {/* LISTA DE ANÚNCIOS */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl shadow border border-slate-200"
              >
                <div className="h-28 md:h-32 w-full bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                  Carregando...
                </div>
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
              const img =
                Array.isArray(carro.imagens) && carro.imagens.length > 0
                  ? carro.imagens[0]
                  : null;

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
                        alt={carro.titulo}
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
                    <p className="text-[11px] font-semibold line-clamp-2 uppercase">
                      {carro.titulo}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-200">
                      {carro.cidade}
                      {carro.bairro ? ` • ${carro.bairro}` : ""}
                    </p>
                    {carro.preco && (
                      <p className="mt-1 text-[11px] font-bold text-emerald-300">
                        R$ {carro.preco}
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

// componente principal com Suspense
export default function ListaVeiculosPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-10">
            <p className="text-sm text-slate-600">Carregando veículos...</p>
          </section>
        </main>
      }
    >
      <ListaVeiculosContent />
    </Suspense>
  );
}
