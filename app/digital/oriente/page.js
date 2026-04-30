export const metadata = {
  title: "Armazém Oriente - Jacaroá",
  description: "Mercado completo com ofertas imperdíveis em Jacaroá, Maricá.",
  openGraph: {
    title: "Armazém Oriente",
    description: "Qualidade, variedade e preço baixo em Jacaroá.",
    images: ["/oriente/oriente-hero.webp"],
  },
};

export default function OrientePage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="relative h-[60vh] w-full">
        <img
          src="/oriente/oriente-hero.webp"
          alt="Armazém Oriente"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Armazém Oriente
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Seu mercado de confiança em Jacaroá
          </p>

          <a
            href="https://wa.me/5521980149773"
            target="_blank"
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-lg font-semibold"
          >
            Fale no WhatsApp
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-12 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Qualidade e economia no seu dia a dia
        </h2>
        <p className="text-gray-600">
          No Armazém Oriente você encontra produtos frescos, variedade e preços
          que cabem no seu bolso. Atendimento rápido e aquele clima de mercado de bairro
          que todo mundo gosta.
        </p>
      </section>

      {/* GALERIA */}
      <section className="py-12 px-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">
          Nosso Mercado
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {Array.from({ length: 12 }).map((_, i) => (
            <img
              key={i}
              src={`/oriente/oriente-galeria-${i + 1}.webp`}
              alt="Armazém Oriente"
              className="rounded-lg shadow"
            />
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Venha nos visitar
        </h2>

        <p className="mb-4">
          R. Pref. Joaquim Mendes, 66 - Jacaroá, Maricá
        </p>

        <a
          href="https://wa.me/5521980149773"
          target="_blank"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-white font-semibold"
        >
          Chamar no WhatsApp
        </a>
      </section>

    </main>
  );
}
