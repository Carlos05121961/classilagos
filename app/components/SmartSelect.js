"use client";

import { useState } from "react";

/* ÍCONES PADRÃO */
const ICONS = {
  // categorias
  "Imóveis": "🏠",
  "Veículos": "🚗",
  "Náutica": "⛵",
  "Pets": "🐾",
  "Empregos": "💼",
  "Serviços": "🛠️",
  "Turismo": "🌴",
  "LagoListas": "📍",
  "Todas": "📋",

  // cidades
  "Toda a região": "🗺️",
  "Maricá": "🌊",
  "Saquarema": "🏄",
  "Araruama": "🏖️",
  "Iguaba Grande": "🌅",
  "São Pedro da Aldeia": "⚓",
  "Arraial do Cabo": "🐠",
  "Cabo Frio": "🏝️",
  "Búzios": "🐚",
  "Rio das Ostras": "🐬",
};

export default function SmartSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:flex flex-col">
        <label className="text-[11px] font-semibold text-slate-200 mb-1">
          {label}
        </label>
        <select
          className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50 text-xs md:text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex flex-col">
        <label className="text-[11px] font-semibold text-slate-200 mb-1">
          {label}
        </label>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50 text-left text-xs flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{ICONS[value] || "•"}</span>
            <span>{value}</span>
          </span>
          <span className="text-[10px] text-slate-300">▼</span>
        </button>
      </div>

      {/* SHEET MOBILE */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm md:hidden">
          <div className="bg-slate-900 rounded-t-3xl pt-3 pb-4 px-4 max-h-[75vh] shadow-2xl">
            {/* puxador */}
            <div className="flex justify-center mb-3">
              <div className="h-1.5 w-12 rounded-full bg-slate-600" />
            </div>

            {/* título */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Escolher {label.toLowerCase()}
                </h2>
                <span className="text-[11px] text-slate-400">
                  Toque para selecionar
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[11px] text-slate-200 px-3 py-1 rounded-full border border-slate-600 hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>

            {/* opções */}
            <div className="space-y-1 max-h-[55vh] overflow-y-auto pr-1">
              {options.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between transition
                      ${
                        isSelected
                          ? "bg-slate-800 text-cyan-300 border border-cyan-500/60 shadow-md"
                          : "bg-slate-850/40 text-slate-100 border border-slate-700 hover:bg-slate-800/70"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">
                        {ICONS[opt] || "•"}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </span>

                    <span
                      className={`flex items-center justify-center h-5 w-5 rounded-full border text-[11px]
                        ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400/30 text-cyan-100"
                            : "border-slate-500 text-transparent"
                        }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
