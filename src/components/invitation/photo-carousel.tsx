"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrusel de fotos: desvanecido automático, se puede deslizar con el dedo
 * y muestra cuántas fotos hay. Se detiene con "reducir movimiento".
 */
export function PhotoCarousel({
  photos,
  alt,
  interval = 4200,
  children,
}: {
  photos: readonly string[];
  alt: string;
  interval?: number;
  /** Contenido superpuesto (fecha + título). */
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const box = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d);
      setI((next + photos.length) % photos.length);
    },
    [photos.length]
  );

  // Deslizar con el dedo (listeners nativos: funcionan en cualquier móvil)
  useEffect(() => {
    const el = box.current;
    if (!el || photos.length < 2) return;
    let startX: number | null = null;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      setPaused(true);
    };
    const onEnd = (e: TouchEvent) => {
      setPaused(false);
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 45) {
        const d = dx < 0 ? 1 : -1;
        setDir(d);
        setI((n) => (n + d + photos.length) % photos.length);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [photos.length]);

  useEffect(() => {
    if (reduce || paused || photos.length < 2) return;
    const id = setInterval(() => {
      setDir(1);
      setI((n) => (n + 1) % photos.length);
    }, interval);
    return () => clearInterval(id);
  }, [reduce, paused, photos.length, interval, i]);

  return (
    <div
      ref={box}
      className="relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/25 ring-offset-4 ring-offset-salt-50 sm:aspect-[4/3]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={i}
          custom={dir}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: 5.5 } }}
          className="absolute inset-0"
        >
          <Image
            src={photos[i]}
            alt={`${alt} — foto ${i + 1}`}
            fill
            sizes="(max-width: 640px) 88vw, 384px"
            priority={i === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Degradado para que se lea el texto */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-twilight via-twilight/40 to-twilight/25"
        aria-hidden
      />

      {children}

      {photos.length > 1 && (
        <>
          {/* Flechas laterales */}
          <button
            type="button"
            onClick={() => go(i - 1, -1)}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(i + 1, 1)}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Contador */}
          <span className="absolute left-4 top-4 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white/90 backdrop-blur-sm">
            {i + 1} / {photos.length}
          </span>

          {/* Puntos */}
          <div className="absolute right-4 top-4 flex gap-1.5">
            {photos.map((_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => go(n, n > i ? 1 : -1)}
                aria-label={`Ver foto ${n + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  n === i ? "w-5 bg-gold-light" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
