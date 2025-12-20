"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePathname } from "next/navigation";


export default function UserMenu() {
 const [user, setUser] = useState(null);
const [open, setOpen] = useState(false);
const menuRef = useRef(null);

const pathname = usePathname();


  useEffect(() => {
    let ignore = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!ignore) setUser(user || null);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      ignore = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ fecha ao clicar fora
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ✅ fecha com ESC
  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

 // ✅ fecha o menu ao trocar de página
useEffect(() => {
  setOpen(false);
}, [pathname]);

  async function sair() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const nome =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "Minha conta");

  return (
    // ✅ IMPORTANTE: relative aqui evita “tarja preta”/overflow e posiciona o dropdown corretamente
    <div className="relative flex items-center gap-2" ref={menuRef}>

      {/* Usuário */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
        aria-label="Abrir menu do usuário"
        aria-expanded={open ? "true" : "false"}
      >
        <span className="hidden sm:inline max-w-[140px] truncate">{nome}</span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs">
          👤
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 line-clamp-1">
              {user ? nome : "Visitante"}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {user ? user.email : "Faça login para acessar seu painel"}
            </p>
          </div>

          <div className="p-2 text-sm">
            {user ? (
              <>
                <Link
                  href="/painel"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                >
                  Meu painel
                </Link>

                <Link
                  href="/anunciar"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                >
                  Anunciar grátis
                </Link>

                <button
                  type="button"
                  onClick={sair}
                  className="w-full text-left rounded-xl px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                >
                  Entrar
                </Link>

                <Link
                  href="/cadastro"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
