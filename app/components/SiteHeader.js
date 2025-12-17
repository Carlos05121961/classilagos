"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import { supabase } from "../supabaseClient";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAdmin(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(!error && data?.role === "admin");
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
        setIsAdmin(false);
      }
    }

    carregarPerfil();
  }, []);

  const categorias = [
    { label: "Imóveis", href: "/imoveis" },
    { label: "Veículos", href: "/veiculos" },
    { label: "Náutica", href: "/nautica" },
    { label: "Pets", href: "/pets" },
    { label: "Empregos", href: "/empregos" },
    { label: "Serviços", href: "/servicos" },
    { label: "Turismo", href: "/turismo" },
    { label: "LagoListas", href: "/lagolistas" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white text-slate-900 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* LOGO (protagonista) */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-classilagos-shop.png"
            alt="Classilagos.shop"
            width={220}
            height={70}
            priority
            className="h-auto w-[165px] sm:w-[185px] md:w-[210px]"
          />
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-[13px] font-semibold">
          {categorias.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="hover:text-slate-600 transition whitespace-nowrap"
            >
              {c.label}
            </Link>
          ))}

          <Link
            href="/noticias"
            className="hover:text-slate-600 transition whitespace-nowrap"
          >
            Notícias
          </Link>

          {/* Premium: só em telas grandes pra não apertar o topo */}
          <Link
            href="/noticias/correspondentes"
            className="hidden lg:inline-flex hover:text-slate-600 transition whitespace-nowrap"
          >
            Correspondentes
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-slate-600 transition whitespace-nowrap"
            >
              Administração
            </Link>
          )}

          {/* UserMenu (contém CTA pulsante) */}
          <div className="shrink-0">
            <UserMenu />
          </div>
        </nav>

        {/* MOBILE: CTA + User + Hambúrguer */}
        <div className="flex items-center gap-2 md:hidden">
          <UserMenu />

          <button
            className="text-slate-900 text-2xl leading-none px-2"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 p-4 space-y-3 text-slate-200 text-sm">
          {categorias.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              className="block py-1 hover:text-cyan-300"
            >
              {c.label}
            </Link>
          ))}

          <Link
            href="/noticias"
            onClick={() => setOpen(false)}
            className="block py-1 hover:text-cyan-300"
          >
            Notícias
          </Link>

          <Link
            href="/noticias/correspondentes"
            onClick={() => setOpen(false)}
            className="block py-1 hover:text-cyan-300"
          >
            Correspondentes
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block py-1 hover:text-cyan-300"
            >
              Administração
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

