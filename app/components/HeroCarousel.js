"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroCarousel({ images = [], interval = 5000 }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval]);

  return (
    <div className="relative w-full h-[280px] md:h-[360px] lg:h-[420px] overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <Image
            src={src}
            alt="Classilagos destaque"
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* overlay leve para texto futuro se quiser */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
      ))}
    </div>
  );
}
