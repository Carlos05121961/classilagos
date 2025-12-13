"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";
import BannerRotator from "./components/BannerRotator";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";

export default function Home() {
  const router = useRouter();

  // HERO (agora em WEBP na pasta /public/hero)
  const heroImages = ["/hero/home-01.webp", "/hero/home-02.webp", "/hero/home-03.webp"];

  // ORDEM DOS ÍCONES (como você definiu)
  const categorias = [
    { label: "Turismo", value: "turismo", href: "/turismo", icon: "/icons/turismo.png" },
    { label: "Imóveis", value: "imoveis", href: "/imoveis", icon: "/icons/imoveis.png" },
    { label: "Serviços", value: "servico", href: "/servicos", icon: "/icons/servicos.png" },
    { label: "LagoListas", value: "lagolistas", href: "/lagolistas", icon: "/icons/lagolistas.png" },
    { label: "Empregos", value: "emprego", href: "/empregos", icon: "/icons/empregos.png" },
    { label: "Veículos", value: "veiculos", href: "/veiculos", icon: "/icons/veiculos.png" },
    { label: "Náutica", value: "nautica", href: "/nautica", icon: "/icons/nautica.png" },
    { label: "Pets", value: "pets", href: "/pets", icon: "/icons/pets.png" },
  ];

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

  const formatCategoria = (cat) => {
    switch (cat) {
      case "imoveis":
        return "Imóveis";
      case "veiculos":
        return "Veículos";
      case "nautica":
        return "Náutica";
      case "pets":
        return "Pets";
      case "emprego":
        return "Empregos";
      case "curriculo":
        return "Currículos";
      case "servico":
        return "Serviços";
      case "turismo":
        return "Turismo";
      case "lagolistas":
        return "LagoListas";
      default:
        return "Classificados";
    }
  };

  // CLASSILAGOS TV
  const tvEmbedUrl = "https://www.youtube.com/embed/Q1z3SdRcYxs";

  // BUSCA (AGORA LIGADA)
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (q?.trim()) params.set("q", q.trim());
    if (categoria) params.set("categoria", categoria);
    if (cidade) params.set("cidade", cidade);

    router.push(`/busca?${params.toString()}`);
  };

  // permitir Enter no campo texto
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuscar();
    }
  };

  // DESTAQUES
  const [destaques, setDestaques] = useState([]);
  const [loadingDestaques, setLoadingDestaques] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("destaque", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error) setDestaques(data || []);
      setLoadingDestaques(false);
    }
    carregarDestaques();
  }, []);

  return (
    <main className="bg-white">
      {/* BANNER TOPO (rotator) */}
      <BannerRotator />

      {/* HERO */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          {/* “FUMAÇA” MAIS LEVE + CLIMA PRAIA */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/10 to-slate-950/45" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10">
            <div className="text-center drop-shadow max-w-3xl">
              <p
                className="
                  text-xs sm:text-sm md:text-base mb-3
                  text-white/95
                  [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]
                "
              >
                O seu guia de compras, serviços, turismo e oportunidades em toda a Região dos Lagos.
              </p>

              {/* TEXTO VERÃO (amarelo/laranja/vermelho) + sombra */}
              <h1
                className="
                  text-2xl sm:text-3xl md:text-4xl font-extrabold
                  tracking-[0.10em] uppercase
                  bg-gradient-to-r from-yellow-200 via-orange-300 to-rose-300
                  bg-clip-text text-transparent
                  [text-shadow:0_6px_18px_rgba(0,0,0,0.50)]
                "
              >
                Classilagos – Região dos Lagos em um só lugar
              </h1>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CAIXA DE BUSCA — GRADIENTE “PRAIA” */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-700">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-5">
          <div className="rounded-3xl bg-slate-950/92 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.65)] px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-white/90 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex.: aluguel temporada, veterinário, eletricista..."
                  className="w-full rounded-full border border-white/15 px-3 py-2 bg-white/5 text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-yellow-200/60 transition"
                />
              </div>

              {/* Categoria */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-white/90 mb-1">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-full border border-white/15 px-3 py-2 bg-white/5 text-white"
                >
                  <option value="" className="text-slate-900">
                    Todas
                  </option>
                  {categorias.map((c) => (
                    <option key={c.value} value={c.value} className="text-slate-900">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-white/90 mb-1">
                  Cidade
                </label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full rounded-full border border-white/15 px-3 py-2 bg-white/5 text-white"
                >
                  <option value="" className="text-slate-900">
                    Toda a região
                  </option>
                  {cidades.map((c) => (
                    <option key={c} value={c} className="text-slate-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleBuscar}
                className="rounded-full bg-white text-slate-900 hover:bg-yellow-50 px-6 py-2 font-semibold shadow-md hover:scale-105 transition"
              >
                Buscar
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-white/85">
            Agora a busca já direciona para a página de resultados (/busca).
          </p>
        </div>
      </section>

      {/* PILARES */}
      <section className="py-12 bg-[url('/fundobotoes.jpg')] bg-cover bg-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="max-w-[150px] w-full mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-md hover:shadow-lg hover:-translate-y-1 transition flex flex-col items-center justify-between py-3 px-2"
              >
                <div className="relative w-24 h-24 mb-1">
                  <Image src={cat.icon} alt={cat.label} fill className="object-contain" />
                </div>

                <p className="text-center text-[13px] font-semibold text-slate-700">
                  {cat.label}
                </p>

                <span className="text-[11px] text-cyan-700 font-medium hover:text-cyan-900">
                  Abrir
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="bg-white pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Anúncios em destaque</h2>
              <p className="text-xs text-slate-500">
                Os anúncios mais vistos e marcados como destaque.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Anúncios marcados como <strong>destaque</strong> aparecem aqui na página principal.
              </p>
            </div>

            <Link
              href="/anunciar"
              className="hidden sm:inline-block text-xs font-semibold text-cyan-700"
            >
              Anuncie em destaque →
            </Link>
          </div>

          {loadingDestaques ? (
            <p className="text-center text-slate-500">Carregando...</p>
          ) : destaques.length === 0 ? (
            <p className="text-center text-slate-500">
              Nenhum destaque ainda. Seja o primeiro a anunciar!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {destaques.map((item) => {
                const imagensValidas = Array.isArray(item.imagens) ? item.imagens : [];
                const thumb = imagensValidas.length > 0 ? imagensValidas[0] : "";

                return (
                  <Link
                    key={item.id}
                    href={`/anuncios/${item.id}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm hover:-translate-y-[2px] hover:shadow-md transition overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-28 bg-slate-900/85 flex items-center justify-center">
                      {thumb ? (
                        <img src={thumb} alt={item.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] text-slate-200">Imagem do anúncio</span>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-600">
                        • Destaque
                      </span>
                      <h3 className="text-sm font-semibold line-clamp-2">{item.titulo}</h3>
                      <p className="text-[11px] text-slate-600">
                        {formatCategoria(item.categoria)} • {item.cidade}
                      </p>
                      {item.preco && (
                        <p className="text-[11px] font-semibold text-slate-900">R$ {item.preco}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-4 text-center sm:hidden">
            <Link href="/anunciar" className="text-xs font-semibold text-cyan-700">
              Quero anunciar em destaque →
            </Link>
          </div>
        </div>
      </section>

      {/* TV + NOTÍCIAS (2 blocos) */}
      <section className="bg-white pb-10 -mt-4">
        <div className="max-w-7xl mx-auto px-4 grid gap-4 md:grid-cols-3">
          {/* TV */}
          <div className="rounded-2xl border border-slate-200 p-4 sm:p-6 bg-slate-50 shadow-sm flex flex-col md:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-2">Classilagos TV</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3">
              Reportagens, vídeos locais, clipes e transmissões especiais da Região dos Lagos.
            </p>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900/80">
              <iframe
                src={tvEmbedUrl}
                title="Classilagos TV"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <Link
              href="/tv"
              className="mt-3 inline-flex items-center text-xs sm:text-sm font-semibold text-cyan-700 hover:text-cyan-900"
            >
              Ver mais vídeos →
            </Link>
          </div>

          {/* NOTÍCIAS (2 cards ao lado) */}
          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
            <Link
              href="/noticias"
              className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm flex flex-col"
            >
              <h3 className="font-semibold text-slate-900 mb-1">Notícias</h3>
              <p className="text-sm text-slate-600">
                Últimas notícias da Região dos Lagos e do Brasil.
              </p>
              <span className="mt-3 text-xs font-semibold text-cyan-700">
                Acessar portal de notícias →
              </span>
            </Link>

            <Link
              href="/noticias"
              className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm flex flex-col"
            >
              <h3 className="font-semibold text-slate-900 mb-1">Notícias da Região</h3>
              <p className="text-sm text-slate-600">
                Atualizações locais, economia, clima e acontecimentos.
              </p>
              <span className="mt-3 text-xs font-semibold text-cyan-700">
                Ver destaques regionais →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* “PAINEL RÁPIDO” NOVO: EMPREGOS (Vagas + Currículos) */}
      <section className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-bold text-white mb-4">Empregos – Vagas e Currículos</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* VAGAS */}
            <Link
              href="/empregos"
              className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-base font-semibold text-white">Vagas de emprego</p>
                <p className="text-[12px] text-slate-300 mt-1">
                  Encontre oportunidades nas 9 cidades da região.
                </p>
              </div>
              <span className="mt-4 text-[11px] text-cyan-300 font-semibold">Ver vagas →</span>
            </Link>

            {/* CURRÍCULOS */}
            <Link
              href="/empregos"
              className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-base font-semibold text-white">Currículos cadastrados</p>
                <p className="text-[12px] text-slate-300 mt-1">
                  Empresas podem encontrar profissionais prontos para trabalhar.
                </p>
              </div>
              <span className="mt-4 text-[11px] text-cyan-300 font-semibold">
                Ver currículos →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER 02 (rodapé acima do footer do layout) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
            <img
              src="/banners/anuncio-02.png"
              alt="Banner Classilagos"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
