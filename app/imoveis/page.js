"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ImoveisPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarImoveis() {
      setCarregando(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "imoveis")
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
        setErro("Não foi possível carregar os imóveis no momento.");
      } else {
        setAnuncios(data || []);
      }

      setCarregando(false);
    }

    carregarImoveis();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* HERO COM 3 FOTOS */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-sky-600 font-semibold">
            Imóveis
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Imóveis na Região dos Lagos
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-3xl">
            Casas, apartamentos, coberturas, sítios e terrenos em Maricá,
            Saquarema, Araruama, Iguaba Grande, São Pedro da Aldeia,
            Arraial do Cabo, Cabo Frio, Búzios e Rio das Ostras.
          </p>
        </div>

        {/* faixa com 3 imagens */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative h-44 md:h-56 rounded-3xl overflow-hidden shadow-sm">
            <Image
              src="/imoveis/imovel-01.jpg"
              alt="Imóveis na Região dos Lagos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs font-semibold text-white/80">
                Destaques em Cabo Frio
              </p>
            </div>
          </div>

          <div className="relative h-44 md:h-56 rounded-3xl overflow-hidden shadow-sm">
            <Image
              src="/imoveis/imovel-02.jpg"
              alt="Imóveis na Região dos Lagos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs font-semibold text-white/80">
                Casas de praia e temporada
              </p>
            </div>
          </div>

          <div className="relative h-44 md:h-56 rounded-3xl overflow-hidden shadow-sm">
            <Image
              src="/imoveis/imovel-03.jpg"
              alt="Imóveis na Região dos Lagos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs font-semibold text-white/80">
                Oportunidades em toda a região
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LISTAGEM DE IMÓVEIS */}
      <section className="space-y-4">
        {erro && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-sm text-slate-500">Carregando imóveis...</p>
        ) : anuncios.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ainda não há imóveis cadastrados. Que tal ser o primeiro a anunciar?
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {anuncios.map((anuncio) => {
              const temImagem =
                Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0;

              const imagemPrincipal = temImagem
                ? anuncio.imagens[0]
                : "/imoveis/sem-foto.jpg"; // imagem padrão para anúncios sem foto

              const precoTexto = anuncio.preco || "";
              const cidadeBairro = [anuncio.bairro, anuncio.cidade]
                .filter(Boolean)
                .join(" - ");

              const descricaoCurta = anuncio.descricao
                ? anuncio.descricao.length > 120
                  ? anuncio.descricao.slice(0, 120) + "..."
                  : anuncio.descricao
                : "";

              return (
                <Link
                  key={anuncio.id}
                  href={`/anuncios/${anuncio.id}`}
                  className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={imagemPrincipal}
                      alt={anuncio.titulo || "Imóvel"}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  </div>

                  <div className="p-3 flex-1 flex flex-col">
                    <h2 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
                      {anuncio.titulo || "Imóvel sem título"}
                    </h2>

                    {cidadeBairro && (
                      <p className="text-xs text-slate-500 mb-1">
                        {cidadeBairro}
                      </p>
                    )}

                    {precoTexto && (
                      <p className="text-sm font-semibold text-emerald-700 mb-1">
                        {precoTexto}
                      </p>
                    )}

                    {descricaoCurta && (
                      <p className="text-xs text-slate-600 mb-2 flex-1">
                        {descricaoCurta}
                      </p>
                    )}

                    <span className="mt-auto inline-flex text-xs font-medium text-blue-600 group-hover:text-blue-700">
                      Ver detalhes
                    </span>
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

