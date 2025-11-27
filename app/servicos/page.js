"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ServicosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar anúncios do tipo "servico"
  useEffect(() => {
    const fetchServicos = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, faixa_preco, atende_domicilio, subcategoria_servico, imagens"
        )
        .eq("categoria", "servico") // <<< CORRIGIDO
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAnuncios(data);
      }
      setLoading(false);
    };

    fetchServicos();
  }, []);

  // Separação por sessões
  const classimed = anuncios.filter((a) =>
    [
      "Clínico geral",
      "Psicólogo",
      "Nutricionista",
      "Fisioterapeuta",
      "Cabeleireiro",
      "Esteticista",
      "Massoterapeuta",
      "Atendimento domiciliar",
    ].includes(a.subcategoria_servico)
  );

  const eventos = anuncios.filter((a) =>
    [
      "Buffet completo",
      "Decoração",
      "Fotografia",
      "Filmagem",
      "Doces e Salgados",
      "Bolo artístico",
      "Locação de brinquedos",
      "DJ / Iluminação",
    ].includes(a.subcategoria_servico)
  );

  const profissionais = anuncios.filter(
    (a) =>
      !classimed.includes(a) &&
      !eventos.includes(a) &&
      a.subcategoria_servico &&
      a.subcategoria_servico !== ""
  );

  // Miniatura do anúncio (logo ou primeira foto)
  const getThumb = (a) => {
    if (a.imagens && Array.isArray(a.imagens) && a.imagens.length > 0) {
      return a.imagens[0]; // primeira imagem como miniatura
    }
    return null;
  };

  // Card de anúncio
  const Card = ({ item }) => {
    const thumb = getThumb(item);

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group border rounded-2xl bg-white hover:bg-slate-50 transition shadow-sm overflow-hidden flex gap-3 p-3"
      >
        {/* Foto ou logo */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
          {thumb ? (
            <img
              src={thumb}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
              sem foto
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="font-semibold text-sm text-slate-900 line-clamp-2">
            {item.titulo}
          </p>

          {item.cidade && (
            <p className="text-[11px] text-slate-600">
              {item.cidade}
              {item.bairro ? ` • ${item.bairro}` : ""}
            </p>
          )}

          {item.faixa_preco && (
            <p className="text-[11px] font-semibold text-emerald-700">
              {item.faixa_preco}
            </p>
          )}

          {item.atende_domicilio && (
            <p className="text-[10px] text-blue-600 font-medium">
              🚗 Atende a domicílio
            </p>
          )}
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
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] overflow-hidden">
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

      {/* ==================== BLOCO CLASSIMED ==================== */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Classimed</h2>

        {loading && <p className="text-sm text-slate-500">Carregando…</p>}

        {!loading && classimed.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum serviço cadastrado.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classimed.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ==================== BLOCO EVENTOS ==================== */}
      <section className="max-w-5xl mx-auto px-4 pt-4 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Festas & Eventos
        </h2>

        {!loading && eventos.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum serviço cadastrado.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {eventos.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ==================== BLOCO PROFISSIONAIS ==================== */}
      <section className="max-w-5xl mx-auto px-4 pt-4 pb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Profissionais e Serviços
        </h2>

        {!loading && profissionais.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum serviço cadastrado.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {profissionais.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>

    </main>
  );
}
