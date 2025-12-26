"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

/**
 * HeroCarousel — Padrão Premium (Classilagos)
 * - Crossfade suave (sem “vazio”)
 * - Preload das imagens (sem piscar)
 * - “Passagem nuvem” discreta na troca (cloud wash)
 * - Não adiciona underline/borda em texto (sem tarja amarela)
 *
 * Uso:
 * <HeroCarousel images={[...]} interval={6500}>
 *   ...seus textos/caixa de busca por cima...
 * </HeroCarousel>
 */
export default function HeroCarousel({ images = [], interval = 6500, children }) {
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);

  const [idx, setIdx] = useState(0);
  const [loadedSet, setLoadedSet] = useState(() => new Set());
  const [fadeIn, setFadeIn] = useState(false);
  const [cloudOn, setCloudOn] = useState(false);

  // Preload
  useEffect(() => {
    if (typeof window === "undefined") return;
    safeImages.forEach((src) => {
      const im = new window.Image();
      im.src = src;
      im.onload = () => {
        setLoadedSet((prev) => {
          const next = new Set(prev);
          next.add(src);
          return next;
        });
      };
    });
  }, [safeImages]);

  // Loop
  useEffect(() => {
    if (safeImages.length <= 1) return;

    const t = setInterval(() => {
      // Inicia transição (nuvem + some)
      setFadeIn(false);
      setCloudOn(true);

      // troca a imagem no meio da “nuvem”
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % safeImages.length);
      }, 320);

      // desliga nuvem depois
      setTimeout(() => {
        setCloudOn(false);
      }, 900);
    }, interval);

    return () => clearInterval(t);
  }, [safeImages.length, interval]);

  // Quando a imagem atual estiver carregada, faz fade-in
  useEffect(() => {
    const src = safeImages[idx];
    if (!src) return;

    if (loadedSet.has(src)) {
      const id = setTimeout(() => setFadeIn(true), 30);
      return () => clearTimeout(id);
    }
  }, [idx, loadedSet, safeImages]);

  const heroSrc = safeImages[idx];

  return (
    <section className="relative w-full">
      <div
        className="
          relative w-full
          h-[380px] sm:h-[420px] md:h-[460px] lg:h-[520px]
          overflow-hidden
        "
      >
        {/* Fundo neutro para nunca dar “vazio” */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200" />

        {/* Imagem atual com fade */}
        {heroSrc ? (
          <>
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: loadedSet.has(heroSrc) && fadeIn ? 1 : 0 }}
            >
              <Image
                src={heroSrc}
                alt="Hero Classilagos"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Preload invisível (ajuda o Next) */}
            <Image
              src={heroSrc}
              alt="Pré-carregamento hero"
              fill
              priority
              sizes="100vw"
              className="opacity-0 pointer-events-none"
            />
          </>
        ) : null}

        {/* Overlay premium (contraste) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-black/55" />

        {/* “Passagem nuvem” na troca (bem discreta) */}
        <div
          className={`
            absolute inset-0 pointer-events-none
            transition-opacity duration-500
            ${cloudOn ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* camada 1 */}
          <div className="absolute inset-0 bg-white/20" />
          {/* camada 2: “névoa” em manchas */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 40% at 35% 35%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0) 75%), radial-gradient(55% 40% at 70% 40%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0) 75%), radial-gradient(70% 55% at 50% 70%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 78%)",
              filter: "blur(2px)",
            }}
          />
        </div>

        {/* Conteúdo por cima (texto, busca, etc.) */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </section>
  );
}
