"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePathname } from "next/navigation";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  // ===============================
  // 🔐 Carrega usuário + perfil
  // ===============================
  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || ignore) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      setUser(user);

      // busca perfil (admin)
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      setIsAdmin(Boolean(profile?.is_admin));
    }

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      ignore = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // ===============================
  // UX helpers
  // ===============================
  useEffect(() => {
    function onClickOutside(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onClickOutside);
    return () =>
      document.removeEventListener("pointerdown", onClickOutside);
  }, []);

  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

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

  const itemClass =
    "block rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50";

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      {/* CTA MOBILE FIXO */}
      <Link
        href="/anunciar"
        className="md:hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-2 text-[12px] font-extrabold shadow-md"
      >
        📣 Anuncie grátis
      </Link>

      {/* Botão usuário */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
      >
        <span className="hidden sm:inline max-w-[140px] truncate">
          {nome}
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs">
          👤
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user ? nome : "Visitante"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user ? user.email : "Faça login para acessar"}
            </p>
          </div>

          <div className="p-2 text-sm">
            {user ? (
              <>
                <Link href="/painel" className={itemClass}>
                  Meu painel
                </Link>

                <Link href="/painel/meus-anuncios" className={itemClass}>
                  Meus anúncios
                </Link>

                {/* 🔑 ADMIN */}
                {isAdmin && (
                  <>
                    <div className="my-1 h-px bg-slate-100" />
                    <Link
                      href="/admin"
                      className="block rounded-xl px-3 py-2 text-[13px] font-extrabold text-blue-700 hover:bg-blue-50"
                    >
                      Painel administrativo
                    </Link>
                  </>
                )}

                <div className="my-1 h-px bg-slate-100" />

                <Link href="/anunciar" className={itemClass}>
                  Anunciar grátis
                </Link>

                <button
                  onClick={sair}
                  className="w-full text-left rounded-xl px-3 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={itemClass}>
                  Entrar
                </Link>
                <Link href="/cadastro" className={itemClass}>
                  Cadastre-se grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

