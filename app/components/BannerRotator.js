"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function BannerRotator({
  images = [],
  interval = 6000,
  height = 120,
  maxWidth = 720,
}) {
  const [index, setIndex] = useState(0);

  const normalized = useMemo(() => {
    return (images || [])
      .map((it) => {
        if (typeof it === "string") return { src: it, href: "", alt: "Banner" };
        return {
          src: it?.src || "",
          href: it?.href || "",
          alt: it?.alt || "Banner",
        };
      })
      .filter((x) => x.src);
  }, [images]);

  useEffect(() => {
    if (!normalized.length) return;
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % normalized.length);
    }, interval);
    return () => clearInterval(t);
  }, [normalized.length, interval]);

  const current = normalized[index] || { src: "", href: "", alt: "Banner" };

  const BannerImg = (
    <div
      className="relative w-full mx-auto overflow-hidden"
      style={{ height: `${height}px`, maxWidth: `${maxWidth}px` }}
    >
      <Image
        src={current.src}
        alt={current.alt}
        fill
        className="object-contain"
      />
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      {current.href ? (
        <a
          href={current.href}
          target="_blank"
          rel="noreferrer"
          aria-label={current.alt}
          className="block"
        >
          {BannerImg}
        </a>
      ) : (
        BannerImg
      )}
    </div>
  );
}
