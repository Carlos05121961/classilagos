"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItens = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/anuncios", label: "Anúncios" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/noticias", label: "Notícias" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/config", label: "Configurações" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto flex">
        {/* LATERAL (DESKTOP) */}
        <aside className="hidden md:flex w-60 flex-col border-r border-slate-200 bg-white">
          <div className="px-4 py-4 border-b border-slate-200">
            <h1 className="text-sm font-bold text-slate-800">
              Painel Classilagos
            </h1>
            <p className="text-[11px] text-slate-500 mt-1">
              Administração geral do portal
            </p>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-1 text-sm">
            {menuItens.map((item) => {
              const ativo =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 ${
                    ativo
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* TOPO + CONTEÚDO (MOBILE + DESKTOP) */}
        <section className="flex-1 flex flex-col">
          {/* TOPO MOBILE */}
          <header className="md:hidden border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500">Painel Classilagos</p>
                <h1 className="text-sm font-bold text-slate-800">
                  Administração
                </h1>
              </div>
              <Link
                href="/"
                className="text-[11px] font-medium text-blue-600 underline"
              >
                Voltar ao site
              </Link>
            </div>

            {/* Menu simples em lista no mobile */}
            <div className="mt-3 flex flex-wrap gap-2">
              {menuItens.map((item) => {
                const ativo =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[11px] px-2 py-1 rounded-full border ${
                      ativo
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-300 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          {/* CONTEÚDO */}
          <div className="px-4 md:px-8 py-5 w-full">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
