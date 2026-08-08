import { Video } from "lucide-react";
import { wedding } from "@/lib/config";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

/** Ceremonia virtual por Google Meet para invitados a distancia. */
export function MeetSection() {
  return (
    <section className="snap-start relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-twilight-deep py-16 text-salt-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 42%, rgba(201,162,94,0.14), transparent 68%)",
        }}
      />

      <div className="container relative text-center">
        <Reveal>
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold-light">
            <Video className="size-7" />
          </span>
          <p className="eyebrow mt-6 text-gold-light">Ceremonia virtual</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Acompáñanos en línea
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-salt-200/85 sm:text-base">
            {wedding.meet.note}
          </p>

          <a
            href={wedding.meet.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold", size: "lg", className: "mt-7" })}
          >
            <Video className="size-4" /> Unirse por Google Meet
          </a>

          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-salt-200/60">
            {wedding.meet.time}
          </p>
        </Reveal>

        <ScrollDownButton variant="inline" tone="light" />
      </div>
    </section>
  );
}
