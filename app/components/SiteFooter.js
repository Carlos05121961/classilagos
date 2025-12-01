"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-12 bg-slate-950 border-t border-slate-800 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Links superiores */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] text-slate-300 mb-6">
          <Link href="/quem-somos" className="hover:text-cyan-300 transition">
            Quem somos
          </Link>

          <Link href="/como-anunciar" className="hover:text-cyan-300 transition">
            Como anunciar
          </Link>

          <Link href="/fale-conosco" className="hover:text-cyan-300 transition">
            Fale conosco
          </Link>

          <Link href="/termos-de-uso" className="hover:text-cyan-300 transition">
            Termos de uso
          </Link>

          <Link href="/politica-de-privacidade" className="hover:text-cyan-300 transition">
            Política de privacidade
          </Link>
        </div>

        {/* Marca e frase */}
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-50">
            Classilagos
          </p>

          <p className="text-[11px] text-slate-400">
            O seu guia de compras, serviços, turismo e oportunidades na Região dos Lagos
          </p>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-center text-slate-500 mt-6">
          © {new Date().getFullYear()} Classilagos. Todos os direitos reservados.
        </p>

      </div>
    </footer>
  );
}
