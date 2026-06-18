export default function DomcarlitoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-16 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-500">
            Em breve em Maricá
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Domcarlito Smoke
            <span className="block text-yellow-500">Hamburguers</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
            Hambúrguer artesanal feito na brasa, com sabor defumado,
            receita exclusiva e preparo feito na hora.
          </p>

          <div className="mt-10 rounded-3xl border border-yellow-600/40 bg-zinc-950 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-500">
              O segredo está na brasa
            </h2>

            <p className="mt-4 text-zinc-300">
              Nada de chapa. Aqui o hambúrguer ganha vida na grelha,
              com aquele aroma especial de fumaça e sabor artesanal.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-zinc-900 p-5">
              <h3 className="font-bold text-yellow-500">Artesanal</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Preparado com cuidado, sabor e identidade própria.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900 p-5">
              <h3 className="font-bold text-yellow-500">Na brasa</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Hambúrguer grelhado, levemente defumado e feito na hora.
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
                  Hambúrguer artesanal no pão brioche, preparado na brasa.
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
        Domcarlito Smoke Hamburguers • Maricá/RJ
      </footer>
    </main>
  );
}
