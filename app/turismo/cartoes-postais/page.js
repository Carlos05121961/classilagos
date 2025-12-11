"use client";

import { useState } from "react";
import Link from "next/link";
import BannerRotator from "../../components/BannerRotator";

// URL base do seu site (para copiar/compartilhar)
const SITE_BASE = "https://classilagos.vercel.app";

// cidades disponíveis no filtro
const CIDADES = [
  { id: "todas", nome: "Todas" },
  { id: "marica", nome: "Maricá" },
  { id: "saquarema", nome: "Saquarema" },
  { id: "buzios", nome: "Búzios" },
  { id: "arraial", nome: "Arraial do Cabo" },
];

// CADASTRO FIXO DOS CARTÕES
const POSTAIS = [
  // ============ MARICÁ ============
  {
    id: "marica-01",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 01",
    caminho: "/postais/marica/marica-01.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-02",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 02",
    caminho: "/postais/marica/marica-02.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-03",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 03",
    caminho: "/postais/marica/marica-03.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-04",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 04",
    caminho: "/postais/marica/marica-04.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-05",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 05",
    caminho: "/postais/marica/marica-05.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-06",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 06",
    caminho: "/postais/marica/marica-06.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-07",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 07",
    caminho: "/postais/marica/marica-07.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-08",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 08",
    caminho: "/postais/marica/marica-08.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-09",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 09",
    caminho: "/postais/marica/marica-09.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-10",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 10",
    caminho: "/postais/marica/marica-10.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-11",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 11",
    caminho: "/postais/marica/marica-11.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "marica-12",
    cidadeId: "marica",
    cidadeNome: "Maricá",
    titulo: "Maricá – cartão 12",
    caminho: "/postais/marica/marica-12.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },

  // ============ SAQUAREMA ============
  // (quando subir as imagens, deixe exatamente esses nomes de arquivo)
  {
    id: "saquarema-01",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 01",
    caminho: "/postais/saquarema/saquarema-01.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-02",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 02",
    caminho: "/postais/saquarema/saquarema-02.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  // ... copie/cole até saquarema-12 se quiser

  // ============ BÚZIOS ============
  {
    id: "buzios-01",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 01",
    caminho: "/postais/buzios/buzios-01.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },

  // ============ ARRAIAL DO CABO ============
  {
    id: "arraial-01",
    cidadeId: "arraial",
    cidadeNome: "Arraial do Cabo",
    titulo: "Arraial do Cabo – cartão 01",
    caminho: "/postais/arraial/arraial-01.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
];

export default function CartoesPostaisPage() {
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [copiadoId, setCopiadoId] = useState(null);

  const listaFiltrada =
    cidadeFiltro === "todas"
      ? POSTAIS
      : POSTAIS.filter((p) => p.cidadeId === cidadeFiltro);

  const handleCopiarLink = async (caminho, id) => {
    const url = SITE_BASE + caminho;

    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      }
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2500);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
      alert("Não foi possível copiar o link. Tente novamente.");
    }
  };

  const handleCompartilharWhatsApp = (caminho, titulo) => {
    const url = SITE_BASE + caminho;
    const texto = encodeURIComponent(`${titulo} - Classilagos\n${url}`);
    const shareUrl = `https://wa.me/?text=${texto}`;

    if (typeof window !== "undefined") {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <main className="bg-white min-h-screen pb-10">
      {/* BANNER TOPO IGUAL OUTRAS PÁGINAS */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <BannerRotator />
          </div>
        </div>
      </section>

      {/* TÍTULO + FILTRO CIDADE */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Cartões postais digitais
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Escolha um cartão postal da Região dos Lagos, abra em tela cheia e
              compartilhe com seus amigos pelo WhatsApp, Facebook ou copiando o
              link para postar no Instagram e TikTok.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-600">
              Cidade
            </label>
            <select
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
              value={cidadeFiltro}
              onChange={(e) => setCidadeFiltro(e.target.value)}
            >
              {CIDADES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID DE CARTÕES */}
        {listaFiltrada.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ainda não há cartões cadastrados para esta cidade.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {listaFiltrada.map((card) => (
              <article
                key={card.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
              >
                {/* IMAGEM */}
                <div className="h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={card.caminho}
                    alt={card.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTEÚDO */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                      {card.cidadeNome}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {card.titulo}
                    </h3>
                    {card.descricao && (
                      <p className="text-[11px] text-slate-600">
                        {card.descricao}
                      </p>
                    )}
                    {card.credito && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        {card.credito}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      Formato recomendado: 1800×1200px – WebP
                    </p>
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    {/* Abrir em tela cheia */}
                    <Link
                      href={card.caminho}
                      target="_blank"
                      className="rounded-full bg-sky-600 text-white text-xs px-4 py-1.5 font-semibold text-center hover:bg-sky-700"
                    >
                      Abrir em tela cheia
                    </Link>

                    {/* Enviar pelo WhatsApp */}
                    <button
                      type="button"
                      onClick={() =>
                        handleCompartilharWhatsApp(card.caminho, card.titulo)
                      }
                      className="rounded-full bg-[#25D366] text-white text-xs px-4 py-1.5 font-semibold hover:bg-[#1EBE57]"
                    >
                      Enviar pelo WhatsApp
                    </button>

                    {/* Copiar link */}
                    <button
                      type="button"
                      onClick={() => handleCopiarLink(card.caminho, card.id)}
                      className="rounded-full border border-slate-300 text-xs px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {copiadoId === card.id
                        ? "Link copiado!"
                        : "Copiar link do cartão"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
