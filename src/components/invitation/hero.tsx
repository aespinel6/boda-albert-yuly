"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { wedding } from "@/lib/config";
import { ScrollDownButton } from "./scroll-down-button";

/**
 * Banner cinematográfico (no es portada): la foto del Salar con una frase.
 * La foto es de baja resolución (WhatsApp), así que se usa un fondo
 * desenfocado que llena el ancho y la foto nítida centrada encima
 * (mostrada a menor tamaño = se ve sin pixelar).
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", reduce ? "-6%" : "10%"]);

  return (
    <section
      ref={ref}
      className="snap-start relative flex h-full w-full items-center justify-center overflow-hidden bg-twilight"
    >
      {/* Fondo desenfocado (llena el ancho; el blur oculta la baja resolución) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/photos/hero-couple.jpeg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={60}
          className="scale-110 object-cover blur-2xl"
        />
      </div>

      {/* Foto nítida centrada (a tamaño real → sin pixelar) */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-[1] flex justify-center"
      >
        <div className="relative h-full w-auto aspect-[854/1280]">
          <Image
            src="/photos/hero-couple.jpeg"
            alt="Albert y Yuly en el Salar de Uyuni"
            fill
            priority
            quality={90}
            sizes="(max-width: 640px) 100vw, 60vh"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Scrim para legibilidad del texto */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-twilight/90 via-twilight/45 to-twilight/60" />

      {/* Carta: encabezado y firma fijos, el texto se desplaza dentro */}
      <motion.figure
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full max-w-2xl flex-col px-5 pb-16 pt-8 text-center text-white [text-shadow:0_2px_16px_rgba(15,20,30,0.55)] sm:px-8 sm:pb-24 sm:pt-12"
      >
        <p className="eyebrow flex-none text-gold-light">
          {wedding.dedication.eyebrow}
        </p>

        <div className="carta-scroll mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <blockquote className="space-y-1 font-serif text-[12px] font-light italic leading-[1.38] [text-wrap:pretty] sm:space-y-2 sm:text-base sm:leading-snug">
            {wedding.dedication.text.split(/\n\n+/).map((para, i, arr) => (
              <p key={i}>
                {i === 0 && "“"}
                {para}
                {i === arr.length - 1 && "”"}
              </p>
            ))}
          </blockquote>
        </div>

        <div className="flex-none">
          <div className="horizon my-2.5" />
          <figcaption className="font-serif text-sm italic text-gold-light sm:text-base">
            — {wedding.dedication.signature}
          </figcaption>
        </div>
      </motion.figure>

      <ScrollDownButton label="Sigue" tone="light" />
    </section>
  );
}
