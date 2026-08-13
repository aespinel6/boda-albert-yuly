import Image from "next/image";
import { Camera, Instagram } from "lucide-react";
import { wedding } from "@/lib/config";
import { buttonVariants } from "@/components/ui/button";
import { Monogram } from "./monogram";
import { Reveal } from "./reveal";

export function Closing() {
  return (
    <section className="snap-start flex h-full flex-col justify-center bg-salt-100 py-16 text-twilight">
      <div className="container text-center">
        <Reveal>
          <div className="relative mx-auto h-32 w-32 sm:h-44 sm:w-44">
            <Image
              src="/photos/caricature.jpeg"
              alt="Ilustración de Albert & Yuly"
              fill
              sizes="176px"
              className="rounded-full object-cover shadow-lg"
            />
          </div>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl">
            Gracias por acompañarnos
          </h2>
          <p className="mx-auto mt-3 max-w-md text-twilight/70">
            Tu presencia hará de este día un recuerdo inolvidable.
          </p>
        </Reveal>

        {/* Álbum de recuerdos: las fotos llegan por Instagram */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-7 max-w-md rounded-2xl border border-twilight/10 bg-white p-5 shadow-sm">
            <Camera className="mx-auto size-6 text-gold" />
            <h3 className="mt-3 font-serif text-xl">Álbum de recuerdos</h3>
            <p className="mt-2 text-sm text-twilight/70">
              ¿Tomaste fotos en la celebración? Etiquétanos o envíanoslas por
              Instagram para armar juntos el álbum.
            </p>
            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              {[
                { ...wedding.couple.instagram.groom, name: wedding.couple.groomShort },
                { ...wedding.couple.instagram.bride, name: wedding.couple.brideShort },
              ].map((ig) => (
                <a
                  key={ig.handle}
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Instagram className="size-4" /> @{ig.handle}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-7 flex flex-col items-center">
            <Monogram tone="dark" showDate />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-twilight/50">
              {wedding.couple.hashtag}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
