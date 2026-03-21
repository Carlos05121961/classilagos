"use client";

import { useMemo, useState } from "react";

export default function MapaCidades({ onSelectCity }) {
  const [cidadeAtiva, setCidadeAtiva] = useState("");

  const nomes = useMemo(
    () => ({
      marica: "Maricá",
      saquarema: "Saquarema",
      araruama: "Araruama",
      iguaba: "Iguaba Grande",
      sao_pedro: "São Pedro da Aldeia",
      cabo_frio: "Cabo Frio",
      arraial: "Arraial do Cabo",
      buzios: "Búzios",
      rio_das_ostras: "Rio das Ostras",
    }),
    []
  );

  const pontos = {
    marica: { left: "24.5%", top: "77%" },
    saquarema: { left: "42%", top: "69%" },
    araruama: { left: "58.5%", top: "64%" },
    iguaba: { left: "63.5%", top: "61.5%" },
    sao_pedro: { left: "68.5%", top: "61%" },
    cabo_frio: { left: "76.5%", top: "61%" },
    arraial: { left: "73.5%", top: "72%" },
    buzios: { left: "84.5%", top: "58%" },
    rio_das_ostras: { left: "91.5%", top: "28%" },
  };

  function handleEnter(cidade) {
    setCidadeAtiva(cidade);
  }

  function handleLeave() {
    setCidadeAtiva("");
  }

  function handleClick(cidade) {
    if (typeof onSelectCity === "function") {
      onSelectCity(cidade);
    }
  }

  const labelCidade = cidadeAtiva
    ? nomes[cidadeAtiva]
    : "Passe o mouse no mapa ou clique na cidade";

  return (
    <div className="relative w-full">
      {/* LABEL */}
      <div className="mb-2 flex justify-center">
        <span className="inline-flex items-center rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur">
          {labelCidade}
        </span>
      </div>

      {/* MAPA */}
      <div className="relative w-full aspect-[1920/640]">
        {/* BASE (SVG) */}
        <img
          src="/mapas/mapa-cidades-classilagos.svg"
          alt="Mapa da Região dos Lagos"
          className="block w-full h-auto select-none"
          draggable={false}
        />

        {/* ILUSTRAÇÕES */}
        <img
          src="/mapas/mapa-ilustracoes-classilagos.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block w-full h-auto select-none"
          draggable={false}
        />

        {/* PONTOS CLICÁVEIS */}
        {Object.entries(pontos).map(([chave, pos]) => {
          const ativa = cidadeAtiva === chave;

          return (
            <button
              key={chave}
              type="button"
              aria-label={nomes[chave]}
              title={nomes[chave]}
              onMouseEnter={() => handleEnter(chave)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(chave)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              <span
                className={`block rounded-full border-2 border-white shadow transition-all ${
                  ativa
                    ? "h-4 w-4 bg-sky-500 scale-125"
                    : "h-3.5 w-3.5 bg-orange-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
