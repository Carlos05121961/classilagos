// app/lands/empregos/page.js
import Link from "next/link";

export default function LandEmpregos() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          {/* brilho suave */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

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

            <Link
              href="/anunciar/vaga"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Anunciar vaga (grátis)
            </Link>
          </div>

          <p className="mt-4 text-sm text-white/60">
            Dica: comece pelo básico. Você pode completar depois.
          </p>
        </div>
      </section>

      {/* CARDS PRINCIPAIS */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card
            title="Ver vagas agora"
            desc="Oportunidades no comércio, serviços, temporário e freelancer."
            href="/empregos/lista"
            cta="Abrir vagas"
          />
          <Card
            title="Banco de currículos"
            desc="Empresas encontram talentos locais com facilidade."
            href="/empregos/curriculos"
            cta="Ver currículos"
          />
          <Card
            title="Tudo por cidade"
            desc="Conteúdo regional com filtro por cidade, simples e rápido."
            href="/empregos"
            cta="Entrar no Empregos"
          />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Como funciona
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Step n="1" t="Cadastre seu currículo" d="Você cria seu perfil uma única vez. É gratuito." />
            <Step n="2" t="Apareça para quem contrata" d="Empresas da região encontram seu perfil." />
            <Step n="3" t="Contato direto" d="Sem intermediários. A conversa é entre as partes." />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
              href="/empregos"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Ir para o portal
            </Link>
          </div>
        </div>
      </section>

      {/* RODAPÉ CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
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

function Card({ title, desc, href, cta }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/75">{desc}</p>
      <Link
        href={href}
        className="mt-4 inline-flex w-fit items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
      >
        {cta} →
      </Link>
    </div>
  );
}

function Step({ n, t, d }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white font-bold">
        {n}
      </div>
      <h4 className="text-base font-bold text-white">{t}</h4>
      <p className="mt-2 text-sm text-white/75">{d}</p>
    </div>
  );
}
