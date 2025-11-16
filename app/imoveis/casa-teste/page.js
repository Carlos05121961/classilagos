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
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = fechado

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

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
                reais (casas, apartamentos e imóveis de imobiliárias ou
                proprietários).
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

        {/* Vídeo do imóvel (modelo) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Vídeo do imóvel (opcional)
          </h2>
          <p className="text-xs text-slate-600 mb-3">
            Neste espaço o anunciante poderá inserir um vídeo curto gravado pelo
            celular (por exemplo, até 15–30 segundos) mostrando um tour rápido
            pela casa.
          </p>
          <div className="relative w-full h-[220px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
            Área reservada para player de vídeo (em breve)
          </div>
        </section>

        {/* Detalhes + mapa + contato/mensagem */}
        <section className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Coluna esquerda: detalhes + mapa */}
          <div className="md:col-span-2 space-y-6">
            {/* Detalhes do imóvel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Detalhes do imóvel
              </h2>
              <p className="text-sm text-slate-700 mb-3">
                Aqui você poderá descrever o imóvel com calma: tamanho do
                terreno, metragem construída, como é a sala, os quartos,
                cozinha, se tem varanda, área gourmet, piscina, etc.
              </p>

              <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                <li>Terreno de exemplo: 360 m²</li>
                <li>Área construída de exemplo: 90 m²</li>
                <li>Sala, cozinha, 2 quartos e 1 banheiro social</li>
                <li>Quintal com espaço para área gourmet</li>
                <li>Garagem para 1 carro</li>
              </ul>
            </div>

            {/* Localização / mapa */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Localização e entorno
              </h2>
              <p className="text-xs text-slate-600 mb-3">
                O mapa ajuda o interessado a ver não só a localização aproximada
                do imóvel, mas também o que existe ao redor: comércios,
                escolas, transporte, praias, etc. Em breve podemos integrar um
                mapa interativo.
              </p>
              <div className="relative w-full h-[220px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                Mapa interativo da região (em breve)
              </div>
            </div>
          </div>

          {/* Coluna direita: contato + mensagem em um bloco só */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Fale com o anunciante
              </h2>

              <p className="text-xs text-slate-600 mb-3">
                Neste exemplo, o anunciante pode ser tanto um proprietário
                quanto uma imobiliária. No futuro, corretores e lojas poderão
                ter áreas especiais, mas aqui o tratamento é de usuário comum.
              </p>

              {/* Dados de referência (fixos por enquanto) */}
              <div className="space-y-1 text-sm text-slate-800 mb-4">
                <p>
                  <strong>Nome:</strong> Seu nome aqui
                </p>
                <p>
                  <strong>WhatsApp:</strong> (21) 99999-9999
                </p>
                <p>
                  <strong>E-mail:</strong> seuemail@exemplo.com
                </p>
              </div>

              {/* Formulário de mensagem */}
              <form className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite seu nome"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(21) 9 9999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escreva sua mensagem para o anunciante..."
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-full bg-emerald-600 text-white text-sm font-semibold py-2 hover:bg-emerald-700"
                >
                  Enviar mensagem (modelo)
                </button>

                <p className="text-[11px] text-slate-500 mt-2">
                  Este formulário é ilustrativo. Depois vamos conectar a um
                  envio real (e-mail, WhatsApp ou painel interno).
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Ofertas similares (modelo) */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Ofertas similares (exemplo)
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            Quando houver mais anúncios cadastrados, poderemos mostrar imóveis
            semelhantes nesta área, ajudando o usuário a comparar opções.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="h-24 rounded-xl bg-slate-200 mb-3" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Casa exemplo {i} em Maricá
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Imóvel fictício para demonstrar a área de ofertas similares.
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-2">
                  R$ {400 + i * 20}.000
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Aviso de segurança / responsabilidade */}
        <section className="mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-[11px] text-amber-900">
            <strong>Atenção:</strong> o Classilagos é uma plataforma de
            classificados. As informações, valores e condições são de inteira
            responsabilidade de quem anuncia. Recomendamos sempre verificar
            documentos, visitar o imóvel pessoalmente e nunca realizar
            pagamentos adiantados sem garantia.
          </div>
        </section>

        {/* Rodapé do anúncio */}
        <p className="text-[11px] text-slate-500 mb-4">
          Este anúncio é um modelo de teste para definição do layout de imóveis
          no Classilagos. Em breve, os dados serão preenchidos a partir dos
          anúncios reais cadastrados pelos usuários.
        </p>
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


