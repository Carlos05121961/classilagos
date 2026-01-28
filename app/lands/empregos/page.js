import Link from "next/link";

export const metadata = {
  title: "Empregos | Classilagos",
  description:
    "Seu primeiro emprego começa aqui. Vagas, banco de currículos e oportunidades na Região dos Lagos.",
};

export default function LandEmpregos() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#061326] via-[#071a33] to-[#071a33]">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-8 sm:pt-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Classilagos • Empregos • Região dos Lagos
          </p>

          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Seu primeiro emprego começa aqui!
          </h1>

          <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/75">
            Vagas de emprego, banco de currículos e oportunidades em toda a Região dos Lagos.
            O Classilagos conecta — o contato é direto entre as partes.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/empregos"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
            >
              Entrar no portal de Empregos
            </Link>

            <Link
              href="/anunciar/curriculo"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Cadastrar meu currículo (grátis)
            </Link>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Link
              href="/empregos/lista"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Ver vagas agora
            </Link>

            <Link
              href="/anunciar/vaga"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Anunciar vaga (grátis)
            </Link>
          </div>

          <p className="mt-5 text-sm text-white/60">
            Dica: você pode começar pelo básico e completar depois. É rápido e gratuito.
          </p>
        </div>
      </section>

      {/* BLOCO “O QUE VOCÊ ENCONTRA” */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Vagas na região",
              d: "Oportunidades no comércio, serviços, temporário, freelancer e muito mais.",
              href: "/empregos/lista",
              cta: "Abrir vagas",
            },
            {
              t: "Banco de currículos",
              d: "Empresas encontram talentos locais com rapidez e facilidade.",
              href: "/empregos/curriculos",
              cta: "Ver currículos",
            },
            {
              t: "Contato direto",
              d: "Sem intermediários. O Classilagos conecta e o contato é entre as partes.",
              href: "/empregos",
              cta: "Entrar no Empregos",
            },
          ].map((card) => (
            <div
              key={card.t}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
            >
              <h2 className="text-lg font-bold text-white">{card.t}</h2>
              <p className="mt-2 text-sm text-white/75">{card.d}</p>
              <Link
                href={card.href}
                className="mt-4 inline-flex w-fit items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Uma vaga pode mudar uma vida.
          </h3>
          <p className="mt-2 max-w-2xl text-white/75">
            Comece agora: veja vagas, cadastre seu currículo ou anuncie uma oportunidade.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/empregos/lista"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
            >
              Ver vagas
            </Link>
            <Link
              href="/anunciar/curriculo"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Cadastrar currículo
            </Link>
            <Link
              href="/anunciar/vaga"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Anunciar vaga
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
