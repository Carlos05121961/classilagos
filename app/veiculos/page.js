"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

const heroImages = [
  "/veiculos/carro-01.jpg",
  "/veiculos/carro-02.jpg",
  "/veiculos/carro-03.jpg",
];

// Cidades (mesmo padrão dos outros pilares)
const cidades = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro da Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
];

// Tipos de veículos
const tiposVeiculo = [
  "Carro",
  "Moto",
  "Caminhonete",
  "Caminhão",
  "Utilitário",
  "Outros",
];

// CATEGORIAS LINHA 1 – com slug + href para a lista
const categoriasLinha1 = [
  {
    nome: "Carros à venda",
    slug: "carros-venda",
    href: "/veiculos/lista?tipo=Carro",
  },
  {
    nome: "Motos à venda",
    slug: "motos-venda",
    href: "/veiculos/lista?tipo=Moto",
  },
  {
    nome: "Seminovos",
    slug: "seminovos",
    href: "/veiculos/lista?condicao=seminovo",
  },
  {
    nome: "Oportunidades",
    slug: "oportunidades",
    href: "/veiculos/lista", // mostra tudo (prioriza destaque)
  },
];

// CATEGORIAS LINHA 2
const categoriasLinha2 = [
  {
    nome: "0 km",
    slug: "zero-km",
    href: "/veiculos/lista?condicao=0km",
  },
  {
    nome: "Financiados",
    slug: "financiados",
    href: "/veiculos/lista?financiado=1",
  },
  {
    nome: "Consignados",
    slug: "consignados",
    href: "/veiculos/lista?consignado=1",
  },
  {
    nome: "Loja / Revenda",
    slug: "loja-revenda",
    href: "/veiculos/lista?loja=1",
  },
];

export default function VeiculosPage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [veiculos, setVeiculos] = useState([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);

  // ROTATIVO DO HERO
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // BUSCAR ANÚNCIOS DE VEÍCULOS NO SUPABASE (para cards + destaques)
  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        setLoadingVeiculos(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select(
            "*"
            // id, titulo, cidade, bairro, preco, imagens,
            // tipo_imovel, condicao_veiculo, zero_km,
            // financiado, consignado, loja_revenda, destaque, created_at...
          )
          .eq("categoria", "veiculos")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(40);

        if (error) {
          console.error("Erro ao buscar veículos:", error);
          setVeiculos([]);
        } else {
          setVeiculos(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao buscar veículos:", e);
        setVeiculos([]);
      } finally {
        setLoadingVeiculos(false);
      }
    };

    fetchVeiculos();
  }, []);

  // Escolhe um anúncio para representar cada CARD de categoria
  function escolherAnuncioParaCard(slug) {
    if (!veiculos || veiculos.length === 0) return null;

    let filtrados = [...veiculos];

    switch (slug) {
      case "carros-venda":
        filtrados = filtrados.filter((a) => {
          const tipo = (a.tipo_imovel || "").toLowerCase();
          return tipo === "carro";
        });
        break;

      case "motos-venda":
        filtrados = filtrados.filter((a) => {
          const tipo = (a.tipo_imovel || "").toLowerCase();
          return tipo === "moto";
        });
        break;

      case "seminovos":
        filtrados = filtrados.filter((a) => {
          const c = (a.condicao_veiculo || "").toLowerCase();
          return c === "seminovo";
        });
        break;

      case "oportunidades":
        // por enquanto, usamos o campo destaque como "oportunidade"
        filtrados = filtrados.filter((a) => a.destaque === true);
        break;

      case "zero-km":
        filtrados = filtrados.filter((a) => {
          const c = (a.condicao_veiculo || "").toLowerCase();
          return c === "0km" || a.zero_km === true;
        });
        break;

      case "financiados":
        filtrados = filtrados.filter((a) => a.financiado === true);
        break;

      case "consignados":
        filtrados = filtrados.filter((a) => a.consignado === true);
        break;

      case "loja-revenda":
        filtrados = filtrados.filter((a) => a.loja_revenda === true);
        break;

      default:
        break;
    }

    if (filtrados.length === 0) return null;

    // se dentro da categoria tiver algum em destaque, prioriza
    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  // Lista de veículos em destaque (para a faixa "Veículos em destaque")
  const listaDestaques = (() => {
    if (!veiculos || veiculos.length === 0) return [];
    const soDestaques = veiculos.filter((a) => a.destaque === true);
    if (soDestaques.length > 0) return soDestaques.slice(0, 8);
    return veiculos.slice(0, 8);
  })();

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu veículo totalmente GRÁTIS - Classilagos"
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
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Veículos"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre carros, motos, caminhões e oportunidades em toda a Região
              dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Veículos
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA (ainda estática, padrão igual Imóveis) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: carro 1.0 completo, moto 150cc"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Tipo
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos</option>
                  {tiposVeiculo.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará ligada aos anúncios reais da plataforma.
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* CATEGORIAS + DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {/* LINHA 1 – com foto do anúncio representando o card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa =
              imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, veículos aqui
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">
                    {cat.nome}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* LINHA 2 – também com mini-fotos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const imagensValidas = Array.isArray(anuncio?.imagens)
              ? anuncio.imagens
              : [];
            const capa =
              imagensValidas.length > 0 ? imagensValidas[0] : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-400 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-700">
                      Em breve, veículos aqui
                    </div>
                  )}
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">
                    {cat.nome}
                  </p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* VEÍCULOS EM DESTAQUE – anúncios reais do Supabase */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Veículos em destaque
          </h2>

          {loadingVeiculos ? (
            <p className="text-xs text-slate-500">
              Carregando veículos em destaque...
            </p>
          ) : listaDestaques.length === 0 ? (
            <p className="text-xs text-slate-500">
              Ainda não há veículos cadastrados. Seja o primeiro a anunciar!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {listaDestaques.map((carro) => {
                const href = `/anuncios/${carro.id}`;
                const imagens = Array.isArray(carro.imagens)
                  ? carro.imagens
                  : [];
                const capa =
                  imagens.length > 0
                    ? imagens[0]
                    : "/veiculos/sem-foto.jpg";

                return (
                  <Link
                    key={carro.id}
                    href={href}
                    className="group block overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    <div className="relative h-24 md:h-28 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={capa}
                        alt={carro.titulo || "Veículo"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] md:text-xs font-semibold line-clamp-2 uppercase">
                        {carro.titulo}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        {carro.cidade}{" "}
                        {carro.bairro ? `• ${carro.bairro}` : ""}
                      </p>
                      {carro.preco && (
                        <p className="mt-1 text-[11px] text-emerald-200 font-semibold">
                          R$ {carro.preco}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
