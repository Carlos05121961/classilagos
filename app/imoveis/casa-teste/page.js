"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const imagens = [
  "/imoveis/casa-teste-01.jpg",
  "/imoveis/casa-teste-02.jpg",
  "/imoveis/casa-teste-03.jpg",
];

const imovel = {
  titulo: "Casa 2 qts em Itaipuaçu",
  cidade: "Maricá",
  bairro: "Itaipuaçu",
  operacao: "Venda",
  preco: "R$ 500.000",
  descricao:
    "Casa 2 quartos em Itaipuaçu, garagem, piscina, sala, cozinha, 2 banheiros, área externa e outros detalhes. Excelente opção para morar ou veranear, em bairro em crescimento e próximo ao comércio local.",
  quartos: 2,
  banheiros: 2,
  area: 120,
  vagas: 2,
  codigo: "CL-0001",
  videoUrl: "", // quando tiver, coloque aqui o link do YouTube
  mapaUrl: "", // quando tiver, coloque aqui o link do Google Maps
};

export default function ImovelCasaTestePage() {
  const [fotoAtual, setFotoAtual] = useState(0);
  const [lightboxAberto, setLightboxAberto] = useState(false);

  function proximaFoto() {
    setFotoAtual((prev) => (prev + 1) % imagens.length);
  }

  function fotoAnterior() {
    setFotoAtual((prev) =>
      prev === 0 ? imagens.length - 1 : prev - 1
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        {/* Voltar */}
        <div className="mb-4">
          <Link
            href="/imoveis"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Imóveis
          </Link>
        </div>

        {/* Cabeçalho do imóvel */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {imovel.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">
              {imovel.cidade}
            </span>
            <span>— {imovel.bairro}</span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {imovel.operacao}
            </span>
            <span className="text-xs text-slate-400">
              Código: {imovel.codigo}
            </span>
          </div>

          <p className="mt-3 text-3xl font-extrabold text-emerald-600">
            {imovel.preco}
          </p>
        </header>

        {/* Galeria de fotos */}
        <section className="mb-8">
          {/* Foto principal */}
          <div
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 cursor-zoom-in shadow-sm"
            onClick={() => setLightboxAberto(true)}
          >
            <Image
              src={imagens[fotoAtual]}
              alt={imovel.titulo}
              fill
              className="object-cover hover:scale-[1.02] transition-transform"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>

          {/* Miniaturas */}
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {imagens.map((src, index) => (
              <button
                key={src}
                type="button"
                className={`relative h-20 w-32 flex-shrink-0 rounded-xl overflow-hidden border ${
                  index === fotoAtual
                    ? "border-emerald-500 ring-2 ring-emerald-300"
                    : "border-slate-200"
                }`}
                onClick={() => setFotoAtual(index)}
              >
                <Image
                  src={src}
                  alt={`Foto ${index + 1} - ${imovel.titulo}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Clique na foto principal para ampliar e navegar pelas imagens.
          </p>
        </section>

        {/* Detalhes principais */}
        <section className="grid gap-6 lg:grid-cols-[2fr,1.3fr] mb-10">
          {/* Descrição */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Descrição do imóvel
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {imovel.descricao}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
                <p className="text-xs text-slate-500">Cidade / Bairro</p>
                <p className="font-semibold text-slate-900">
                  {imovel.cidade} • {imovel.bairro}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
                <p className="text-xs text-slate-500">Tipo de anúncio</p>
                <p className="font-semibold text-slate-900">
                  {imovel.operacao}
                </p>
              </div>
            </div>
          </div>

          {/* Ficha técnica */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Detalhes do imóvel
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Quartos" value={`${imovel.quartos}`} />
              <Detail label="Banheiros" value={`${imovel.banheiros}`} />
              <Detail label="Área construída" value={`${imovel.area} m²`} />
              <Detail label="Vagas de garagem" value={`${imovel.vagas}`} />
              <Detail label="Código do anúncio" value={imovel.codigo} />
              <Detail label="Plataforma" value="Classilagos Imóveis" />
            </div>

            {/* Contato resumido (mock) */}
            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
              <p className="text-xs text-slate-500 mb-1">
                Contato do anunciante (simulação)
              </p>
              <p className="font-semibold text-slate-900">
                Charles • WhatsApp: (22) 9876-4321
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Nesta fase é apenas um modelo visual. Em breve, os contatos
                virão diretamente do cadastro feito no formulário.
              </p>
            </div>
          </div>
        </section>

        {/* Vídeo e mapa – aparecem apenas se tiver link */}
        {(imovel.videoUrl || imovel.mapaUrl) && (
          <section className="grid gap-6 lg:grid-cols-2 mb-10">
            {imovel.videoUrl && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Vídeo do imóvel
                </h2>
                <p className="text-xs text-slate-600 mb-2">
                  O vídeo será aberto em uma nova aba, sem sair do site
                  Classilagos.
                </p>
                <a
                  href={imovel.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Assistir no YouTube
                </a>
              </div>
            )}

            {imovel.mapaUrl && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Localização aproximada
                </h2>
                <p className="text-xs text-slate-600 mb-2">
                  O mapa será aberto em nova aba (Google Maps).
                </p>
                <a
                  href={imovel.mapaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Ver no Google Maps
                </a>
              </div>
            )}
          </section>
        )}

        {/* Outras ofertas */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Veja outras ofertas semelhantes
            </h2>
            <Link
              href="/imoveis"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Ver todos os imóveis
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                titulo: "Casa 3 qts com piscina em Itaipuaçu",
                cidade: "Maricá",
              },
              {
                titulo: "Apartamento 2 qts próximo à praia",
                cidade: "Cabo Frio",
              },
              {
                titulo: "Sítio com área verde e lazer",
                cidade: "Saquarema",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="relative h-32 bg-slate-200">
                  <Image
                    src="/imoveis/casa-teste-01.jpg"
                    alt={card.titulo}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-xs text-slate-500">{card.cidade}</p>
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {card.titulo}
                  </p>
                  <Link
                    href="/imoveis"
                    className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* LIGHTBOX / MODAL DE FOTOS */}
      {lightboxAberto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl">
            {/* Botão fechar */}
            <button
              type="button"
              onClick={() => setLightboxAberto(false)}
              className="absolute -top-10 right-0 text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full hover:bg-black"
            >
              Fechar ✕
            </button>

            {/* Botão anterior */}
            <button
              type="button"
              onClick={fotoAnterior}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 px-3 py-2 text-2xl text-white hover:bg-black"
            >
              ‹
            </button>

            {/* Botão próxima */}
            <button
              type="button"
              onClick={proximaFoto}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 px-3 py-2 text-2xl text-white hover:bg-black"
            >
              ›
            </button>

            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black">
              <Image
                src={imagens[fotoAtual]}
                alt={imovel.titulo}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}




