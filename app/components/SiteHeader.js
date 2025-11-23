"use client";

import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={45}
            height={45}
          />
          <div className="leading-tight">
            <div className="text-lg font-bold text-slate-900">Classilagos</div>
            <div className="text-[11px] text-slate-600">
              O seu guia de compras e serviços na Região dos Lagos
            </div>
          </div>
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700">
          <Link href="/imoveis" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Imóveis</Link>
          <Link href="/veiculos" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Veículos</Link>
          <Link href="/nautica" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Náutica</Link>
          <Link href="/pets" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Pets</Link>
          <Link href="/empregos" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Empregos</Link>
          <Link href="/servicos" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Serviços</Link>
          <Link href="/turismo" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Turismo</Link>
          <Link href="/lagolistas" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">LagoListas</Link>
          <Link href="/noticias" className="rounded-full px-3 py-1 hover:bg-cyan-50 hover:text-slate-900">Notícias</Link>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="hidden sm:flex rounded-full px-3 py-1 text-slate-700 hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            href="/cadastro"
            className="hidden sm:flex rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50"
          >
            Cadastro
          </Link>

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
