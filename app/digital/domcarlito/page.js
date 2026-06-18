import Image from "next/image";

const produtos = [
  { nome: "Dom Carlito Burguer", descricao: "Pão brioche, hambúrguer artesanal e queijo." },
  { nome: "Dom Carlito Clássico", descricao: "Pão brioche, hambúrguer 130g, queijo, alface e tomate." },
  { nome: "Dom Carlito Bacon", descricao: "Pão brioche, hambúrguer artesanal, queijo e bacon crocante." },
  { nome: "Dom Carlito BBQ", descricao: "Pão brioche, hambúrguer artesanal, queijo e molho barbecue." },
  { nome: "Dom Carlito Duplo", descricao: "Pão brioche, dois hambúrgueres artesanais e queijo duplo." },
  { nome: "Dom Carlito Kids", descricao: "Versão infantil no pão brioche, com hambúrguer 50g e queijo." },
];

export default function DomcarlitoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-10 text-center">
        <Image
          src="/digital/domcarlito/grelha.jpeg"
          alt="Grelha Dom Carlito"
          fill
          priority
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-black/75"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <Image
            src="/digital/domcarlito/domcarlitologo.webp"
            alt="Logo Dom Carlito"
            width={360}
            height={360}
            priority
            className="mx-auto w-full max-w-[230px] md:max-w-[280px]"
          />

          <p className="mt-3 text-sm uppercase tracking-[0.45em] text-yellow-500">
            Smoke Hamburguers
          </p>

          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_1.15fr_1fr]">
            <div className="hidden md:block">
              <Image
                src="/digital/domcarlito/hamburguer-pronto.jpeg"
                alt="Hambúrguer Dom Carlito"
                width={520}
                height={520}
                className="rounded-3xl border border-yellow-600/30 object-cover shadow-2xl"
              />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-yellow-500">
                Receita Exclusiva Domcarlito
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Hambúrguer artesanal com presença de verdade.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
                Cada hambúrguer é preparado na hora para proporcionar uma
                experiência marcante, com sabor, aroma e identidade própria.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="#cardapio"
                  className="rounded-full bg-yellow-500 px-8 py-4 font-bold text-black transition hover:bg-yellow-400"
                >
                  Ver cardápio
                </a>

                <a
                  href="#pedido"
                  className="rounded-full border border-yellow-500 px-8 py-4 font-bold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                >
                  Fazer pedido
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <Image
                src="/digital/domcarlito/hamburguer-pronto2.jpeg"
                alt="Hambúrguer artesanal Dom Carlito"
                width={520}
                height={520}
                className="rounded-3xl border border-yellow-600/30 object-cover shadow-2xl"
              />
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-yellow-600/20 bg-black/60 p-5 backdrop-blur">
              <h3 className="font-bold text-yellow-500">Artesanal</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Preparado com cuidado, sabor e identidade própria.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-600/20 bg-black/60 p-5 backdrop-blur">
              <h3 className="font-bold text-yellow-500">Feito na hora</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Cada pedido recebe atenção especial do preparo à entrega.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-600/20 bg-black/60 p-5 backdrop-blur">
              <h3 className="font-bold text-yellow-500">Sabor marcante</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Uma experiência criada para ficar na memória.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cardapio" className="bg-black px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-yellow-500">
            Cardápio
          </p>

          <h2 className="mt-4 text-center text-3xl font-black md:text-5xl">
            Cardápio inicial
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {produtos.map((produto) => (
              <div
                key={produto.nome}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-yellow-600/60"
              >
                <h3 className="text-xl font-bold text-yellow-500">
                  {produto.nome}
                </h3>
                <p className="mt-3 text-zinc-300">{produto.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pedido" className="bg-zinc-950 px-6 py-16 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-600/30 bg-black p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-yellow-500">
            Pedidos em breve
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            Em breve você poderá fazer seu pedido pelo cardápio digital do Dom
            Carlito.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-black px-6 py-8 text-center text-sm text-zinc-500">
        Dom Carlito Smoke Hamburguers • Maricá/RJ
      </footer>
    </main>
  );
}
