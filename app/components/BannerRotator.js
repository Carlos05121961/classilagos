"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerRotator({
  images = [],
  links = [],          // ✅ novo
  interval = 6000,
  height = 120,
  maxWidth = 900,
  contain = false,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images?.length) return;
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval]);

  const src = images[index];
  const href = links?.[index] || ""; // ✅ pega o link do mesmo índice

  const BannerImg = (
    <div
      className="relative w-full"
      style={{ height: `${height}px`, maxWidth: `${maxWidth}px` }}
    >
      <Image
        src={src}
        alt="Banner"
        fill
        className={contain ? "object-contain" : "object-cover"}
        priority={false}
      />
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" aria-label="Abrir oferta no Mercado Livre">
          {BannerImg}
        </a>
      ) : (
        BannerImg
      )}
    </div>
  );
}
