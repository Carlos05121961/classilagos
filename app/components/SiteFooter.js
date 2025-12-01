"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-12 text-slate-200 border-t border-slate-700 relative">

      {/* IMAGEM DE FUNDO DO OCEANO */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "url('/footer-oceano.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* CAMADA ESCURA ACIMA DA IMAGEM */}
      <div className="absolute inset-0 bg-slate-900/88" />

      {/* CONTEÚDO DO FOOTER */}
      <div className="relative z-10 pt-40 pb-10">
        <div className="max-w-6xl mx-auto px-4">

          {/* LINKS SUPERIORES */}
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

          {/* MARCA */}
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Classilagos</p>

            <p className="text-[11px] text-slate-400">
              O seu guia de compras, serviços, turismo e oportunidades na Região dos Lagos.
            </p>
          </div>

          {/* COPYRIGHT */}
          <p className="text-[10px] text-center text-slate-500 mt-6">
            © {new Date().getFullYear()} Classilagos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
