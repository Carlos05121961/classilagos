"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

export default function TurismoPage() {
  const [anunciosTurismo, setAnunciosTurismo] = useState([]);
  const [loading, setLoading] = useState(true);

  // HERO – você pode ajustar as imagens depois
  const heroImages = [
    "/turismo/hero-turismo-01.jpg",
    "/turismo/hero-turismo-02.jpg",
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentHero((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  // Buscar anúncios de turismo no Supabase
  useEffect(() => {
    async function carregarTurismo() {
      setLoading(true);
      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, categoria, pilar_turismo, subcategoria_turismo, nome_negocio, faixa_preco, imagens, status"
        )
        .eq("categoria", "turismo")
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar turismo:", error);
        setAnunciosTurismo([]);
      } else {
        setAnunciosTurismo(data || []);
      }
      setLoading(false);
    }

    carregarTurismo();
  }, []);

  function filtrarPorPilar(pilar) {
    return anunciosTurismo.filter(
      (anuncio) => anuncio.pilar_turismo === pilar
    );
  }

  const ondeFicar = filtrarPorPilar("onde_ficar");
  const ondeComer = filtrarPorPilar("onde_comer");
  const ondePassear = filtrarPorPilar("onde_passear");
  const produtosTuristicos = filtrarPorPilar("produtos_turisticos");
  const servicosTurismo = filtrarPorPilar("servicos_turismo");

  function CardTurismo({ item }) {
    const primeiraImagem =
      item.imagens && item.imagens.length > 0 ? item.imagens[0] : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-[2px] transition flex flex-col overflow-hidden"
      >
        {/* Imagem */}
        {primeiraImagem ? (
          <div className="relative w-full h-40">
            <Image
              src={primeiraImagem}
              alt={item.titulo}
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-[11px] text-slate-500">
            Sem foto
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-3 md:p-4 flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {item.nome_negocio || "Anúncio de turismo"}
          </p>

          <h3 className="text-sm md:text-[15px] font-bold text-slate-900 line-clamp-2">
            {item.titulo}
          </h3>

          <p className="text-[11px] text-slate-600">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          {item.faixa_preco && (
            <p className="text-[11px] font-semibold text-emerald-700 mt-1">
              {item.faixa_preco}
            </p>
          )}

          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:gap-2 transition-all">
            Ver detalhes <span>➜</span>
          </span>
        </div>
      </Link>
    );
  }

  function BlocoSecao({ id, titulo, descricao, lista }) {
    return (
      <section id={id} className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              {titulo}
            </h2>
            {descricao && (
              <p className="text-[11px] md:text-xs text-slate-600">
                {descricao}
              </p>
            )}
          </div>
          {lista.length > 0 && (
            <p className="text-[11px] text-slate-500">
              {lista.length} anúncio(s)
            </p>
          )}
        </div>

        {loading && (
          <p className="text-sm text-slate-500">Carregando anúncios...</p>
        )}

        {!loading && lista.length === 0 && (
          <p className="text-sm text-slate-500">
            Ainda não há anúncios nesta seção.
          </p>
        )}

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {lista.map((item) => (
            <CardTurismo key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
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

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Turismo"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-x-0 top-[20%] flex flex-col items-center px-4 text-center text-white">
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow">
              Classilagos – Turismo
            </h1>
            <p className="mt-2 text-xs md:text-sm max-w-2xl drop-shadow">
              Pousadas, hotéis, bares, restaurantes, passeios, mergulhos,
              quadriciclo, trilhas e muito mais nas nove cidades da Região dos
              Lagos.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] md:text-xs">
              <Link
                href="#onde-ficar"
                className="rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold hover:bg-white"
              >
                Onde ficar
              </Link>
              <Link
                href="#onde-comer"
                className="rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold hover:bg-white"
              >
                Onde comer
              </Link>
              <Link
                href="#passeios"
                className="rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold hover:bg-white"
              >
                Passeios & experiências
              </Link>
              <Link
                href="#produtos-turisticos"
                className="rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold hover:bg-white"
              >
                Produtos turísticos
              </Link>
              <Link
                href="#servicos-turismo"
                className="rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold hover:bg-white"
              >
                Serviços de turismo
              </Link>
            </div>

            <div className="mt-5">
              <Link
                href="/anunciar/turismo"
                className="rounded-full bg-blue-600 text-white px-6 py-3 font-semibold text-xs md:text-sm hover:bg-blue-700 shadow-lg"
              >
                Anunciar no turismo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO: ONDE FICAR */}
      <BlocoSecao
        id="onde-ficar"
        titulo="Onde ficar"
        descricao="Pousadas, hotéis, hostels e casas de temporada nas cidades da Região dos Lagos."
        lista={ondeFicar}
      />

      {/* BLOCO: ONDE COMER */}
      <BlocoSecao
        id="onde-comer"
        titulo="Onde comer"
        descricao="Bares, restaurantes, quiosques e lugares para curtir a gastronomia local."
        lista={ondeComer}
      />

      {/* BLOCO: PASSEIOS & EXPERIÊNCIAS */}
      <BlocoSecao
        id="passeios"
        titulo="Passeios & experiências"
        descricao="Passeios de barco, mergulho, quadriciclo, buggy, trilhas e muito mais."
        lista={ondePassear}
      />

      {/* BLOCO: PRODUTOS TURÍSTICOS / SUBLIMAÇÃO */}
      <BlocoSecao
        id="produtos-turisticos"
        titulo="Produtos turísticos & lembranças"
        descricao="Canecas, camisetas, quadros e lembranças com a cara da Região dos Lagos."
        lista={produtosTuristicos}
      />

      {/* BLOCO: SERVIÇOS DE TURISMO */}
      <BlocoSecao
        id="servicos-turismo"
        titulo="Serviços de turismo"
        descricao="Guias, agências, receptivos e outros serviços para organizar sua viagem."
        lista={servicosTurismo}
      />

      {/* RODAPÉ SIMPLES */}
      <footer className="bg-slate-100 border-t py-6 text-center text-xs text-slate-600 mt-4">
        <p>Classilagos © {new Date().getFullYear()}</p>
        <p className="mt-1">
          <Link href="/quem-somos" className="hover:underline">
            Quem somos
          </Link>{" "}
          •{" "}
          <Link href="/contato" className="hover:underline">
            Contato
          </Link>{" "}
          •{" "}
          <Link href="/politica" className="hover:underline">
            Política de privacidade
          </Link>
        </p>
      </footer>
    </main>
  );
}
