"use client";

import Image from "next/image";
import Link from "next/link";

export default function PortalLanding() {
  return (
    <main className="fixed inset-0 bg-[#050815]">
      {/* Container central – imagem inteira, sem cortar */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-[1536px] aspect-[16/9]">
          <Image
            src="/branding/30anos-classilagos-shop.png"
            alt="classilagos.shop — 30 anos"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-contain"
          />

          {/* ÁREA CLICÁVEL — ENTRAR NO PORTAL */}
          <Link
            href="/home"
            aria-label="Entrar no portal"
            className="absolute"
            style={{
              left: "22.5%",
              top: "71.5%",
              width: "28%",
              height: "9%",
            }}
          />

          {/* ÁREA CLICÁVEL — ANUNCIAR GRÁTIS (LAGOLISTAS) */}
          <Link
            href="/lagolistas"
            aria-label="Cadastre seu negócio gratuitamente"
            className="absolute"
            style={{
              left: "52%",
              top: "71.5%",
              width: "34.5%",
              height: "9%",
            }}
          />
        </div>
      </div>

      {/* Remove header / footer SOMENTE nessa rota */}
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        header,
        footer,
        nav {
          display: none !important;
        }
      `}</style>
    </main>
  );
}

