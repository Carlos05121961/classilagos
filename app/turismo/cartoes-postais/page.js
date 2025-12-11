"use client";

import { useState } from "react";
import Link from "next/link";
import BannerRotator from "../../components/BannerRotator";

// AJUSTE AQUI SE TROCAR DE DOMÍNIO
const SITE_BASE = "https://classilagos.vercel.app";

/**
 * Lista de cidades para o filtro
 */
const CIDADES = [
  { id: "todas", label: "Todas" },
  { id: "marica", label: "Maricá" },
  { id: "saquarema", label: "Saquarema" },
  { id: "buzios", label: "Búzios" },
  { id: "arraial", label: "Arraial do Cabo" },
];

/**
 * Cartões postais cadastrados.
 * Você só precisa garantir que os arquivos existam nesses caminhos:
 * /public/postais/marica/marica-01.webp ...
 * /public/postais/saquarema/saquarema-01.webp ...
 * /public/postais/buzios/buzios-01.webp ...
 * /public/postais/arraial/arraial-01.webp ...
 */
const POSTAIS = [
  // =========== MARICÁ ===========
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

  // =========== SAQUAREMA ===========
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
  {
    id: "saquarema-03",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 03",
    caminho: "/postais/saquarema/saquarema-03.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-04",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 04",
    caminho: "/postais/saquarema/saquarema-04.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-05",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 05",
    caminho: "/postais/saquarema/saquarema-05.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-06",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 06",
    caminho: "/postais/saquarema/saquarema-06.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  // Se quiser até 12, é só completar daqui pra baixo:
  {
    id: "saquarema-07",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 07",
    caminho: "/postais/saquarema/saquarema-07.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-08",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 08",
    caminho: "/postais/saquarema/saquarema-08.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-09",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 09",
    caminho: "/postais/saquarema/saquarema-09.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-10",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 10",
    caminho: "/postais/saquarema/saquarema-10.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-11",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 11",
    caminho: "/postais/saquarema/saquarema-11.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "saquarema-12",
    cidadeId: "saquarema",
    cidadeNome: "Saquarema",
    titulo: "Saquarema – cartão 12",
    caminho: "/postais/saquarema/saquarema-12.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },

  // =========== BÚZIOS ===========
  {
    id: "buzios-01",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 01",
    caminho: "/postais/buzios/buzios-01.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-02",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 02",
    caminho: "/postais/buzios/buzios-02.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  // ...complete até buzios-12 se quiser
  {
    id: "buzios-03",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 03",
    caminho: "/postais/buzios/buzios-03.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-04",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 04",
    caminho: "/postais/buzios/buzios-04.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-05",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 05",
    caminho: "/postais/buzios/buzios-05.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-06",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 06",
    caminho: "/postais/buzios/buzios-06.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-07",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 07",
    caminho: "/postais/buzios/buzios-07.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-08",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 08",
    caminho: "/postais/buzios/buzios-08.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-09",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 09",
    caminho: "/postais/buzios/buzios-09.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-10",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 10",
    caminho: "/postais/buzios/buzios-10.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-11",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 11",
    caminho: "/postais/buzios/buzios-11.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "buzios-12",
    cidadeId: "buzios",
    cidadeNome: "Búzios",
    titulo: "Búzios – cartão 12",
    caminho: "/postais/buzios/buzios-12.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },

  // =========== ARRAIAL DO CABO ===========
  {
    id: "arraial-01",
    cidadeId: "arraial",
    cidadeNome: "Arraial do Cabo",
    titulo: "Arraial do Cabo – cartão 01",
    caminho: "/postais/arraial/arraial-01.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  {
    id: "arraial-02",
    cidadeId: "arraial",
    cidadeNome: "Arraial do Cabo",
    titulo: "Arraial do Cabo – cartão 02",
    caminho: "/postais/arraial/arraial-02.webp",
    credito: "Foto: Carlinhos Soares / Classilagos",
    descricao: "",
  },
  // ...complete até 12 também se quiser
];

/**
 * Componente principal da página
 */
export default function CartoesPostaisPage() {
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const listaFiltrada =
    cidadeFiltro === "todas"
      ? POSTAIS
      : POSTAIS.filter((p) => p.cidadeId === cidadeFiltro);

  const handleCopiarLink = async (caminho: string, id: string) => {
    const url = SITE_BASE + caminho;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiadoId(id);
        setTimeout(() => setCopiadoId(null), 2000);
      } else {
        // fallback simples: abre prompt
        window.prompt("Copie o link abaixo:", url);
      }
    } catch {
      window.prompt("Copie o link abaixo:", url);
    }
  };

  return (
    <main className="bg-white min-h-screen pb-10">
      {/* BANNER PADRÃO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <BannerRotator />
          </div>
        </div>
      </section>

      {/* TÍTULO + FILTRO */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Cartões postais digitais
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-600 max-w-2xl">
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
              {CIDADES.map((cidade) => (
                <option key={cidade.id} value={cidade.id}>
                  {cidade.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID DE CARTÕES */}
        {listaFiltrada.length === 0 ? (
          <p className="text-sm text-slate-500">
            Em breve teremos vários cartões postais desta cidade.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {listaFiltrada.map((card) => {
              const urlImagem = SITE_BASE + card.caminho;
              const textoWhatsApp = `Olha esse cartão postal da Região dos Lagos que encontrei no Classilagos: ${urlImagem}`;

              return (
                <article
                  key={card.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
                >
                  {/* IMAGEM */}
                  <div className="h-44 bg-slate-100 overflow-hidden">
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
                      <p className="text-[10px] text-slate-500">
                        {card.credito}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Formato recomendado: 1800×1200px · WebP
                      </p>
                    </div>

                    {/* AÇÕES */}
                    <div className="mt-3 flex flex-col gap-2">
                      <a
                        href={card.caminho}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 font-semibold hover:bg-blue-700 text-center"
                      >
                        Abrir em tela cheia
                      </a>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          textoWhatsApp
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#25D366] text-white text-xs px-4 py-1.5 font-semibold hover:bg-[#1EBE57] text-center"
                      >
                        Compartilhar no WhatsApp
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          urlImagem
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#1877F2] text-white text-xs px-4 py-1.5 font-semibold hover:bg-[#0F5BCC] text-center"
                      >
                        Compartilhar no Facebook
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopiarLink(card.caminho, card.id)}
                        className="rounded-full border border-slate-300 text-xs px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {copiadoId === card.id
                          ? "Link copiado!"
                          : "Copiar link para outras redes"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* RODAPÉ EXPLICATIVO */}
        <div className="mt-6 text-[11px] text-slate-500 max-w-3xl">
          <p>
            Para postar no Instagram ou TikTok, abra o cartão em tela cheia,
            salve a imagem no seu celular e publique normalmente, marcando{" "}
            <span className="font-semibold">@classilagos</span> se quiser que a
            gente veja e compartilhe.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/turismo"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-sky-700"
          >
            Voltar para o Guia Onde – Turismo
          </Link>
        </div>
      </section>
    </main>
  );
}
