export const metadata = {
  title: "Armazém Oriente - Supermercado em Jacaroá",
  description:
    "Armazém Oriente em Jacaroá, Maricá. Mercado completo com ofertas, hortifruti, padaria, frios, carnes, bebidas e economia para sua casa.",
  openGraph: {
    title: "Armazém Oriente - Jacaroá",
    description:
      "Qualidade, variedade e economia no seu mercado de confiança em Jacaroá.",
    images: ["/digital/oriente/oriente-hero.webp"],
  },
};

const whatsapp = "https://wa.me/5521980149773";

const setores = [
  "Ofertas da semana",
  "Hortifruti fresco",
  "Padaria",
  "Frios e queijos",
  "Açougue",
  "Bebidas",
  "Mercearia",
  "Limpeza",
];

export default function OrientePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src="/digital/oriente/oriente-hero.webp"
          alt="Fachada do Armazém Oriente em Jacaroá"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-5 py-20 text-white">
          <span className="mb-4 w-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-red-700 shadow-lg">
            🛒 Mercado completo em Jacaroá
          </span>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Armazém Oriente
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-medium text-white/95 md:text-2xl">
            Qualidade, variedade e economia para encher o seu carrinho todos os dias.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsapp}
              target="_blank"
              className="rounded-full bg-green-500 px-7 py-4 text-center text-lg font-bold text-white shadow-xl transition hover:bg-green-600"
            >
              Falar no WhatsApp
            </a>

            <a
              href="#localizacao"
              className="rounded-full border border-white/70 bg-white/10 px-7 py-4 text-center text-lg font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Ver localização
            </a>
          </div>
        </div>
      </section>

      {/* CHAMADA */}
      <section className="bg-red-700 px-5 py-5 text-center text-white">
        <p className="text-lg font-bold md:text-xl">
          Ofertas, produtos frescos e atendimento de bairro, com a confiança que Jacaroá conhece.
        </p>
      </section>

      {/* SOBRE */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-sm font-black uppercase tracking-widest text-red-700">
            Seu mercado do dia a dia
          </span>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Mais qualidade e economia no seu bolso
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            No Armazém Oriente você encontra um mercado completo para sua casa:
            alimentos, bebidas, limpeza, hortifruti, padaria, frios, queijos e muito mais.
            Tudo com variedade, preço justo e atendimento próximo.
          </p>
        </div>

        <div className="rounded-[2rem] bg-yellow-50 p-6 shadow-xl">
          <h3 className="text-2xl font-black text-red-700">
            🛒 Encha seu carrinho
          </h3>
          <p className="mt-3 text-slate-700">
            Produtos para o café da manhã, almoço, lanche, churrasco, limpeza da casa
            e compras da semana em um só lugar.
          </p>
        </div>
      </section>

      {/* SETORES */}
      <section className="bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-black md:text-4xl">
            Tudo que você precisa em um só lugar
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {setores.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 font-bold shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <span className="text-sm font-black uppercase tracking-widest text-red-700">
              Conheça o mercado
            </span>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Estrutura, variedade e ofertas
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <img
                key={i}
                src={`/digital/oriente/oriente-galeria-${i + 1}.webp`}
                alt={`Armazém Oriente foto ${i + 1}`}
                loading="lazy"
                className="h-64 w-full rounded-2xl object-cover shadow-md transition duration-300 hover:scale-[1.02]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section id="localizacao" className="bg-red-700 px-5 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">
              Estamos em Jacaroá
            </h2>

            <p className="mt-4 text-lg">
              R. Pref. Joaquim Mendes, 66 - Jacaroá, Maricá - RJ
            </p>

            <p className="mt-2 text-white/85">
              Passe aqui hoje mesmo e aproveite nossas ofertas.
            </p>

            <a
              href={whatsapp}
              target="_blank"
              className="mt-7 inline-block rounded-full bg-green-500 px-7 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-green-600"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-2xl">
            <iframe
              title="Localização Armazém Oriente"
              src="https://www.google.com/maps?q=R.%20Pref.%20Joaquim%20Mendes,%2066%20-%20Jacaro%C3%A1,%20Maric%C3%A1%20-%20RJ,%2024942-395&output=embed"
              className="h-80 w-full rounded-2xl border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-16 text-center">
        <h2 className="text-3xl font-black">
          Armazém Oriente: preço, qualidade e confiança.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Fale com a equipe pelo WhatsApp ou venha fazer suas compras em Jacaroá.
        </p>

        <a
          href={whatsapp}
          target="_blank"
          className="mt-7 inline-block rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-green-600"
        >
          Falar agora
        </a>
      </section>

      {/* WHATSAPP FIXO */}
      <a
        href={whatsapp}
        target="_blank"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-2xl transition hover:bg-green-600"
      >
        WhatsApp
      </a>
    </main>
  );
}
