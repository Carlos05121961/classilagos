"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function BannerRotator({
  images = [],
  interval = 6000,
  height = 120,         // topo padrão: 120
  maxWidth = 900,       // topo padrão: 900
  bg = "bg-slate-100",
  contain = true,       // true = não corta o banner (object-contain)
  rounded = "rounded-3xl",
  showDots = true,
  className = "",
}) {
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [index, setIndex] = useState(0);

  // se mudar a lista de imagens, reseta para 0 pra não “estourar” índice
  useEffect(() => {
    setIndex(0);
  }, [safeImages.length]);

  useEffect(() => {
    if (safeImages.length <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % safeImages.length);
    }, interval);

    return () => clearInterval(t);
  }, [interval, safeImages.length]);

  if (safeImages.length === 0) return null;

  return (
    <div className={`w-full flex justify-center ${bg} py-3 ${className}`}>
      <div className="w-full px-4" style={{ maxWidth }}>
        <div
          className={`relative w-full ${rounded} bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center`}
          style={{ height }}
        >
          <Image
            src={safeImages[index]}
            alt="Banner Classilagos"
            fill
            sizes={`${maxWidth}px`}
            className={contain ? "object-contain" : "object-cover"}
            priority
          />
        </div>

        {showDots && safeImages.length > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Banner ${i + 1}`}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-slate-800" : "bg-slate-300"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
