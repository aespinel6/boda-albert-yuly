import Image from "next/image";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

type StoryItem = (typeof wedding.story)[number];

export function Story() {
  return (
    <>
      {wedding.story.map((item, i) => (
        <StoryChapter key={item.title} item={item} index={i + 1} />
      ))}
    </>
  );
}

function StoryChapter({ item, index }: { item: StoryItem; index: number }) {
  return (
    <section className="snap-start flex min-h-[100svh] flex-col justify-center bg-salt-50 py-12 text-twilight">
      <div className="container">
        <Reveal className="mx-auto max-w-sm">
          {/* Marcador de capítulo — la historia sí es una secuencia */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-serif text-lg leading-none text-gold">
              {String(index).padStart(2, "0")}
            </span>
            <span className="h-px w-7 bg-gold/40" aria-hidden />
            <span className="eyebrow">Nuestra historia</span>
          </div>

          {/* Foto editorial con el título encima */}
          <figure className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/25 ring-offset-4 ring-offset-salt-50">
            <Image
              src={item.photo}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 88vw, 384px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-twilight via-twilight/45 to-transparent"
              aria-hidden
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-left">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold-light">
                {item.date}
              </p>
              <h3 className="mt-1.5 font-serif text-2xl leading-tight text-white [text-wrap:balance] sm:text-[1.75rem]">
                {item.title}
              </h3>
            </figcaption>
          </figure>

          <p className="mt-6 text-center text-sm leading-relaxed text-twilight/75 sm:text-[15px]">
            {item.text}
          </p>
        </Reveal>

        <ScrollDownButton variant="inline" tone="dark" />
      </div>
    </section>
  );
}
