import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { wedding } from "@/lib/config";
import { buttonVariants } from "@/components/ui/button";
import { Monogram } from "./monogram";
import { Reveal } from "./reveal";

export function Closing({ token }: { token: string }) {
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

        {/* Álbum colaborativo — se activa después del evento */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-7 max-w-md rounded-2xl border border-twilight/10 bg-white p-5 shadow-sm">
            <Camera className="mx-auto size-6 text-gold" />
            <h3 className="mt-3 font-serif text-xl">Álbum colaborativo</h3>
            <p className="mt-2 text-sm text-twilight/70">
              ¿Tomaste fotos en la celebración? Compártelas aquí para que todos
              tengamos el mismo álbum de recuerdos.
            </p>
            <Link
              href={`/album/${token}`}
              className={buttonVariants({ variant: "outline", className: "mt-4" })}
            >
              <Camera className="size-4" /> Subir mis fotos
            </Link>
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
