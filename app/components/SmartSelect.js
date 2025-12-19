"use client";

import { useState } from "react";

export default function SmartSelect({
  label,
  options = [],
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const current =
    options.find((o) => o.value === value)?.label || value || "Selecionar";

  return (
    <>
      {/* BOTÃO */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-slate-800 text-white px-4 py-3 text-left text-sm flex justify-between items-center"
      >
        <span className="opacity-90">{current}</span>
        <span className="text-lg">▾</span>
      </button>

      {/* MODAL */}
      {open && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* painel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <strong className="text-slate-900">{label}</strong>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-slate-500"
              >
                Fechar ✕
              </button>
            </div>

            <div className="space-y-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border
                    ${
                      value === opt.value
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-slate-800 border-slate-200"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
