"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { supabase } from "../supabaseClient";

// Hook para descobrir se o usuário logado é admin
function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function verificarAdmin() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || cancelado) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelado && !error && profile?.role === "admin") {
        setIsAdmin(true);
      }
    }

    verificarAdmin();

    return () => {
      cancelado = true;
    };
  }, []);

  return isAdmin;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();

  // 🔴 NÃO vamos mais esconder o header na HOME

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      {/* ---------- MOBILE ---------- */}
      <div className="flex md:hidden w-full px-4 py-3 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={120}
            height={120}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* BOTÕES + USER */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-[11px] px-2 py-1 rounded-full border border-blue-200 text-blue-700 font-semibold"
            >
              Admin
            </Link>
          )}

          <Link
            href="/anunciar"
            className="rounded-full bg-blue-600 text-white text-xs px-3 py-1.5 font-semibold"
          >
            Anuncie grátis
          </Link>

          <UserMenu />
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-3 items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={130}
            height={130}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* MENU + USERMENU */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 text-xs md:text-sm font-medium text-slate-700 leading-none">
            <Link href="/imoveis" className="hover:text-cyan-700">
              Imóveis
            </Link>
            <Link href="/veiculos" className="hover:text-cyan-700">
              Veículos
            </Link>
            <Link href="/nautica" className="hover:text-cyan-700">
              Náutica
            </Link>
            <Link href="/pets" className="hover:text-cyan-700">
              Pets
            </Link>
            <Link href="/empregos" className="hover:text-cyan-700">
              Empregos
            </Link>
            <Link href="/servicos" className="hover:text-cyan-700">
              Serviços
            </Link>
            <Link href="/turismo" className="hover:text-cyan-700">
              Turismo
            </Link>
            <Link href="/lagolistas" className="hover:text-cyan-700">
              LagoListas
            </Link>
            <Link href="/noticias" className="hover:text-cyan-700">
              Notícias
            </Link>
          </nav>

          {/* Botão do painel admin – só você vê */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              Painel do admin
            </Link>
          )}

          <UserMenu />
        </div>
      </div>
    </header>
  );
}



