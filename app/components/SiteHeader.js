"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  const pathname = usePathname();

  // Não mostra header na HOME
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

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

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-5 text-xs md:text-sm font-medium text-slate-700 leading-none">

          <Link href="/imoveis"   className="hover:text-cyan-700">Imóveis</Link>
          <Link href="/veiculos"  className="hover:text-cyan-700">Veículos</Link>
          <Link href="/nautica"   className="hover:text-cyan-700">Náutica</Link>
          <Link href="/pets"      className="hover:text-cyan-700">Pets</Link>
          <Link href="/empregos"  className="hover:text-cyan-700">Empregos</Link>
          <Link href="/servicos"  className="hover:text-cyan-700">Serviços</Link>
          <Link href="/turismo"   className="hover:text-cyan-700">Turismo</Link>
          <Link href="/lagolistas" className="hover:text-cyan-700">LagoListas</Link>
          <Link href="/noticias"  className="hover:text-cyan-700">Notícias</Link>

          {/* Login / Cadastro */}
          <Link href="/login"    className="hover:text-cyan-700">Login</Link>
          <Link href="/cadastro" className="hover:text-cyan-700">Cadastro</Link>

          {/* BOTÃO ANUNCIE */}
          <Link
            href="/anunciar"
            className="rounded-full bg-cyan-500 px-4 py-2 text-white text-xs md:text-sm font-semibold hover:bg-cyan-600 flex items-center"
          >
            Anuncie grátis
          </Link>
        </nav>

      </div>
    </header>
  );
}
