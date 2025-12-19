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

  // trava scroll quando menu aberto
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

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white text-slate-900 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          aria-label="Ir para a página inicial"
        >
          <div className="relative transition group-hover:-translate-y-[1px]">
            <Image
              src="/logo-classilagos-shop.png"
              alt="Classilagos.shop"
              width={220}
              height={70}
              priority
              className="h-auto w-[165px] sm:w-[185px] md:w-[210px] transition group-hover:brightness-[1.05] group-hover:contrast-[1.05]"
            />
            <span className="pointer-events-none absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-[10px] bg-gradient-to-r from-cyan-300/20 via-amber-200/20 to-cyan-300/20" />
          </div>
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-[12.5px] font-semibold">
          {categorias.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="hover:text-slate-600 transition whitespace-nowrap rounded-lg px-1.5 py-1 hover:bg-slate-100/70"
            >
              {c.label}
            </Link>
          ))}

          <Link
            href="/noticias"
            className="hover:text-slate-600 transition whitespace-nowrap rounded-lg px-1.5 py-1 hover:bg-slate-100/70"
          >
            Notícias
          </Link>

          <Link
            href="/noticias/correspondentes"
            className="hidden lg:inline-flex hover:text-slate-600 transition whitespace-nowrap rounded-lg px-1.5 py-1 hover:bg-slate-100/70"
          >
            Correspondentes
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-slate-600 transition whitespace-nowrap rounded-lg px-1.5 py-1 hover:bg-slate-100/70"
            >
              Administração
            </Link>
          )}

          {/* CTA Premium */}
          <Link
            href="/anunciar"
            className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-white text-xs md:text-sm font-semibold hover:bg-sky-700"
          >
            Anuncie grátis
          </Link>

          <div className="shrink-0">
            <UserMenu />
          </div>
        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <UserMenu />

          <button
            className="text-slate-900 text-2xl leading-none px-2 rounded-xl hover:bg-slate-100/70 active:scale-[0.98] transition"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* DRAWER MOBILE PREMIUM */}
      {open && (
        <>
          {/* overlay */}
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-50 bg-black/30"
            onClick={close}
          />

          {/* painel */}
          <div className="fixed top-0 right-0 z-50 h-full w-[86%] max-w-[360px] bg-white shadow-2xl border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900">Menu</p>
              <button
                type="button"
                onClick={close}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Fechar ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <Link
                href="/anunciar"
                onClick={close}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-sky-700"
              >
                Anuncie grátis
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/noticias"
                  onClick={close}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Notícias
                </Link>
                <Link
                  href="/noticias/correspondentes"
                  onClick={close}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Correspondentes
                </Link>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="grid grid-cols-2 gap-2">
                {categorias.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={close}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>

              {isAdmin && (
                <>
                  <div className="h-px bg-slate-200" />
                  <Link
                    href="/admin"
                    onClick={close}
                    className="block rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-extrabold text-amber-800 hover:bg-amber-100"
                  >
                    Administração
                  </Link>
                </>
              )}
            </div>

            <div className="mt-auto p-4 border-t border-slate-200">
              <p className="text-[11px] text-slate-500">
                Classilagos • padrão Premium (mobile)
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

