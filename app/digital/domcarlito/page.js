import Image from "next/image";

const produtos = [
  {
    nome: "Dom Carlito Burguer",
    imagem: "/digital/domcarlito/domcarlito-burguer.webp",
    descricao: "Carne 130g, queijo e pão Brioche 60g.",
    preco: "R$ 19,90",
  },
  {
    nome: "Dom Carlito Clássico",
    imagem: "/digital/domcarlito/domcarlito-classico.webp",
    descricao:
      "Carne 130g, queijo, cebola, tomate, alface e pão Prime GB 60g.",
    preco: "R$ 23,90",
  },
  {
    nome: "Dom Carlito Bacon",
    imagem: "/digital/domcarlito/domcarlito-bacon.webp",
    descricao:
      "Carne 130g, queijo, bacon, cebola e pão Prime GB 60g.",
    preco: "R$ 25,90",
  },
  {
    nome: "Dom Carlito Pimenta",
    imagem: "/digital/domcarlito/domcarlito-pimenta.webp",
    descricao:
      "Carne 130g, queijo, cebola, tomate, alface e pão Brioche Pimenta Vermelha 60g.",
    preco: "R$ 24,90",
  },
  {
    nome: "Dom Carlito Duplo",
    imagem: "/digital/domcarlito/domcarlito-duplo.webp",
    descricao:
      "2 carnes 130g, 2 queijos, cebola e pão Brioche Pimenta Vermelha 60g.",
    preco: "R$ 33,90",
  },
];

const bebidas = [
  {
    nome: "Coca-Cola Lata 350ml",
    imagem: "/digital/domcarlito/coca-cola-350.webp",
    preco: "R$ 9,00",
  },
  {
    nome: "Coca-Cola 200ml",
    imagem: "/digital/domcarlito/coca-cola-200.webp",
    preco: "R$ 5,00",
  },
];

export default function DomcarlitoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-10 text-center">
        <Image
          src="/digital/domcarlito/grelha.jpeg"
          alt="Dom Carlito na grelha"
          fill
          priority
          className="object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <Image
            src="/digital/domcarlito/domcarlitologo.webp"
            alt="Logo Dom Carlito"
            width={420}
            height={420}
            priority
            className="mx-auto w-full max-w-[260px] md:max-w-[310px]"
          />

          <p className="mt-4 text-sm uppercase tracking-[0.45em] text-yellow-500">
            Smoke Hamburguers
          </p>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Receita Exclusiva Domcarlito
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Cada hambúrguer é preparado na hora para proporcionar uma
            experiência marcante, com sabor, aroma e identidade própria.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </section>

      <section className="bg-zinc-950 px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-500">
              Experiência Dom Carlito
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Hambúrguer artesanal com presença de verdade.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-zinc-300">
              Um lanche preparado para quem valoriza sabor, qualidade e uma
              identidade diferente do comum.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-yellow-600/30 bg-black p-8 shadow-2xl">
            <Image
              src="/digital/domcarlito/domcarlito-burguer.webp"
              alt="Dom Carlito Burguer"
              width={700}
              height={700}
              className="mx-auto max-h-[360px] w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="cardapio" className="bg-black px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-yellow-500">
            Cardápio
          </p>

          <h2 className="mt-4 text-center text-3xl font-black md:text-5xl">
            A Linha Dom Carlito
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <div
                key={produto.nome}
                className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center transition hover:border-yellow-600/70 hover:shadow-2xl"
              >
                <div className="flex h-56 items-center justify-center">
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    width={420}
                    height={320}
                    className="max-h-52 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-5 text-2xl font-black text-yellow-500">
                  {produto.nome}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-zinc-300">
                  {produto.descricao}
                </p>

                <p className="mt-5 text-3xl font-black text-white">
                  {produto.preco}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-yellow-500">
            Bebidas
          </p>

          <h2 className="mt-4 text-center text-3xl font-black md:text-5xl">
            Acompanhe seu pedido
          </h2>

          <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
            {bebidas.map((bebida) => (
              <div
                key={bebida.nome}
                className="rounded-3xl border border-zinc-800 bg-black p-6 text-center"
              >
                <Image
                  src={bebida.imagem}
                  alt={bebida.nome}
                  width={220}
                  height={220}
                  className="mx-auto h-40 w-full object-contain"
                />

                <h3 className="mt-5 text-xl font-bold text-yellow-500">
                  {bebida.nome}
                </h3>

                <p className="mt-3 text-3xl font-black text-white">
                  {bebida.preco}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pedido" className="bg-black px-6 py-16 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-600/30 bg-zinc-950 p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-yellow-500">
            Pedidos em breve
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            Em breve você poderá fazer seu pedido pelo cardápio digital do Dom
            Carlito.
          </p>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Entregas por Uber Flash ou Moto-Táxi • Maricá/RJ
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-black px-6 py-8 text-center text-sm text-zinc-500">
        Dom Carlito Smoke Hamburguers • Maricá/RJ
      </footer>
    </main>
  );
}
