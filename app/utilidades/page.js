"use client";

import Link from "next/link";
import { LINKS_OFICIAIS } from "../../lib/linksOficiais";

export default function UtilidadesPage() {
  // IPVA RJ (geral do estado) — você pode trocar depois se quiser outro destino
  const IPVA_RJ =
    "https://www.ipva.rj.gov.br/ipva/";

  // Telefones úteis (exemplos) — você me passa depois e eu ajusto certinho
  const TELEFONES_UTEIS = [
    { nome: "Emergência", tel: "190" },
    { nome: "SAMU", tel: "192" },
    { nome: "Bombeiros", tel: "193" },
    { nome: "Defesa Civil", tel: "199" },
  ];

  return (
    <main className="min-h-screen bg-[#F5FBFF] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Central de Utilidades — Classilagos
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Links oficiais, consultas e informações úteis para a Região dos Lagos.
              Tudo organizado em um só lugar.
            </p>
          </div>

          <Link
            href="/imoveis"
            className="hidden sm:inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Voltar para Imóveis
          </Link>
        </header>

        {/* IPTU por cidade */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">IPTU — Prefeituras da Região</h2>
          <p className="mt-1 text-sm text-slate-600">
            Acesse o portal oficial de IPTU e o site da prefeitura da sua cidade.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(LINKS_OFICIAIS).map(([cidade, links]) => (
              <div
                key={cidade}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-bold text-slate-900">{cidade}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {links?.iptu ? (
                    <a
                      href={links.iptu}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
                    >
                      Consultar IPTU
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">IPTU: em breve</span>
                  )}

                  {links?.prefeitura ? (
                    <a
                      href={links.prefeitura}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Site da Prefeitura
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IPVA */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">IPVA — Estado do RJ</h2>
          <p className="mt-1 text-sm text-slate-600">
            Consulta e serviços do IPVA (link estadual).
          </p>

          <div className="mt-4">
            <a
              href={IPVA_RJ}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Acessar IPVA RJ
            </a>
          </div>
        </section>

        {/* Telefones úteis */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Telefones úteis</h2>
          <p className="mt-1 text-sm text-slate-600">
            Lista básica (vamos personalizar para a Região dos Lagos).
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TELEFONES_UTEIS.map((t) => (
              <div
                key={t.tel}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-slate-800">{t.nome}</span>
                <a
                  href={`tel:${t.tel}`}
                  className="rounded-full bg-white border border-slate-300 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  {t.tel}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Rodapé */}
        <p className="text-[11px] text-slate-500">
          Dica: esta página vai crescer com novas utilidades (certidões, ITBI, água, luz, cartórios, etc.)
          sem precisar mexer nas páginas principais.
        </p>
      </div>
    </main>
  );
}
