"use client";

export default function MapaCidades() {
  return (
    <div className="relative w-full">
      <div className="relative mx-auto w-full max-w-[1700px]">
        {/* BASE SVG */}
        <img
          src="/mapas/mapa-cidades-classilagos.svg"
          alt="Mapa da Região dos Lagos"
          className="block w-full h-auto select-none"
          draggable={false}
        />

        {/* ILUSTRAÇÕES POR CIMA */}
        <img
          src="/hero/noticias-mapa-arte.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
