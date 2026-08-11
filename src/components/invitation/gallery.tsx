"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

export function Gallery() {
  const photos = wedding.gallery;
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  return (
    <section className="snap-start flex h-full flex-col justify-center bg-twilight-deep py-16">
      <div className="container">
        <Reveal className="text-center text-salt-100">
          <p className="eyebrow">Galería</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Momentos</h2>
          <div className="horizon mt-5" />
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
          {photos.map((p, i) => (
            <Reveal key={p.src} delay={(i % 2) * 0.06}>
              <button
                onClick={() => setOpen(i)}
                className="group block aspect-square w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={500}
                  height={500}
                  sizes="(max-width: 640px) 45vw, 220px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </Reveal>
          ))}
        </div>

        <ScrollDownButton variant="inline" tone="light" />
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={close}
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={close}
              aria-label="Cerrar"
            >
              <X className="size-6" />
            </button>
            <button
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Anterior"
            >
              <ChevronLeft className="size-6" />
            </button>
            <motion.div
              key={open}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-h-[85vh] w-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[open].src}
                alt={photos[open].alt}
                width={1200}
                height={1600}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
            </motion.div>
            <button
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Siguiente"
            >
              <ChevronRight className="size-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
