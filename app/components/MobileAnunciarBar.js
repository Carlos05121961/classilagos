"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileAnunciarBar() {
  const pathname = usePathname() || "";

  // ✅ Não mostra na home (tanto "/" quanto "/home")
  const isHome = pathname === "/" || pathname === "/home";
  if (isHome) return null;

  // ✅ Páginas/fluxos onde NÃO queremos a barra (já tem CTA ou é área logada)
  // Usamos "startsWith" pra cobrir rotas filhas (ex: /anunciar/..., /painel/...)
  const hiddenPrefixes = [
    "/anunciar",
    "/login",
    "/cadastro",
    "/painel",
    "/admin",
    "/imoveis",
    "/veiculos",
    "/nautica",
    "/pets",
    "/empregos",
    "/servicos",
    "/turismo",
    "/lagolistas",
    "/noticias",
  ];

  const shouldHide = hiddenPrefixes.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Texto da barra */}
        <div className="flex flex-col leading-tight max-w-[60%]">
          <span className="text-[11px] font-semibold text-slate-800">
            Divulgue seu negócio
          </span>
          <span className="text-[10px] text-slate-500">
            Alcance milhares de pessoas na Região dos Lagos.
          </span>
        </div>

        {/* Botão */}
        <Link
          href="/anunciar"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-[11px] px-4 py-1.5 font-semibold shadow-md hover:from-cyan-600 hover:to-sky-600"
        >
          <span className="text-sm">📣</span>
          <span>Anuncie grátis</span>
        </Link>
      </div>
    </div>
  );
}

