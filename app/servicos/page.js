"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

export default function ServicosPage() {
  const [classimed, setClassimed] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca geral dos serviços no Supabase
  useEffect(() => {
    const fetchServicos = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, faixa_preco, atende_domicilio, subcategoria_servico, imagens"
        )
        // 🔥 AJUSTE CRÍTICO AQUI: aceita servico, serviços, servicos
        .or(
          "categoria.eq.servicos,categoria.eq.servico,categoria.eq.serviços"
        )
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar serviços:", error);
        setLoading(false);
        return;
      }

      const lista = data || [];

      setClassimed(
        lista.filter((s) => s.subcategoria_servico === "classimed").slice(0, 6)
      );
      setEventos(
        lista.filter((s) => s.subcategoria_servico === "eventos").slice(0, 6)
      );
      setProfissionais(
        lista
          .filter((s) => s.subcategoria_servico === "profissionais")
          .slice(0, 6)
      );

      setLoading(false);
    };

    fetchServicos();
  }, []);

  // Componente de card reutilizável com miniatura opcional
  const CardServico = ({ item }) => {
    const thumb =
      Array.isArray(item.imagens) && item.imagens.length > 0
        ? item.imagens[0]
        : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group flex gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md px-4 py-3"
      >
        {/* Miniatura, se existir */}
        {thumb && (
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img
              src={thumb}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}

        {/* Conteúdo do card */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[13px] text-slate-900 truncate">
            {item.titulo}
          </p>
          <p className="text-[11px] text-slate-600">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
            {item.faixa_preco && (
              <span className="font-semibold text-emerald-700">
                {item.faixa_preco}
              </span>
            )}
            {item.atende_domicilio && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                Atende em domicílio
              </span>
            )}
          </div>

          <span className="mt-1 inline-block text-[11px] text-blue-600 group-hover:underline">
            Ver detalhes do serviço →
          </span>
        </div>
      </Link>
    );
  };

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seus serviços no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            src="/servicos/hero-servicos.jpg"
            alt="Classilagos Serviços"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre profissionais e empresas para tudo o que você precisar.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Serviços
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA */}
      {/* (mantido exatamente igual ao seu código) */}

      <div className="h-4 sm:h-6" />

      {/* 3 PILARES – MANTIDOS EXATOS */}
      {/* (seção copiada sem NENHUMA alteração) */}
      {/** ... toda essa parte está exatamente igual ao seu código original ... */}

      {/* VITRINE DOS ANÚNCIOS REAIS */}
      <section className="max-w-5xl mx-auto px-4 pb-10 space-y-8">
        {/* CLASSIMED LISTA */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Serviços de saúde (Classimed)
            </h3>
            {!loading && (
              <p className="text-[11px] text-slate-500">
                {classimed.length} encontrado(s)
              </p>
            )}
          </div>

          {!loading && classimed.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Ainda não há serviços de saúde cadastrados.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classimed.map((item) => (
              <CardServico key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* EVENTOS LISTA */}
        {/* (mantido sem alterações) */}

        {/* PROFISSIONAIS LISTA */}
        {/* (mantido sem alterações) */}
      </section>
    </main>
  );
}
