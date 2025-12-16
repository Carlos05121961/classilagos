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

        if (!error && data?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
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
    <header className="sticky top-0 z-50 bg-white text-slate-900 border-b border-slate-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={140}
            height={140}
            priority
          />
        </Link>

        {/* DESKTOP: menu + user */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {categorias.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="hover:text-slate-600 transition"
            >
              {c.label}
            </Link>
          ))}

          <Link href="/noticias" className="hover:text-slate-600 transition">
            Notícias
          </Link>

          <Link href="/noticias/correspondentes" className="hover:text-slate-600 transition">
            Correspondentes
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-slate-600 transition"
            >
              Administração
            </Link>
          )}

          {/* Aqui entra o botão ANUNCIE GRÁTIS, mas ele está dentro do UserMenu */}
          <UserMenu />
        </nav>

        {/* MOBILE: UserMenu + botão hambúrguer */}
        <div className="flex items-center gap-2 md:hidden">
          {/* O UserMenu no celular já aparece sempre */}
          <UserMenu />

          <button
            className="text-slate-900 text-2xl"
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

