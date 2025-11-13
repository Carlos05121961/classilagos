"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerRotator({
  images = [],
  interval = 6000,
  className = "",
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  const current = images[idx] ?? images[0];

  return (
    <div
      className={`relative w-full overflow-hidden border border-slate-200 rounded-2xl ${className}`}
      style={{
        height: "150px",       // altura fixa ideal
        maxHeight: "150px",
        minHeight: "150px",
      }}
    >
      <Image
        key={current}
        src={current}
        alt="Banner rotativo"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}



