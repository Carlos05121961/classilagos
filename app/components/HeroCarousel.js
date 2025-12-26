"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function HeroCarousel({ images = [], interval = 5000, children }) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const [idx, setIdx] = useState(0);

  // ✅ se trocar a lista de imagens, garante idx válido
  useEffect(() => {
    setIdx(0);
  }, [safeImages.length]);

  // ✅ Timer NÃO reinicia a cada render (depende só do length + interval)
  useEffect(() => {
    if (safeImages.length <= 1) return;

    const t = setInterval(() => {
      setIdx((i) => (i + 1) % safeImages.length);
    }, interval);

    return () => clearInterval(t);
  }, [safeImages.length, interval]);

  const src = safeImages[idx] || safeImages[0];

  return (
    <div
      className="
        relative w-full
        h-[380px]      /* mobile: mais alto pra foto aparecer melhor */
        sm:h-[420px]   /* tablets */
        md:h-[460px]   /* notebooks */
        lg:h-[520px]   /* desktops grandes */
        overflow-hidden
      "
    >
      {src ? (
        <Image
          key={src}
          src={src}
          alt="Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200" />
      )}

      {/* overlay leve */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/15 to-black/45" />

      {/* conteúdo por cima (títulos da Home etc.) */}
      {children ? <div className="absolute inset-0">{children}</div> : null}
    </div>
  );
}
