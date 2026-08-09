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
      className="snap-start relative flex h-[100svh] min-h-[520px] w-full items-center justify-center overflow-hidden bg-twilight"
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

      {/* Frase */}
      <motion.figure
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl px-8 text-center text-white [text-shadow:0_2px_16px_rgba(15,20,30,0.55)]"
      >
        <p className="eyebrow text-gold-light">{wedding.dedication.eyebrow}</p>
        <blockquote className="mt-4 space-y-2.5 font-serif text-[15px] font-light italic leading-relaxed [text-wrap:balance] sm:text-lg sm:leading-relaxed">
          {wedding.dedication.text.split(/\n\n+/).map((para, i, arr) => (
            <p key={i}>
              {i === 0 && "“"}
              {para}
              {i === arr.length - 1 && "”"}
            </p>
          ))}
        </blockquote>
        <div className="horizon my-5" />
        <figcaption className="font-serif text-base italic text-gold-light">
          — {wedding.dedication.signature}
        </figcaption>
      </motion.figure>

      <ScrollDownButton label="Sigue" tone="light" />
    </section>
  );
}
