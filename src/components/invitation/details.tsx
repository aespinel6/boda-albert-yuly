import { Church, PartyPopper, MapPin, Clock, CalendarPlus } from "lucide-react";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

const items = [
  { ...wedding.ceremony, Icon: Church },
  { ...wedding.reception, Icon: PartyPopper },
];

export function Details() {
  return (
    <section className="snap-start flex h-full flex-col justify-center bg-salt-100 py-16 text-twilight">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow">El evento</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ceremonia y recepción</h2>
          <div className="horizon mt-6" />
        </Reveal>

        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-3xl sm:flex-row">
          {items.map(({ Icon, title, place, time, address, mapsUrl, calendarUrl }, i) => (
            <Reveal key={title} delay={i * 0.1} className="sm:flex-1">
              <div className="flex h-full items-start gap-4 rounded-2xl border border-twilight/10 bg-white p-4 text-left shadow-sm sm:flex-col sm:items-center sm:p-6 sm:text-center">
                <span className="flex size-11 flex-none items-center justify-center rounded-full bg-gold/10 text-gold sm:size-12">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow sm:mt-3">{title}</p>
                  <h3 className="mt-0.5 font-serif text-lg leading-tight sm:mt-1.5 sm:text-xl">
                    {place}
                  </h3>
                  <p className="mt-1.5 inline-flex items-center gap-1 text-sm text-twilight/70">
                    <Clock className="size-3.5" /> {time}
                  </p>
                  <p className="mt-0.5 text-xs text-twilight/55">{address}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:justify-center">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-gold transition-colors hover:text-gold/80"
                    >
                      <MapPin className="size-3.5" /> Cómo llegar
                    </a>
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-gold transition-colors hover:text-gold/80"
                    >
                      <CalendarPlus className="size-3.5" /> Agendar
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <ScrollDownButton variant="inline" tone="dark" />
      </div>
    </section>
  );
}
