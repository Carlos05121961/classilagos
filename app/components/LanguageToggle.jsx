"use client";

import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const [lang, setLang] = useState("pt");

  useEffect(() => {
    const saved = localStorage.getItem("classilagos_lang");
    if (saved === "es" || saved === "pt") setLang(saved);
  }, []);

  function toggle() {
    const next = lang === "pt" ? "es" : "pt";
    setLang(next);
    localStorage.setItem("classilagos_lang", next);

    // atualiza a tela para refletir os textos imediatamente
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
      aria-label="Trocar idioma"
      title={lang === "pt" ? "Ver em Espanhol" : "Ver em Português"}
    >
      <span className="text-[12px]">{lang === "pt" ? "🇪🇸" : "🇧🇷"}</span>
      {lang === "pt" ? "Ver em Espanhol" : "Ver em Português"}
    </button>
  );
}
