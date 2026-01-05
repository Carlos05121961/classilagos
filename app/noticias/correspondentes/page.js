"use client";

import Link from "next/link";
import { correspondentesData } from "./correspondentesData";

function Chip({ children, tone = "yellow" }) {
  const map = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-emerald-50 border-emerald-200 text-emerald-700",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    sky: "bg-sky-50 border-sky-200 text-sky-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${map[tone] || map.slate}`}
    >
      {children}
    </span>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      {children}
    </div>
  );
}

export default function CorrespondentesPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* TOPO / HERO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-7 space-y-3">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Correspondentes Culturais Classilagos
              </h1>

              <p className="text-sm text-slate-600 max-w-3xl">
                Rede por cidade para valorizar <strong>cultura</strong>,{" "}
                <strong>turismo</strong>, <strong>comércio tradicional</strong> e
                histórias locais — <strong>sem violência</strong> e{" "}
                <strong>sem política partidária</strong>.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Link
                href="/noticias/correspondentes/candidatar"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Quero ser correspondente
              </Link>

              <Link
                href="/noticias"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Voltar para Notícias
              </Link>
            </div>
          </div>

          {/* BADGES + LINKS */}
          <div className="mt-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              <Chip tone="slate">Conteúdo positivo</Chip>
              <Chip tone="slate">Cultura & Turismo</Chip>
              <Chip tone="slate">Comércio tradicional</Chip>
              <Chip tone="slate">Curadoria editorial</Chip>
              <Chip tone="green">Comissão 70/30</Chip>
              <Chip tone="sky">Processo por etapas</Chip>
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <p className="text-[11px] text-slate-600">
                Leia também:{" "}
                <Link
                  className="text-sky-700 underline"
                  href="/noticias/correspondentes/regulamento"
                >
                  Regulamento
                </Link>{" "}
                •{" "}
                <Link
                  className="text-sky-700 underline"
                  href="/noticias/correspondentes/tabela"
                >
                  Tabela de preços
                </Link>{" "}
                •{" "}
                <Link
                  className="text-sky-700 underline"
                  href="/noticias/correspondentes/apresentacao"
                >
                  Texto de apresentação
                </Link>{" "}
                •{" "}
                <Link
                  className="text-sky-700 underline"
                  href="/noticias/correspondentes/exemplos"
                >
                  Exemplos de matérias
                </Link>{" "}
                •{" "}
                <Link
                  className="text-sky-700 underline"
                  href="/noticias/correspondentes/termo"
                >
                  Termo de adesão
                </Link>
              </p>

              <p className="text-[11px] text-slate-500">
                Dica: após a aprovação, o e-mail do Classilagos vai trazer o link
                desta página para você seguir o passo a passo (exemplos + termo).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (resumo premium) */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <Card>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <h2 className="text-sm md:text-base font-extrabold text-slate-900">
                Como funciona o processo (bem simples)
              </h2>
              <p className="text-xs text-slate-600 max-w-3xl">
                Você se candidata, a equipe faz a curadoria, e se aprovado recebe
                um e-mail com os próximos passos. A partir daí você já consegue
                visualizar como suas matérias aparecem no Classilagos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip tone="sky">1) Candidatura</Chip>
              <Chip tone="sky">2) Curadoria</Chip>
              <Chip tone="sky">3) Aprovação</Chip>
              <Chip tone="sky">4) Termo</Chip>
              <Chip tone="sky">5) Primeira matéria</Chip>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-900">Pagamento & comissão</p>
              <p className="text-xs text-slate-600 mt-1">
                Reportagens especiais podem ser remuneradas. Comissão padrão{" "}
                <strong>70/30</strong>, conforme regras e tabela.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-900">Linha editorial</p>
              <p className="text-xs text-slate-600 mt-1">
                Cultura, turismo, comércio e histórias locais. Sem violência,
                sensacionalismo e sem política partidária.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-900">Créditos</p>
              <p className="text-xs text-slate-600 mt-1">
                Após a aprovação, suas matérias podem exibir créditos com{" "}
                <strong>nome</strong> e <strong>cidade</strong> do correspondente.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* LISTA POR CIDADE */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 className="text-sm font-extrabold text-slate-900">
            Rede por cidade
          </h3>
          <p className="text-[11px] text-slate-500">
            “Ativo” = já em operação • “Em formação” = vaga aberta / em curadoria
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {correspondentesData.map((c) => {
            const ativo = c.status === "ativo";

            return (
              <div
                key={c.cidade}
                className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs font-extrabold text-sky-700 uppercase tracking-wide">
                  {c.cidade}
                </p>

                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-bold text-slate-900">{c.nome}</h2>
                  {ativo ? (
                    <Chip tone="green">Ativo</Chip>
                  ) : (
                    <Chip tone="yellow">Em formação</Chip>
                  )}
                </div>

                <p className="text-xs text-slate-600">{c.bio}</p>

                {c.instagram ? (
                  <Link
                    href={c.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-700 underline"
                  >
                    Ver Instagram
                  </Link>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Contato disponível em breve.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
