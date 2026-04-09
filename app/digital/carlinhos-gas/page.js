"use client";

export const dynamic = "force-dynamic";

export default function LandingPageCarlinhosGas() {
  const whatsappLink =
    "https://wa.me/5521996749365?text=Ol%C3%A1!%20Vi%20a%20promo%C3%A7%C3%A3o%20do%20g%C3%A1s%20no%20site%20e%20gostaria%20de%20fazer%20um%20pedido.";

  const pageUrl = "https://classilagos.shop/digital/carlinhos-gas";

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

      <section
        style={{
          padding: "14px",
          textAlign: "center",
          fontWeight: "bold",
          color: "#fff",
          background:
            "linear-gradient(90deg, #0f172a, #dc2626, #f97316, #fde047)",
          backgroundSize: "300% 100%",
          animation: "fireMove 6s linear infinite",
        }}
      >
        🔥 ENTREGA RÁPIDA EM MARICÁ • LIGUE 0800-282-2894 OU PEÇA AGORA NO
        WHATSAPP
      </section>

      <style>{`
        @keyframes fireMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 300% 0%; }
        }
      `}</style>

      {/* HERO NOVO */}
      <section
        style={{
          padding: "60px 20px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {/* TEXTO */}
          <div>
            <p
              style={{
                color: "#ef4444",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              🔥 Entrega rápida em Maricá
            </p>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "16px",
                lineHeight: 1.1,
              }}
            >
              Peça seu gás com rapidez e segurança
            </h1>

            <p
              style={{
                color: "#475569",
                marginBottom: "22px",
                lineHeight: "1.6",
                fontSize: "1.05rem",
              }}
            >
              Há mais de 50 anos atendendo Maricá com qualidade, confiança e
              entrega rápida direto na sua casa.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                Pedir no WhatsApp
              </a>

              <a
                href="tel:08002822894"
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Ligar 0800
              </a>
            </div>

{/* COMPARTILHAR */}
<div style={{ marginTop: "18px" }}>
  <p
    style={{
      fontSize: "13px",
      marginBottom: "6px",
      color: "#64748b",
    }}
  >
    Compartilhar:
  </p>

  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>

    {/* WHATSAPP */}
    <a
      href={`https://wa.me/?text=${encodeURIComponent(pageUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ transition: "0.2s" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="#25D366"
      >
        <path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.48 0 .13 5.35.13 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.29-1.65a11.86 11.86 0 0 0 5.76 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.46-8.4zM12.06 21.3a9.34 9.34 0 0 1-4.76-1.3l-.34-.2-3.73.98.99-3.63-.22-.37a9.31 9.31 0 0 1-1.43-4.96c0-5.14 4.18-9.32 9.33-9.32 2.49 0 4.83.97 6.6 2.73a9.27 9.27 0 0 1 2.73 6.6c0 5.14-4.18 9.32-9.33 9.32zm5.16-6.98c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.17.19-.33.21-.61.07-.28-.14-1.19-.44-2.27-1.4-.84-.75-1.4-1.68-1.57-1.96-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34 0 1.38 1 2.71 1.14 2.9.14.19 1.97 3.01 4.78 4.21.67.29 1.2.46 1.61.59.68.22 1.3.19 1.79.12.55-.08 1.66-.68 1.9-1.34.23-.66.23-1.23.16-1.34-.07-.1-.26-.16-.54-.3z"/>
      </svg>
    </a>

    {/* FACEBOOK */}
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ transition: "0.2s" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="#1877F2"
      >
        <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.57 1.54-3.99 3.9-3.99 1.13 0 2.31.2 2.31.2v2.54h-1.3c-1.28 0-1.67.8-1.67 1.62V12h2.84l-.45 2.88h-2.39v6.99A10 10 0 0 0 22 12z"/>
      </svg>
    </a>

    {/* COPIAR LINK */}
    <button
      onClick={() => {
        navigator.clipboard.writeText(pageUrl);
        alert("Link copiado!");
      }}
      style={{
        background: "transparent",
        border: "1px solid #cbd5e1",
        borderRadius: "999px",
        padding: "6px 12px",
        fontSize: "12px",
        cursor: "pointer",
        color: "#334155",
        fontWeight: "bold",
      }}
    >
      Copiar link
    </button>

  </div>
</div>

          {/* IMAGEM */}
          <div>
            <img
              src="/digital/carlinhos-gas/entregador.webp"
              alt="Entrega de gás"
              style={{
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                display: "block",
              }}
            />
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
                <h3 className="text-xl font-black text-slate-900">
                  {item.title}
                </h3>
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
              Trabalhamos com foco em segurança, atendimento responsável e
              qualidade para o seu dia a dia. Quando você escolhe experiência,
              escolhe tranquilidade.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Atendimento rápido em Maricá",
                "Qualidade e segurança",
                "Loja conhecida na cidade",
                "Facilidade no pedido",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-800"
                >
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
              Você pode pagar com Pix, cartão ou dinheiro, conforme a opção
              disponível no atendimento da loja.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Pix", "Cartão", "Dinheiro", "Consulte opções"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center font-black text-slate-900 shadow-sm"
                >
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
                Fale agora com a loja e faça seu pedido pelo WhatsApp ou pelo
                telefone.
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
            <p className="text-lg font-black text-slate-900">
              Carlinhos do Gás
            </p>
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
