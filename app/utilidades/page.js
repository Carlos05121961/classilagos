"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LINKS_OFICIAIS } from "../../lib/linksOficiais";


const CIDADES = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro da Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
];

const LINKS_IPVA = {
  ipva_rj: "https://portal.fazenda.rj.gov.br/ipva/",
  detran_servicos: "https://www.detran.rj.gov.br/todos-os-servicos/servicos-drv.html",
};

const TELEFONES_UTEIS = [
  {
    titulo: "Emergências",
    itens: ["190 (Polícia Militar)", "192 (SAMU)", "193 (Corpo de Bombeiros)", "199 (Defesa Civil)"],
  },
  {
    titulo: "Turismo / Apoio ao turista",
    itens: [
      "DEAT RJ: (21) 2332-2924",
      "DEAT RJ: (21) 2332-2429",
      "DEAT RJ: (21) 2332-2885",
      "Búzios / Cabo Frio: (22) 2633-0059",
    ],
  },
  {
    titulo: "Polícia Rodoviária (exemplos)",
    itens: [
      "BPRv Saquarema: (22) 2654-1497",
      "BPRv Rio das Ostras: (21) 99171-7071",
    ],
  },
];

// normaliza acentos
function norm(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLinksCidade(cidade) {
  if (!cidade) return null;
  if (LINKS_OFICIAIS[cidade]) return LINKS_OFICIAIS[cidade];
  const alvo = norm(cidade);
  const chave = Object.keys(LINKS_OFICIAIS).find((k) => norm(k) === alvo);
  return chave ? LINKS_OFICIAIS[chave] : null;
}

export default function UtilidadesPage() {
  const searchParams = useSearchParams();

  const [tab, setTab] = useState("iptu"); // iptu | ipva | telefones
  const [cidade, setCidade] = useState("");

  // pega tab da URL: /utilidades?tab=iptu
  useEffect(() => {
    const t = (searchParams.get("tab") || "").toLowerCase();
    if (t === "iptu" || t === "ipva" || t === "telefones") setTab(t);
  }, [searchParams]);

  const linksCidade = useMemo(() => getLinksCidade(cidade), [cidade]);

  return (
    <main className="bg-slate-50 min-h-screen pb-14">
      {/* topo */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
              Utilidades da Região
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
              Utilidades • IPTU • IPVA • Telefones úteis
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Um atalho prático para serviços oficiais e contatos essenciais na Região dos Lagos.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/fale-conosco"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Nos ajude a atualizar
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </Link>
          </div>
        </div>

        {/* abas */}
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <button
              type="button"
              onClick={() => setTab("iptu")}
              className={`rounded-2xl px-3 py-2 font-semibold transition ${
                tab === "iptu"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              IPTU (Cidades)
            </button>

            <button
              type="button"
              onClick={() => setTab("ipva")}
              className={`rounded-2xl px-3 py-2 font-semibold transition ${
                tab === "ipva"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              IPVA (RJ)
            </button>

            <button
              type="button"
              onClick={() => setTab("telefones")}
              className={`rounded-2xl px-3 py-2 font-semibold transition ${
                tab === "telefones"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Telefones
            </button>
          </div>
        </div>
      </section>

      {/* conteúdo */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        {tab === "iptu" && (
          <div className="grid gap-4 lg:grid-cols-[1fr,1.2fr]">
            {/* seletor */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-extrabold text-slate-900">
                IPTU — Portais oficiais por cidade
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Escolha a cidade e abra o IPTU e/ou o site oficial da prefeitura.
              </p>

              <label className="block mt-4 text-[11px] font-semibold text-slate-600">
                Selecione a cidade
              </label>

              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">— Escolher —</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {CIDADES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCidade(c)}
                    className={`rounded-2xl border px-3 py-2 text-[12px] font-semibold transition ${
                      cidade === c
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-slate-500">
                Alguns portais abrem em nova aba e podem solicitar CPF/CNPJ do contribuinte.
              </p>
            </div>

            {/* resultado */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-extrabold text-slate-900">
                {cidade ? `Links de ${cidade}` : "Selecione uma cidade"}
              </h2>

              {!cidade && (
                <p className="mt-2 text-sm text-slate-600">
                  Clique em uma cidade para mostrar os links oficiais.
                </p>
              )}

              {cidade && !linksCidade && (
                <p className="mt-2 text-sm text-slate-600">
                  Ainda não há links cadastrados para esta cidade.
                </p>
              )}

              {cidade && linksCidade && (
                <div className="mt-4 space-y-3">
                  {linksCidade.iptu && (
                    <a
                      href={linksCidade.iptu}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-lente block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
                    >
                      <p className="text-sm font-extrabold text-slate-900">Consultar IPTU</p>
                      <p className="text-[11px] text-slate-600 break-all">{linksCidade.iptu}</p>
                    </a>
                  )}

                  {linksCidade.prefeitura && (
                    <a
                      href={linksCidade.prefeitura}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-lente block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
                    >
                      <p className="text-sm font-extrabold text-slate-900">
                        Site oficial da Prefeitura
                      </p>
                      <p className="text-[11px] text-slate-600 break-all">{linksCidade.prefeitura}</p>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "ipva" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-slate-900">IPVA — Estado do RJ</h2>
            <p className="mt-2 text-sm text-slate-600">
              Links oficiais para consulta e serviços relacionados.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={LINKS_IPVA.ipva_rj}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lente block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
              >
                <p className="text-sm font-extrabold text-slate-900">Portal IPVA (SEFAZ RJ)</p>
                <p className="text-[11px] text-slate-600 break-all">{LINKS_IPVA.ipva_rj}</p>
              </a>

              <a
                href={LINKS_IPVA.detran_servicos}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lente block rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
              >
                <p className="text-sm font-extrabold text-slate-900">Detran RJ — Serviços</p>
                <p className="text-[11px] text-slate-600 break-all">{LINKS_IPVA.detran_servicos}</p>
              </a>
            </div>

            <p className="mt-4 text-[11px] text-slate-500">
              Dica: alguns serviços exigem login, placa/Renavam e validações do governo.
            </p>
          </div>
        )}

        {tab === "telefones" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-slate-900">Telefones úteis</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lista básica e direta. Depois expandimos por cidade (UPA, Hospital, Guarda Municipal etc.).
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TELEFONES_UTEIS.map((bloco) => (
                <div key={bloco.titulo} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-extrabold text-slate-900">{bloco.titulo}</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {bloco.itens.map((it) => (
                      <li key={it}>• {it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-600">
                Achou um telefone atualizado da sua cidade?{" "}
                <Link href="/fale-conosco" className="font-semibold text-sky-700 hover:underline">
                  Envie pra gente aqui
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

