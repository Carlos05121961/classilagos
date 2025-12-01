"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-12 bg-[#021b2f] text-slate-300 border-t border-slate-800 pt-0">

      {/* FAIXA DO OCEANO */}
      <div
        className="w-full bg-[url('/footer-oceano.jpg')] bg-cover bg-center"
        style={{ minHeight: "180px" }}
      ></div>

      {/* CONTEÚDO DO FOOTER */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Links superiores */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] text-slate-300 mb-6">
          <Link href="/quem-somos" className="hover:text-white transition">
            Quem somos
          </Link>

          <Link href="/como-anunciar" className="hover:text-white transition">
            Como anunciar
          </Link>

          <Link href="/fale-conosco" className="hover:text-white transition">
            Fale conosco
          </Link>

          <Link href="/termos-de-uso" className="hover:text-white transition">
            Termos de uso
          </Link>

          <Link
            href="/politica-de-privacidade"
            className="hover:text-white transition"
          >
            Política de privacidade
          </Link>
        </div>

        {/* Marca e frase */}
        <div className="text-center">
          <p className="text-sm font-semibold text-white">
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
