import Image from "next/image";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

/** Invitación formal: tarjeta enmarcada sobre la foto de la silueta. */
export function InviteStatement() {
  return (
    <section className="snap-start relative flex h-full items-center justify-center overflow-hidden py-16">
      {/* Foto de fondo */}
      <Image
        src="/photos/silhouette.jpeg"
        alt="Albert y Yuly al atardecer"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Oscurecido + viñeta para dramatismo */}
      <div className="absolute inset-0 bg-gradient-to-b from-twilight/85 via-twilight/70 to-twilight/90" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(201,162,94,0.16), transparent 70%)",
        }}
      />

      <Reveal className="relative z-10 w-full max-w-md px-6">
        {/* Marco doble con esquinas ornamentales */}
        <div className="relative rounded-2xl border border-gold/40 bg-twilight/30 px-7 py-12 text-center text-white shadow-2xl backdrop-blur-[3px] sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute inset-[7px] rounded-xl border border-gold/20" />
          <Corner className="left-3 top-3 border-l border-t" />
          <Corner className="right-3 top-3 border-r border-t" />
          <Corner className="bottom-3 left-3 border-b border-l" />
          <Corner className="bottom-3 right-3 border-b border-r" />

          <p className="eyebrow text-gold-light">Con inmensa alegría</p>

          <p className="mx-auto mt-5 max-w-xs font-serif text-lg italic leading-relaxed text-salt-100/95 sm:text-xl">
            Tenemos el honor de invitarte a celebrar nuestro matrimonio
          </p>

          <Ornament />

          <div className="font-serif leading-tight">
            <p className="text-2xl sm:text-3xl">{wedding.couple.groom}</p>
            <p className="my-1.5 text-xl italic text-gold-light sm:text-2xl">&amp;</p>
            <p className="text-2xl sm:text-3xl">{wedding.couple.bride}</p>
          </div>

          <Ornament />

          <p className="text-xs uppercase tracking-[0.25em] text-salt-100/80">
            {wedding.date.dayName} · {wedding.date.display}
          </p>
        </div>
      </Reveal>

      <ScrollDownButton label="Sigue" tone="light" />
    </section>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute size-5 border-gold/70 ${className ?? ""}`}
    />
  );
}

function Ornament() {
  return (
    <div className="my-6 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="text-[10px] text-gold">◆</span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
