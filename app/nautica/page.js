"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/nautica/lancha-01.jpg",
  "/nautica/lancha-02.jpg",
  "/nautica/lancha-03.jpg",
];

export default function NauticaPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Rotativo do hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Carrega TODOS os anúncios de náutica (padrão Classilagos)
  useEffect(() => {
    async function carregarAnuncios() {
      setLoading(true);
      setErro("");
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "nautica")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao carregar anúncios de náutica:", error);
        setErro("Não foi possível carregar os anúncios de náutica no momento.");
      } else {
        setAnuncios(data || []);
      }
      setLoading(false);
    }

    carregarAnuncios();
  }, []);

  const getFinalidadeLabel = (anuncio) => {
    const value = anuncio.finalidade_nautica || anuncio.finalidade || "";
    switch (value) {
      case "venda":
        return "VENDA";
      case "aluguel":
        return "ALUGUEL";
      case "passeio":
        return "PASSEIO TURÍSTICO";
      case "servico":
        return "SERVIÇO NÁUTICO";
      case "vaga_marina":
        return "VAGA EM MARINA";
      default:
        return value ? value.toString().toUpperCase() : "";
    }
  };

  const getPrecoLabel = (preco) => {
    if (!preco) return "A combinar";
    return preco;
  };

  return (
    <main className="bg-slate-950 min-h-screen text-slate-900">
      {/* HERO / CAPA NÁUTICA */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={heroImages[currentHero]}
            alt="Náutica na Região dos Lagos"
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-900/20" />
          <div className="relative z-10 h-full flex flex-col items-start justify-end px-4 md:px-10 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              Náutica • Classilagos
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-100 max-w-xl">
              Lanchas, veleiros, jet skis, passeios, marinas e serviços
              náuticos em toda a Região dos Lagos.
            </p>
          </div>
        </div>
      </section>

      {/* ATALHOS / CATEGORIAS NÁUTICAS (cards de topo) */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-b from-slate-200 to-slate-300 p-[1px]">
              <div className="h-full rounded-2xl bg-slate-900/95 flex flex-col justify-between p-4">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                    Destaques
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-white">
                    Embarcações à venda
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    Lanchas, veleiros, barcos de pesca e mais.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">
                  Use o formulário para anunciar seu barco.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-200 to-slate-300 p-[1px]">
              <div className="h-full rounded-2xl bg-slate-900/95 flex flex-col justify-between p-4">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                    Turismo
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-white">
                    Passeios e experiências
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    Passeios de lancha, escuna, mergulho e roteiros exclusivos.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">
                  Anuncie seus pacotes turísticos náuticos.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-200 to-slate-300 p-[1px]">
              <div className="h-full rounded-2xl bg-slate-900/95 flex flex-col justify-between p-4">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                    Estruturas
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-white">
                    Marinas & guardarias
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    Vagas secas ou molhadas, estruturas completas.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">
                  Ofereça vagas para embarcações de todos os portes.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-slate-200 to-slate-300 p-[1px]">
              <div className="h-full rounded-2xl bg-slate-900/95 flex flex-col justify-between p-4">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                    Serviços
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-white">
                    Serviços náuticos
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    Manutenção, limpeza, transporte, mecânica e muito mais.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">
                  Profissionais e empresas de toda a região.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA PRINCIPAL DE ANÚNCIOS NÁUTICOS */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-900">
                Embarcações e anúncios náuticos
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Todos os anúncios de náutica publicados no Classilagos.
              </p>
            </div>

            <Link
              href="/anunciar/formulario?tipo=nautica"
              className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700 transition"
            >
              + Anunciar em Náutica
            </Link>
          </div>

          {erro && (
            <p className="text-sm text-red-600 border border-red-100 bg-red-50 rounded-md px-3 py-2 mb-4">
              {erro}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Carregando anúncios...</p>
          ) : anuncios.length === 0 ? (
            <p className="text-sm text-slate-500">
              Ainda não há anúncios náuticos publicados. Seja o primeiro a
              anunciar!
            </p>
          ) : (
            <>
              <p className="text-[11px] md:text-xs text-slate-500 mb-3">
                {anuncios.length} anúncio(s) encontrado(s)
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {anuncios.map((anuncio) => {
                  const img =
                    Array.isArray(anuncio.imagens) &&
                    anuncio.imagens.length > 0
                      ? anuncio.imagens[0]
                      : "/placeholder-nautica.jpg";

                  const finalidade = getFinalidadeLabel(anuncio);
                  const precoLabel = getPrecoLabel(anuncio.preco);

                  const localParts = [];
                  if (anuncio.cidade) localParts.push(anuncio.cidade);
                  if (anuncio.bairro) localParts.push(anuncio.bairro);
                  if (anuncio.ponto_embarque)
                    localParts.push(anuncio.ponto_embarque);
                  const local = localParts.join(" • ");

                  return (
                    <Link
                      href={`/anuncios/${anuncio.id}`}
                      key={anuncio.id}
                      className="group rounded-2xl overflow-hidden border border-sky-50 bg-white shadow-sm hover:shadow-md transition flex flex-col"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-slate-200">
                        <Image
                          src={img}
                          alt={anuncio.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {finalidade && (
                          <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-50">
                            {finalidade}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 p-4 flex flex-col gap-1.5">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                          {anuncio.titulo}
                        </h3>

                        {local && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {local}
                          </p>
                        )}

                        <p className="mt-1 text-sm font-semibold text-emerald-700">
                          {precoLabel}
                        </p>

                        {anuncio.subcategoria_nautica && (
                          <p className="text-[11px] text-slate-500">
                            {anuncio.subcategoria_nautica}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* RODAPÉZINHO DA SEÇÃO (texto institucional simples) */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <p className="text-[11px] md:text-xs text-slate-400">
            Use o Classilagos como guia para encontrar embarcações, marinas,
            passeios e serviços náuticos em toda a Região dos Lagos. Anuncie
            gratuitamente e conecte-se com clientes de Maricá, Saquarema,
            Araruama, Iguaba Grande, São Pedro da Aldeia, Arraial do Cabo, Cabo
            Frio, Búzios e Rio das Ostras.
          </p>
        </div>
      </section>
    </main>
  );
}
