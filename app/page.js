"use client";

import Image from "next/image";
import Link from "next/link";

export default function LagoListasPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          LagoListas — Guia Comercial da Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          O maior guia de comércio, lojas, empresas, profissionais liberais e
          serviços da Região dos Lagos. Aqui você encontra tudo: mercados, petshops,
          oficinas, clínicas, farmácias, moda, beleza, automotivo, construção,
          cursos, tecnologia e muito mais.  
          <br />
          Clique abaixo para cadastrar seu negócio gratuitamente.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/lagolistas/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no LagoListas
          </Link>
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

          <button
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver guia completo (em breve)
          </button>
      {/* HERO LAGOLISTAS */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          {/* sua arte amarela sem texto */}
          <Image
            src="/lagolistas/hero-lagolistas.jpg"
            alt="Classilagos LagoListas"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* textos em cima da arte */}
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Classilagos – LagoListas
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-slate-900">
              O maior guia comercial da Região dos Lagos.
            </p>
            <p className="mt-1 text-[11px] md:text-xs text-slate-800/80 max-w-2xl">
              Telefones, WhatsApp, endereços, sites, mapas e muito mais de
              comércios, serviços, turismo, saúde e profissionais liberais.
            </p>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA LAGOLISTAS */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* O que você procura */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: farmácia, pizzaria, encanador, clínica..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve você poderá navegar por mais de 100 categorias comerciais,
          filtros por cidade, mapa de localização, anúncios destacados e
          vitrines digitais de empresas da região.
              {/* Categoria */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos</option>
                  <option>Comércio</option>
                  <option>Serviços</option>
                  <option>Turismo &amp; Lazer</option>
                  <option>Saúde &amp; Bem-estar</option>
                  <option>Construção &amp; Reforma</option>
                  <option>Automotivo</option>
                  <option>Educação</option>
                  <option>Profissionais liberais</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Toda a região</option>
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              {/* Botão */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará ligada aos cadastros reais do LagoListas.
          </p>
        </div>
      </section>

      </div>
      {/* BLOCO CHAMADA PARA ANÚNCIO */}
      <section className="max-w-6xl mx-auto px-4 pb-12 pt-6">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Quer colocar sua empresa no LagoListas?
          </p>
          <p className="text-xs text-slate-700 mb-4">
            Cadastre gratuitamente seu comércio, serviço ou profissão e seja
            encontrado por milhares de pessoas em toda a Região dos Lagos.
          </p>

          <Link
            href="/anunciar"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no LagoListas
          </Link>
        </div>
      </section>
    </main>
  );
}
