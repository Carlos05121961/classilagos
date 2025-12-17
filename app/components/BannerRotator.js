"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function BannerRotator({ interval = 6000, max = 5 }) {
  const fallbackImages = useMemo(
    () => [
      "/banners/anuncio-01.png",
      "/banners/anuncio-02.png",
      "/banners/anuncio-03.png",
    ],
    []
  );

  const [images, setImages] = useState(fallbackImages);
  const [index, setIndex] = useState(0);

  // carrega automaticamente os banners da pasta /public/banners/topo
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/banners/topo", { cache: "no-store" });
        const json = await res.json();

        const arr = Array.isArray(json?.images) ? json.images : [];
        const cleaned = arr
          .filter((x) => typeof x === "string" && x.trim().length > 0)
          .slice(0, Math.max(1, max));

        if (!alive) return;

        if (cleaned.length > 0) {
          setImages(cleaned);
          setIndex(0);
        } else {
          setImages(fallbackImages);
          setIndex(0);
        }
      } catch {
        if (!alive) return;
        setImages(fallbackImages);
        setIndex(0);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [fallbackImages, max]);

  // rotação
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);

    return () => clearInterval(t);
  }, [images, interval]);

  return (
    <div className="w-full flex justify-center bg-slate-100 py-2">
      {/* padrão “banner do topo” (não gigante) */}
      <div className="w-full max-w-[980px] px-4">
        <div className="relative w-full h-[110px] sm:h-[120px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
          <Image
            src={images[index]}
            alt="Banner Classilagos"
            fill
            sizes="(max-width: 1024px) 92vw, 980px"
            className="object-contain"
            priority
          />
        </div>

        {/* bolinhas */}
        {images.length > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Banner ${i + 1}`}
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

