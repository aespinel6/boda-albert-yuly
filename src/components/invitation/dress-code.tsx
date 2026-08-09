import { Sparkles, Ban, Footprints } from "lucide-react";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

export function DressCode() {
  const { label, avoid, tip } = wedding.dressCode;

  return (
    <section className="snap-start relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-twilight-deep py-16 text-salt-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 42%, rgba(201,162,94,0.13), transparent 68%)",
        }}
      />

      <div className="container relative text-center">
        <Reveal>
          <p className="eyebrow text-gold-light">Código de vestimenta</p>
          <h2 className="mt-4 flex items-center justify-center gap-2.5 font-serif text-4xl sm:text-5xl">
            <Sparkles className="size-6 text-gold" />
            {label}
          </h2>
          <div className="horizon mt-5" />
        </Reveal>

        {/* Colores reservados */}
        <Reveal delay={0.1}>
          <p className="mt-9 text-xs uppercase tracking-[0.28em] text-salt-200/55">
            Por favor evitar
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {avoid.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-salt-200/90"
              >
                <Ban className="size-4 flex-none text-gold-light" />
                {color}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Recomendación */}
        <Reveal delay={0.18}>
          <div className="mx-auto mt-8 inline-flex items-center gap-2.5 rounded-full bg-gold/15 px-5 py-2.5">
            <Footprints className="size-4 flex-none text-gold-light" />
            <span className="text-sm text-salt-100">{tip}</span>
          </div>
        </Reveal>

        <ScrollDownButton variant="inline" tone="light" />
      </div>
    </section>
  );
}
