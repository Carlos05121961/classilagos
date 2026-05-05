"use client";

import Image from "next/image";

export default function PauloGomesPage() {
  const whatsapp = "5524992889898";

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

  const abrirWhatsApp = () => {
    window.open(`https://wa.me/${whatsapp}`, "_blank");
  };

  return (
    <main className="bg-white text-slate-900">

      {/* HERO */}
      <section className="relative w-full h-[80vh]">
        <Image
          src="/digital/paulo-gomes/hero-paulo.webp"
          alt="Paulo Gomes artista"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Paulo Gomes
            </h1>
            <p className="text-lg md:text-2xl text-white mt-4">
              Aquarelas que eternizam Paraty
            </p>

            <div className="mt-6 flex gap-4 justify-center flex-wrap">
              <button
                onClick={abrirWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="px-5 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Galeria de Obras
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galeria.map((img, index) => (
            <div key={index} className="group">
              <div className="overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={`/digital/paulo-gomes/${img}`}
                  alt={`Obra ${index + 1}`}
                  width={500}
                  height={500}
                  className="object-cover w-full h-[300px] group-hover:scale-105 transition"
                />
              </div>

              <button
                onClick={abrirWhatsApp}
                className="mt-3 w-full text-sm bg-black text-white py-2 rounded-full hover:bg-slate-800"
              >
                Tenho interesse nesta obra
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-slate-50 px-5 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <Image
            src="/digital/paulo-gomes/artista-paulo.webp"
            alt="Paulo Gomes pintando"
            width={500}
            height={500}
            className="rounded-2xl shadow-md"
          />

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Sobre o artista
            </h2>

            <p className="text-sm md:text-base leading-relaxed text-slate-700">
              Paulo Gomes é artista plástico com trajetória consolidada e
              reconhecida, dedicado à pintura desde a juventude.
              <br /><br />
              Vive em Paraty desde a década de 1980, cidade que se tornou sua
              principal fonte de inspiração, retratada com sensibilidade em suas
              aquarelas.
              <br /><br />
              Seu trabalho é marcado pela leveza, emoção e fidelidade às
              paisagens brasileiras, com obras presentes em coleções no Brasil e
              no exterior.
            </p>
          </div>
        </div>
      </section>

      {/* ENCOMENDAS */}
      <section className="px-5 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Obras sob encomenda
        </h2>

        <p className="mt-4 text-slate-600 max-w-xl mx-auto">
          Solicite uma obra personalizada com tema, cores e estilo de acordo com
          seu ambiente.
        </p>

        <button
          onClick={abrirWhatsApp}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold"
        >
          Solicitar orçamento
        </button>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-black text-white text-center py-6 text-sm">
        © Paulo Gomes Aquarelas
      </footer>

    </main>
  );
}
