import { Sparkles, Ban } from "lucide-react";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

export function DressCode() {
  return (
    <section className="snap-start flex min-h-[100svh] flex-col justify-center bg-twilight-deep py-16 text-salt-100">
      <div className="container text-center">
        <Reveal>
          <p className="eyebrow">Código de vestimenta</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            <Sparkles className="mb-1 mr-2 inline size-7 text-gold" />
            {wedding.dressCode.label}
          </h2>
          <div className="horizon mt-6" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-xl flex-col justify-center gap-4 sm:flex-row">
            {wedding.dressCode.notes.map((note) => (
              <div
                key={note}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-salt-200/90"
              >
                <Ban className="size-4 flex-none text-gold-light" />
                {note}
              </div>
            ))}
          </div>
        </Reveal>

        <ScrollDownButton variant="inline" tone="light" />
      </div>
    </section>
  );
}
