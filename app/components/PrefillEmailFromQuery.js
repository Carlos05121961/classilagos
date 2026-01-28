"use client";

import { useEffect } from "react";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function PrefillEmailFromQuery({
  queryKey = "email",
  storageKey = "classilagos_email",
}) {
  useEffect(() => {
    // 1) pega email do querystring
    let email = "";
    try {
      const params = new URLSearchParams(window.location.search);
      email = (params.get(queryKey) || "").trim();
    } catch {}

    // 2) se veio do query e é válido, salva
    if (isValidEmail(email)) {
      try {
        localStorage.setItem(storageKey, email);
      } catch {}
    } else {
      // 3) se não veio query, tenta recuperar do storage
      try {
        const saved = (localStorage.getItem(storageKey) || "").trim();
        if (isValidEmail(saved)) email = saved;
      } catch {}
    }

    if (!isValidEmail(email)) return;

    // 4) tenta preencher um input de email na página
    const selectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[name="contato_email"]',
      'input[name="email_contato"]',
      'input[id*="email"]',
      'input[name*="email"]',
    ];

    let input = null;
    for (const sel of selectors) {
      input = document.querySelector(sel);
      if (input) break;
    }

    if (!input) return;

    // não sobrescreve se usuário já digitou
    if (String(input.value || "").trim()) return;

    input.value = email;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, [queryKey, storageKey]);

  return null;
}
