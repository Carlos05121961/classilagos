"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BannerRotator from "../../components/BannerRotator";

// Aqui você cadastra os cartões postais
const POSTAIS = [
  {
    id: "restinga-aerea-01",
    cidade: "Maricá",
    titulo: "Restinga de Maricá – vista aérea",
    caminho: "/postais/marica/restinga-aerea-01.webp",
    credito: "Foto: Carlinhos Soares",
    descricao:
      "Vista aérea da restinga entre a lagoa e o mar em Maricá, cartão postal clássico da Região dos Lagos.",
  },
  // Exemplo extra – depois você copia esse bloco e cria quantos quiser
  /*
  {
    id: "ponta-negra-01",
    cidade: "Maricá",
    titulo: "Farol de Ponta Negra",
    caminho: "/postais/marica/ponta-negra-01.webp",
    credito: "Foto: Carlinhos Soares",
    descricao:
      "Farol de Ponta Negra ao entardecer, com as ondas batendo nas pedras.",
  },
  */
];

export default function CartoesPostaisPage() {
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [origin, setOrigin] = useState("");

  // Pega o domínio atual (produção, dev, etc.) para montar o link de compartilhamento
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Lista de cidades para o filtro
  const cidades = useMemo(() => {
    const set = new Set(POSTAIS.map((p) => p.cidade));
    return Array.from(set).sort();
  }, []);

  const postaisFiltrados =
    cidadeFiltro === "todas"
      ? POSTAIS
      : POSTAIS.filter((p) => p.cidade === cidadeFiltro);

  return (
    <main className="bg-white min-h-screen pb-10">
      {/* BANNER TOPO (mesmo padrão das outras páginas) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CABEÇALHO */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Cartões postais digitais
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
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
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
              value={cidadeFiltro}
              onChange={(e) => setCidadeFiltro(e.target.value)}
            >
              <option value="todas">Todas</option>
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {postaisFiltrados.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ainda não há cartões cadastrados
            {cidadeFiltro !== "todas" ? ` para ${cidadeFiltro}.` : "."}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {postaisFiltrados.map((postal) => {
              const urlImagem = `${origin || ""}${postal.caminho}`;
              const textoBase = `${postal.titulo} – cartão postal da Região dos Lagos (Classilagos).`;

              const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
                `${textoBase} ${urlImagem}`
              )}`;
              const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                urlImagem
              )}`;

              const copiarLink = () => {
                if (navigator && navigator.clipboard) {
                  navigator.clipboard.writeText(urlImagem);
                  alert("Link copiado! Cole no Instagram, TikTok ou onde quiser.");
                } else {
                  alert("Não foi possível copiar automaticamente. Tente copiar o link manualmente.");
                }
              };

              return (
                <article
                  key={postal.id}
                  id={postal.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
                >
                  {/* IMAGEM */}
                  <div className="h-64 bg-slate-100 overflow-hidden">
                    <img
                      src={postal.caminho}
                      alt={postal.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTEÚDO */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                        {postal.cidade}
                      </p>
                      <h2 className="text-sm md:text-base font-bold text-slate-900">
                        {postal.titulo}
                      </h2>
                      <p className="text-[11px] text-slate-600">
                        {postal.descricao}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {postal.credito}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Formato recomendado: 1600×900px • WebP
                      </p>
                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {/* Abrir em tela cheia */}
                      <a
                        href={postal.caminho}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-slate-900 text-white text-[11px] px-4 py-1.5 font-semibold hover:bg-slate-800"
                      >
                        Abrir em tela cheia
                      </a>

                      {/* Compartilhar WhatsApp */}
                      <a
                        href={whatsappShare}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#25D366] text-white text-[11px] px-3 py-1.5 font-semibold hover:bg-[#1EBE57]"
                      >
                        WhatsApp
                      </a>

                      {/* Compartilhar Facebook */}
                      <a
                        href={facebookShare}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#1877F2] text-white text-[11px] px-3 py-1.5 font-semibold hover:bg-[#0F5BCC]"
                      >
                        Facebook
                      </a>

                      {/* Copiar link (Instagram / TikTok) */}
                      <button
                        type="button"
                        onClick={copiarLink}
                        className="rounded-full border border-slate-300 text-[11px] px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Copiar link (Instagram / TikTok)
                      </button>
                    </div>

                    <p className="mt-2 text-[10px] text-slate-400">
                      Para postar no <span className="font-semibold">Instagram</span> ou{" "}
                      <span className="font-semibold">TikTok</span>, copie o link
                      acima ou baixe a imagem em tela cheia e publique pelo aplicativo.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA VOLTAR PARA TURISMO */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex justify-center">
          <Link
            href="/turismo"
            className="rounded-full bg-sky-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-sky-700"
          >
            Voltar para o Guia ONDE – Turismo
          </Link>
        </div>
      </section>
    </main>
  );
}
