import { Mail, Gift } from "lucide-react";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

export function Gifts() {
  const { title, detail, note } = wedding.gifts.envelope;

  return (
    <section className="snap-start flex min-h-[100svh] flex-col justify-center bg-salt-100 py-16 text-twilight">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow">
            <Gift className="mb-1 mr-1 inline size-4" /> Regalos
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Un detalle</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-twilight/70 sm:text-base">
            {wedding.gifts.intro}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-twilight/10 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Mail className="size-7" />
            </span>
            <h3 className="mt-5 font-serif text-2xl">{title}</h3>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-gold">
              {detail}
            </p>
            <div className="horizon my-5" />
            <p className="text-sm leading-relaxed text-twilight/70">{note}</p>
          </div>
        </Reveal>

        <ScrollDownButton variant="inline" tone="dark" />
      </div>
    </section>
  );
}
