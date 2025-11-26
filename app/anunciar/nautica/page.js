// app/anunciar/nautica/page.js

import Link from "next/link";
import Image from "next/image";
import FormularioNautica from "../../components/forms/FormularioNautica";

export default function AnunciarNauticaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-slate-100">
      {/* Faixa topo / breadcrumb */}
      <section className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
          <div className="text-slate-600">
            <span className="text-slate-400">Você está em:</span>{" "}
            <Link href="/" className="text-sky-700 hover:underline">
              Classilagos
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <Link href="/nautica" className="text-sky-700 hover:underline">
              Náutica
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-800">
              Anunciar na Náutica
            </span>
          </div>
          <div className="text-slate-500">
            Anúncios de náutica em toda a Região dos Lagos.
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
                Anunciar em <span className="text-sky-700">Náutica</span>
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-600">
                Cadastre sua embarcação, passeios, vagas em marina ou serviços
                náuticos. Durante a fase de lançamento, os anúncios são{" "}
                <span className="font-semibold text-emerald-700">
                  totalmente gratuitos
                </span>
                .
              </p>
            </header>

            <FormularioNautica />
          </div>

          {/* Coluna lateral com dicas + ilustração */}
          <aside className="space-y-4">
            <div className="bg-sky-900 text-sky-50 rounded-3xl shadow-md border border-sky-800 p-4 text-xs md:text-sm">
              <h2 className="text-sm md:text-base font-semibold mb-2">
                Dicas para um bom anúncio náutico
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  Use um título claro com modelo, tamanho e tipo de embarcação.
                </li>
                <li>
                  Informe ano, motorização, horas de uso e capacidade de
                  pessoas.
                </li>
                <li>
                  Para passeios, detalhe duração, rota, itens inclusos e regras.
                </li>
                <li>
                  Coloque fotos nítidas por fora e por dentro, mostrando
                  detalhes importantes.
                </li>
                <li>
                  Seja honesto nas informações: isso gera confiança e mais
                  contatos.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow border border-slate-200 p-4 flex flex-col gap-3">
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src="/nautica/lancha-01.jpg"
                  alt="Náutica na Classilagos"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-slate-700">
                Seu anúncio aparecerá na página{" "}
                <Link
                  href="/nautica"
                  className="text-sky-700 font-semibold hover:underline"
                >
                  Classilagos – Náutica
                </Link>
                , junto com outras embarcações, passeios e serviços da região.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
