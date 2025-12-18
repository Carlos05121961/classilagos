"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";

// ✅ HERO em WEBP (pasta /public/hero)
const heroImages = ["/hero/veiculos-01.webp", "/hero/veiculos-02.webp", "/hero/veiculos-03.webp"];

// ✅ BANNERS AFILIADOS (Topo)
const bannersTopo = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

// ✅ BANNERS AFILIADOS (Rodapé) — PRINCIPAL
const bannersRodape = [
  {
    src: "/banners/rodape/banner-rodape-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

// Cidades padrão
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

// Tipos (para ajudar na busca do topo)
const tiposVeiculo = ["Carro", "Moto", "Caminhonete", "Caminhão", "Utilitário", "Van", "Outros"];

function norm(s) {
  return (s || "").toString().trim().toLowerCase();
}

function pegarCapaDoAnuncio(anuncio) {
  const imgs = Array.isArray(anuncio?.imagens) ? anuncio.imagens : [];
  return imgs.find((u) => typeof u === "string" && u.trim() !== "") || "/imoveis/sem-foto.jpg";
}

// ✅ Cards na ordem final
const cards = [
  { nome: "Carros à venda", slug: "carros-venda", href: "/veiculos/lista?tipo=Carro" },
  { nome: "Motos à venda", slug: "motos-venda", href: "/veiculos/lista?tipo=Moto" },
  { nome: "Seminovos", slug: "seminovos", href: "/veiculos/lista?condicao=seminovo" },
  { nome: "0 km", slug: "zero-km", href: "/veiculos/lista?condicao=0km" },
  { nome: "Financiados", slug: "financiados", href: "/veiculos/lista?financiado=1" },
  { nome: "Consignados", slug: "consignados", href: "/veiculos/lista?consignado=1" },
  { nome: "Loja / Revenda", slug: "loja-revenda", href: "/veiculos/lista?loja=1" },
  { nome: "Locação de carros", slug: "locadoras", href: "/veiculos/lista?loja=1" },
];

export default function VeiculosPage() {
  const router = useRouter();

  // ✅ HERO premium: preload + fade “nuvem”
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState(() => new Set());
  const [fadeIn, setFadeIn] = useState(false);

  // busca topo (ligada ao /busca)
  const [buscaTexto, setBuscaTexto] = useState("");
  const [buscaTipo, setBuscaTipo] = useState("");
  const [buscaCidade, setBuscaCidade] = useState("");

  const [veiculos, setVeiculos] = useState([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);

  // Preload das imagens do hero (evita “piscar”)
  useEffect(() => {
    heroImages.forEach((src) => {
      const im = new window.Image();
      im.src = src;
      im.onload = () =>
        setLoadedSet((prev) => {
          const n = new Set(prev);
          n.add(src);
          return n;
        });
    });
  }, []);

  // Rotação do hero
  useEffect(() => {
    if (!heroImages.length) return;
    const t = setInterval(() => {
      setFadeIn(false);
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  // Ativa fade quando a imagem atual estiver carregada
  useEffect(() => {
    const src = heroImages[heroIndex];
    if (loadedSet.has(src)) {
      const id = setTimeout(() => setFadeIn(true), 30);
      return () => clearTimeout(id);
    }
  }, [heroIndex, loadedSet]);

  // Buscar anúncios de veículos no Supabase
  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        setLoadingVeiculos(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "veiculos")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(80);

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

  // Escolhe 1 anúncio para representar cada card
  function escolherAnuncioParaCard(slug) {
    if (!veiculos || veiculos.length === 0) return null;

    let filtrados = [...veiculos];

    switch (slug) {
      case "carros-venda":
        filtrados = filtrados.filter((a) => norm(a.tipo_imovel) === "carro");
        break;

      case "motos-venda":
        filtrados = filtrados.filter((a) => norm(a.tipo_imovel) === "moto");
        break;

      case "seminovos":
        filtrados = filtrados.filter((a) => norm(a.condicao_veiculo) === "seminovo");
        break;

      case "zero-km":
        filtrados = filtrados.filter((a) => norm(a.condicao_veiculo) === "0km" || a.zero_km === true);
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

      case "locadoras":
        filtrados = filtrados.filter((a) => a.loja_revenda === true);
        break;

      default:
        break;
    }

    if (filtrados.length === 0) return null;

    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  const listaDestaques = useMemo(() => {
    if (!veiculos || veiculos.length === 0) return [];
    const soDestaques = veiculos.filter((a) => a.destaque === true);
    if (soDestaques.length > 0) return soDestaques.slice(0, 8);
    return veiculos.slice(0, 8);
  }, [veiculos]);

  function executarBusca() {
    const partes = [];
    if (buscaTexto?.trim()) partes.push(buscaTexto.trim());
    if (buscaTipo) partes.push(buscaTipo);
    if (buscaCidade) partes.push(buscaCidade);

    const q = partes.join(" ").trim();
    router.push(`/busca?q=${encodeURIComponent(q)}&categoria=veiculos`);
  }

  const heroSrc = heroImages[heroIndex];

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (afiliado, clicável, rotativo) */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* ✅ HERO PREMIUM (sem piscar) */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          {/* fundo “nuvem” */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200" />

          {/* imagem em background com fade */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: loadedSet.has(heroSrc) && fadeIn ? 1 : 0,
              backgroundImage: `url(${heroSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* pré-carregamento silencioso */}
          <Image src={heroSrc} alt="Pré-carregamento hero" fill className="opacity-0 pointer-events-none" />
        </div>

        {/* overlay premium em degradê */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35" />

        {/* textos mais altos + sombra premium */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white translate-y-[-26px] sm:translate-y-[-34px]">
          <p className="text-sm md:text-base font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
            Encontre carros, motos, caminhões e oportunidades em toda a Região dos Lagos.
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold [text-shadow:0_6px_20px_rgba(0,0,0,0.75)]">
            Classilagos – Veículos
          </h1>
          <div className="mt-3 flex justify-center">
            <div className="h-[3px] w-44 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA (ligada ao motor) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Busca</label>
                <input
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executarBusca()}
                  type="text"
                  placeholder="Ex.: corolla 2014, jeep 4x4, moto 150"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Tipo</label>
                <select
                  value={buscaTipo}
                  onChange={(e) => setBuscaTipo(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {tiposVeiculo.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Cidade</label>
                <select
                  value={buscaCidade}
                  onChange={(e) => setBuscaCidade(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={executarBusca}
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">Busca ligada ao motor do Classilagos.</p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* CARDS */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const capa = anuncio ? pegarCapaDoAnuncio(anuncio) : null;

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img
                      src={capa}
                      alt={anuncio?.titulo || cat.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, veículos aqui
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 text-white px-3 py-2">
                  <p className="text-xs md:text-sm font-semibold">{cat.nome}</p>
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

        {/* DESTAQUES */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">Veículos em destaque</h2>
        </div>

        {loadingVeiculos ? (
          <p className="text-xs text-slate-500">Carregando veículos...</p>
        ) : listaDestaques.length === 0 ? (
          <p className="text-xs text-slate-500">Ainda não há veículos cadastrados. Seja o primeiro a anunciar!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {listaDestaques.map((carro) => {
              const img = pegarCapaDoAnuncio(carro);
              return (
                <Link
                  key={carro.id}
                  href={`/anuncios/${carro.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    <img
                      src={img}
                      alt={carro.titulo || "Veículo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2">
                    <p className="text-[11px] font-semibold line-clamp-2 uppercase">{carro.titulo}</p>
                    <p className="mt-1 text-[10px] text-slate-200">
                      {carro.cidade}
                      {carro.bairro ? ` • ${carro.bairro}` : ""}
                    </p>
                    {carro.preco && <p className="mt-1 text-[11px] font-bold text-emerald-300">R$ {carro.preco}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) — com respiro */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

      {/* FAIXA – SERVIÇOS */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">Serviços e informações para veículos</h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para entender documentos, custos e serviços importantes na hora de comprar, vender
            ou trocar seu veículo na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">IPVA, multas e documentação</h3>
              <p className="text-[11px] text-slate-300">
                Em breve, links diretos para consultar IPVA, multas, documentação, licenciamento e serviços do Detran.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Financiamento e consórcio</h3>
              <p className="text-[11px] text-slate-300">
                Informações básicas sobre financiamento, consórcios, simulações e contato com bancos e financeiras.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Vistoria e laudos</h3>
              <p className="text-[11px] text-slate-300">
                Dicas sobre vistorias, laudos cautelares, transferência e cuidados ao comprar veículos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Serviços para o seu veículo</h3>
              <p className="text-[11px] text-slate-300">
                Em breve, integração com o LagoListas para encontrar oficinas, lava-jatos, autoelétricas e mais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

