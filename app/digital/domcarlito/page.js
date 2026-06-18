import Image from "next/image";

export default function DomcarlitoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-10 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-yellow-500">
            Em breve em Maricá
          </p>

          <div className="flex justify-center">
            <Image
              src="/digital/domcarlito/domcarlitologo.webp"
              alt="Logo Dom Carlito"
              width={420}
              height={420}
              priority
              className="w-full max-w-[280px] md:max-w-[320px]"
            />
          </div>

          <p className="mt-2 text-sm uppercase tracking-[0.35em] text-yellow-500">
            Smoke Hamburguers
          </p>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-white md:text-5xl">
            Receita Exclusiva Domcarlito
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
            Cada hambúrguer é preparado na hora para proporcionar uma
            experiência marcante, com sabor, aroma e identidade própria.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-zinc-900 p-5">
              <h3 className="font-bold text-yellow-500">Artesanal</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Preparado com cuidado, sabor e identidade própria.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900 p-5">
              <h3 className="font-bold text-yellow-500">Feito na hora</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Cada pedido é preparado com atenção para entregar qualidade.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900 p-5">
              <h3 className="font-bold text-yellow-500">Pedidos online</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Em breve com cardápio digital e pagamento pelo Mercado Pago.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="#cardapio"
              className="inline-block rounded-full bg-yellow-500 px-8 py-4 font-bold text-black transition hover:bg-yellow-400"
            >
              Ver prévia do cardápio
            </a>
          </div>
        </div>
      </section>

      <section id="cardapio" className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black text-yellow-500">
            Cardápio inicial
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              "Dom Carlito Burguer",
              "Dom Carlito Clássico",
              "Dom Carlito Bacon",
              "Dom Carlito BBQ",
              "Dom Carlito Duplo",
              "Dom Carlito Kids",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <h3 className="text-xl font-bold text-white">{item}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Hambúrguer artesanal no pão brioche, feito na hora.
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-zinc-400">
            Delivery e retirada no local. Atendimento em breve.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
        Dom Carlito Smoke Hamburguers • Maricá/RJ
      </footer>
    </main>
  );
  }
