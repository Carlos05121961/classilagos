"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#001f3f] text-slate-200">
      {/* Faixa com o fundo oceânico, igual ao fundo de praia dos pilares */}
      <div className="w-full h-32 bg-[url('/footer-oceano.jpg')] bg-cover bg-bottom bg-no-repeat" />

      {/* Conteúdo principal do footer */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        {/* Links superiores */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] text-slate-300 mt-6 mb-6">
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

          <Link
            href="/politica-de-privacidade"
            className="hover:text-cyan-300 transition"
          >
            Política de privacidade
          </Link>
        </div>

        {/* Marca e frase */}
        <div className="text-center">
          <p className="text-sm font-semibold text-white tracking-wide">
            Classilagos
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            O seu guia de compras, serviços, turismo e oportunidades na Região
            dos Lagos
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
