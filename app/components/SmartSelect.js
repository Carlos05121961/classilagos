"use client";

import { useState } from "react";

export default function SmartSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <>
      {/* DESKTOP / TABLET (select normal) */}
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

      {/* MOBILE (sheet que sobe de baixo) */}
      <div className="md:hidden flex flex-col">
        <label className="text-[11px] font-semibold text-slate-200 mb-1">
          {label}
        </label>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50 text-left text-xs"
        >
          {value}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm md:hidden">
          <div className="bg-slate-900 rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto">
            {/* puxador */}
            <div className="flex justify-center mb-3">
              <div className="h-1.5 w-12 rounded-full bg-slate-600" />
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">
                Escolher {label.toLowerCase()}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-slate-300 px-2 py-1 rounded-full border border-slate-600"
              >
                Fechar
              </button>
            </div>

            <div className="divide-y divide-slate-700">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-2 py-3 text-sm flex items-center justify-between ${
                    opt === value
                      ? "bg-slate-800 text-cyan-300"
                      : "text-slate-100"
                  }`}
                >
                  <span>{opt}</span>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      opt === value
                        ? "border-cyan-400 bg-cyan-400/30"
                        : "border-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
