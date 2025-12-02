"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // pega usuário atual ao carregar o header
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/"; // volta pra home depois de sair
  }

  // 🔹 NÃO LOGADO → Login / Cadastro / Anuncie grátis
  if (!user) {
    return (
      <div className="flex items-center gap-3 text-xs md:text-sm font-medium">
        <Link href="/login" className="hover:text-cyan-700">
          Login
        </Link>
        <Link href="/cadastro" className="hover:text-cyan-700">
          Cadastro
        </Link>

        {/* 🔵 ANUNCIE GRÁTIS - AGORA PULSANDO */}
        <Link
          href="/anunciar"
          className="
            rounded-full 
            bg-cyan-500 
            px-4 
            py-2 
            text-white 
            font-semibold 
            hover:bg-cyan-600
            animate-pulse     /* 💥 PULSO SUAVE */
          "
        >
          Anuncie grátis
        </Link>
      </div>
    );
  }

  // 🔹 LOGADO → Anuncie grátis + menu com o nome
  const label =
    user.user_metadata?.nome ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Minha conta";

  return (
    <div className="flex items-center gap-3">

      {/* 🔵 ANUNCIE GRÁTIS LOGADO - AGORA PULSANDO */}
      <Link
        href="/anunciar"
        className="
          rounded-full 
          bg-cyan-500 
          px-4 
          py-2 
          text-white 
          text-xs 
          md:text-sm 
          font-semibold 
          hover:bg-cyan-600
          animate-pulse     /* 💥 MESMO PULSO */
        "
      >
        Anuncie grátis
      </Link>

      {/* Botão com o nome + dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-100"
        >
          <span className="text-xs md:text-sm text-slate-700 truncate max-w-[120px]">
            {label}
          </span>
          <span className="text-base">👤</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg p-1 text-xs md:text-sm z-50 text-slate-700">
            <Link
              href="/painel"
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Meu painel
            </Link>

            <Link
              href="/painel/meus-anuncios"
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Meus anúncios
            </Link>

            <Link
              href="/editar-perfil"
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Editar cadastro
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 mt-1"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
