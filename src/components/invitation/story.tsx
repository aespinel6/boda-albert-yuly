import Image from "next/image";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

export function Story() {
  return (
    <section className="snap-start flex min-h-[100svh] flex-col justify-center bg-twilight-deep py-16 text-salt-100">
      <div className="container">
        <Reveal className="text-center">
          <p className="eyebrow">Nuestra historia</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Cómo llegamos aquí</h2>
          <div className="horizon mt-5" />
        </Reveal>

        <div className="mx-auto mt-10 max-w-md space-y-5">
          {wedding.story.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="flex items-center gap-4">
                <div className="relative size-16 flex-none overflow-hidden rounded-xl shadow-lg sm:size-20">
                  <Image
                    src={item.photo}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gold-light sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm text-salt-200/75">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-8 max-w-md text-center">
          <p className="font-serif text-lg italic text-salt-200/90 sm:text-xl">
            Ahora queremos compartir contigo el día más importante de nuestras vidas.
          </p>
        </Reveal>

        <ScrollDownButton variant="inline" tone="light" />
      </div>
    </section>
  );
}
