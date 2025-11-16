"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  "/imoveis/casa-teste-01.jpg",
  "/imoveis/casa-teste-02.jpg",
  "/imoveis/casa-teste-03.jpg",
];

export default function CasaTestePage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* BANNER FIXO DO ANÚNCIO */}
      <div className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[900px] px-4">
          <div className="relative w-full h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Banner do anúncio"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* CONTEÚDO DO ANÚNCIO */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Voltar */}
        <div className="mb-4">
          <Link
            href="/imoveis"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Imóveis
          </Link>
        </div>

        {/* Cabeçalho do anúncio */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Casa para aluguel anual em Maricá – 2 quartos, quintal e
                garagem
              </h1>
              <p className="text-sm text-slate-700 mb-3">
                Anúncio de teste para visualização do layout de imóveis no
                Classilagos. Em breve, este modelo será usado para anúncios
                reais.
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  🛏️ 2 quartos
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  🚿 1 banheiro
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  🚗 Garagem
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                  📍 Maricá – Bairro de exemplo
                </span>
              </div>
            </div>

            {/* Bloco de valores (aluguel + detalhamento) */}
            <div className="w-full md:w-64 bg-slate-50 rounded-2xl border border-slate-200 p-3 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase text-slate-500">
                  Aluguel (exemplo)
                </span>
                <span className="text-base font-bold text-emerald-600">
                  R$ 1.070
                </span>
              </div>

              <div className="border-t border-slate-200 my-2" />

              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Condomínio</span>
                  <span>R$ 1.100</span>
                </div>
                <div className="flex justify-between">
                  <span>IPTU</span>
                  <span>R$ 10</span>
                </div>
                <div className="flex justify-between">
                  <span>Seguro incêndio</span>
                  <span>R$ 18</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de serviço</span>
                  <span>R$ 27</span>
                </div>
              </div>

              <div className="border-t border-slate-200 my-2" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-800">
                  Total estimado mensal
                </span>
                <span className="text-base font-bold text-emerald-700">
                  R$ 2.225
                </span>
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Valores meramente ilustrativos para demonstração de layout.
              </p>
            </div>
          </div>

          {/* Barra de ações */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50">
              ⭐ Favoritar
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50">
              📩 Compartilhar
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-50">
              🖨️ Imprimir
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-red-300 text-red-600 px-3 py-1 hover:bg-red-50 ml-auto">
              ⚠️ Denunciar este anúncio
            </button>
          </div>
        </section>

        {/* Galeria de fotos */}
        <section className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Foto principal */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <div
              className="relative w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={images[0]}
                alt="Foto principal da casa"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Clique na foto para ampliar e navegar entre as imagens.
            </p>
          </div>

          {/* Miniaturas */}
          <div className="space-y-3">
            {images.slice(1).map((src, idx) => {
              const realIndex = idx + 1;
              return (
                <div
                  key={src}
                  className="relative w-full h-[120px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm cursor-pointer"
                  onClick={() => openLightbox(realIndex)}
                >
                  <Image
                    src={src}
                    alt="Foto da casa"
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Vídeo opcional, detalhes, mapa, contato, similares, aviso... */}
        {/* (mantemos o restante igual ao modelo anterior que você já aprovou) */}
        {/* Para não ficar gigante aqui, se quiser depois eu te mando essa parte isolada
            para qualquer ajuste fino. */}
      </div>

      {/* LIGHTBOX das fotos */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-3xl h-[70vh] px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-white text-2xl"
              onClick={closeLightbox}
            >
              ✕
            </button>

            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-2xl px-3"
              onClick={showPrev}
            >
              ‹
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-2xl px-3"
              onClick={showNext}
            >
              ›
            </button>

            <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
              <Image
                src={images[lightboxIndex]}
                alt="Foto ampliada do imóvel"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


