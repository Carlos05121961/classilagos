"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CasaTestePage() {
  const fotos = [
    "/imoveis/casa-teste-01.jpg",
    "/imoveis/casa-teste-02.jpg",
    "/imoveis/casa-teste-03.jpg",
  ];

  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  function abrirLightbox(index) {
    setFotoSelecionada(index);
  }

  function fecharLightbox() {
    setFotoSelecionada(null);
  }

  function proximaFoto() {
    setFotoSelecionada((prev) => (prev + 1) % fotos.length);
  }

  function fotoAnterior() {
    setFotoSelecionada((prev) =>
      prev === 0 ? fotos.length - 1 : prev - 1
    );
  }

  return (
    <main className="bg-white min-h-screen pb-20">
      
      {/* Banner topo */}
      <div className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[900px] px-4">
          <div className="relative w-full h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-02.png"
              alt="Classilagos Imóveis"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">

        {/* Voltar */}
        <Link
          href="/imoveis"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Voltar para Imóveis
        </Link>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">
          Casa 2 qts em Itaipuaçu
        </h1>

        {/* Cidade + bairro + tipo */}
        <p className="text-slate-600 mt-1">
          <span className="font-semibold">Maricá</span> — Itaipuaçu • Venda
        </p>

        {/* Preço */}
        <p className="text-3xl font-bold text-emerald-600 mt-4">
          R$ 500.000
        </p>

        {/* GALERIA DE FOTOS */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {fotos.map((foto, index) => (
            <div
              key={index}
              className="relative w-full h-28 md:h-40 cursor-pointer"
              onClick={() => abrirLightbox(index)}
            >
              <Image
                src={foto}
                alt="Foto do imóvel"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* LIGHTBOX */}
        {fotoSelecionada !== null && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <button
              className="absolute top-6 right-6 text-white text-3xl"
              onClick={fecharLightbox}
            >
              ✕
            </button>

            {/* Setas */}
            <button
              onClick={fotoAnterior}
              className="absolute left-4 md:left-20 text-4xl text-white"
            >
              ‹
            </button>
            <button
              onClick={proximaFoto}
              className="absolute right-4 md:right-20 text-4xl text-white"
            >
              ›
            </button>

            <div className="relative w-[90%] max-w-2xl h-[70vh]">
              <Image
                src={fotos[fotoSelecionada]}
                alt="Foto ampliada"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* DESCRIÇÃO */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Descrição do imóvel
          </h2>
          <p className="text-slate-700 mt-2 leading-relaxed">
            Casa 2 qts em Itaipuaçu, garagem, piscina, sala, cozinha,
            2 banheiros, etc.
          </p>
        </section>

        {/* FICHA TÉCNICA */}
        <section className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Informações gerais
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-slate-500">Quartos</p>
              <p className="text-slate-900 font-bold">2</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-slate-500">Banheiros</p>
              <p className="text-slate-900 font-bold">2</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-slate-500">Área</p>
              <p className="text-slate-900 font-bold">120 m²</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-slate-500">Vagas</p>
              <p className="text-slate-900 font-bold">2</p>
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Contato do anunciante
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-slate-800 text-sm">
              <strong>Charles</strong>
            </p>

            <p className="text-slate-700 mt-1 text-sm">
              WhatsApp: <a 
                href="https://wa.me/5522987643216"
                target="_blank"
                className="text-blue-600 underline"
              >
                22 9876-43216
              </a>
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}




