"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-12 text-slate-200 border-t border-slate-700 relative">
      {/* IMAGEM DE FUNDO */}
      <div
        className="absolute inset-0 opacity-45 pointer-events-none"
        style={{
          backgroundImage: "url('/footer-oceano.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* OVERLAY ESCURO */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-slate-950/80" />

      {/* CONTEÚDO */}
      <div className="relative z-10 pt-36 pb-10">
        <div className="max-w-6xl mx-auto px-4 space-y-8">

          {/* LINKS INSTITUCIONAIS */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] text-slate-300">
            <Link href="/quem-somos" className="hover:text-white transition">
              Quem somos
            </Link>

            <Link href="/como-anunciar" className="hover:text-white transition">
              Como anunciar
            </Link>

            <Link href="/fale-conosco" className="hover:text-white transition font-semibold text-white">
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

          {/* BLOCO DE CONTATOS OFICIAIS */}
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Contato oficial Classilagos
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-300">
              <span>📧 fale-conosco@classilagos.shop</span>
              <span>📧 comercial@classilagos.shop</span>
              <span>📰 noticias@classilagos.shop</span>
              <span>🏛️ imprensa@classilagos.shop</span>
            </div>

            <p className="text-[10px] text-slate-500 max-w-xl mx-auto">
              Para anúncios, parcerias comerciais, envio de pautas, comunicados
              oficiais e contato institucional com o portal.
            </p>
          </div>

          {/* MARCA */}
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Classilagos</p>

            <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
              O seu guia de compras, serviços, turismo e oportunidades na Região
              dos Lagos.
            </p>
          </div>

          {/* COPYRIGHT */}
          <p className="text-[10px] text-center text-slate-500">
            © {new Date().getFullYear()} Classilagos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
