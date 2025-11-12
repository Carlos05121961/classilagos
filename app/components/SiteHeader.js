"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null; // na home, o menu vai sobre a foto

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-classilagos.png" alt="Classilagos" width={120} height={120} priority />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/imoveis" className="hover:text-blue-600">Imóveis</Link>
          <Link href="/veiculos" className="hover:text-blue-600">Veículos</Link>
          <Link href="/nautica" className="hover:text-blue-600">Náutica</Link>
          <Link href="/servicos" className="hover:text-blue-600">Serviços</Link>
          <Link href="/turismo" className="hover:text-blue-600">Turismo</Link>
          <Link href="/lagolistas" className="hover:text-blue-600">LagoListas</Link>
          <Link href="/login" className="hover:text-blue-600">Login</Link>
          <Link href="/anunciar" className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white">Anuncie</Link>
        </nav>
      </div>
    </header>
  );
}
