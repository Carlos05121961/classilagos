"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerRotator({
  images = [],
  interval = 6000,         // tempo entre banners (ms)
  className = ""
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  const current = images[idx] ?? images[0];

  return (
   <div className={`relative w-full h-[150px] md:h-[190px] lg:h-[220px] rounded-2xl overflow-hidden border border-slate-200 ${className}`}>

      <Image
        key={current}
        src={current}
        alt="Banner"
        fill
        sizes="100vw"
        className="object-cover transition-opacity duration-500"
        priority
      />
    </div>
  );
}
