// app/anunciar/pets/page.js

import Link from "next/link";
import Image from "next/image";
import FormularioPets from "../../components/forms/FormularioPets";

export default function AnunciarPetsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-slate-50 to-slate-100">
      {/* Faixa topo / breadcrumb */}
      <section className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
          <div className="text-slate-600">
            <span className="text-slate-400">Você está em:</span>{" "}
            <Link href="/" className="text-sky-700 hover:underline">
              Classilagos
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <Link href="/pets" className="text-sky-700 hover:underline">
              Pets
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-800">
              Anunciar para pets
            </span>
          </div>
          <div className="text-slate-500">
            Anúncios de pets em toda a Região dos Lagos.
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-[3fr,2fr] items-start">
          {/* Card com título + formulário */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-5 md:p-6">
            <header className="mb-5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                Anuncie grátis
              </p>
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                Anunciar em <span className="text-sky-700">Pets</span>
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-600">
                Cadastre animais, acessórios ou serviços pet. Durante a fase de
                lançamento, os anúncios são{" "}
                <span className="font-semibold text-emerald-700">
                  totalmente gratuitos
                </span>
                .
              </p>
            </header>

            <FormularioPets />
          </div>

          {/* Coluna lateral com dicas + ilustração */}
          <aside className="space-y-4">
            <div className="bg-amber-500 text-amber-50 rounded-3xl shadow-md border border-amber-600 p-4 text-xs md:text-sm">
              <h2 className="text-sm md:text-base font-semibold mb-2">
                Dicas para um bom anúncio de pets
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  Use um título claro: espécie, raça e algo que chame atenção.
                </li>
                <li>
                  Explique o temperamento do animal (calmo, brincalhão, tímido).
                </li>
                <li>
                  Informe se está vacinado, vermifugado e castrado (se souber).
                </li>
                <li>
                  Coloque fotos nítidas, com boa luz, de frente e de lado.
                </li>
                <li>
                  Para serviços, descreva bem o que está incluído e a região de
                  atendimento.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow border border-slate-200 p-4 flex flex-col gap-3">
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src="/pets/animal-01.jpg"
                  alt="Pets na Classilagos"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-slate-700">
                Seu anúncio aparecerá na página{" "}
                <Link
                  href="/pets"
                  className="text-sky-700 font-semibold hover:underline"
                >
                  Classilagos – Pets
                </Link>
                , junto com outros anúncios da região.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
