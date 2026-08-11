import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";
import { PhotoCarousel } from "./photo-carousel";

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

          {/* Carrusel editorial con el título encima */}
          <div className="mt-6">
            <PhotoCarousel photos={item.photos} alt={item.title}>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-left">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold-light">
                  {item.date}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl leading-tight text-white [text-wrap:balance] sm:text-[1.75rem]">
                  {item.title}
                </h3>
              </div>
            </PhotoCarousel>
          </div>

          <p className="mt-6 text-center text-sm leading-relaxed text-twilight/75 sm:text-[15px]">
            {item.text}
          </p>
        </Reveal>

        <ScrollDownButton variant="inline" tone="dark" />
      </div>
    </section>
  );
}
