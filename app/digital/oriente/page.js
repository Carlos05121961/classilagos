export const metadata = {
  title: "Armazém Oriente - Supermercado",
  description:
    "Armazém Oriente. Mercado completo com ofertas, hortifruti, padaria, frios, carnes, bebidas e economia para sua casa.",
  openGraph: {
    title: "Armazém Oriente",
    description: "Qualidade, variedade e economia no seu mercado de confiança.",
    images: ["/digital/oriente/oriente-hero.webp"],
  },
};

const whatsapp = "https://wa.me/5521980149773";

const setores = [
  { icon: "🏷️", title: "Ofertas", text: "todos os dias" },
  { icon: "🍎", title: "Hortifruti", text: "fresco" },
  { icon: "🥖", title: "Padaria", text: "sempre quentinha" },
  { icon: "🧀", title: "Frios e", text: "queijos" },
  { icon: "🥩", title: "Açougue", text: "carnes selecionadas" },
  { icon: "🥤", title: "Bebidas", text: "geladas" },
  { icon: "🛒", title: "Mercearia", text: "completa" },
  { icon: "🧴", title: "Limpeza", text: "e utilidades" },
];

export default function OrientePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative min-h-[76vh] overflow-hidden">
        <img
          src="/digital/oriente/oriente-hero.webp"
          alt="Fachada do Armazém Oriente"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[76vh] max-w-6xl flex-col justify-center px-5 py-20 text-white">
          <span className="mb-4 w-fit rounded-full bg-yellow-400 px-5 py-2 text-sm font-black text-red-700 shadow-lg">
            🛒 Mercado completo para sua casa
          </span>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Armazém Oriente
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-bold text-white md:text-2xl">
            Qualidade, variedade e economia para encher o seu carrinho todos os dias.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsapp}
              target="_blank"
              className="rounded-full bg-green-500 px-8 py-4 text-center text-lg font-black text-white shadow-xl transition hover:bg-green-600"
            >
              Falar no WhatsApp
            </a>

            <a
              href="#localizacao"
              className="rounded-full border border-white/70 bg-white/10 px-8 py-4 text-center text-lg font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              Ver localização
            </a>
          </div>
        </div>
      </section>

      {/* TARJA */}
      <section className="bg-red-700 px-5 py-6 text-center text-white">
        <p className="text-lg font-black md:text-xl">
          🛒 Ofertas, produtos frescos e atendimento de bairro, com a confiança que{" "}
          <span className="text-yellow-300">Cajú</span>,{" "}
          <span className="text-yellow-300">Jacaroá</span> e{" "}
          <span className="text-yellow-300">Amizade</span> já conhecem.
        </p>
      </section>

      {/* SETORES COMPACTOS */}
      <section className="bg-slate-50 px-5 py-8">
        <div className="mx-auto max-w-6xl overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {setores.map((item) => (
              <div
                key={item.title}
                className="min-w-[160px] flex-shrink-0 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">{item.icon}</div>
                <h3 className="mt-2 text-sm font-black text-red-700">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCO PREMIUM CARRINHO */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="flex justify-center">
            <img
              src="/digital/oriente/oriente-carrinho.webp"
              alt="Carrinho de compras cheio"
              className="w-full max-w-md drop-shadow-2xl"
            />
          </div>

          <div>
            <span className="text-sm font-black uppercase tracking-widest text-red-700">
              Seu mercado completo
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              Mais qualidade e economia no seu bolso
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-700">
              Aqui você encontra tudo que precisa para sua casa: alimentos,
              bebidas, produtos de limpeza, higiene pessoal, padaria, frios,
              hortifruti e muito mais.
            </p>

            <p className="mt-3 text-lg font-bold text-slate-800">
              Tudo com preços justos e aquele atendimento próximo que você merece.
            </p>

            <a
              href={whatsapp}
              target="_blank"
              className="mt-6 inline-block rounded-full bg-green-500 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-green-600"
            >
              Fazer pedido no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="bg-slate-50 px-5 py-16">
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
              Venha nos visitar
            </h2>

            <p className="mt-4 text-lg">
              R. Pref. Joaquim Mendes, 66 - Maricá - RJ
            </p>

            <p className="mt-2 text-white/85">
              Passe aqui hoje mesmo e aproveite nossas ofertas.
            </p>

            <a
              href={whatsapp}
              target="_blank"
              className="mt-7 inline-block rounded-full bg-green-500 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-green-600"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-2xl">
            <iframe
              title="Localização Armazém Oriente"
              src="https://www.google.com/maps?q=R.%20Pref.%20Joaquim%20Mendes,%2066%20Maric%C3%A1%20RJ&output=embed"
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
          Fale com a equipe pelo WhatsApp ou venha fazer suas compras.
        </p>

        <a
          href={whatsapp}
          target="_blank"
          className="mt-7 inline-block rounded-full bg-green-500 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-green-600"
        >
          Falar agora
        </a>
      </section>

      {/* WHATSAPP FIXO */}
      <a
        href={whatsapp}
        target="_blank"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-4 font-black text-white shadow-2xl transition hover:bg-green-600"
      >
        WhatsApp
      </a>
    </main>
  );
}
