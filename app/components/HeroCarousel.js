
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroCarousel({ images = [], interval = 5000, children }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  return (
    <div
      className="
        relative w-full
        h-[380px]      /* mobile: mais alto pra foto aparecer melhor */
        sm:h-[420px]  /* tablets */
        md:h-[460px]  /* notebooks */
        lg:h-[520px]  /* desktops grandes */
        overflow-hidden
      "
    >
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
        </div>
      ))}

      {/* overlay para logo / textos / busca */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {children}
      </div>
    </div>
  );
}
