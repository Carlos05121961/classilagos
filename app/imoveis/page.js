"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

const CIDADES = [
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

const TIPOS_IMOVEL = [
  "Casa",
  "Apartamento",
  "Cobertura",
  "Kitnet / Studio",
  "Terreno / Lote",
  "Comercial",
  "Loja / Sala",
  "Galpão",
  "Sítio / Chácara",
  "Outros",
];

const TIPOS_COMERCIAIS = ["Comercial", "Loja / Sala", "Galpão"];

// ===== helpers =====
function normalizar(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function finalidadeEhTemporada(v) {
  const s = normalizar(v);
  return (
    s === "temporada" ||
    s === "aluguel temporada" ||
    s === "aluguel_temporada" ||
    s === "aluguel-por-temporada"
  );
}

function finalidadeEhAluguel(v) {
  const s = normalizar(v);
  return s === "aluguel" || s === "aluguel fixo" || s === "aluguel_fixo";
}

function isDestaqueTruthy(v) {
  if (v === true) return true;
  const s = normalizar(v);
  return s === "true" || s === "1" || s === "sim" || s === "yes";
}

function isLancamento(anuncio) {
  const t = normalizar(anuncio?.titulo);
  const d = normalizar(anuncio?.descricao);
  return (
    t.includes("lancamento") ||
    t.includes("lançamento") ||
    d.includes("lancamento") ||
    d.includes("lançamento")
  );
}

function getCapa(anuncio) {
  const imagens = Array.isArray(anuncio?.imagens) ? anuncio.imagens : [];
  return imagens?.[0] || "/imoveis/sem-foto.jpg";
}

export default function ImoveisPage() {
  const router = useRouter();

  // ===== busca do topo =====
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [cidade, setCidade] = useState("");

  // ===== cards =====
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [listaBase, setListaBase] = useState([]);

  useEffect(() => {
    async function carregarBase() {
      try {
        setCarregando(true);
        setErro("");

        // Pega uma base "grande" e ordenada (destaque primeiro, depois mais recentes)
        // e faz o filtro dos cards em JS (evita bugs de query e “troca” no refresh).
        const { data, error } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, descricao, cidade, bairro, imagens, finalidade, tipo_imovel, created_at, destaque, status, categoria"
          )
          .eq("categoria", "imoveis")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(250);

        if (error) throw error;

        // se existir status, prioriza ativos
        const base = (data || []).filter((a) => {
          const st = normalizar(a?.status);
          return !st || st === "ativo";
        });

        setListaBase(base);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar os imóveis agora.");
      } finally {
        setCarregando(false);
      }
    }

    carregarBase();
  }, []);

  // ===== escolhe 1 anúncio por card (sempre o primeiro da base ordenada) =====
  const picks = useMemo(() => {
    const base = Array.isArray(listaBase) ? listaBase : [];

    const pick = (fn) => base.find(fn) || null;

    const aluguelTemporada = pick((a) => finalidadeEhTemporada(a.finalidade));
    const aluguelResidencial = pick(
      (a) => finalidadeEhAluguel(a.finalidade) && !TIPOS_COMERCIAIS.includes(a.tipo_imovel)
    );

    const casasVenda = pick(
      (a) => normalizar(a.finalidade) === "venda" && normalizar(a.tipo_imovel) === "casa"
    );

    const aptsVenda = pick(
      (a) => normalizar(a.finalidade) === "venda" && normalizar(a.tipo_imovel) === "apartamento"
    );

    const aluguelComercial = pick(
      (a) => finalidadeEhAluguel(a.finalidade) && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
    );

    const comercialVenda = pick(
      (a) => normalizar(a.finalidade) === "venda" && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
    );

    const terrenos = pick((a) => normalizar(a.tipo_imovel) === "terreno / lote");

    const lancamentos = pick((a) => isLancamento(a));

    return {
      aluguelTemporada,
      aluguelResidencial,
      casasVenda,
      aptsVenda,
      aluguelComercial,
      comercialVenda,
      terrenos,
      lancamentos,
    };
  }, [listaBase]);

  const cards = useMemo(() => {
    return [
      {
        key: "aluguel-temporada",
        titulo: "Aluguel por temporada",
        href: "/imoveis/lista?finalidade=aluguel%20temporada",
        anuncio: picks.aluguelTemporada,
      },
      {
        key: "aluguel-residencial",
        titulo: "Aluguel residencial",
        href: "/imoveis/lista?finalidade=aluguel&aluguel_tipo=residencial",
        anuncio: picks.aluguelResidencial,
      },
      {
        key: "casas-venda",
        titulo: "Casas à venda",
        href: "/imoveis/lista?finalidade=venda&tipo_imovel=Casa",
        anuncio: picks.casasVenda,
      },
      {
        key: "apts-venda",
        titulo: "Apartamentos à venda",
        href: "/imoveis/lista?finalidade=venda&tipo_imovel=Apartamento",
        anuncio: picks.aptsVenda,
      },
      {
        key: "aluguel-comercial",
        titulo: "Aluguel comercial",
        href: "/imoveis/lista?finalidade=aluguel&aluguel_tipo=comercial",
        anuncio: picks.aluguelComercial,
      },
      {
        key: "comercial-venda",
        titulo: "Imóveis comercial (venda)",
        href: "/imoveis/lista?comercial_venda=1",
        anuncio: picks.comercialVenda,
      },
      {
        key: "terrenos",
        titulo: "Terrenos & Lotes",
        href: "/imoveis/lista?tipo_imovel=Terreno%20%2F%20Lote",
        anuncio: picks.terrenos,
      },
      {
        key: "lancamentos",
        titulo: "Lançamentos",
        href: "/imoveis/lista?lancamento=1",
        anuncio: picks.lancamentos,
      },
    ];
  }, [picks]);

  function irParaLista() {
    const params = new URLSearchParams();

    if (busca.trim()) params.set("q", busca.trim());
    if (tipo) params.set("tipo_imovel", tipo);
    if (cidade) params.set("cidade", cidade);

    // não depende disso existir na lista (se não existir, não quebra nada)
    router.push(`/imoveis/lista?${params.toString()}`);
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-10">
      <section className="max-w-6xl mx-auto px-4 pt-6">
        {/* topo / busca */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Imóveis</h1>
              <p className="mt-1 text-xs md:text-sm text-slate-600">
                Busca ligada ao motor do Classilagos.
              </p>
            </div>

            <Link
              href="/anunciar/formulario?tipo=imoveis"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 text-white px-5 py-2 text-xs md:text-sm font-semibold hover:bg-sky-700 transition"
            >
              Anunciar grátis
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr,200px,200px,140px] items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Busca</label>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-full px-4 py-2 text-xs md:text-sm"
                placeholder="Ex.: casa 2 quartos, frente para a lagoa"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-full px-4 py-2 text-xs md:text-sm bg-white"
              >
                <option value="">Todos</option>
                {TIPOS_IMOVEL.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Cidade</label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-full px-4 py-2 text-xs md:text-sm bg-white"
              >
                <option value="">Todas</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={irParaLista}
              className="rounded-full bg-blue-600 text-white px-5 py-2 text-xs md:text-sm font-semibold hover:bg-blue-700 transition"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* cards */}
        <div className="mt-7">
          {erro && (
            <p className="text-xs md:text-sm text-red-600 border border-red-100 rounded-xl px-4 py-3 bg-red-50 mb-4">
              {erro}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => {
              const a = c.anuncio;
              const capa = getCapa(a);

              return (
                <Link
                  key={c.key}
                  href={c.href}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
                >
                  {/* imagem com altura fixa (resolve card menor) */}
                  <div className="relative w-full h-44 bg-slate-100">
                    <Image
                      src={capa}
                      alt={c.titulo}
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform"
                      priority={false}
                    />

                    {a && isDestaqueTruthy(a.destaque) && (
                      <span className="absolute top-3 left-3 rounded-full bg-amber-500 text-[10px] font-semibold text-white px-2 py-1 shadow">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-slate-900 text-white">
                    <h2 className="font-semibold text-sm">{c.titulo}</h2>

                    {a ? (
                      <p className="mt-1 text-[11px] text-slate-200 line-clamp-2">
                        {a.titulo}
                        {a.cidade ? ` • ${a.cidade}` : ""}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-300">
                        Ainda sem anúncios nessa seção.
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* dica de estabilidade */}
          {!carregando && (
            <p className="mt-4 text-[11px] text-slate-500">
              Obs.: Os cards pegam sempre o anúncio mais recente (com destaque primeiro) de cada categoria,
              evitando “trocar” no refresh.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

