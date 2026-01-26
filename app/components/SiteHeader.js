"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { supabase } from "../supabaseClient";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

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
    <header className="sticky top-0 z-[60] bg-white text-slate-900 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-[auto,1fr,auto] items-center gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0">
<Image
  src="/logo-classilagos-shop.png"
  alt="Classilagos"
  width={300}
  height={90}
  priority
  className="max-h-[80px] w-auto"
 />

        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center justify-center gap-4 text-[12.5px] font-semibold text-slate-800">
          {categorias.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="transition hover:text-slate-900"
            >
              {c.label}
            </Link>
          ))}
           <Link
  href="/noticias"
  className="transition hover:text-slate-900"
>
  Notícias
</Link>


          {isAdmin && (
            <Link href="/admin" className="transition hover:text-slate-900">
              Administração
            </Link>
          )}
        </nav>

        {/* AÇÕES DESKTOP */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/anunciar"
            className="rounded-full bg-sky-600 px-4 py-2 text-white text-sm font-semibold hover:bg-sky-700 animate-[pulse_2.6s_ease-in-out_infinite]"
          >
            Anuncie grátis
          </Link>
          <UserMenu />
        </div>

        {/* MOBILE (somente usuário + menu) */}
        <div className="flex md:hidden items-center gap-2 justify-end col-span-2">
          <UserMenu />
          <button
            onClick={() => setOpen(true)}
            className="text-2xl px-2 rounded-xl hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* DRAWER MOBILE */}
      {open && (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <div className="fixed top-0 right-0 z-50 h-full w-[86%] max-w-[360px] bg-white shadow-2xl border-l flex flex-col">
            <div className="p-4 border-b flex justify-between">
              <strong>Menu</strong>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="p-4 space-y-3">
              <Link
                href="/anunciar"
                onClick={() => setOpen(false)}
                className="block text-center rounded-2xl bg-sky-600 py-3 text-white font-bold animate-[pulse_2.6s_ease-in-out_infinite]"
              >
                Anuncie grátis
              </Link>

              <div className="grid grid-cols-2 gap-2">
                {categorias.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border px-3 py-2 text-sm font-semibold"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 border-t text-xs text-slate-500">
              Classilagos • padrão Premium (mobile)
            </div>
          </div>
        </>
      )}
    </header>
  );
}
