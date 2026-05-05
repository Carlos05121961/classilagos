"use client";

import Image from "next/image";
import { useState } from "react";

export default function PauloGomesPage() {
  const [imagemAberta, setImagemAberta] = useState(null);

  const galeria = [
    "galeria-01.webp",
    "galeria-02.webp",
    "galeria-03.webp",
    "galeria-04.webp",
    "galeria-05.webp",
    "galeria-06.webp",
    "galeria-07.webp",
    "galeria-08.webp",
    "galeria-09.webp",
    "galeria-10.webp",
    "galeria-11.webp",
    "galeria-12.webp",
  ];

  return (
    <main className="bg-[#f8f5ef] text-slate-900">
      {/* HERO */}
      <section className="relative min-h-[85vh] w-full overflow-hidden">
        <Image
          src="/digital/paulo-gomes/hero-paulo.webp"
          alt="Paulo Gomes pintando aquarela em Paraty"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex min-h-[85vh] items-center justify-center px-5 text-center">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber-200">
              Paraty • Aquarela • Plein Air
            </p>

            <h1 className="text-5xl font-bold text-white md:text-7xl">
              Paulo Gomes
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-xl text-white/90 md:text-2xl">
              60 anos aquarelando Paraty
            </p>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
              Mestre da pintura ao ar livre, Paulo Gomes eterniza em aquarela
              as paisagens, o casario, as marinhas e a alma histórica de Paraty.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#galeria"
                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition hover:bg-amber-100"
              >
                Ver galeria
              </a>

              <a
                href="#tv"
                className="rounded-full border border-white/60 px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
              >
                TV Paulo Gomes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Galeria online
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Aquarelas que guardam a memória afetiva de Paraty
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            Esta galeria reúne obras, registros e momentos da trajetória de
            Paulo Gomes, artista plástico reconhecido por sua ligação profunda
            com Paraty e pela sensibilidade de sua pintura ao ar livre.
          </p>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Acervo artístico
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Galeria de Obras
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
              Clique em uma obra para ampliar e apreciar os detalhes da
              composição, das luzes e das cores.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {galeria.map((img, index) => (
              <button
                key={img}
                type="button"
                onClick={() =>
                  setImagemAberta(`/digital/paulo-gomes/${img}`)
                }
                className="group text-left"
              >
                <div className="rounded-[28px] bg-[#f4efe6] p-4 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="overflow-hidden rounded-2xl border-[10px] border-white bg-white shadow-inner">
                    <Image
                      src={`/digital/paulo-gomes/${img}`}
                      alt={`Aquarela de Paulo Gomes ${index + 1}`}
                      width={900}
                      height={700}
                      className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-2 pt-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Obra do acervo
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Paulo Gomes Aquarelas • Paraty
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {imagemAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8">
          <button
            type="button"
            onClick={() => setImagemAberta(null)}
            className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
          >
            Fechar
          </button>

          <div className="relative max-h-[90vh] max-w-6xl overflow-hidden rounded-2xl border-[12px] border-white bg-white shadow-2xl">
            <Image
              src={imagemAberta}
              alt="Obra ampliada de Paulo Gomes"
              width={1400}
              height={1000}
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* SOBRE */}
      <section className="bg-[#f8f5ef] px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="rounded-[32px] bg-white p-3 shadow-xl">
            <Image
              src="/digital/paulo-gomes/artista-paulo.webp"
              alt="Paulo Gomes pintando ao ar livre"
              width={900}
              height={900}
              className="rounded-[24px] object-cover"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Sobre o artista
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Uma vida dedicada à arte e à paisagem
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 md:text-base">
              <p>
                Paulo Gomes nasceu no Rio de Janeiro, em 1950, e decidiu ser
                pintor ainda criança. Desde os primeiros desenhos, encontrou na
                arte uma forma de observar, sentir e interpretar o mundo.
              </p>

              <p>
                Em Paraty desde a década de 1980, transformou a cidade em sua
                principal fonte de inspiração. Suas aquarelas retratam igrejas,
                marinhas, ruas, casarios históricos e cenas cotidianas com
                sensibilidade e identidade própria.
              </p>

              <p>
                Mestre da pintura ao ar livre, Paulo Gomes construiu uma
                trajetória marcada pela leveza da aquarela, pela força da
                memória e por uma profunda ligação com a cultura paratiense.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 60 ANOS */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Trajetória e reconhecimento
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Aquarelar — 60 anos da arte de Paulo Gomes
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl italic leading-relaxed text-slate-700">
            “Quem pinta ao ar livre não copia, retrata o que está vendo e
            sentindo.”
          </p>

          <div className="mx-auto mt-10 max-w-4xl space-y-5 text-sm leading-relaxed text-slate-700 md:text-base">
            <p>
              A exposição <strong>“Aquarelar — 60 anos da arte de Paulo Gomes”</strong>,
              realizada na Casa da Cultura de Paraty, celebrou seis décadas
              dedicadas à aquarela e à pintura ao ar livre, conhecida como{" "}
              <em>plein air</em>.
            </p>

            <p>
              A mostra reuniu mais de 70 obras, apresentando uma retrospectiva
              de sua trajetória artística com ênfase nas paisagens de Paraty,
              cidade que escolheu como lar e inspiração desde 1980.
            </p>

            <p>
              Em suas aquarelas, Paulo Gomes documenta diferentes fases da
              cidade: marinhas, igrejas, ruas, praças e o casario histórico,
              renovados sob seu olhar sensível e autoral.
            </p>
          </div>

          <div className="mt-10">
            <a
              href="https://www.frm.org.br/conteudo/patrimonio-e-cultura/noticia/exposicao-aquarelar-na-casa-da-cultura-de-paraty-celebra-60"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Ler reportagem completa
            </a>
          </div>
        </div>
      </section>

      {/* TV */}
      <section id="tv" className="bg-black px-5 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
              TV Paulo Gomes
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Vídeos, exposições e trajetória
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              Registros em vídeo, exposições, entrevistas e momentos da carreira
              de Paulo Gomes.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/-XOsKe_MhUc"
                title="TV Paulo Gomes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://www.youtube.com/@paulosergiogomes1235"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-red-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Visitar canal no YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ATELIER */}
      <section className="bg-[#f8f5ef] px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Casa da Árvore Atelier
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            O refúgio criativo de Paulo Gomes
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
            Entre aquarelas, música, encontros e memórias, a Casa da Árvore
            Atelier representa o espaço de criação, convivência e inspiração de
            Paulo Gomes em Paraty.
          </p>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-black px-5 py-8 text-center text-sm text-white/70">
        <p className="font-semibold text-white">Paulo Gomes Aquarelas</p>
        <p className="mt-2">Galeria online • Paraty - RJ</p>
        <p className="mt-4 text-xs text-white/40">
          Produzido por Classilagos Digital
        </p>
      </footer>
    </main>
  );
}
