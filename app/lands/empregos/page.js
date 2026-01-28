// app/lands/empregos/page.js
import Link from "next/link";

export default function LandEmpregos() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full">
          {/* Card principal */}
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
            {/* Selo discreto */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Classilagos • Empregos • Região dos Lagos
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Seu primeiro emprego começa aqui.
            </h1>

            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Cadastre seu currículo ou anuncie uma vaga na Região dos Lagos.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {/* Botão principal */}
              <Link
                href="/iniciar/curriculo"
                className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-4 text-base font-bold text-white shadow-[0_14px_40px_rgba(16,185,129,0.25)] transition hover:brightness-110"
              >
                Começar meu currículo
                <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
              </Link>

              {/* Botão secundário */}
              <Link
                href="/iniciar/vaga"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Anunciar uma vaga
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Plataforma regional • 100% gratuito • Contato direto
            </p>
          </div>

          {/* Rodapé discreto */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Ao continuar, você será direcionado(a) para preencher as informações no Classilagos.
          </p>
        </div>
      </section>
    </main>
  );
}

