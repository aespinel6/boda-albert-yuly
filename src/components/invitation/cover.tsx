"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { wedding } from "@/lib/config";
import { ScrollDownButton } from "./scroll-down-button";

/**
 * Portada de la invitación: el logo A&A sobre fondo crema (mismo tono del
 * logo, con un leve degradado radial para que se funda sin recuadro).
 */
export function Cover() {
  const reduce = useReducedMotion();

  return (
    <section
      className="snap-start relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          "radial-gradient(circle at 50% 42%, #f4eee4 0%, #efe8dd 55%, #e8e0d6 100%)",
      }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-full text-[11px] font-semibold uppercase tracking-[0.3em] text-gold"
        style={{ color: "#b0863a" }}
      >
        Nos casamos
      </motion.p>

      {/* Logo — limitado por ancho Y alto para que quepa en cualquier pantalla */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-3 aspect-square w-full max-w-[340px] sm:max-w-[380px]"
      >
        <Image
          src="/photos/logo.png"
          alt="Albert & Yuly — 26 de septiembre de 2026"
          fill
          priority
          sizes="(max-width: 480px) 82vw, 400px"
          className="object-contain"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle at 50% 49%, #000 60%, transparent 86%)",
            maskImage:
              "radial-gradient(circle at 50% 49%, #000 60%, transparent 86%)",
          }}
        />
      </motion.div>

      {/* Frase */}
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 max-w-xs px-2 font-serif text-lg italic sm:max-w-sm sm:text-2xl"
        style={{ color: "#5a4a34" }}
      >
        Acompáñanos a celebrar el comienzo de nuestra historia
      </motion.p>

      {/* Botón para bajar a la siguiente sección */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <ScrollDownButton label="Desliza" tone="gold" />
      </motion.div>

      {/* dato accesible/SEO oculto con la fecha */}
      <span className="sr-only">
        {wedding.couple.groom} y {wedding.couple.bride} · {wedding.date.display}
      </span>
    </section>
  );
}
