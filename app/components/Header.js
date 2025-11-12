import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-classilagos.png"
            alt="Classilagos"
            width={40}
            height={40}
            priority
          />
          <div className="leading-tight">
            <div className="text-lg font-bold text-slate-900">Classilagos</div>
            <div className="text-[11px] text-slate-600">
              O seu guia de compras e serviços na Região dos Lagos
            </div>
          </div>
        </Link>

        {/* menu simples – ajustamos depois */}
        <nav className="hidden md:flex items-center gap-4 text-sm text-slate-700">
          <Link href="/imoveis" className="hover:text-blue-700">Imóveis</Link>
          <Link href="/veiculos" className="hover:text-blue-700">Veículos</Link>
          <Link href="/nautica" className="hover:text-blue-700">Náutica</Link>
          <Link href="/servicos" className="hover:text-blue-700">Serviços</Link>
          <Link href="/turismo" className="hover:text-blue-700">Turismo</Link>
          <Link href="/lagolistas" className="hover:text-blue-700">LagoListas</Link>
          <Link href="/anunciar" className="rounded-full bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700">
            Anuncie
          </Link>
        </nav>
      </div>
    </header>
  );
}
