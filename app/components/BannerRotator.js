"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * BannerRotator – Padrão Classilagos
 *
 * variant:
 * - "home-topo"
 * - "home-rodape"
 * - "pilar"
 * - "comercial" (futuro)
 *
 * height: altura do banner em px
 */

export default function BannerRotator({
  variant = "home-topo",
  height = 140,
  interval = 6000,
}) {
  const bannersPorTipo = {
    "home-topo": [
      "/banners/home-topo/home-topo-01.webp",
      "/banners/home-topo/home-topo-02.webp",
      "/banners/home-topo/home-topo-03.webp",
    ],
    "home-rodape": [
      "/banners/home-rodape/home-rodape-01.webp",
      "/banners/home-rodape/home-rodape-02.webp",
      "/banners/home-rodape/home-rodape-03.webp",
    ],
    "pilar": [
      "/banners/pilar/pilar-imoveis.webp",
      "/banners/pilar/pilar-veiculos.webp",
      "/banners/pilar/pilar-turismo.webp",
    ],
    "comercial": [],
  };

  const images = bannersPorTipo[variant] || [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <section className="w-full flex justify-center bg-slate-100 py-3">
      <div className="w-full max-w-7xl px-4">
        <div
          className="relative w-full rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <Image
            src={images[index]}
            alt="Banner Classilagos"
            fill
            priority={variant === "home-topo"}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-contain"
          />
        </div>

        {images.length > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-slate-800" : "bg-slate-300"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}




