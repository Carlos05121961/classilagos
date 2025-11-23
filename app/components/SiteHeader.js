"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const mainLinks = [
  { href: "/imoveis", label: "Imóveis" },
  { href: "/veiculos", label: "Veículos" },
  { href: "/nautica", label: "Náutica" },
  { href: "/pets", label: "Pets" },
  { href: "/empregos", label: "Empregos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/turismo", label: "Turismo" },
  { href: "/lagolistas", label: "LagoListas" },
  { href: "/noticias", label: "Notícias" },
];

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-700 hover:text-cyan-700"
    >
      {label}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  // NA HOME NÃO MOSTRA ESTE HEADER (quem manda é o hero)
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* LOGO SIMPLES, SEM FRASE EMBAIXO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={44}
            height={44}
            priority
          />
          <span className="text-base font-bold text-slate-900 leading-none">
            Classilagos
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-4">
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-cyan-700"
          >
            Login
          </Link>
          <Link
            href="/cadastro"
            className="text-sm font-medium text-slate-700 hover:text-cyan-700"
          >
            Cadastro
          </Link>

          <Link
            href="/anunciar"
            className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
          >
            Anuncie grátis
          </Link>
        </nav>
      </div>
    </header>
  );
}
