"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/banners/anuncio-01.png",
  "/banners/anuncio-02.png",
  "/banners/anuncio-03.png",
];

export default function BannerRotator({ interval = 6000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);

    return () => clearInterval(t);
  }, [interval]);

  return (
    <div className="w-full flex justify-center bg-slate-100 py-3">
      <div className="w-full max-w-5xl px-4">
        
        {/* Banner rotativo – altura fixa 120px */}
        <div className="relative w-full h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden">
          <Image
            src={images[index]}
            alt="Banner Classilagos"
            fill
            sizes="100vw"
            className="object-cover"   // mantém nitidez e preenche sem deformar
            priority
          />
        </div>

        {/* Bolinhas de navegação */}
        <div className="mt-2 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-slate-800" : "bg-slate-300"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}






