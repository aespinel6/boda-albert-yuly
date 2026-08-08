import Image from "next/image";
import { wedding } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

type StoryItem = (typeof wedding.story)[number];

export function Story() {
  return (
    <>
      {wedding.story.map((item, i) => (
        <StoryChapter key={item.title} item={item} dark={i % 2 === 1} />
      ))}
    </>
  );
}

function StoryChapter({ item, dark }: { item: StoryItem; dark: boolean }) {
  return (
    <section
      className={cn(
        "snap-start flex min-h-[100svh] flex-col justify-center py-12",
        dark ? "bg-twilight-deep text-salt-100" : "bg-salt-50 text-twilight"
      )}
    >
      <div className="container">
        <Reveal className="mx-auto max-w-md text-center">
          <p className={cn("eyebrow", dark && "text-gold-light")}>Nuestra historia</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
            {item.title}
          </h3>
          <p
            className={cn(
              "mt-1 text-xs uppercase tracking-[0.2em]",
              dark ? "text-salt-200/60" : "text-twilight/50"
            )}
          >
            {item.date}
          </p>

          <div className="relative mx-auto mt-6 aspect-[3/2] w-full max-w-sm overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={item.photo}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 88vw, 384px"
              className="object-cover"
            />
          </div>

          <p
            className={cn(
              "mt-6 text-sm leading-relaxed sm:text-[15px]",
              dark ? "text-salt-200/85" : "text-twilight/75"
            )}
          >
            {item.text}
          </p>
        </Reveal>

        <ScrollDownButton variant="inline" tone={dark ? "light" : "dark"} />
      </div>
    </section>
  );
}
