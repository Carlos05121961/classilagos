"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Header só aparece 100% transparente na HOME
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm border-b border-white/10"
          : "sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200"
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={40}
            height={40}
            priority
          />
          <div className="leading-tight">
            <div className="text-lg font-bold text-white drop-shadow-md">
              Classilagos
            </div>
            <div className="text-[11px] text-white/80">
              O seu guia de compras e serviços na Região dos Lagos
            </div>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {[
            { href: "/imoveis", label: "Imóveis" },
            { href: "/veiculos", label: "Veículos" },
            { href: "/nautica", label: "Náutica" },
            { href: "/pets", label: "Pets" },
            { href: "/empregos", label: "Empregos" },
            { href: "/servicos", label: "Serviços" },
            { href: "/turismo", label: "Turismo" },
            { href: "/lagolistas", label: "LagoListas" },
            { href: "/noticias", label: "Notícias" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1 text-white/90 hover:bg-white/20 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2">
          {/* Login / Cadastro */}
          <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
            <Link
              href="/login"
              className="rounded-full px-3 py-1 text-white/90 hover:bg-white/20"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full border border-white/40 px-3 py-1 text-white/90 hover:bg-white/20"
            >
              Cadastro
            </Link>
          </div>

          {/* ANUNCIE GRÁTIS */}
          <Link
            href="/anunciar"
            className="rounded-full bg-gradient-to-r from-[#21D4FD] to-[#3EC9C3] px-4 py-2 text-xs md:text-sm font-semibold text-slate-900 shadow-sm hover:brightness-105"
          >
            Anuncie grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
