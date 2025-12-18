"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function BannerRotator({
  images = [],
  interval = 6000,
  height = 120,
  maxWidth,     // opcional
  contain = false, // opcional
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

  const style = {
    height: `${height}px`,
    ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
  };

  const BannerImg = (
    <div className="relative w-full mx-auto overflow-hidden" style={style}>
      <Image
        src={current.src}
        alt={current.alt}
        fill
        className={contain ? "object-contain" : "object-cover"}
        priority={false}
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
          className="block w-full"
        >
          {BannerImg}
        </a>
      ) : (
        BannerImg
      )}
    </div>
  );
}
