export default function LandingPageCarlinhosGas() {
  const whatsappLink =
    "https://wa.me/5521996749365?text=Ol%C3%A1!%20Vi%20a%20promo%C3%A7%C3%A3o%20do%20g%C3%A1s%20no%20site%20e%20gostaria%20de%20fazer%20um%20pedido.";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-3xl font-black leading-none tracking-tight text-slate-900 md:text-4xl">
              Carlinhos do Gás
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600 md:text-base">
              Há 50 anos em Maricá
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="tel:08002822894"
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              0800-282-2894
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:opacity-95"
            >
              Pedir no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-red-100 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-4 py-3 text-center text-sm font-bold text-white md:text-base">
        Atendimento rápido em Maricá • Ligue 0800-282-2894 ou peça agora no WhatsApp
      </section>

      <section className="bg-[linear-gradient(180deg,#fff_0%,#fff8f6_100%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 shadow-sm">
              Tradição, confiança e atendimento local
            </span>

            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
              O gás de Maricá há 50 anos.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
              Peça seu gás com quem é referência na cidade. Atendimento rápido,
              segurança e confiança de muitos anos para sua casa e sua família.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-emerald-600 px-7 py-4 text-center text-base font-extrabold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-95"
              >
                Peça no WhatsApp
              </a>
              <a
                href="tel:08002822894"
                className="rounded-2xl border-2 border-slate-900 px-7 py-4 text-center text-base font-extrabold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Ligar: 0800-282-2894
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["50 anos em Maricá", "Tradição que passa confiança"],
                ["Atendimento rápido", "Mais agilidade para o seu pedido"],
                ["Segurança", "Qualidade e cuidado para sua família"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-base font-black text-slate-900">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-2xl">
              <img
                src="/digital/carlinhos-gas/entregador.webp"
                alt="Entregador de gás em Maricá"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="rounded-[2rem] bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Faça seu pedido
              </p>
              <p className="mt-2 text-3xl font-black md:text-4xl">0800-282-2894</p>
              <p className="mt-2 text-base text-white/90">
                WhatsApp da loja: (21) 99674-9365
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
              Por que escolher o Carlinhos do Gás?
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Quem mora em Maricá sabe o valor de um atendimento de confiança.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Segurança, tradição e rapidez para você pedir com tranquilidade.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Tradição de 50 anos",
                text: "Um nome conhecido em Maricá, construído com trabalho sério e atendimento de verdade.",
              },
              {
                title: "Atendimento local",
                text: "Quem conhece a cidade entende a necessidade do cliente e responde mais rápido.",
              },
              {
                title: "Pedido simples e rápido",
                text: "Ligue ou chame no WhatsApp e fale direto com a loja para agilizar seu atendimento.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="mb-4 h-12 w-12 rounded-2xl bg-red-100" />
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
            <img
              src="/digital/carlinhos-gas/botijao.webp"
              alt="Botijão de gás com segurança"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
              Segurança para sua família
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Gás com qualidade, cuidado e confiança.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Trabalhamos com foco em segurança, atendimento responsável e qualidade
              para o seu dia a dia. Quando você escolhe experiência, escolhe
              tranquilidade.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Atendimento rápido em Maricá",
                "Qualidade e segurança",
                "Loja conhecida na cidade",
                "Facilidade no pedido",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-800">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
              Formas de pagamento
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Mais praticidade para fazer seu pedido.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Você pode deixar esta área pronta para informar as formas de pagamento
              aceitas pela loja, ajudando o cliente a decidir mais rápido.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Pix', 'Cartão', 'Dinheiro', 'Consulte opções'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center font-black text-slate-900 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
            <img
              src="/digital/carlinhos-gas/carrinho.webp"
              alt="Entrega de botijões de gás"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 text-white shadow-2xl md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Peça seu gás agora
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Atendimento rápido em Maricá com quem já é tradição na cidade.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">
                Fale agora com a loja e faça seu pedido pelo WhatsApp ou pelo telefone.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-white px-6 py-4 text-center text-base font-black text-red-600 shadow-lg transition hover:opacity-95"
              >
                Pedir no WhatsApp
              </a>
              <a
                href="tel:08002822894"
                className="block rounded-2xl border-2 border-white px-6 py-4 text-center text-base font-black text-white transition hover:bg-white hover:text-red-600"
              >
                Ligar 0800-282-2894
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-lg font-black text-slate-900">Carlinhos do Gás</p>
            <p>Há 50 anos em Maricá</p>
            <p>Telefone: 0800-282-2894</p>
            <p>WhatsApp: (21) 99674-9365</p>
          </div>
          <p className="font-semibold">Produzido por Classilagos Digital</p>
        </div>
      </footer>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-2xl transition hover:opacity-95 md:px-6 md:py-4"
      >
        WhatsApp
      </a>
    </main>
  );
}
