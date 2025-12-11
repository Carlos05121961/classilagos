"use client";

import { useState } from "react";
import Link from "next/link";
import BannerRotator from "../../components/BannerRotator";

// 🔹 Cadastro simples dos cartões postais
// Basta seguir o padrão: cidade, id, caminho do arquivo.
// Título, descrição e crédito são opcionais.
const POSTAIS = [
  // ---------- MARICÁ ----------
  {
    id: "marica-01",
    cidade: "Maricá",
    caminho: "/postais/marica/marica-01.webp",
    // Opcional – se não colocar, o sistema cria um título padrão
    titulo: "Restinga de Maricá – vista aérea",
    descricao:
      "Vista aérea da restinga entre a lagoa e o mar em Maricá, cartão postal clássico da Região dos Lagos.",
    credito: "Foto: Carlinhos Soares",
  },
  // Exemplo de outros cartões de Maricá:
  // {
  //   id: "marica-02",
  //   cidade: "Maricá",
  //   caminho: "/postais/marica/marica-02.webp",
  // },

  // ---------- SAQUAREMA ----------
  // {
  //   id: "saquarema-01",
  //   cidade: "Saquarema",
  //   caminho: "/postais/saquarema/saquarema-01.webp",
  // },

  // ---------- BÚZIOS ----------
  // {
  //   id: "buzios-01",
  //   cidade: "Búzios",
  //   caminho: "/postais/buzios/buzios-01.webp",
  // },

  // ---------- ARRAIAL DO CABO ----------
  // {
  //   id: "arraial-01",
  //   cidade: "Arraial do Cabo",
  //   caminho: "/postais/arraial/arraial-01.webp",
  // },
];

export default function CartoesPostaisPage() {
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [copiadoId, setCopiadoId] = useState(null);

  // Lista de cidades para o seletor
  const cidadesUnicas = Array.from(
    new Set(POSTAIS.map((p) => p.cidade))
  ).sort();

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const postaisFiltrados =
    cidadeFiltro === "todas"
      ? POSTAIS
      : POSTAIS.filter((p) => p.cidade === cidadeFiltro);

  const handleCopiarLink = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  };

  return (
    <main className="bg-white min-h-screen pb-10">
      {/* BANNER TOPO – mesmo padrão do site */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* TÍTULO + TEXTO INTRODUTÓRIO */}
      <section className="max-w-5xl mx-auto px-4 pt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Cartões postais digitais
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl">
            Escolha um cartão postal da Região dos Lagos, abra em tela cheia e
            compartilhe com seus amigos pelo WhatsApp, Facebook ou copiando o
            link para postar no Instagram e TikTok.
          </p>
        </div>

        {/* FILTRO POR CIDADE */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-slate-600">
            Cidade
          </label>
          <select
            value={cidadeFiltro}
            onChange={(e) => setCidadeFiltro(e.target.value)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-800 bg-white"
          >
            <option value="todas">Todas</option>
            {cidadesUnicas.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* LISTA DE CARTÕES */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        {postaisFiltrados.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ainda não há cartões cadastrados para esta cidade. Em breve teremos
            muitas opções da Região dos Lagos.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {postaisFiltrados.map((card) => {
              const imageUrl = card.caminho;
              const fullImageUrl = baseUrl + imageUrl;

              const titulo =
                card.titulo || `Cartão postal de ${card.cidade}`;
              const descricao =
                card.descricao ||
                "Cartão postal digital da Região dos Lagos.";
              const credito = card.credito || "";

              const textoWhatsApp = `Olha este cartão postal de ${card.cidade} no Classilagos: ${fullImageUrl}`;
              const whatsappShareUrl =
                "https://wa.me/?text=" + encodeURIComponent(textoWhatsApp);

              const facebookShareUrl =
                "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(fullImageUrl);

              return (
                <article
                  key={card.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
                >
                  {/* IMAGEM */}
                  <div className="bg-slate-100 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={titulo}
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  {/* CONTEÚDO */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                        {card.cidade}
                      </p>
                      <h2 className="text-sm md:text-base font-bold text-slate-900">
                        {titulo}
                      </h2>
                      <p className="text-[11px] text-slate-600">
                        {descricao}
                      </p>
                      {credito && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          {credito}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-slate-400">
                        Formato recomendado: 1600×900px • WebP
                      </p>
                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/* Abrir imagem em tela cheia */}
                      <a
                        href={fullImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Abrir em tela cheia
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={whatsappShareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
                      >
                        Enviar pelo WhatsApp
                      </a>

                      {/* Facebook */}
                      <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#1877F2] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
                      >
                        Compartilhar no Facebook
                      </a>

                      {/* Copiar link para Instagram / TikTok */}
                      <button
                        type="button"
                        onClick={() =>
                          handleCopiarLink(card.id, fullImageUrl)
                        }
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        {copiadoId === card.id
                          ? "Link copiado!"
                          : "Copiar link"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA final (opcional) */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-6 px-4 text-center text-xs sm:text-sm text-slate-600">
          Em breve, esta galeria terá cartões de todas as cidades da Região dos
          Lagos. Você pode criar novos postais e ir adicionando aqui sempre que
          quiser.
        </div>
      </section>
    </main>
  );
}
