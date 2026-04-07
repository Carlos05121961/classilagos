export default function LandingPageCarlinhosGas() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">Carlinhos do Gás</p>
            <p className="text-sm text-slate-600">Há 50 anos em Maricá</p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="tel:08002822894" className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold">
              0800-282-2894
            </a>
            <a href="https://wa.me/5521967463576" className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Pedir no WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* HERO COM IMAGEM */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div>
          <h1 className="text-4xl font-black md:text-6xl">
            O gás de Maricá há 50 anos.
          </h1>
          <p className="mt-5 text-lg text-slate-700">
            Peça seu gás com quem é referência na cidade. Atendimento rápido e confiança de muitos anos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="https://wa.me/5521967463576" className="rounded-2xl bg-emerald-600 px-6 py-4 text-white font-bold">
              Peça no WhatsApp
            </a>
            <a href="tel:08002822894" className="rounded-2xl border-2 border-slate-900 px-6 py-4 font-bold">
              Ligar: 0800-282-2894
            </a>
          </div>
        </div>

        <div>
          <img src="/digital/carlinhos-gas/entregador.webp" className="rounded-2xl shadow-xl" />
        </div>
      </section>

      {/* PRODUTO */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <img src="/digital/carlinhos-gas/botijao.webp" className="rounded-2xl" />

          <div>
            <h2 className="text-3xl font-black">Segurança e qualidade</h2>
            <p className="mt-4 text-lg text-slate-600">
              Trabalhamos com gás de qualidade e segurança para sua família.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
          <h2 className="text-3xl font-black">Peça seu gás agora</h2>
          <p className="mt-4 text-lg text-slate-600">Atendimento rápido em Maricá</p>

          <img src="/digital/carlinhos-gas/carrinho.webp" className="mx-auto mt-8 rounded-2xl" />

          <div className="mt-8">
            <a href="https://wa.me/5521967463576" className="rounded-2xl bg-emerald-600 px-8 py-4 text-white font-bold">
              Pedir no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-slate-600">
        Produzido por Classilagos Digital
      </footer>
    </main>
  );
}
