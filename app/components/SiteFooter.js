"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  // Esconde o footer nas páginas de landing em /digital
  if (pathname?.startsWith("/digital")) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 text-slate-200 border-t border-slate-700 relative overflow-hidden">
      {/* FUNDO (PEIXINHOS) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/footer-oceano.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.38,
        }}
      />

      {/* OVERLAY ESCURO */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* DEGRADÊ DE TRANSIÇÃO NO TOPO */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/0 via-slate-950/30 to-slate-950/70 pointer-events-none" />

      {/* CONTEÚDO */}
      <div className="relative z-10 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* LINKS SUPERIORES */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] text-slate-200/85 mb-6">
            <Link href="/quem-somos" className="hover:text-white transition">
              Quem somos
            </Link>
            <Link href="/como-anunciar" className="hover:text-white transition">
              Como anunciar
            </Link>
            <Link
              href="/fale-conosco"
              className="hover:text-white transition font-semibold"
            >
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
          </nav>

          {/* CONTATO OFICIAL */}
          <div className="text-center">
            <p className="text-[11px] tracking-[0.14em] text-slate-200/70 uppercase">
              Contato oficial Classilagos
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-slate-100/90">
              <a
                href="mailto:fale-conosco@classilagos.shop"
                className="inline-flex items-center gap-2 hover:text-white transition"
              >
                ✉️ <span>faleconosco@classilagos.shop</span>
              </a>

              <a
                href="mailto:comercial@classilagos.shop"
                className="inline-flex items-center gap-2 hover:text-white transition"
              >
                🧾 <span>comercial@classilagos.shop</span>
              </a>

              <a
                href="mailto:noticias@classilagos.shop"
                className="inline-flex items-center gap-2 hover:text-white transition"
              >
                📰 <span>noticias@classilagos.shop</span>
              </a>

              <a
                href="mailto:imprensa@classilagos.shop"
                className="inline-flex items-center gap-2 hover:text-white transition"
              >
                🏛️ <span>imprensa@classilagos.shop</span>
              </a>
            </div>

            <p className="mt-3 text-[10px] text-slate-200/60 max-w-2xl mx-auto">
              Para anúncios, parcerias comerciais, envio de pautas, comunicados
              oficiais e contato institucional com o portal.
            </p>
          </div>

          {/* MARCA */}
          <div className="text-center mt-7">
            <p className="text-base font-semibold text-white">Classilagos</p>
            <p className="mt-1 text-[11px] text-slate-200/70">
              O seu guia de compras, serviços, turismo e oportunidades na Região
              dos Lagos.
            </p>
          </div>

          {/* COPYRIGHT */}
          <p className="text-[10px] text-center text-slate-200/45 mt-6">
            © {year} Classilagos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
