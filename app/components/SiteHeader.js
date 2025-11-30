"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";

export default function SiteHeader() {
  const pathname = usePathname();

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

        {/* BOTÃO + USER */}
        <div className="flex items-center gap-2">
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
            <Link href="/imoveis" className="hover:text-cyan-700">Imóveis</Link>
            <Link href="/veiculos" className="hover:text-cyan-700">Veículos</Link>
            <Link href="/nautica" className="hover:text-cyan-700">Náutica</Link>
            <Link href="/pets" className="hover:text-cyan-700">Pets</Link>
            <Link href="/empregos" className="hover:text-cyan-700">Empregos</Link>
            <Link href="/servicos" className="hover:text-cyan-700">Serviços</Link>
            <Link href="/turismo" className="hover:text-cyan-700">Turismo</Link>
            <Link href="/lagolistas" className="hover:text-cyan-700">LagoListas</Link>
            <Link href="/noticias" className="hover:text-cyan-700">Notícias</Link>
          </nav>

          <UserMenu />
        </div>
      </div>

    </header>
  );
}


