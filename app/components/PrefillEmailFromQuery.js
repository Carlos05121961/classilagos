"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function PrefillEmailFromQuery({
  queryKey = "email",
  storageKey = "classilagos_email",
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromQuery = searchParams.get(queryKey);
    const email = (fromQuery || "").trim();

    if (isValidEmail(email)) {
      // guarda para reaproveitar caso o usuário navegue sem query depois
      try {
        localStorage.setItem(storageKey, email);
      } catch {}

      // tenta preencher qualquer input de email visível na página
      const candidates = [
        'input[type="email"]',
        'input[name="email"]',
        'input[name="contato_email"]',
        'input[name="email_contato"]',
        'input[id*="email"]',
        'input[name*="email"]',
      ];

      let input = null;
      for (const sel of candidates) {
        input = document.querySelector(sel);
        if (input) break;
      }

      if (input && input.value !== email) {
        input.value = email;

        // dispara eventos para inputs controlados (React)
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }

      return;
    }

    // se não veio query, tenta puxar do storage (pra facilitar retorno)
    try {
      const saved = (localStorage.getItem(storageKey) || "").trim();
      if (!isValidEmail(saved)) return;

      const input = document.querySelector('input[type="email"]');
      if (input && !input.value) {
        input.value = saved;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } catch {}
  }, [searchParams, queryKey, storageKey]);

  return null;
}
