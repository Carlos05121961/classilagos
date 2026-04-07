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
            <a
              href="tel:08002822894"
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              0800-282-2894
            </a>
            <a
              href="https://wa.me/5521967463576?text=Ol%C3%A1%2C%20quero%20pedir%20g%C3%A1s."
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
            >
              Pedir no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit rounded-full border border-red-200 bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">
              Tradição, confiança e atendimento local
            </span>

            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              O gás de Maricá há 50 anos.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              Peça seu gás com quem é referência na cidade. Atendimento rápido, confiança de muitos anos e um serviço feito para quem precisa de segurança e agilidade no dia a dia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/5521967463576?text=Ol%C3%A1%2C%20quero%20pedir%20g%C3%A1s."
                className="rounded-2xl bg-emerald-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg hover:opacity-95"
              >
                Peça seu gás agora no WhatsApp
              </a>
              <a
                href="tel:08002822894"
                className="rounded-2xl border-2 border-slate-900 px-6 py-4 text-center text-base font-bold hover:bg-slate-900 hover:text-white"
              >
                Ligar: 0800-282-2894
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold">50 anos em Maricá</p>
                <p className="mt-1 text-sm text-slate-600">História e credibilidade local.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold">Atendimento rápido</p>
                <p className="mt-1 text-sm text-slate-600">Agilidade para o seu dia a dia.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold">Confiança e segurança</p>
                <p className="mt-1 text-sm text-slate-600">Serviço sério, conhecido na cidade.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-red-600 via-red-500 to-amber-500 p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  Carlinhos do Gás
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                  Entrega com tradição, rapidez e confiança.
                </h2>
                <p className="mt-4 text-base leading-7 text-white/90">
                  Atendimento local em Maricá para quem quer pedir gás com mais segurança e praticidade.
                </p>

                <div className="mt-8 rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white/80">Telefone</p>
                  <p className="mt-1 text-3xl font-black">0800-282-2894</p>
                  <p className="mt-2 text-sm text-white/90">Fale agora e faça seu pedido.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
            Por que escolher o Carlinhos do Gás?
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Quem é de Maricá sabe o valor de um atendimento de confiança.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Quando o assunto é gás, o que mais importa é segurança, tradição e resposta rápida. É isso que faz o nome Carlinhos do Gás ser lembrado há tantos anos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Tradição de 50 anos',
              text: 'Uma marca conhecida em Maricá, construída com trabalho sério e atendimento constante ao longo do tempo.',
            },
            {
              title: 'Atendimento local',
              text: 'Quem mora em Maricá prefere falar com quem conhece a cidade e entende a necessidade do cliente.',
            },
            {
              title: 'Rapidez no pedido',
              text: 'Uma página simples, direta e pensada para facilitar seu contato pelo WhatsApp ou telefone.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-2xl bg-red-100" />
              <h3 className="text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
              Pedido fácil
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Peça seu gás agora.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Escolha o melhor caminho para falar com a equipe. Quanto mais fácil o contato, mais rápido você resolve.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="https://wa.me/5521967463576?text=Ol%C3%A1%2C%20quero%20pedir%20g%C3%A1s."
                className="block rounded-2xl bg-emerald-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg hover:opacity-95"
              >
                Falar no WhatsApp
              </a>
              <a
                href="tel:08002822894"
                className="block rounded-2xl border-2 border-slate-900 px-6 py-4 text-center text-base font-bold hover:bg-slate-900 hover:text-white"
              >
                Ligar agora: 0800-282-2894
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
              Formas de pagamento
            </p>
            <h3 className="mt-3 text-3xl font-black">Pagamento facilitado</h3>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Você pode incluir aqui as formas de pagamento aceitas, como dinheiro, cartão, Pix e outras opções que o cliente usa no dia a dia.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {['Pix', 'Cartão', 'Dinheiro', 'Consulte opções'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-center font-bold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-red-600 via-red-500 to-amber-500 p-8 text-white shadow-2xl md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Atendimento rápido em Maricá
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Precisando de gás? Fale agora com o Carlinhos do Gás.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">
                Tradição, confiança e atendimento local para você pedir com mais tranquilidade.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.me/5521967463576?text=Ol%C3%A1%2C%20quero%20pedir%20g%C3%A1s."
                className="block rounded-2xl bg-white px-6 py-4 text-center text-base font-black text-red-600 shadow-lg hover:opacity-95"
              >
                Pedir pelo WhatsApp
              </a>
              <a
                href="tel:08002822894"
                className="block rounded-2xl border-2 border-white px-6 py-4 text-center text-base font-black text-white hover:bg-white hover:text-red-600"
              >
                0800-282-2894
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="font-bold text-slate-900">Carlinhos do Gás</p>
            <p>Há 50 anos em Maricá</p>
            <p>Telefone: 0800-282-2894</p>
          </div>
          <p>Produzido por Classilagos Digital</p>
        </div>
      </footer>

      <a
        href="https://wa.me/5521967463576?text=Ol%C3%A1%2C%20quero%20pedir%20g%C3%A1s."
        className="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-600 px-5 py-4 text-sm font-extrabold text-white shadow-2xl hover:opacity-95 md:hidden"
      >
        WhatsApp
      </a>
    </main>
  );
}
