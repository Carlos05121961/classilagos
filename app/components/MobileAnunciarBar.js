"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileAnunciarBar() {
  const pathname = usePathname();

  // Não mostra na home
  if (pathname === "/") return null;

  // Se quiser, pode esconder em certas rotas específicas:
  const hiddenPaths = [
    "/anunciar",
    "/anunciar/formulario",
  ];

  if (hiddenPaths.includes(pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-600 leading-tight">
          Divulgue seu negócio na Região dos Lagos
        </span>
        <Link
          href="/anunciar"
          className="rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 font-semibold"
        >
          Anuncie grátis
        </Link>
      </div>
    </div>
  );
}
