"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function CategoryBannerCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);

    return () => clearInterval(t);
  }, [images]);

  return (
    <div className="w-full bg-slate-100 border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow bg-white h-[200px] relative">
          <Image
            src={images[index]}
            alt="Banner Categoria"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* bolinhas do carrossel */}
        {images.length > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-slate-800" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
