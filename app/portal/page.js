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
            alt="classilagos.shop – 30 anos"
            fill
            priority
            quality={100}
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />

          {/* ÁREA CLICÁVEL — Botão "ENTRAR NO PORTAL" (vai para /home) */}
          <Link
            href="/home"
            aria-label="Entrar no portal"
            className="absolute rounded-full"
            style={{
              left: "47%",
              top: "66%",
              width: "30%",
              height: "12%",
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

