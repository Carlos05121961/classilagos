"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function TamarindosPage() {
  const [slide, setSlide] = useState(0);
  const [imagemAberta, setImagemAberta] = useState(null);

  const whatsapp = "552199760694";

  const heroImages = [
    "/digital/tamarindos/hero-lagoa.webp",
    "/digital/tamarindos/hero-pousada.webp",
  ];

  const quartos = [
    "quarto-01.webp",
    "quarto-02.webp",
    "quarto-03.webp",
    "quarto-04.webp",
    "quarto-05.webp",
    "quarto-06.webp",
    "quarto-07.webp",
  ];

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
  ];

  const abrirWhatsApp = () => {
    window.open(
      `https://wa.me/${whatsapp}?text=Olá, vi a página da Pousada Tamarindos e gostaria de fazer uma reserva.`,
      "_blank"
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-[#f7f4ec] text-slate-900">
      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        {heroImages.map((img, index) => (
          <Image
            key={img}
            src={img}
            alt="Pousada Tamarindos em Maricá"
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-1000 ${
              slide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex min-h-[88vh] items-center justify-center px-5 text-center text-white">
          <div className="max-w-4xl">
            <Image
              src="/digital/tamarindos/tamarindos-logo.webp"
              alt="Pousada Tamarindos"
              width={520}
              height={220}
              className="mx-auto mb-8 max-w-[280px] rounded-3xl bg-white/90 p-4 shadow-xl md:max-w-[420px]"
            />

            <p className="text-xs uppercase tracking-[0.35em] text-amber-200">
              Maricá • Lagoa de Araçatiba
            </p>

            <h1 className="mt-4 text-4xl font-bold md:text-6xl">
              Hospede-se de frente para a lagoa
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-xl">
              Conforto, café da manhã incluso e localização privilegiada em uma
              das paisagens mais bonitas de Maricá.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={abrirWhatsApp}
                className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600"
              >
                Reservar pelo WhatsApp
              </button>

              <a
                href="#quartos"
                className="rounded-full border border-white/70 px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
              >
                Ver acomodações
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] bg-white p-3 shadow-xl">
            <Image
              src="/digital/tamarindos/hero-pousada.webp"
              alt="Frente da Pousada Tamarindos"
              width={900}
              height={600}
              className="rounded-[24px] object-cover"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
              Pousada Tamarindos
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Tranquilidade, localização e acolhimento em Maricá
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700 md:text-base">
              <p>
                Com localização privilegiada, de frente para o calçadão e a
                Lagoa de Araçatiba, a Pousada Tamarindos oferece um ambiente
                acolhedor para quem busca descanso, praticidade e contato com a
                natureza.
              </p>

              <p>
                A pousada conta com acomodações equipadas com ar-condicionado,
                TV e frigobar, além de café da manhã incluso nas diárias.
              </p>

              <p>
                Localizada a poucos minutos do centro de Maricá, é uma excelente
                opção para viagens a lazer, trabalho, eventos e hospedagens em
                família.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
              Estrutura
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Tudo para uma estadia confortável
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              "48 leitos",
              "Ar-condicionado",
              "TV e frigobar",
              "Café da manhã incluso",
              "Wi-Fi",
              "Área de lazer",
              "Churrasqueira",
              "Salão para eventos",
              "Próximo ao centro",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-100 bg-[#f7f4ec] p-5 text-center shadow-sm"
              >
                <p className="font-semibold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUARTOS */}
      <section id="quartos" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
              Acomodações
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Quartos simples, limpos e confortáveis
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
              Acomodações para diferentes necessidades, com conforto,
              praticidade e estrutura para uma boa estadia.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {quartos.map((img, index) => (
              <button
                key={img}
                onClick={() =>
                  setImagemAberta(`/digital/tamarindos/${img}`)
                }
                className="group overflow-hidden rounded-[28px] bg-white p-3 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <Image
                  src={`/digital/tamarindos/${img}`}
                  alt={`Quarto da Pousada Tamarindos ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-[260px] w-full rounded-[22px] object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="p-4">
                  <p className="font-bold">Acomodação Tamarindos</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Ar, TV, frigobar e café da manhã incluso.
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CAFÉ E ÁREAS */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
              Café e convivência
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Ambientes acolhedores para começar bem o dia
            </h2>

            <p className="mt-6 text-sm leading-relaxed text-slate-700 md:text-base">
              O café da manhã já está incluso no valor das diárias. A pousada
              também conta com salão, recepção e espaços internos para
              convivência, descanso e eventos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "area-cafe-01.webp",
              "area-cafe-02.webp",
              "recepcao.webp",
              "lagoa-aracatiba.webp",
            ].map((img) => (
              <button
                key={img}
                onClick={() =>
                  setImagemAberta(`/digital/tamarindos/${img}`)
                }
                className="overflow-hidden rounded-3xl shadow-md"
              >
                <Image
                  src={`/digital/tamarindos/${img}`}
                  alt="Área da Pousada Tamarindos"
                  width={600}
                  height={500}
                  className="h-[210px] w-full object-cover transition hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] bg-white p-3 shadow-xl">
            <Image
              src="/digital/tamarindos/hero-lagoa.webp"
              alt="Lagoa de Araçatiba em Maricá"
              width={900}
              height={600}
              className="rounded-[24px] object-cover"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
              Localização privilegiada
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Em frente à Lagoa de Araçatiba
            </h2>

            <p className="mt-6 text-sm leading-relaxed text-slate-700 md:text-base">
              A pousada fica de frente para o calçadão e a Lagoa de Araçatiba,
              em uma área ideal para caminhadas, lazer e contemplação da
              paisagem. Também está próxima ao centro de Maricá, com fácil
              acesso a serviços, restaurantes e pontos importantes da cidade.
            </p>

            <button
              onClick={abrirWhatsApp}
              className="mt-8 rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Consultar disponibilidade
            </button>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
              Galeria
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Pousada, lagoa e arredores
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galeria.map((img, index) => (
              <button
                key={img}
                onClick={() =>
                  setImagemAberta(`/digital/tamarindos/${img}`)
                }
                className="group overflow-hidden rounded-[28px] bg-[#f7f4ec] p-3 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={`/digital/tamarindos/${img}`}
                  alt={`Galeria Pousada Tamarindos ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-[250px] w-full rounded-[22px] object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTOS */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
            Eventos
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Salão disponível para festas e encontros
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
            A Pousada Tamarindos também conta com salão para eventos, festas e
            encontros. Tradicionalmente, toda primeira sexta-feira do mês, o
            espaço recebe o “Baile da Melhor Idade”, das 21h às 02h.
          </p>
        </div>
      </section>

      {/* MÚSICA */}
      <section className="bg-[#10251b] px-5 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            Música e história
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Zé Carlos Reis
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
            Além da pousada, Zé Carlos Reis também carrega uma trajetória
            musical. Conheça suas composições e sua página artística.
          </p>

          <a
            href="https://www.palcomp3.com.br/zecarlosreis/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-[#10251b] transition hover:bg-amber-100"
          >
            Ouvir músicas no Palco MP3
          </a>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-20 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Faça sua reserva na Pousada Tamarindos
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-600 md:text-base">
          Fale direto pelo WhatsApp e consulte disponibilidade, tarifas e
          condições para sua hospedagem em Maricá.
        </p>

        <button
          onClick={abrirWhatsApp}
          className="mt-8 rounded-full bg-emerald-600 px-10 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
        >
          Reservar agora pelo WhatsApp
        </button>
      </section>

      {/* LIGHTBOX */}
      {imagemAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8">
          <button
            onClick={() => setImagemAberta(null)}
            className="absolute right-5 top-5 rounded-full bg-white px-5 py-2 text-sm font-bold text-black"
          >
            Fechar
          </button>

          <Image
            src={imagemAberta}
            alt="Imagem ampliada Pousada Tamarindos"
            width={1400}
            height={1000}
            className="max-h-[86vh] w-auto rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      <footer className="bg-black px-5 py-8 text-center text-sm text-white/70">
        <p className="font-semibold text-white">Pousada Tamarindos</p>
        <p className="mt-2">Maricá • Lagoa de Araçatiba</p>
        <p className="mt-4 text-xs text-white/40">
          Produzido por Classilagos Digital
        </p>
      </footer>
    </main>
  );
}
