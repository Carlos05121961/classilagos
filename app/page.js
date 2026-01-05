import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Landing30Anos() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
        <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* TEXTO */}
            <div className="space-y-4">
              <p className="text-xs tracking-widest text-slate-300 uppercase">
                classilagos.shop
              </p>

              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                30 anos conectando pessoas, negócios e oportunidades
                <span className="block text-slate-300">na Região dos Lagos</span>
              </h1>

              <p className="text-sm md:text-base text-slate-300 max-w-xl">
                Um portal regional completo para imóveis, veículos, turismo, empregos,
                serviços e comércio local — simples, moderno e organizado.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Entrar no portal
                </Link>

                <Link
                  href="/cadastrar"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 px-6 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900"
                >
                  Cadastre seu negócio gratuitamente
                </Link>

                <Link
                  href="/fale-conosco"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-900/40"
                >
                  Fale conosco
                </Link>
              </div>

              <div className="pt-4 grid gap-2 sm:grid-cols-2 text-xs text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-3">
                  <p className="font-semibold text-slate-100">Presença gratuita</p>
                  <p className="mt-1 text-slate-300">
                    Página para comércio, serviços, turismo e muito mais — com clareza e credibilidade.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-3">
                  <p className="font-semibold text-slate-100">Foco regional</p>
                  <p className="mt-1 text-slate-300">
                    Feito para quem vive, trabalha, empreende e investe na Região dos Lagos.
                  </p>
                </div>
              </div>
            </div>

            {/* IMAGEM */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-3 shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/branding/30anos-classilagos-shop.png"
                    alt="classilagos.shop • 30 anos"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                classilagos.shop • 30 anos conectando a Região dos Lagos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ ENCONTRA */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-extrabold">O que você encontra no classilagos.shop</h2>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl">
          Tudo em um só lugar — pensado para a Região dos Lagos.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Imóveis", d: "Venda, aluguel e temporada." },
            { t: "Veículos & Náutica", d: "Ofertas e oportunidades na região." },
            { t: "Turismo", d: "Onde ficar, onde comer, passeios." },
            { t: "Empregos", d: "Vagas e currículos com foco local." },
            { t: "Serviços", d: "Profissionais e prestadores encontrados de verdade." },
            { t: "Comércio local (Lagolistas)", d: "A lista amarela digital da região." },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-3xl border border-slate-800 bg-slate-900/30 p-4 hover:bg-slate-900/40 transition"
            >
              <p className="text-sm font-bold">{item.t}</p>
              <p className="mt-1 text-xs text-slate-300">{item.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/portal"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Entrar no portal
          </Link>
          <Link
            href="/cadastrar"
            className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/30 px-6 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900/50"
          >
            Cadastre seu negócio gratuitamente
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-6 text-[11px] text-slate-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p>
            © {new Date().getFullYear()} classilagos.shop — 30 anos conectando a Região dos Lagos
          </p>
          <p className="text-slate-500">
            Simples. Local. Completo.
          </p>
        </div>
      </footer>
    </main>
  );
}

