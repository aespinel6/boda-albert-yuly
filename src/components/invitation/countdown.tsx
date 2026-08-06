"use client";

import { Fragment, useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

const UNITS: Array<[keyof ReturnType<typeof diff>, string]> = [
  ["days", "Días"],
  ["hours", "Horas"],
  ["minutes", "Min"],
  ["seconds", "Seg"],
];

export function Countdown() {
  const target = new Date(wedding.date.iso);
  const [t, setT] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="snap-start relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-twilight-deep py-16 text-salt-100">
      {/* Resplandor dorado de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 40%, rgba(201,162,94,0.14), transparent 68%)",
        }}
      />

      <div className="container relative text-center">
        <Reveal>
          <p className="eyebrow text-gold-light">
            {t.done ? "¡Hoy es el día!" : "Cuenta regresiva"}
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Falta para el gran día
          </h2>
          <div className="horizon mt-5" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex items-start justify-center gap-2 sm:gap-5">
            {UNITS.map(([key, label], i) => (
              <Fragment key={key}>
                <div className="flex min-w-[62px] flex-col items-center sm:min-w-[88px]">
                  <span className="font-serif text-[3.25rem] font-light leading-none tabular-nums text-gold-light sm:text-8xl">
                    {mounted ? String(t[key] as number).padStart(2, "0") : "--"}
                  </span>
                  <span className="mt-3 text-[10px] uppercase tracking-[0.28em] text-salt-200/55">
                    {label}
                  </span>
                </div>
                {i < UNITS.length - 1 && (
                  <span
                    aria-hidden
                    className="mt-1 h-10 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent sm:mt-2 sm:h-16"
                  />
                )}
              </Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.05] px-5 py-2.5 backdrop-blur-sm">
              <CalendarHeart className="size-4 text-gold-light" />
              <span className="text-sm tracking-wide text-salt-200/90">
                {wedding.date.dayName} {wedding.date.display}
              </span>
            </span>
          </div>
        </Reveal>

        <ScrollDownButton variant="inline" tone="light" />
      </div>
    </section>
  );
}
