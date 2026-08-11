"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Carrusel de fotos con desvanecido automático.
 * Avanza solo, se puede tocar los puntos para ir a una foto,
 * y se detiene si el sistema pide movimiento reducido.
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
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || photos.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % photos.length), interval);
    return () => clearInterval(id);
  }, [reduce, paused, photos.length, interval]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/25 ring-offset-4 ring-offset-salt-50"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.1 }, scale: { duration: 5 } }}
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-twilight via-twilight/45 to-transparent"
        aria-hidden
      />

      {children}

      {/* Puntos */}
      {photos.length > 1 && (
        <div className="absolute right-4 top-4 flex gap-1.5">
          {photos.map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Ver foto ${n + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? "w-5 bg-gold-light" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
